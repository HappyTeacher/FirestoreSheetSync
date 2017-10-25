function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMNS[ID], generateBoardIdFromRow);
}

function writeBoardsToFirestoreForLanguage(languageCode, data, syllabusLessonData, subtopicBoardLevelData) {
    var sortedData = getDataSortedByLanguage(data, BOARDS_COLUMNS, languageCode);

    var currentRow = 0;
    var row = sortedData[currentRow];

    // Go through all rows where there are boards with names for this language
    while (row && row[BOARDS_COLUMNS[NAME][languageCode]]) {
        var idAndObject = getIdAndObjectFromRow(row, BOARDS_COLUMNS, languageCode);
        var boardId = idAndObject[ID];
        var board = idAndObject[OBJECT];

        var path = "localized/" + languageCode + "/boards/" + boardId;
        FirestoreApp.updateDocument(path, board, email, key, projectId);

        currentRow++;
        row = sortedData[currentRow];
    }
}

function generateBoardIdFromRow(row) {
  var boardTitleEnglish = row[BOARDS_COLUMNS[NAME][ENGLISH_LOCALE]];
  return boardTitleEnglish.toLowerCase();
}