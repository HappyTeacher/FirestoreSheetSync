function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMNS[ID], generateBoardIdFromRow);
}

function writeBoardsToFirestoreForLanguage(languageCode, data) {
    var sortedData = getDataSortedByLanguage(data, BOARDS_COLUMNS, languageCode);

    const boardCollectionPath = "localized/" + languageCode + "/boards";
    const previousIds = FirestoreApp.getDocumentIds(boardCollectionPath, email, key, projectId);
    const newIds = [];

    forRowsWithLanguageName(sortedData, BOARDS_COLUMNS, languageCode, function(row){
        var idAndObject = getIdAndObjectFromRow(row, BOARDS_COLUMNS, languageCode);
        var boardId = idAndObject[ID];
        var board = idAndObject[OBJECT];

        newIds.push(boardId);

        var path = boardCollectionPath + "/" + boardId;
        FirestoreApp.updateDocument(path, board, email, key, projectId);
    });

    deleteDocumentDiffs(previousIds, newIds, boardCollectionPath)
}

function generateBoardIdFromRow(row) {
  var boardTitleEnglish = row[BOARDS_COLUMNS[NAME][ENGLISH_LOCALE]];
  return boardTitleEnglish.toLowerCase();
}