function writeIds(sheet, idColumn, idGenerator) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
	writeIdAtRowNumber(i, sheet, data, idColumn, idGenerator);
  }
}

function writeIdAtRowNumber(rowNumber, sheet, data, idColumn, idGenerator) {
	var row = data[rowNumber];
	var id = idGenerator(row);

	var idCell = sheet.getRange(rowNumber + 1, idColumn + 1);
	idCell.setValue(id);
	idCell.setBackground("green");
}