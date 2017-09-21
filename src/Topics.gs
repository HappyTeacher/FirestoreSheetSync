function writeTopicIds(topicsSheet) {
  writeIds(topicsSheet, TOPICS_COLUMNS[ID], generateTopicIdFromRow);
}

function writeSubtopicIds(subtopicsSheet) {
  writeIds(subtopicsSheet, SUBTOPICS_COLUMNS[ID], generateSubtopicIdFromRow);
}

function writeTopicsToFirebaseForLanguage(languageCode, topicsData, subjectsData, subtopicsData, subtopicBoardLevelData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);

  var sortedData = getDataSortedByLanguage(topicsData, TOPICS_COLUMNS, languageCode);

  var topics = {};
  var currentRow = 0;
  var row = sortedData[currentRow];
  while (row && row[TOPICS_COLUMNS[NAME][languageCode]]) {
    var idAndObject = getIdAndObjectFromRow(row, TOPICS_COLUMNS, languageCode);
    var topicId = idAndObject[ID];
    var topicObject = idAndObject[OBJECT];
  
    topics[topicId] = topicObject;

    // Now write subtopics for this topic:
    writeSubtopicsToFirebaseForLanguage(topicId, languageCode, subtopicsData, subtopicBoardLevelData);
      
    currentRow++;
    row = sortedData[currentRow];
  }

  base.setData(languageCode + "/topics", topics);
}

function writeSubtopicsToFirebaseForLanguage(topicId, languageCode, subtopicsData, subtopicBoardLevelData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  var topicSubtopics = ArrayLib.filterByText(subtopicsData, SUBTOPICS_COLUMNS[TOPIC], topicId);
  var sortedData = getDataSortedByLanguage(topicSubtopics, SUBTOPICS_COLUMNS, languageCode);

  var subtopics = {};
  var currentRow = 0;

  var row = sortedData[currentRow];

  while (row && row[SUBTOPICS_COLUMNS[NAME][languageCode]]) {
    var idAndObject = getIdAndObjectFromRow(row, SUBTOPICS_COLUMNS, languageCode);
    var subtopicId = idAndObject[ID];
    var subtopicObject = idAndObject[OBJECT];

    addBoardLevelDataToSubtopicObject(subtopicObject, subtopicId, subtopicBoardLevelData);
  
    subtopics[subtopicId] = subtopicObject;
      
    currentRow++;
    row = sortedData[currentRow];
  }

  base.setData(languageCode + "/subtopics/" + topicId, subtopics);
}

function addBoardLevelDataToSubtopicObject(subtopicObject, subtopicId, subtopicBoardLevelData) {
  var boardLevelsForSubtopic = ArrayLib.filterByText(subtopicBoardLevelData, SUBTOPIC_BOARD_LEVEL_COLUMNS[SUBTOPIC], subtopicId);

  var levelsByBoard = {};
  for (var i = 0; i < boardLevelsForSubtopic.length; i++) {
    var row = boardLevelsForSubtopic[i];
    var level = row[SUBTOPIC_BOARD_LEVEL_COLUMNS[LEVEL]];
    var board = row[SUBTOPIC_BOARD_LEVEL_COLUMNS[BOARD]];

    levelsByBoard[board] = level;
  }

  subtopicObject[BOARD_LEVELS] = levelsByBoard;
}

function generateTopicIdFromRow(row) {
  var subject = row[TOPICS_COLUMNS[SUBJECT]];
  var topic = row[TOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
  return (subject + ID_DIV + topic).toLowerCase();
}

function generateSubtopicIdFromRow(row) {
  var name = row[SUBTOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
  var author = row[SUBTOPICS_COLUMNS[AUTHOR_NAME]];
  var institution = row[SUBTOPICS_COLUMNS[AUTHOR_INSTITUTION]];
  return (name + ID_DIV + author + ID_DIV + institution).toLowerCase();
}

function generateSubtopicIdFromRow(row) {
  var name = row[SUBTOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
  return name.toLowerCase();
}

// The below functions are just for dummy data in the spreadsheet. Not for production!
function writeSubtopicSubmissionsToFirebaseForLanguage(languageCode, submissionsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);

  var submissions = {};
  
  for (var i = 0; i < submissionsData.length; i++) {
    var row = submissionsData[i];

    var idAndObject = getIdAndObjectFromRow(row, SUBTOPICS_DUMMY_SUBMISSIONS_COLUMN, languageCode);
    var submissionId = idAndObject[ID];
    var submissionObject = idAndObject[OBJECT];

    var subtopic = submissionObject[SUBTOPIC];
    var topic = submissionObject[SUBTOPIC][TOPIC];
  
    if (!submissions[TOPIC]) {
      submissions[TOPIC] = {};
    }

    submissions[TOPIC][SUBTOPIC] = submissionObject;
  }

  base.setData(languageCode + "/subtopics_submissions/", submissions);
}

function generateSubtopicSubmissionIdFromRow(row) {
  var subtopic = row[SUBTOPICS_DUMMY_SUBMISSIONS_COLUMN[SUBTOPIC]];
  var author = row[SUBTOPICS_DUMMY_SUBMISSIONS_COLUMN[AUTHOR_NAME]];
  var institution = row[SUBTOPICS_DUMMY_SUBMISSIONS_COLUMN[AUTHOR_INSTITUTION]];
  return (subtopic + ID_DIV + author + ID_DIV + institution).toLowerCase();
}

function writeSubtopicSubmissionIds(submissionsSheet) {
  writeIds(submissionsSheet, SUBTOPICS_DUMMY_SUBMISSIONS_COLUMN[ID], generateSubtopicSubmissionIdFromRow);
}