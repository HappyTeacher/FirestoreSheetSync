function writeBoardIds(boardSheet) {
  writeIds(boardSheet, BOARDS_COLUMNS[ID], generateBoardIdFromRow);
}

function writeBoardsToFirestoreForLanguage(languageCode, boardData) {
    var sortedData = getDataSortedByLanguage(boardData, BOARDS_COLUMNS, languageCode);

    const boardCollectionPath = "localized/" + languageCode + "/boards";

    forRowsWithLanguageName(sortedData, BOARDS_COLUMNS, languageCode, function(row){
        var idAndObject = getIdAndObjectFromRow(row, BOARDS_COLUMNS, languageCode);
        var boardId = idAndObject[ID];
        var board = idAndObject[OBJECT];

        var path = boardCollectionPath + "/" + boardId;
        FirestoreApp.updateDocument(path, board, email, key, projectId);
    });

    performDeletionsIfAvailable(boardData, BOARDS_COLUMNS, boardCollectionPath);
}

function generateBoardIdFromRow(row) {
  var boardTitle = getNameInFirstLanguageAvailable(row, BOARDS_COLUMNS);
  return boardTitle.toLowerCase();
}