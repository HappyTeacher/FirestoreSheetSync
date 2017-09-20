function writeSyllabusLessonIds(syllabusLessonSheet) {
  writeIds(syllabusLessonSheet, SYLLABUS_COLUMNS[ID], generateSyllabusLessonIdFromRow);
}

function writeSyllabusLessonsToFirebaseForLanguage(languageCode, syllabusLessonData, boardData, pairData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  var sortedData = getDataSortedByLanguage(syllabusLessonData, SYLLABUS_COLUMNS, languageCode);
  
  var lessonsByBoard = {};
  for (var i = 0; i < boardData.length; i++) {
    var boardId = boardData[i][BOARDS_COLUMNS[ID]];

    var lessonsForBoard = ArrayLib.filterByText(sortedData, SYLLABUS_COLUMNS[BOARD], boardId);
     
    boardLessonsObject = {};
    // Iterate over syllabus lesson IDs:
    var currentLessonRow = 0;
    var lessonRow = lessonsForBoard[currentLessonRow];
    while (lessonRow && lessonRow[SYLLABUS_COLUMNS[NAME][languageCode]]) {
      var idAndObject = getIdAndObjectFromRow(lessonRow, SYLLABUS_COLUMNS, languageCode);
      var lessonId = idAndObject[ID];
      var lessonObject = idAndObject[OBJECT];
            
      var subject = lessonObject[SUBJECT];
      var level = lessonObject[LEVEL];

      addTopicPairsAndCountToLesson(lessonObject, lessonId, pairData);
      
      if (!boardLessonsObject[subject]) {
        boardLessonsObject[subject] = {};
      }
      
      if (!boardLessonsObject[subject][level]) {
        boardLessonsObject[subject][level] = {};
      }
                       
      boardLessonsObject[subject][level][lessonId] = lessonObject;

      currentLessonRow++;
      lessonRow = lessonsForBoard[currentLessonRow];
    }
    lessonsByBoard[boardId] = boardLessonsObject;
  }
  base.setData(languageCode + "/syllabusLessons", lessonsByBoard);
}

function addTopicPairsAndCountToLesson(lessonObject, syllabusLessonId, pairData) {
  // Find pairs for this lesson ID:
  var topicsForLesson = ArrayLib.filterByText(pairData, PAIR_COLUMNS[LESSON], syllabusLessonId);
    
  // Create object of associations -- {id: true} if associated
  var associatedTopicsObject = {};
  for (var j = 0; j < topicsForLesson.length; j++) {
    var topicId = topicsForLesson[j][PAIR_COLUMNS[TOPIC]];
    associatedTopicsObject[topicId] = true;
  }

  lessonObject[TOPICS] = associatedTopicsObject;
  lessonObject[TOPIC_COUNT] = topicsForLesson.length;
}

function generateSyllabusLessonIdFromRow(row) {
  var board = row[SYLLABUS_COLUMNS[BOARD]];
  var level = row[SYLLABUS_COLUMNS[LEVEL]];
  var subject = row[SYLLABUS_COLUMNS[SUBJECT]];
  var lessonNameEnglish = row[SYLLABUS_COLUMNS[NAME][ENGLISH_LOCALE]];

  return (board + ID_DIV + level + ID_DIV + subject + ID_DIV + lessonNameEnglish).toLowerCase();
}