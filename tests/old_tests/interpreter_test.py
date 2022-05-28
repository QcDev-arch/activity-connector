import unittest
import tarfile
import shutil
import tempfile
import arrow

from dateutil import tz
from datetime import timedelta, time

from interpreter import Interpreter, AbsoluteTimeModifierException, \
    InvalidModifiersException, InvalidSubjectException
from moodle import MoodleCourse, MoodleQuiz
from ics_calendar import CalendarReader, Seminar, Practicum


class InterpreterTest(unittest.TestCase):

    calendar_path = '../data/multi-fr.ics'
    moodle_archive_path = '\
../data/backup-moodle2-course-1677-s20143-log792-09-20151102-1202-nu.mbz'

    def setUp(self):
        # Setup calendar
        calendar = CalendarReader(self.calendar_path)

        self.calendar_meetings = calendar.get_all_meetings()

        # Setup Moodle course
        self.tmp_path = tempfile.mkdtemp()
        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

        self.course = MoodleCourse(self.tmp_path)
        self.interpreter = Interpreter(self.calendar_meetings, self.course)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)

    def test_split_events_line(self):
        self.assertEqual(['Q1', 'S1F', 'S2S'],
                         self.interpreter._split_line('Q1 S1F S2S'))

    def test_detection_of_event(self):
        event = self.interpreter._detect_event_class_and_id('MQ1')
        self.assertEqual((MoodleQuiz, 1), event)

        event = self.interpreter._detect_event_class_and_id('Mq13')
        self.assertEqual((MoodleQuiz, 13), event)

        event = self.interpreter._detect_event_class_and_id('p2')
        self.assertEqual((Practicum, 2), event)

        event = self.interpreter._detect_event_class_and_id('P12')
        self.assertEqual((Practicum, 12), event)

        event = self.interpreter._detect_event_class_and_id('s4')
        self.assertEqual((Seminar, 4), event)

        event = self.interpreter._detect_event_class_and_id('S4')
        self.assertEqual((Seminar, 4), event)

        event = self.interpreter._detect_event_class_and_id('E1')
        self.assertEqual('Exam', event[0].name)

        event = self.interpreter._detect_event_class_and_id('Q1')
        self.assertEqual('Quiz', event[0].name)

    def test_get_at_end_modifier(self):
        # Implicit start
        mods = self.interpreter._get_modifiers_as_string('S1')
        relative_modifier = mods[0]
        self.assertEqual(False, relative_modifier)

        # Explicit finish
        mods = self.interpreter._get_modifiers_as_string('S1F')
        relative_modifier = mods[0]
        self.assertEqual(True, relative_modifier)

        # Explicit finish lowercase
        mods = self.interpreter._get_modifiers_as_string('S1f')
        relative_modifier = mods[0]
        self.assertEqual(True, relative_modifier)

        # Explicit finish
        mods = self.interpreter._get_modifiers_as_string('S1F@23:59')
        relative_modifier = mods[0]
        self.assertEqual(True, relative_modifier)

        # Implicit start
        mods = self.interpreter._get_modifiers_as_string('S1-1d')
        relative_modifier = mods[0]
        self.assertEqual(False, relative_modifier)

        # Explicit finish
        mods = self.interpreter._get_modifiers_as_string('S1F+1D@23:59')
        at_end = mods[0]
        self.assertEqual(True, at_end)

        # Explicit start
        mods = self.interpreter._get_modifiers_as_string('S1S+1D@23:59')
        at_end = mods[0]
        self.assertEqual(False, at_end)

        # Implicit start
        mods = self.interpreter._get_modifiers_as_string('S1+1D@23:59')
        at_end = mods[0]
        self.assertEqual(False, at_end)

    def test_parse_invalid_modifiers(self):
        self.assertRaises(InvalidModifiersException,
                          self.interpreter._get_modifiers_as_string,
                          'S1+1k@23:59')
        self.assertRaises(InvalidModifiersException,
                          self.interpreter._get_modifiers_as_string,
                          'S1@23:59+1m')
        self.assertRaises(InvalidModifiersException,
                          self.interpreter._get_modifiers_as_string,
                          'S1-23:59@1m')

    def test_get_relative_modifier_as_string(self):
        mods = self.interpreter._get_modifiers_as_string('S1')
        relative_modifier = mods[1]
        self.assertEqual(None, relative_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F')
        relative_modifier = mods[1]
        self.assertEqual(None, relative_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F@23:59')
        relative_modifier = mods[1]
        self.assertEqual(None, relative_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F-1d')
        relative_modifier = mods[1]
        self.assertEqual('-1d', relative_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F+1D@23:59')
        relative_modifier = mods[1]
        self.assertEqual('+1D', relative_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1S+1h@23:59')
        relative_modifier = mods[1]
        self.assertEqual('+1h', relative_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1-13243m@23:59')
        relative_modifier = mods[1]
        self.assertEqual('-13243m', relative_modifier)

    def test_get_time_modifier_as_string(self):
        mods = self.interpreter._get_modifiers_as_string('S1')
        time_modifier = mods[2]
        self.assertEqual(None, time_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F')
        time_modifier = mods[2]
        self.assertEqual(None, time_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F-1d')
        time_modifier = mods[2]
        self.assertEqual(None, time_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F@10:59')
        time_modifier = mods[2]
        self.assertEqual('10:59', time_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1F+1D@23:59')
        time_modifier = mods[2]
        self.assertEqual('23:59', time_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1S+1h@22:11')
        time_modifier = mods[2]
        self.assertEqual('22:11', time_modifier)

        mods = self.interpreter._get_modifiers_as_string('S1-13243m@3:01')
        time_modifier = mods[2]
        self.assertEqual('3:01', time_modifier)

    def test_interpret_time_modifier(self):
        self.assertEqual(
            time(hour=3, minute=1),
            self.interpreter._interpret_time_modifier('3:01'))

        self.assertEqual(
            time(hour=15, minute=59),
            self.interpreter._interpret_time_modifier('15:59'))

        self.assertEqual(
            time(hour=23, minute=59),
            self.interpreter._interpret_time_modifier('23:59'))

        self.assertEqual(
            time(hour=1, minute=1),
            self.interpreter._interpret_time_modifier('01:1'))

    def test_interpret_invalid_time_modifier(self):
        self.assertRaises(
            AbsoluteTimeModifierException,
            self.interpreter._interpret_time_modifier, '24:00')

        self.assertRaises(
            AbsoluteTimeModifierException,
            self.interpreter._interpret_time_modifier, '23:60')

        self.assertRaises(
            AbsoluteTimeModifierException,
            self.interpreter._interpret_time_modifier, '12:63')

    def test_interpret_relative_modifier(self):
        self.assertEqual(
            timedelta(days=1),
            self.interpreter._interpret_relative_modifier('+1d'))

        self.assertEqual(
            timedelta(days=-2),
            self.interpreter._interpret_relative_modifier('-2d'))

        self.assertEqual(
            timedelta(days=10),
            self.interpreter._interpret_relative_modifier('+10d'))

        self.assertEqual(
            timedelta(hours=123),
            self.interpreter._interpret_relative_modifier('+0123h'))

        self.assertEqual(
            timedelta(hours=-23),
            self.interpreter._interpret_relative_modifier('-23h'))

        self.assertEqual(
            timedelta(minutes=-50),
            self.interpreter._interpret_relative_modifier('-050m'))

        self.assertEqual(
            timedelta(minutes=106),
            self.interpreter._interpret_relative_modifier('+106m'))

        self.assertEqual(
            timedelta(weeks=-2),
            self.interpreter._interpret_relative_modifier('-2w'))

        self.assertEqual(
            timedelta(weeks=4),
            self.interpreter._interpret_relative_modifier('+4w'))

        self.assertEqual(
            timedelta(weeks=10),
            self.interpreter._interpret_relative_modifier('+10w'))

    def test_build_new_date_from_event(self):
        expected = arrow.get(2000, 1, 1, 0, 1).datetime
        actual = self.interpreter._get_new_datetime(
            arrow.get(2000, 1, 1).datetime, timedelta(minutes=1), None)
        self.assertEqual(expected, actual)

        expected = arrow.get(2000, 1, 1).datetime
        actual = self.interpreter._get_new_datetime(
            arrow.get(2000, 1, 1, 0, 2).datetime, timedelta(minutes=-2), None)
        self.assertEqual(expected, actual)

        expected = arrow.get(2000, 1, 1, 3).datetime
        actual = self.interpreter._get_new_datetime(
            arrow.get(2000, 1, 1).datetime, timedelta(hours=3), None)
        self.assertEqual(expected, actual)

        expected = arrow.get(1999, 12, 31).datetime
        actual = self.interpreter._get_new_datetime(
            arrow.get(2000, 1, 1).datetime, timedelta(days=-1), None)
        self.assertEqual(expected, actual)

        expected = arrow.get(2000, 1, 1, 2, 5).datetime
        actual = self.interpreter._get_new_datetime(
            arrow.get(2000, 1, 1).datetime, None, time(hour=2, minute=5))
        self.assertEqual(expected, actual)

        expected = arrow.get(2000, 1, 2, 2, 5).datetime
        actual = self.interpreter._get_new_datetime(
            arrow.get(2000, 1, 1, 0, 0, 0).datetime, timedelta(days=1),
            time(hour=2, minute=5))
        self.assertEqual(expected, actual)

        expected = arrow.get(1999, 12, 31, 23, 55).datetime
        actual = self.interpreter._get_new_datetime(
            arrow.get(2000, 1, 1).datetime, timedelta(days=-1),
            time(hour=23, minute=55))
        self.assertEqual(expected, actual)

    def test_get_datetime_from_token(self):
        expected = arrow.get(2014, 1, 15, 12, 0).datetime
        actual = self.interpreter._get_datetime_from_token('S1+9D')
        self.assertEqual(expected, actual)
        expected = arrow.get(2014, 1, 6, 22, 0).datetime
        actual = self.interpreter._get_datetime_from_token('S1+10h')
        self.assertEqual(expected, actual)
        expected = arrow.get(2014, 1, 16, 12, 0).datetime
        actual = self.interpreter._get_datetime_from_token('S1+10D')
        self.assertEqual(expected, actual)

    def test_get_subject(self):
        tokens = self.interpreter._split_line('MQ1 S1 S1F')
        actual = self.interpreter._parse_subject(tokens)['id']
        self.assertEqual('4271', actual)

        tokens = self.interpreter._split_line('MQ2 S1 S1F')
        actual = self.interpreter._parse_subject(tokens)['id']
        self.assertEqual('4272', actual)

        tokens = self.interpreter._split_line('MQ3 S1 S1F')
        actual = self.interpreter._parse_subject(tokens)['id']
        self.assertEqual('4273', actual)

    def test_handle_invalid_subject(self):
        # Seminars can't be used as subject
        tokens = self.interpreter._split_line('S1 Q1 Q1F')
        self.assertRaises(
            InvalidSubjectException,
            self.interpreter._parse_subject, tokens)

        # Practica can't be used as subject
        tokens = self.interpreter._split_line('P1 Q1 Q1F')
        self.assertRaises(
            InvalidSubjectException,
            self.interpreter._parse_subject, tokens)

    def test_get_new_event_from_string(self):
        expected_s = arrow.get(
            2014, 1, 6, 7, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 6, 8, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MQ1 S1S S1F')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

        expected_s = arrow.get(
            2014, 1, 13, 7, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 20, 8, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MQ1 S2 S3F')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

        expected_s = arrow.get(
            2014, 1, 13, 7, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 20, 8, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MH1 S2 S3F')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

        expected_s = arrow.get(
            2014, 1, 8, 8, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 15, 7, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MQ1 P1F P2')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

        expected_s = arrow.get(
            2014, 1, 8, 23, 45, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 14, 22, 23, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string(
            'MQ1 P1@23:45 P2-1d@22:23')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

        expected_s = arrow.get(
            2014, 1, 8, 6, 59, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 18, 12, 23, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string(
            'MQ1 P1-1m P2+3d@12:23')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

        expected_s = arrow.get(
            2014, 1, 1, 13, 20, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 18, 12, 23, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string(
            'MQ1 P1-1w@13:20 P2+3d@12:23')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

        expected_s = arrow.get(
            2014, 1, 1, 13, 20, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 18, 12, 23, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string(
            'E1 P1-1w@13:20 P2+3d@12:23')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

    def test_with_3_dates(self):
        expected_s = arrow.get(
            2014, 1, 6, 8, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2014, 1, 13, 7, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_c = arrow.get(
            2014, 1, 13, 8, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('mh1 S1F S2S S2F')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        actual_c = actual._get_datetime_at_index(2)

        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)
        self.assertEqual(expected_c, actual_c)


class InterpreterTestOtherActivities(unittest.TestCase):

    calendar_path = '../data/multi-fr.ics'
    moodle_archive_path = '../data/all-activities.mbz'

    def setUp(self):
        # Setup calendar
        calendar = CalendarReader(self.calendar_path)

        self.calendar_meetings = calendar.get_all_meetings()

        # Setup Moodle course
        self.tmp_path = tempfile.mkdtemp()
        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

        self.course = MoodleCourse(self.tmp_path)
        self.interpreter = Interpreter(self.calendar_meetings, self.course)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)

    def test_homework_as_start_and_end(self):
        expected_s = arrow.get(
            2015, 10, 1, 0, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2015, 10, 29, 0, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MQ1 mh1 mh1f')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

    def test_lesson_as_start_and_end(self):
        expected_s = arrow.get(
            2016, 2, 10, 13, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2016, 2, 10, 15, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MQ1 ml1 ml1f')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

    def test_choice_as_start_and_end(self):
        expected_s = arrow.get(
            2016, 2, 10, 13, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2016, 2, 10, 14, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MQ1 mc1 mc1f')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)

    def test_feedback_as_start_and_end(self):
        expected_s = arrow.get(
            2016, 2, 10, 13, 0, tzinfo=tz.gettz('America/Montreal')).datetime
        expected_e = arrow.get(
            2016, 2, 10, 13, 5, tzinfo=tz.gettz('America/Montreal')).datetime
        actual = self.interpreter.get_new_event_from_string('MQ1 mf1 mf1f')
        actual_s = actual.get_start_datetime()
        actual_e = actual.get_end_datetime()
        self.assertEqual(expected_s, actual_s)
        self.assertEqual(expected_e, actual_e)
