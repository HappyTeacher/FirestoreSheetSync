function writeSubjectIds(subjectsSheet) {
  writeIds(subjectsSheet, SUBJECTS_COLUMNS[ID], generateSubjectIdFromRow);
}

function writeSubjectsToFirebaseForLanguage(languageCode, subjectsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);

  var sortedData = getDataSortedByLanguage(subjectsData, SUBJECTS_COLUMNS, languageCode);

  var subjectsObject = {};

  // Keep track of whether a parent subject has children (for
  //  populating a boolean field). Keep track of this outside 
  //  the loop in case a child is encountered before parent.
  var subjectHasChildrenMap = {};
  
  var currentRow = 0;
  var row = sortedData[currentRow];
  while (row && row[SUBJECTS_COLUMNS[NAME][languageCode]]) {
    var idAndObject = getIdAndObjectFromRow(row, SUBJECTS_COLUMNS, languageCode);
    var subjectId = idAndObject[ID];
    var subjectObject = idAndObject[OBJECT];

    var parent = row[SUBJECTS_COLUMNS[PARENT_SUBJECT]];
    var hasChildren = subjectHasChildrenMap[subjectId];

    Logger.log(subjectId);
    Logger.log(subjectHasChildrenMap);
    
    subjectObject[HAS_CHILDREN] = hasChildren;

    if (parent) {
      subjectObject[PARENT_SUBJECT] = parent;
      subjectHasChildrenMap[parent] = true;

      if (subjectsObject[parent]) {
        subjectsObject[parent][HAS_CHILDREN] = true;
      }
    }

    subjectsObject[subjectId] = subjectObject;

    currentRow++;
    row = sortedData[currentRow];
  }
  base.setData(languageCode + "/subjects", subjectsObject);
}

function generateSubjectIdFromRow(row) {
  var nameEnglish = row[SUBJECTS_COLUMNS[NAME][ENGLISH_LOCALE]];

  return nameEnglish.toLowerCase();
}