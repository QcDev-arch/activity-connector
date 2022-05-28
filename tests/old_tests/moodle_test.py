import os
import unittest
import tarfile
import shutil
import tempfile
import arrow

from dateutil import tz

from moodle import MoodleCourse, MoodleQuiz, MoodleHomework, MoodleLesson, \
    MoodleFeedback, MoodleChoice


class TestMoodleCourseSingleSection(unittest.TestCase):

    moodle_archive_path = '\
../data/backup-moodle2-course-1677-s20143-log792-09-20151102-1202-nu.mbz'

    def setUp(self):
        self.tmp_path = tempfile.mkdtemp()

        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)

    def test_bad_archive_path(self):
        """Test constructor with an invalid path"""
        self.assertRaises(Exception, MoodleCourse, 'invalid_path')

    def test_load_activity_sequence(self):
        course = MoodleCourse(self.tmp_path)
        actual = course._load_activity_sequence()

        self.assertEqual([146934, 146935, 146936, 146937, 146939], actual)

    def test_load_activities(self):
        course = MoodleCourse(self.tmp_path)
        actual = course._load_activites()[MoodleQuiz]
        self.assertEqual(3, len(actual))
        actual = course._load_activites()[MoodleHomework]
        self.assertEqual(1, len(actual))

    def test_sort_activity_type(self):
        course = MoodleCourse(self.tmp_path)
        activities = course._load_activites()[MoodleQuiz]
        activities = course._sort_activity_type(activities)

        for i, x in enumerate([146935, 146936, 146939]):
            self.assertEqual(x, activities[i]['moduleid'])

    def test_activities_are_sorted(self):
        course = MoodleCourse(self.tmp_path)

        for i, x in enumerate([146935, 146936, 146939]):
            self.assertEqual(x, course.activities[MoodleQuiz][i]['moduleid'])

    def test_get_activity_by_relative_num(self):
        course = MoodleCourse(self.tmp_path)

        actual = course.get_activity_by_type_and_num(MoodleQuiz, 1)['id']
        self.assertEqual('4271', actual)

        actual = course.get_activity_by_type_and_num(MoodleQuiz, 2)['id']
        self.assertEqual('4272', actual)

        actual = course.get_activity_by_type_and_num(MoodleQuiz, 3)['id']
        self.assertEqual('4273', actual)

        actual = course.get_activity_by_type_and_num(MoodleHomework, 1)['id']
        self.assertEqual('5588', actual)

    def test_set_invalid_key_raises_exception(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)

        with self.assertRaises(Exception):
            quiz['invalid_key'] = 'some data'

        with self.assertRaises(Exception):
            quiz['id'] = 'some data'

        with self.assertRaises(Exception):
            quiz['moduleid'] = 'some data'


class TestMoodleCourseMultipleSections(unittest.TestCase):

    moodle_archive_path = '../data/multi-sections.mbz'

    def setUp(self):
        self.tmp_path = tempfile.mkdtemp()

        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)

    def test_load_activity_sequence(self):
        course = MoodleCourse(self.tmp_path)
        actual = course._load_activity_sequence()

        self.assertEqual([175721, 175723, 175724, 175720, 175722, 176000],
                         actual)

    def test_load_activities(self):
        course = MoodleCourse(self.tmp_path)
        actual = course._load_activites()[MoodleQuiz]
        self.assertEqual(4, len(actual))
        actual = course._load_activites()[MoodleHomework]
        self.assertEqual(1, len(actual))

    def test_sort_activity_type(self):
        course = MoodleCourse(self.tmp_path)
        activities = course._load_activites()[MoodleQuiz]
        activities = course._sort_activity_type(activities)

        for i, x in enumerate([175721, 175724, 175722, 176000]):
            self.assertEqual(x, activities[i]['moduleid'])


class TestMoodleEvent(unittest.TestCase):

    moodle_archive_path = '\
../data/backup-moodle2-course-1677-s20143-log792-09-20151102-1202-nu.mbz'

    def setUp(self):
        self.tmp_path = tempfile.mkdtemp()

        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)

    def test_get_data_from_event(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)

        self.assertEqual('test de remise', quiz['name'])
        self.assertEqual('1451709900', quiz['timeopen'])
        self.assertEqual('1454301900', quiz['timeclose'])

    def test_set_event_start_date(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)

        dt = arrow.get(
            2014, 1, 6, 12, tzinfo=tz.gettz('America/Montreal')).datetime
        quiz.set_start_datetime(dt)

        self.assertEqual('1389027600', quiz['timeopen'])

    def test_get_event_start_date(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)

        quiz['timeopen'] = '1389027600'
        dt = arrow.get(
            2014, 1, 6, 12, tzinfo=tz.gettz('America/Montreal')).datetime

        self.assertEqual(dt, quiz.get_start_datetime())

    def test_set_event_end_date(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)

        dt = arrow.get(
            2014, 1, 6, 12, tzinfo=tz.gettz('America/Montreal')).datetime
        quiz.set_end_datetime(dt)

        self.assertEqual('1389027600', quiz['timeclose'])

    def test_get_event_end_date(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)

        quiz['timeclose'] = 1389027600
        dt = arrow.get(
            2014, 1, 6, 12, tzinfo=tz.gettz('America/Montreal')).datetime

        self.assertEqual(dt, quiz.get_end_datetime())


