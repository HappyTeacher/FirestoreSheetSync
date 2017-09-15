function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMN_BOARD_ID, generateBoardIdFromRow);
}

function writeBoardsToFirebase(boardSheet, data) {
  // Create new JSON object to import!
  var boards = {};
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var boardId = row[BOARDS_COLUMN_BOARD_ID];
    
    var board = {};
    board[NAMES] = getNameObjectFromBoardRow(row);
    board[IS_ACTIVE] = data[i][BOARDS_COLUMN_IS_ACTIVE];
    
    boards[boardId] = board;

    onSyncBoardRow(i, boardSheet);
  }
  
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  base.setData("boards", boards);
}

function getNameObjectFromBoardRow(row) {
  var names = {};
      
  var engName = row[BOARDS_COLUMN_ENGLISH_NAME];
  var marName = row[BOARDS_COLUMN_MARATHI_NAME];
  var hinName = row[BOARDS_COLUMN_HINDI_NAME];
        
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

function onSyncBoardRow(rowNumber, boardSheet) {
  boardSheet.getRange(row + 1, 5 + 1).setBackground("red");
}

function generateBoardIdFromRow(row) {
  var boardTitleEnglish = row[BOARDS_COLUMN_ENGLISH_NAME];
  return boardTitleEnglish.toLowerCase();
}