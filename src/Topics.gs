function writeTopicIds(topicsSheet) {
  writeIds(topicsSheet, TOPICS_COLUMN_ID, generateTopicIdFromRow);
}

function writeTopicsToFirebase(topicsData, subjectsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  
  // Put topics as children of their subject
  var topicsBySubject = {};
  for (var i = 1; i < subjectsData.length; i++) {
    var subjectId = subjectsData[i][SUBJECTS_COLUMN_ID];
    var topics = {};
    
    topicsWithSubject = ArrayLib.filterByText(topicsData, TOPICS_COLUMN_SUBJECT_ID, subjectId);
    for (var j = 0; j < topicsWithSubject.length; j++) {
      var row = topicsWithSubject[j];
    
      var id = row[TOPICS_COLUMN_ID];
      var names = getNamesObjectFromTopicRow(row);
      var subject = row[TOPICS_COLUMN_SUBJECT_ID];
      var isActive = row[TOPICS_COLUMN_IS_ACTIVE];
    
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
      
  var engName = row[TOPICS_COLUMN_ENGLISH_NAME];
  var marName = row[TOPICS_COLUMN_MARATHI_NAME];
  var hinName = row[TOPICS_COLUMN_HINDI_NAME];
        
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

function generateTopicIdFromRow(row) {
  var subject = row[TOPICS_COLUMN_SUBJECT_ID];
  var topic = row[TOPICS_COLUMN_ENGLISH_NAME];
  return (subject + ID_DIV + topic).toLowerCase();
}