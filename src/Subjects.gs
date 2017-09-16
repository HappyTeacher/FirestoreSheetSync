function writeSubjectIds(subjectsSheet) {
  writeIds(subjectsSheet, SUBJECTS_COLUMNS[ID], generateSubjectIdFromRow);
}

function writeSubjectsToFirebase(subjectsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
    
  var subjectsObject = {};
  for (var i = 1; i < subjectsData.length; i++) {
    var row = subjectsData[i];
    
    var id = row[SUBJECTS_COLUMNS[ID]];
    var isActive = row[SUBJECTS_COLUMNS[IS_ACTIVE]];
    var names = getNamesObjectFromSubjectRow(row);
    
    var subjectObject = {};
    subjectObject[NAMES] = names;
    subjectObject[IS_ACTIVE] = isActive;
    
    subjectsObject[id] = subjectObject;
  }
  base.setData("subjects", subjectsObject);
}

function getNamesObjectFromSubjectRow(row) {
  var names = {};
      
  var engName = row[SUBJECTS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  var marName = row[SUBJECTS_COLUMNS[NAMES][MARATHI_LOCALE]];
  var hinName = row[SUBJECTS_COLUMNS[NAMES][HINDI_LOCALE]];
        
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

function generateSubjectIdFromRow(row) {
  var nameEnglish = row[SUBJECTS_COLUMNS[NAMES][ENGLISH_LOCALE]];

  return nameEnglish.toLowerCase();
}