function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMNS[ID], generateBoardIdFromRow);
}

function writeBoardsToFirebaseForLanguage(languageCode, data, syllabusLessonData, subtopicBoardLevelData) {
  var sortedData = getDataSortedByLanguage(data, BOARDS_COLUMNS, languageCode);

  // Create new JSON object to import!
  var boards = {};

  var currentRow = 0;
  var row = sortedData[currentRow];
  while (row && row[BOARDS_COLUMNS[NAME][languageCode]]) {
    var idAndObject = getIdAndObjectFromRow(row, BOARDS_COLUMNS, languageCode);
    var boardId = idAndObject[ID];
    var board = idAndObject[OBJECT];

    board[LEVEL_SUBTOPICS] = getSubtopicLevelsIndexObjectForBoard(boardId, subtopicBoardLevelData);

    addBoardSubjectsAndLevelsToBoard(board, boardId, syllabusLessonData);
    boards[boardId] = board;

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

function getSubtopicLevelsIndexObjectForBoard(boardId, subtopicBoardLevelData) {
  var subtopicLevelsForBoard = ArrayLib.filterByText(subtopicBoardLevelData, SUBTOPIC_BOARD_LEVEL_COLUMNS[BOARD], boardId);

  var indexListByLevel = {};
  for (var i = 0; i < subtopicLevelsForBoard.length; i++) {
    var row = subtopicLevelsForBoard[i];
    var level = row[SUBTOPIC_BOARD_LEVEL_COLUMNS[LEVEL]];
    var subtopic = row[SUBTOPIC_BOARD_LEVEL_COLUMNS[SUBTOPIC]];

    if (!indexListByLevel[level]) {
      indexListByLevel[level] = {};
    }

    indexListByLevel[level][subtopic] = true;
  }

  return indexListByLevel;
}

function generateBoardIdFromRow(row) {
  var boardTitleEnglish = row[BOARDS_COLUMNS[NAME][ENGLISH_LOCALE]];
  return boardTitleEnglish.toLowerCase();
}