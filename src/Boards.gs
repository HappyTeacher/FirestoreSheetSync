function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMNS[ID], generateBoardIdFromRow);
}

function writeBoardsToFirebase(boardSheet, data) {
  // Create new JSON object to import!
  var boards = {};
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var boardId = row[BOARDS_COLUMNS[ID]];
    
    var board = {};
    board[NAMES] = getNameObjectFromBoardRow(row);
    board[IS_ACTIVE] = data[i][BOARDS_COLUMNS[IS_ACTIVE]];
    
    boards[boardId] = board;

    onSyncBoardRow(i, boardSheet);
  }
  
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  base.setData("boards", boards);
}

function getNameObjectFromBoardRow(row) {
  var names = {};
      
  var engName = row[BOARDS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  var marName = row[BOARDS_COLUMNS[NAMES][MARATHI_LOCALE]];
  var hinName = row[BOARDS_COLUMNS[NAMES][HINDI_LOCALE]];
        
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

function onSyncBoardRow(rowNumber, boardSheet) {
  //boardSheet.getRange(rowNumber + 1, 5 + 1).setBackground("red");
}

function generateBoardIdFromRow(row) {
  Logger.log(BOARDS_COLUMNS);
  Logger.log(NAMES);
  Logger.log(BOARDS_COLUMNS[ID]);
  var boardTitleEnglish = row[BOARDS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  return boardTitleEnglish.toLowerCase();
}