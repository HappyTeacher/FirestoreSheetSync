function writeTopicIds(topicsSheet) {
  writeIds(topicsSheet, TOPICS_COLUMNS[ID], generateTopicIdFromRow);
}

function writeTopicsToFirebase(topicsData, subjectsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  
  // Put topics as children of their subject
  var topicsBySubject = {};
  for (var i = 1; i < subjectsData.length; i++) {
    var subjectId = subjectsData[i][SUBJECTS_COLUMNS[ID]];
    var topics = {};
    
    topicsWithSubject = ArrayLib.filterByText(topicsData, TOPICS_COLUMNS[SUBJECT], subjectId);
    for (var j = 0; j < topicsWithSubject.length; j++) {
      var row = topicsWithSubject[j];
    
      var id = row[TOPICS_COLUMNS[ID]];
      var names = getNamesObjectFromTopicRow(row);
      var subject = row[TOPICS_COLUMNS[SUBJECT]];
      var isActive = row[TOPICS_COLUMNS[IS_ACTIVE]];
    
      var topicObject = {};
      topicObject[NAMES] = names;
      topicObject[SUBJECT] = subject;
      topicObject[IS_ACTIVE] = isActive;
    
      topics[id] = topicObject;
    }
    topicsBySubject[subjectId] = topics;
  }
  base.setData("topics", topicsBySubject);
}

function getNamesObjectFromTopicRow(row) {
  var names = {};
      
  var engName = row[TOPICS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  var marName = row[TOPICS_COLUMNS[NAMES][MARATHI_LOCALE]];
  var hinName = row[TOPICS_COLUMNS[NAMES][HINDI_LOCALE]];
        
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

function generateTopicIdFromRow(row) {
  var subject = row[TOPICS_COLUMNS[SUBJECT]];
  var topic = row[TOPICS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  return (subject + ID_DIV + topic).toLowerCase();
}