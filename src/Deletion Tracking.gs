function getWritesSheet() {
    var HappyTeacherSpreadsheet = SpreadsheetApp.openById(SHEET_ID);
    return HappyTeacherSpreadsheet.getSheetByName("DB_WRITES");
}

function getWritesDataRangeForRow(rowNumber) {
    var writesSheet = getWritesSheet();
    var dataRange = writesSheet.getDataRange();

    var itemCount = dataRange.getCell(rowNumber + 1, 2).getValue();
    if (!itemCount) {
        itemCount = 0;
    }

    var numRows = 1;
    var numCols = itemCount + 1; // + 1 for the count cell
    var startingColumn = 2; // indexed starting from 1 :|

    var rowRange = writesSheet.getRange(rowNumber + 1, startingColumn, numRows, numCols);
    return rowRange;
}

function getIdsWritten(modelRowNumber) {
    var writesDataRange = getWritesDataRangeForRow(modelRowNumber);
    var innerArray = writesDataRange.getValues()[0];
    innerArray.shift(); // Remove first item (length)

    return innerArray;
}

function setIdsWritten(modelRowNumber, idsArray) {

    // Clear old writes
    getWritesDataRangeForRow(modelRowNumber).clear();

    // First cell is the count, so prepend count onto IDs list
    idsArray.unshift(idsArray.length);

    // Make it a 2D spreadsheet-like array
    var wrappedArray = [];
    wrappedArray.push(idsArray);

    var writesSheet = getWritesSheet();
    var numRows = wrappedArray.length;
    var numCols = idsArray.length;
    var startingColumn = 1;
    var writesDataRange = writesSheet.getRange(modelRowNumber + 1, startingColumn + 1, numRows, numCols);

    writesDataRange.setValues(wrappedArray);
}

function performDeletionsIfAvailable(modelSheetData, modelColumnsObject, collectionPath) {
    Logger.log("Performing deletions.");
    var modelRowNumber = modelColumnsObject[DB_WRITES_ROW_NUMBER];

    var currentIds = getColumnAsArray(modelSheetData, modelColumnsObject[ID]);
    var previousIds = getIdsWritten(modelRowNumber);

    deleteDocumentDiffs(previousIds, currentIds, collectionPath);
    setIdsWritten(modelRowNumber, currentIds)
}

function deleteDocumentDiffs(previousIds, newIds, collectionPath) {
    Logger.log("Attempting delete. prev /  new");
    Logger.log(previousIds);
    Logger.log(newIds);

    const IdsToDelete = getRemovedItems(previousIds, newIds);

    forEach(IdsToDelete, function(id) {
        var documentPath = collectionPath + "/" + id;
        FirestoreApp.deleteDocument(documentPath, email, key, projectId);
    })
}