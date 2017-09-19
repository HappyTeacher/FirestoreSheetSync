function writeSubjectIds(subjectsSheet) {
  writeIds(subjectsSheet, SUBJECTS_COLUMNS[ID], generateSubjectIdFromRow);
}

function writeSubjectsToFirebaseForLanguage(languageCode, subjectsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);

  var columnForLanguageName = SUBJECTS_COLUMNS[NAMES][languageCode];
  if (!columnForLanguageName) {
    throw new Error("The language " + languageCode + " does not have a NAME column assigned. Operation cancelled.");
  }

  // Sort the table by name for this language, only add for rows where name column isn't empty.
  var sortedData = ArrayLib.sort(subjectsData, columnForLanguageName, false); // false => descending
    
  var subjectsObject = {};

  // Keep track of whether a parent subject has children (for
  //  populating a boolean field). Keep track of this outside 
  //  the loop in case a child is encountered before parent.
  var subjectHasChildrenMap = {};
  
  var currentRow = 0;
  var row = sortedData[currentRow];
  while (row && row[SUBJECTS_COLUMNS[NAMES][languageCode]]) {
    
    var id = row[SUBJECTS_COLUMNS[ID]];
    var name = row[SUBJECTS_COLUMNS[NAMES][languageCode]];
    var parent = row[SUBJECTS_COLUMNS[PARENT_SUBJECT]];
    var hasChildren = subjectHasChildrenMap[id];
    
    var subjectObject = {};
    subjectObject[NAME] = name;
    subjectObject[HAS_CHILDREN] = hasChildren;

    if (parent) {
      subjectObject[PARENT_SUBJECT] = parent;
      subjectHasChildrenMap[parent] = true;
      subjectsObject[parent][HAS_CHILDREN] = true;
    }

    subjectsObject[id] = subjectObject;

    currentRow++;
    row = sortedData[currentRow];
  }
  base.setData(languageCode + "/subjects", subjectsObject);
}

function generateSubjectIdFromRow(row) {
  var nameEnglish = row[SUBJECTS_COLUMNS[NAMES][ENGLISH_LOCALE]];

  return nameEnglish.toLowerCase();
}