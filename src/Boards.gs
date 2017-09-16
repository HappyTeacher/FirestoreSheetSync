function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMNS[ID], generateBoardIdFromRow);
}

function writeBoardsToFirebaseForLanguage(languageCode, data) {
  var columnForLanguageName = BOARDS_COLUMNS[NAMES][languageCode];
  if (!columnForLanguageName) {
    throw new Error("The language " + languageCode + " does not have a NAME column assigned. Operation cancelled.");
  }

  var sortedData = ArrayLib.sort(data, columnForLanguageName, false); // false => descending

  // Create new JSON object to import!
  var boards = {};

  var currentRow = 0;
  var row = sortedData[currentRow];
  while (row && row[BOARDS_COLUMNS[NAMES][languageCode]]) {
    var boardId = row[BOARDS_COLUMNS[ID]];
    
    var board = {};
    board[NAME] = row[BOARDS_COLUMNS[NAMES][languageCode]];
    board[IS_ACTIVE] = row[BOARDS_COLUMNS[IS_ACTIVE]];
    
    boards[boardId] = board;

    currentRow++;
    row = sortedData[currentRow];
  }
  
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  base.setData(languageCode + "/boards", boards);
}

function generateBoardIdFromRow(row) {
  var boardTitleEnglish = row[BOARDS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  return boardTitleEnglish.toLowerCase();
}