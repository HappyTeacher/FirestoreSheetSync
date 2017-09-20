function getIdAndObjectFromRow(row, columnObject, languageCode) {
	var id = row[columnObject[ID]];

	if (!id) {
		throw new Error("The following row is missing an ID. Row:" + row);
	}

	var keys = columnObject[KEYS];
	var object = {};
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var column;

		if (key == NAME) {
			column = columnObject[key][languageCode];
		} else {
			column = columnObject[key];
		}

		object[key] = row[column];
	}

	var payload = {};
	payload[ID] = id;
	payload[OBJECT] = object;

	return payload;
}

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