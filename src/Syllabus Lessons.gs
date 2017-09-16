function writeSyllabusLessonIds(syllabusLessonSheet) {
  writeIds(syllabusLessonSheet, SYLLABUS_COLUMNS[ID], generateSyllabusLessonIdFromRow);
}

function writeSyllabusLessonsToFirebaseForLanguage(languageCode, syllabusLessonData, boardData, pairData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  
  var columnForLanguageName = SYLLABUS_COLUMNS[NAMES][languageCode];
  if (!columnForLanguageName) {
    throw new Error("The language " + languageCode + " does not have a NAME column assigned. Operation cancelled.");
  }

  var sortedData = ArrayLib.sort(syllabusLessonData, columnForLanguageName, false); // false => descending
  
  var lessonsByBoard = {};
  Logger.log(boardData);
  for (var i = 0; i < boardData.length; i++) {
    var boardId = boardData[i][BOARDS_COLUMNS[ID]];

    if (!boardId) { return; }

    var lessonsForBoard = ArrayLib.filterByText(sortedData, SYLLABUS_COLUMNS[BOARD], boardId);
     
    boardLessonsObject = {};
    // Iterate over syllabus lesson IDs:
    var currentLessonRow = 0;
    var lessonRow = lessonsForBoard[currentLessonRow];
    while (lessonRow && lessonRow[SYLLABUS_COLUMNS[NAMES][languageCode]]) {
      var lessonObject = {};
            
      var subject = lessonRow[SYLLABUS_COLUMNS[SUBJECT]];
      var level = lessonRow[SYLLABUS_COLUMNS[LEVEL]];
      var name = lessonRow[SYLLABUS_COLUMNS[NAMES][languageCode]];

      lessonObject[NAME] = name;
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

      currentLessonRow++;
      lessonRow = lessonsForBoard[currentLessonRow];
    }
    Logger.log(boardId);
    lessonsByBoard[boardId] = boardLessonsObject;
  }
  base.setData(languageCode + "/syllabusLessons", lessonsByBoard);
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

function generateSyllabusLessonIdFromRow(row) {
  var board = row[SYLLABUS_COLUMNS[BOARD]];
  var level = row[SYLLABUS_COLUMNS[LEVEL]];
  var subject = row[SYLLABUS_COLUMNS[SUBJECT]];
  var lessonNameEnglish = row[SYLLABUS_COLUMNS[NAMES][ENGLISH_LOCALE]];

  return (board + ID_DIV + level + ID_DIV + subject + ID_DIV + lessonNameEnglish).toLowerCase();
}