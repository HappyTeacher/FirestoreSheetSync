function writeTopicIds(topicsSheet) {
  writeIds(topicsSheet, TOPICS_COLUMNS[ID], generateTopicIdFromRow);
}

function writeTopicsToFirebaseForLanguage(languageCode, topicsData, subjectsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);

  var columnForLanguageName = TOPICS_COLUMNS[NAMES][languageCode];
  if (!columnForLanguageName) {
    throw new Error("The language " + languageCode + " does not have a NAME column assigned. Operation cancelled.");
  }

  // Sort the table by name for this language, only add for rows where name column isn't empty.
  var sortedData = ArrayLib.sort(topicsData, columnForLanguageName, false); // false => descending

  var topics = {};
  var currentRow = 0;
  var row = sortedData[currentRow];
  while (row && row[TOPICS_COLUMNS[NAMES][languageCode]]) {
  
    var id = row[TOPICS_COLUMNS[ID]];
    var name = row[TOPICS_COLUMNS[NAMES][languageCode]];
    var subject = row[TOPICS_COLUMNS[SUBJECT]];
  
    var topicObject = {};
    topicObject[NAME] = name;
    topicObject[SUBJECT] = subject;
  
    topics[id] = topicObject;
      
    currentRow++;
    row = sortedData[currentRow];
  }

  base.setData(languageCode + "/topics", topics);
}

function generateTopicIdFromRow(row) {
  var subject = row[TOPICS_COLUMNS[SUBJECT]];
  var topic = row[TOPICS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  return (subject + ID_DIV + topic).toLowerCase();
}