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
var AUTHOR_EMAIL = "authorEmail";
var AUTHOR_INSTITUTION = "authorInstitution";
var AUTHOR_LOCATION = "authorLocation";
var SUBTOPIC = "subtopic";
var BOARD_LEVELS = "boardLevels";
var LEVEL_SUBTOPICS = "level_subtopics";
var SYLLABUS_LESSONS = "syllabus_lessons";
var DATE_EDITED = "dateEdited";
var IS_FEATURED = "isFeatured";
var SUBJECT_NAME = "subjectName";
var ORDER_NUMBER = "orderNumber";
var HEADER = "header";
var BODY = "body";
var IMAGES = "imageUrls";
var YOUTUBE_ID = "youtubeId";
var LINK_URLS = "linkUrls";
var ATTACHMENT_PATH = "attachmentPath";
var TOPIC_NAME = "topicName";

var DB_WRITES_ROW_NUMBER = "DB_WRITES_ROW_NUMBER";

//// Sheet: Boards
var BOARDS_COLUMNS = {};
BOARDS_COLUMNS[ID] = 0;
BOARDS_COLUMNS[NAME] = {};
BOARDS_COLUMNS[NAME][ENGLISH_LOCALE] = 1;
BOARDS_COLUMNS[NAME][MARATHI_LOCALE] = 2;
BOARDS_COLUMNS[NAME][HINDI_LOCALE] = 3;
BOARDS_COLUMNS[KEYS] = [NAME];
BOARDS_COLUMNS[DB_WRITES_ROW_NUMBER] = 1;

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
SYLLABUS_COLUMNS[DB_WRITES_ROW_NUMBER] = 5;


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
TOPICS_COLUMNS[DB_WRITES_ROW_NUMBER] = 3;

//// Sheet: subtopics
var SUBTOPICS_COLUMNS = {};
SUBTOPICS_COLUMNS[ID] = 0;
SUBTOPICS_COLUMNS[TOPIC] = 1;
SUBTOPICS_COLUMNS[NAME] = {};
SUBTOPICS_COLUMNS[NAME][ENGLISH_LOCALE] = 2;
SUBTOPICS_COLUMNS[NAME][MARATHI_LOCALE] = 3;
SUBTOPICS_COLUMNS[NAME][HINDI_LOCALE] = 4;
SUBTOPICS_COLUMNS[KEYS] = [NAME, TOPIC];
SUBTOPICS_COLUMNS[DB_WRITES_ROW_NUMBER] = 4;

//// Sheet: Topic, Subtopic * Board Lesson
var BOARDLESSON_TOPIC_PAIR_COLUMNS = {};
BOARDLESSON_TOPIC_PAIR_COLUMNS[LESSON] = 0;
BOARDLESSON_TOPIC_PAIR_COLUMNS[TOPIC] = 1;
BOARDLESSON_TOPIC_PAIR_COLUMNS[SUBTOPIC] = 2;

//// Sheet: Subjects
var SUBJECTS_COLUMNS = {};
SUBJECTS_COLUMNS[ID] = 0;
SUBJECTS_COLUMNS[PARENT_SUBJECT] = 1;
SUBJECTS_COLUMNS[NAME] = {};
SUBJECTS_COLUMNS[NAME][ENGLISH_LOCALE] = 2;
SUBJECTS_COLUMNS[NAME][MARATHI_LOCALE] = 3;
SUBJECTS_COLUMNS[NAME][HINDI_LOCALE] = 4;
SUBJECTS_COLUMNS[KEYS] = [NAME];
SUBJECTS_COLUMNS[DB_WRITES_ROW_NUMBER] = 2;

//// Other:
var ID_DIV = " () ";