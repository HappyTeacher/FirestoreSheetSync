function writeLevelsToFirebase(levelsData) {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
    
  var levelsObject = {};
  for (var i = 1; i < levelsData.length; i++) {
    var row = levelsData[i];
    
    var number = row[LEVELS_COLUMN_NUMBER];
    var isActive = row[LEVELS_COLUMN_IS_ACTIVE];
    
    levelsObject[number] = isActive;
  }
  base.setData("levels", levelsObject);
}