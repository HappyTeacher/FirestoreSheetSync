function writeLevelsToFirebase() {
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  
  var HappyTeacherSpreadsheet = SpreadsheetApp.openById(SHEET_ID);
  var levelsSheet = HappyTeacherSpreadsheet.getSheetByName("Levels");
  var levelsData = levelsSheet.getDataRange().getValues();
  
  var levelsObject = {}
  for (var i = 1; i < levelsData.length; i++) {
    var row = levelsData[i];
    
    var number = row[LEVELS_COLUMN_NUMBER];
    var isActive = row[LEVELS_COLUMN_IS_ACTIVE];
    
    levelsObject[number] = isActive;
  }
  base.setData("levels", levelsObject);
}