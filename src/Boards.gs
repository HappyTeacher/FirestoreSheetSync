function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMNS[ID], generateBoardIdFromRow);
}

function writeBoardsToFirebaseForLanguage(languageCode, data, syllabusLessonData) {
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
    
    boards[boardId] = board;

    addBoardSubjectsAndLevelsToBoard(board, boardId, syllabusLessonData);

    currentRow++;
    row = sortedData[currentRow];
  }
  
  var base = FirebaseApp.getDatabaseByUrl(FIREBASE_URL, SECRET);
  base.setData(languageCode + "/boards", boards);
}

function addBoardSubjectsAndLevelsToBoard(board, boardId, syllabusLessonData) {
  var boardLessons = ArrayLib.filterByText(syllabusLessonData, SYLLABUS_COLUMNS[BOARD], boardId);
  var uniqueSubjectRows = ArrayLib.unique(boardLessons, SYLLABUS_COLUMNS[SUBJECT]);
  var uniqueLevelRows = ArrayLib.unique(boardLessons, SYLLABUS_COLUMNS[LEVEL]);

  boardSubjectsObject = {};
  for (var i = 0; i < uniqueSubjectRows.length; i++) {
    var boardSubject = uniqueSubjectRows[i][SYLLABUS_COLUMNS[SUBJECT]];
    var levelsForSubject = getLevelsIndexObjectForSubject(boardSubject, boardLessons);
    boardSubjectsObject[boardSubject] = levelsForSubject;
  }

  board[SUBJECTS] = boardSubjectsObject;

}

function getLevelsIndexObjectForSubject(boardSubject, boardLessons) {
  var lessonsForSubject = ArrayLib.filterByText(boardLessons, SYLLABUS_COLUMNS[SUBJECT], boardSubject);
  var uniqueLevelRowsForSubject = ArrayLib.unique(lessonsForSubject, SYLLABUS_COLUMNS[LEVEL]);

  levelsIndexObject = {};
  for (var i = 0; i < uniqueLevelRowsForSubject.length; i++) {
    var level = uniqueLevelRowsForSubject[i][SYLLABUS_COLUMNS[LEVEL]];
    levelsIndexObject[level] = true;
  }

  return levelsIndexObject;
}

function generateBoardIdFromRow(row) {
  var boardTitleEnglish = row[BOARDS_COLUMNS[NAMES][ENGLISH_LOCALE]];
  return boardTitleEnglish.toLowerCase();
}