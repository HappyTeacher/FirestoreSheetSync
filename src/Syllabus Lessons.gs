function writeSyllabusLessonIds(syllabusLessonSheet) {
  writeIds(syllabusLessonSheet, SYLLABUS_COLUMNS[ID], generateSyllabusLessonIdFromRow);
}

function writeSyllabusLessonsToFirebase(syllabusLessonData, boardData, pairData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
   
  var lessonsByBoard = {};
  for (var i = 1; i < boardData.length; i++) {
    var boardId = boardData[i][BOARDS_COLUMNS[ID]];
    var lessonsForBoard = ArrayLib.filterByText(syllabusLessonData, SYLLABUS_COLUMNS[BOARD], boardId);
     
    boardLessonsObject = {};
    // Iterate over syllabus lesson IDs:
    for (var j = 0; j < lessonsForBoard.length; j++) {
      var lessonObject = {};
      var lessonRow = lessonsForBoard[j];
            
      var subject = lessonRow[SYLLABUS_COLUMNS[SUBJECT]];
      var level = lessonRow[SYLLABUS_COLUMNS[LEVEL]];

      lessonObject[NAMES] = getNameObjectFromSyllabusLessonRow(lessonRow);
      lessonObject[LEVEL] = level;
      lessonObject[SUBJECT] = subject;
      lessonObject[BOARD] = lessonRow[SYLLABUS_COLUMNS[BOARD]];
      lessonObject[LESSON_NUMBER] = lessonRow[SYLLABUS_COLUMNS[LESSON_NUMBER]];
      
      var lessonId = lessonRow[SYLLABUS_COLUMNS[ID]];
      
      if (!lessonId) {
        throw new Error("No ID specified for this syllabus lesson plan. Make sure all rows have an ID defined.");
      }
      
      var topicsAndCount = getTopicPairsAndCount(lessonId, pairData);
      lessonObject[TOPICS] = topicsAndCount[TOPICS];
      lessonObject[TOPIC_COUNT] = topicsAndCount[TOPIC_COUNT];
       
      if (!boardLessonsObject[subject]) {
        boardLessonsObject[subject] = {};
      }
      
      if (!boardLessonsObject[subject][level]) {
        boardLessonsObject[subject][level] = {};
      }
                       
      boardLessonsObject[subject][level][lessonId] = lessonObject;
    }
    lessonsByBoard[boardId] = boardLessonsObject;
  }
  base.setData("syllabusLessons", lessonsByBoard);
}

function getTopicPairsAndCount(syllabusLessonId, pairData) {
  // Find pairs for this lesson ID:
  var topicsForLesson = ArrayLib.filterByText(pairData, PAIR_COLUMNS[LESSON], syllabusLessonId);
    
  // Create object of associations -- {id: true} if associated
  var associatedTopicsObject = {};
  for (var j = 0; j < topicsForLesson.length; j++) {
    var topicId = topicsForLesson[j][PAIR_COLUMNS[TOPIC]];
    associatedTopicsObject[topicId] = true;
  }
  
  var payload = {};
  payload[TOPIC_COUNT] = topicsForLesson.length;
  payload[TOPICS] = associatedTopicsObject;
  
  return payload;
}

function getNameObjectFromSyllabusLessonRow(row) {
  var names = {};
      
  var engName = row[SYLLABUS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  var marName = row[SYLLABUS_COLUMNS[NAMES][MARATHI_LOCALE]];
  var hinName = row[SYLLABUS_COLUMNS[NAMES][HINDI_LOCALE]];
        
  if (engName) {
    names[ENGLISH_LOCALE] = engName;
  }
  if (marName) {
    names[MARATHI_LOCALE] = marName;
  }
  if (hinName) {
    names[HINDI_LOCALE] = hinName;
  }
  
  return names;
}

function generateSyllabusLessonIdFromRow(row) {
  var board = row[SYLLABUS_COLUMNS[BOARD]];
  var level = row[SYLLABUS_COLUMNS[LEVEL]];
  var subject = row[SYLLABUS_COLUMNS[SUBJECT]];
  var lessonNameEnglish = row[SYLLABUS_COLUMNS[NAMES][ENGLISH_LOCALE]];

  return (board + ID_DIV + level + ID_DIV + subject + ID_DIV + lessonNameEnglish).toLowerCase();
}