class TestMoodleWriter(unittest.TestCase):

    moodle_archive_path = '\
../data/backup-moodle2-course-1677-s20143-log792-09-20151102-1202-nu.mbz'

    def setUp(self):
        self.tmp_path = tempfile.mkdtemp()
        self.tmp_output_archive = tempfile.mktemp('.mbz')

        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)
        if os.path.isfile(self.tmp_output_archive):
            os.remove(self.tmp_output_archive)

    def test_no_modification_on_event_has_no_effect_on_disk(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)
        before_modification_dt = os.path.getmtime(quiz.path)

        quiz.write()
        self.assertTrue(before_modification_dt == os.path.getmtime(quiz.path))

    def test_modification_of_event_has_effect_on_disk(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)
        quiz.set_start_datetime(arrow.get(
            2001, 1, 1, 1, 1, 1, tzinfo=tz.gettz('America/Montreal')).datetime)
        before_modification_dt = os.path.getmtime(quiz.path)

        quiz.write()
        self.assertFalse(before_modification_dt == os.path.getmtime(quiz.path))
        self.assertFalse(before_modification_dt == os.path.getmtime(
            quiz.global_path + '/calendar.xml'))

        # Check data is updated on disk
        course_after = MoodleCourse(self.tmp_path)
        quiz_after = course_after.get_activity_by_type_and_num(MoodleQuiz, 1)
        self.assertEqual(arrow.get(
            2001, 1, 1, 1, 1, 1, tzinfo=tz.gettz('America/Montreal')).datetime,
            quiz_after.get_start_datetime())

    def test_archive_is_repacked(self):
        course = MoodleCourse(self.tmp_path)
        quiz = course.get_activity_by_type_and_num(MoodleQuiz, 1)
        quiz.set_start_datetime(arrow.get(
            2001, 1, 1, 1, 1, 1, tzinfo=tz.gettz('America/Montreal')).datetime)

        course.write(self.tmp_output_archive)
        self.assertTrue(os.path.isfile(self.tmp_output_archive))

    def test_write_activities_to_disk_saves_io(self):
        course = MoodleCourse(self.tmp_path)

        # quiz 1 is not modified
        q1 = course.get_activity_by_type_and_num(MoodleQuiz, 1)
        q1_before_modification_dt = os.path.getmtime(q1.path)

        # quiz 2 is modified
        q2 = course.get_activity_by_type_and_num(MoodleQuiz, 2)
        q2.set_start_datetime(arrow.get(
            2001, 1, 1, 1, 1, 1, tzinfo=tz.gettz('America/Montreal')).datetime)
        q2_before_modification_dt = os.path.getmtime(q2.path)

        # Homework 1 is modified
        h1 = course.get_activity_by_type_and_num(MoodleHomework, 1)
        h1.set_start_datetime(arrow.get(
            2001, 1, 1, 1, 1, 1, tzinfo=tz.gettz('America/Montreal')).datetime)
        h1_before_modification_dt = os.path.getmtime(h1.path)

        course._write_activities_to_disk()
        # Only quiz 2 was written on disk
        self.assertTrue(q1_before_modification_dt == os.path.getmtime(q1.path))
        self.assertFalse(q2_before_modification_dt == os.path.getmtime(q2.path))
        self.assertFalse(h1_before_modification_dt == os.path.getmtime(h1.path))


class TestMoodleOtherActivities(unittest.TestCase):

    moodle_archive_path = '../data/all-activities.mbz'

    def setUp(self):
        self.tmp_path = tempfile.mkdtemp()

        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)

    def test_load_activities(self):
        course = MoodleCourse(self.tmp_path)

        actual = course._load_activites()[MoodleQuiz]
        self.assertEqual(3, len(actual))

        actual = course._load_activites()[MoodleHomework]
        self.assertEqual(1, len(actual))

        actual = course._load_activites()[MoodleLesson]
        self.assertEqual(1, len(actual))

        actual = course._load_activites()[MoodleFeedback]
        self.assertEqual(1, len(actual))

        actual = course._load_activites()[MoodleChoice]
        self.assertEqual(1, len(actual))


class TestMoodleInvisibleActivites(unittest.TestCase):

    moodle_archive_path = '../data/invisible.mbz'

    def setUp(self):
        self.tmp_path = tempfile.mkdtemp()

        with tarfile.open(self.moodle_archive_path) as tar_file:
            tar_file.extractall(self.tmp_path)

    def tearDown(self):
        # TODO test on windows
        shutil.rmtree(self.tmp_path)

    def test_invisible_activities_are_not_loaded(self):
        course = MoodleCourse(self.tmp_path)
        actual = course._load_activites()[MoodleQuiz]
        self.assertEqual(2, len(actual))

if __name__ == "__main__":
    unittest.main()
