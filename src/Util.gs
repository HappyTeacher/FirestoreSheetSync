
// Create a JSON object from a row given its columnObject
//	(an object of keys whose values are column numbers where
//	the value of that key should go in the created object).
//	Return this object and the ID in a payload object.
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

		if (key === NAME && columnObject[key][languageCode]) {
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

// Sort data so that rows with a name for the given language appear first.
function getDataSortedByLanguage(data, columnObject, languageCode) {
	var columnForLanguageName = columnObject[NAME][languageCode];
	if (!columnForLanguageName) {
		throw new Error("The language " + languageCode + " does not have a NAME column assigned. Operation cancelled.");
	}

	return ArrayLib.sort(data, columnForLanguageName, false); // false => descending
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

/**
 * Iterate over the given data until the data at column nameColumn
 * 	is empty. At each iteration, run the loopFunction, which can take
 * 	a row array as a parameter.
 */
function forRowsWithLanguageName(data, columnObject, languageCode, loopFunction) {
    var sortedData = getDataSortedByLanguage(data, columnObject, languageCode);

    var currentRow = 0;
    var row = sortedData[currentRow];

    while (row && row[columnObject[NAME][languageCode]]) {
        loopFunction(row);
        currentRow++;
        row = sortedData[currentRow];
    }
}

/**
 * Filter a 2D array into a 2D array where the given column equals
 *  the given value.
 *
 *  (This is a replacement helper function of the filterByText function
 *   in the ArrayLib library. The ArrayLib version of the function does
 *   not do an exact match, but rather checks if the element at the column
 *   contains the value).
 *
 * @param data the 2D array
 * @param column the column of the value to check
 * @param value the value to check
 * @returns {Array} the filtered array
 */
function filterExactByText(data, column, value) {
    filteredArray = [];
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row[column] === value) {
            filteredArray.push(row);
        }
    }

    return filteredArray;
}

function contains(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

function forEach(array, func) {
    for (var i = 0; i < array.length; i++) {
        var element = array[i];
        func(element);
    }
}

function getRemovedItems(previousItems, newItems) {
    const removedItems = [];
    for (var i = 0; i < previousItems.length; i++) {
        var previousItem = previousItems[i];
        if (previousItem && newItems.indexOf(previousItem) === -1) {
            removedItems.push(previousItem);
        }
    }

    return removedItems;
}

function getColumnAsArray(data, column) {
    return data.map(function(value, i) { return value[column] });
}

/**
 * Determine which name from a row to use in an ID and return it.
 *
 *  If a name was already assigned to the ID, use that name if it still
 *  exists in the row. Otherwise, choose the name in the first available
 *  language.
 */
function getNameFromRowForId(row, columnsObject, currentNameInId) {
    const englishName = row[columnsObject[NAME][ENGLISH_LOCALE]];
    const marathiName = row[columnsObject[NAME][MARATHI_LOCALE]];
    const hindiName = row[columnsObject[NAME][HINDI_LOCALE]];

    const names = [englishName, marathiName, hindiName];

    // If the ID already has a name in it, use that name if it is unchanged in the new row.
    //  (e.g. if the ID was first assigned with a Marathi name and then an English name was
    //        added, don't change the ID to use the English name now. Keep it the same).
    if (contains(names, currentNameInId)) {
        return currentNameInId;
    }

    const nameForRowId = getFirstTruthy(names);

    if (nameForRowId) {
        return nameForRowId
    } else {
        throw new Error("ID generation error! No name found for row: " + row);
    }
}

/**
 * Return the first non-falsey element in an array.
 *  If all elements are falsey, return null.
 * @param array the array of items to check
 */
function getFirstTruthy(array) {
    for (var i = 0; i < array.length; i++) {
        var element = array[i];
        if (element) {
            return element
        }
    }

    return null;
}

function getLastPieceFromIdOrNull(row, columnObject) {
    const id = row[columnObject[ID]];

    if (!id) {
        return null
    }

    const idPieces = id.split(ID_DIV);
    const length = idPieces.length;
    if (length > 0) {
        return idPieces[length - 1];
    } else {
        return null;
    }
}