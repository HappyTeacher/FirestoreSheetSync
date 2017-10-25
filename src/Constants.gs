//// KEYS
var NAMES = "names";
var NAME = "name";
var SUBJECT = "subject";
var SUBJECTS = "subjects";
var TOPICS = "topics";
var TOPIC_COUNT = "topicCount";
var BOARD = "board";
var LEVEL = "level";
var LEVELS = "levels";
var PARENT_SUBJECT = "parentSubject";
var HAS_CHILDREN = "hasChildren";
var LESSON_NUMBER = "lessonNumber";
var ID = "id";
var LESSON = "lesson";
var TOPIC = "topic";
var NUMBER = "number";
var OBJECT = "object";
var KEYS = "keys";
var ENGLISH_LOCALE = "en";
var MARATHI_LOCALE = "mr";
var HINDI_LOCALE = "hi";
var AUTHOR_NAME = "authorName";
var AUTHOR_INSTITUTION = "authorInstitution";
var AUTHOR_LOCATION = "authorLocation";
var SUBTOPIC = "subtopic";
var BOARD_LEVELS = "boardLevels";
var LEVEL_SUBTOPICS = "level_subtopics";

//// Sheet: Boards
var BOARDS_COLUMNS = {};
BOARDS_COLUMNS[ID] = 0;
BOARDS_COLUMNS[NAME] = {};
BOARDS_COLUMNS[NAME][ENGLISH_LOCALE] = 1;
BOARDS_COLUMNS[NAME][MARATHI_LOCALE] = 2;
BOARDS_COLUMNS[NAME][HINDI_LOCALE] = 3;
BOARDS_COLUMNS[KEYS] = [NAME];

//// Sheet: Syllabus Lessons
var SYLLABUS_COLUMNS = {};
SYLLABUS_COLUMNS[ID] = 0;
SYLLABUS_COLUMNS[BOARD] = 1;
SYLLABUS_COLUMNS[LEVEL] = 2;
SYLLABUS_COLUMNS[SUBJECT] = 3;
SYLLABUS_COLUMNS[LESSON_NUMBER] = 4;
SYLLABUS_COLUMNS[NAME] = {};
SYLLABUS_COLUMNS[NAME][ENGLISH_LOCALE] = 5;
SYLLABUS_COLUMNS[NAME][MARATHI_LOCALE] = 6;
SYLLABUS_COLUMNS[NAME][HINDI_LOCALE] = 7;
SYLLABUS_COLUMNS[KEYS] = [BOARD, LEVEL, SUBJECT, LESSON_NUMBER, NAME];


//// Sheet: Syllabus Lessons * Topics
var PAIR_COLUMNS = {};
PAIR_COLUMNS[LESSON] = 0;
PAIR_COLUMNS[TOPIC] = 1;

//// Sheet: Topics
var TOPICS_COLUMNS = {};
TOPICS_COLUMNS[ID] = 0;
TOPICS_COLUMNS[SUBJECT] = 1;
TOPICS_COLUMNS[NAME] = {};
TOPICS_COLUMNS[NAME][ENGLISH_LOCALE] = 2;
TOPICS_COLUMNS[NAME][MARATHI_LOCALE] = 3;
TOPICS_COLUMNS[NAME][HINDI_LOCALE] = 4;
TOPICS_COLUMNS[KEYS] = [SUBJECT, NAME];

//// Sheet: subtopics
var SUBTOPICS_COLUMNS = {};
SUBTOPICS_COLUMNS[ID] = 0;
SUBTOPICS_COLUMNS[TOPIC] = 1;
SUBTOPICS_COLUMNS[NAME] = {};
SUBTOPICS_COLUMNS[NAME][ENGLISH_LOCALE] = 2;
SUBTOPICS_COLUMNS[NAME][MARATHI_LOCALE] = 3;
SUBTOPICS_COLUMNS[NAME][HINDI_LOCALE] = 4;
SUBTOPICS_COLUMNS[KEYS] = [NAME];

//// Sheet: subtopics dummy submissions
var SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS = {};
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[ID] = 0;
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[TOPIC] = 1;
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[SUBTOPIC] = 2;
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[AUTHOR_NAME] = 3;
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[AUTHOR_INSTITUTION] = 4;
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[AUTHOR_LOCATION] = 5;
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[NAME] = 6;
SUBTOPICS_DUMMY_SUBMISSIONS_COLUMNS[KEYS] = [AUTHOR_NAME, AUTHOR_INSTITUTION, AUTHOR_LOCATION, NAME];

//// Sheet: Subtopic * Board * Level
var SUBTOPIC_BOARD_LEVEL_COLUMNS = {};
SUBTOPIC_BOARD_LEVEL_COLUMNS[SUBTOPIC] = 0;
SUBTOPIC_BOARD_LEVEL_COLUMNS[BOARD] = 1;
SUBTOPIC_BOARD_LEVEL_COLUMNS[LEVEL] = 2;

//// Sheet: Subjects
var SUBJECTS_COLUMNS = {};
SUBJECTS_COLUMNS[ID] = 0;
SUBJECTS_COLUMNS[PARENT_SUBJECT] = 1;
SUBJECTS_COLUMNS[NAME] = {};
SUBJECTS_COLUMNS[NAME][ENGLISH_LOCALE] = 2;
SUBJECTS_COLUMNS[NAME][MARATHI_LOCALE] = 3;
SUBJECTS_COLUMNS[NAME][HINDI_LOCALE] = 4;
SUBJECTS_COLUMNS[KEYS] = [NAME];

//// Sheet: Levels
var LEVELS_COLUMNS = {};
LEVELS_COLUMNS[NUMBER] = 0;

//// Other:
var ID_DIV = " ^ ";