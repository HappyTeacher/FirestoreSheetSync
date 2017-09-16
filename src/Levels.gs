function writeLevelsToFirebase(levelsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
    
  var levelsObject = {};
  for (var i = 1; i < levelsData.length; i++) {
    var row = levelsData[i];
    
    var number = row[LEVELS_COLUMNS[NUMBER]];
    var isActive = row[LEVELS_COLUMNS[IS_ACTIVE]];
    
    levelsObject[number] = isActive;
  }
  base.setData("levels", levelsObject);
}