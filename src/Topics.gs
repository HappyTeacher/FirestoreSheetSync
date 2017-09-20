function writeTopicIds(topicsSheet) {
  writeIds(topicsSheet, TOPICS_COLUMNS[ID], generateTopicIdFromRow);
}

function writeTopicsToFirebaseForLanguage(languageCode, topicsData, subjectsData) {
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
      
    currentRow++;
    row = sortedData[currentRow];
  }

  base.setData(languageCode + "/topics", topics);
}

function generateTopicIdFromRow(row) {
  var subject = row[TOPICS_COLUMNS[SUBJECT]];
  var topic = row[TOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
  return (subject + ID_DIV + topic).toLowerCase();
}