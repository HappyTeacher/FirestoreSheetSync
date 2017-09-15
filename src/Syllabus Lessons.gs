function onSyllabusEdit() {
  writeSyllabusLessonsToFirebase();
}

function writeSyllabusLessonsToFirebase() {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  var HappyTeacherSpreadsheet = SpreadsheetApp.openById(SHEET_ID);
  
  var syllabusLessonsSheet = HappyTeacherSpreadsheet.getSheetByName("Syllabus Lessons");
  var syllabusLessonData = syllabusLessonsSheet.getDataRange().getValues();
  
  var boardSheet = HappyTeacherSpreadsheet.getSheetByName("Boards");
  var boardData = boardSheet.getDataRange().getValues();
  
  var pairSheet = HappyTeacherSpreadsheet.getSheetByName("Syllabus Lessons * Topics");
  var pairData = pairSheet.getDataRange().getValues();
   
  var lessonsByBoard = {}
  for (var i = 1; i < boardData.length; i++) {
    var boardId = boardData[i][BOARDS_COLUMN_BOARD_ID]
    Logger.log(boardId);
    var lessonsForBoard = ArrayLib.filterByText(syllabusLessonData, SYLLABUS_COLUMN_SYLLABUS_BOARD_LINK, boardId);
     
    boardLessonsObject = {};
    // Iterate over syllabus lesson IDs:
    for (var j = 0; j < lessonsForBoard.length; j++) {
      var lessonObject = {};
      var lessonRow = lessonsForBoard[j];
            
      var subject = lessonRow[SYLLABUS_COLUMN_SUBJECT];
      var standard = lessonRow[SYLLABUS_COLUMN_STANDARD];

      lessonObject[NAMES] = getNameObjectFromSyllabusLessonRow(lessonRow);
      lessonObject[LEVEL] = standard;
      lessonObject[SUBJECT] = subject;
      lessonObject[BOARD] = lessonRow[SYLLABUS_COLUMN_SYLLABUS_BOARD_LINK];
      lessonObject[LESSON_NUMBER] = lessonRow[SYLLABUS_COLUMN_LESSON_NUMBER];
      
      var lessonId = lessonRow[SYLLABUS_COLUMN_LESSON_ID];
      
      if (!lessonId) {
        throw new Error("No ID specified for this syllabus lesson plan. Make sure all rows have an ID defined."); 
      }
      
      var topicsAndCount = getTopicPairsAndCount(lessonId, pairData)
      lessonObject[TOPICS] = topicsAndCount[TOPICS];
      lessonObject[TOPIC_COUNT] = topicsAndCount[TOPIC_COUNT];
       
      if (!boardLessonsObject[subject]) {
        boardLessonsObject[subject] = {};
      }
      
      if (!boardLessonsObject[subject][standard]) {
        boardLessonsObject[subject][standard] = {};
      }
                       
      boardLessonsObject[subject][standard][lessonId] = lessonObject;
    }
    lessonsByBoard[boardId] = boardLessonsObject;
  }
  base.setData("syllabusLessons", lessonsByBoard);
}

function getTopicPairsAndCount(syllabusLessonId, pairData) {    
  // Find pairs for this lesson ID:
  var topicsForLesson = ArrayLib.filterByText(pairData, PAIR_COLUMN_LESSON_ID, syllabusLessonId);
    
  // Create object of associations -- {id: true} if associated
  var associatedTopicsObject = {}
  for (var j = 0; j < topicsForLesson.length; j++) {
    var topicId = topicsForLesson[j][PAIR_COLUMN_TOPIC_ID];
    associatedTopicsObject[topicId] = true;
  }
  
  var payload = {}
  payload[TOPIC_COUNT] = topicsForLesson.length;
  payload[TOPICS] = associatedTopicsObject;
  
  return payload
}

function getNameObjectFromSyllabusLessonRow(row) {
  var names = {};
      
  var engName = row[SYLLABUS_COLUMN_ENGLISH_NAME];
  var marName = row[SYLLABUS_COLUMN_MARATHI_NAME];
  var hinName = row[SYLLABUS_COLUMN_HINDI_NAME];
        
  if (engName) {
    names[LANGUAGE_CODE_ENGLISH] = engName;
  } 
  if (marName) {
    names[LANGUAGE_CODE_MARATHI] = marName;
  } 
  if (hinName) {
    names[LANGUAGE_CODE_HINDI] = hinName;
  }
  
  return names;
}

function setSyllabusEditTrigger() {
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("onSyllabusEdit")
   .forSpreadsheet(sheet)
   .onEdit()
   .create();
}