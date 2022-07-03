/* test for CAP DSL */
/* currently parsing works, but no results generated */ 
/* Javascript goes inside the {} */

Expression
  = Spacing Rule+ EndOfFile

Rule
/* define specific rules for the activity types */
  = head:ExamActivity _ tail:Timing Spacing {
        return {
          "activity": head,
          "open": tail
        };
    }
    / activity:MoodleQuizActivity _ opens:MoodleQuizOpenTime _ closes:MoodleQuizCloseTime Spacing {
      return {
      	"activity": activity,
        "open": opens,
        "close": closes
      };
    }
    / activity:MoodleHomeworkActivity _ opens:MoodleHomeworkAllowSubmissionsTime _ due:MoodleHomeworkDueTime _ cutoff:MoodleHomeworkCutoffTime Spacing {
      return {
      	"activity": activity,
        "open": opens,
        "due": due,
        "cutoff": cutoff
      };
    }

ExamActivity
  = head:EXAM_ACTIVITY_CODE tail:Integer {
    return head + tail;
  }
MoodleQuizActivity 
  = head:MOODLE_QUIZ_ACTIVITY_CODE tail:Integer {
    return head + tail;
  }
MoodleQuizOpenTime "Moodle Quiz Open Time" = Timing  
MoodleQuizCloseTime "Moodle Quiz Close Time" = Timing  

MoodleHomeworkActivity 
  = head:MOODLE_HOMEWORK_ACTIVITY_CODE tail:Integer {
    return head + tail;
  }
MoodleHomeworkAllowSubmissionsTime "Moodle Homework Allow Submissions Time" = Timing  
MoodleHomeworkDueTime "Moodle Homework Due Time" = Timing  
MoodleHomeworkCutoffTime "Moodle Homework Cutoff Time" = Timing  




Activity "Activity Number (e.g., E1 for Exam 1)"
 = head:ActivityCode tail:Integer {
     return head + tail;
   }

Timing
/* Case for Session, Labs, Practica */
  = head:MeetingSequence tail:TimeModifier? {
    var result = {"activity":head}, i;
    if (tail !== null) {
      for (i=0; i<tail.length; i++) {
      	if(tail[i] !== null){
        	switch(i){
            	case 0:
                	result.modifier = tail[i];
                    break;
                case 1:
                	var modif = {};
                    
                    if(tail[i][0] !== null) { modif.modifier = tail[i][0][0]; }
                    if(tail[i][0][1] !== null) {
                    	modif.number = tail[i][0][1][0];
                        modif.type = tail[i][0][1][1];
                    }
                    if(tail[i][1] !== null) { modif.at = tail[i][1][1]; }
                	result.time = modif;
                    break;
            }
        }
      }
    }
    return result;
  }

ActivityCode 
  = code:(EXAM_ACTIVITY_CODE / MOODLE_QUIZ_ACTIVITY_CODE / MOODLE_HOMEWORK_ACTIVITY_CODE) { return code; }

MeetingSequence "Meeting Number (e.g., S2 for Seminar 2)"
  = meeting:(SEMINAR_MEETING / LABORATORY_MEETING / PRACTICUM_MEETING) number:Integer { return meeting + ' ' + number}

TimeModifier
  = time:(MEETING_START / MEETING_END) adjust:((('-'/'+') DeltaTime) ('@' HHMM)?)?

DeltaTime 
  = Integer ('m' / 'h' / 'd' / 'w') 

HHMM
  = ([2][0-3] / [0-1]?[0-9] / [0-9]) ':' [0-5][0-9] { return text() }

Integer "integer"
  = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t]*

EXAM_ACTIVITY_CODE 
  = 'E' { return "Exam "}
MOODLE_QUIZ_ACTIVITY_CODE 
  = 'Q' { return "Moodle Quiz "}
MOODLE_HOMEWORK_ACTIVITY_CODE 
  = 'H' { return "Moodle Homework "}

SEMINAR_MEETING 
  = 'S' {return 'Seminar'; }
LABORATORY_MEETING
  = 'L' {return 'Laboratory'; }
PRACTICUM_MEETING
  = 'P' {return 'Practicum'; }

MEETING_START 
  = 'S' {return 'start'; }
MEETING_END 
  = 'F' {return 'end'; }

Spacing 
  = (Space / Comment)*
Comment 
  = '#' (!EndOfLine .)* EndOfLine { return 'comment';}
Space 
  = ' ' / '\t' / EndOfLine
EndOfLine 
  = '\r\n' / '\n' / '\r'
EndOfFile 
  = !. { return "EOF"; }