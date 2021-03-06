// Card Content Lists ==> Lesson Plans or Classroom Resources

function updateContentAtPath(path, cardListContent, sheetData, sheet, cardRowStart) {
    FirestoreApp.updateDocument(path, cardListContent, email, key, projectId);
    writeCardsToFirestore(path, sheetData, sheet, cardRowStart);
}

function createCardListContentAtPath(path, cardListContent, sheetData, sheet, cardRowStart) {
    const response = FirestoreApp.createDocument(path, cardListContent, email, key, projectId);
    const id = getContentIdFromResponse(response);
    writeCardsToFirestore(path + id, sheetData, sheet, cardRowStart);
    return id;
}

function writeCardsToFirestore(path, sheetData, sheet, cardRowStart) {
    const cardIdColumn = 14;

    const previousCardIds = FirestoreApp.getDocumentIds(path + "/cards", email, key, projectId);
    const newCardIds = [];

    for (var i = cardRowStart; i < sheetData.length; i++) {
        var row = sheetData[i];
        var card = getCardFromRow(row, i);
        var cardId = row[cardIdColumn];

        if (cardId) {
            var resp = FirestoreApp.updateDocument(path + "/cards/" + cardId, card, email, key, projectId);
            newCardIds.push(cardId)
        } else {
            var response = FirestoreApp.createDocument(path + "/cards/", card, email, key, projectId);
            var id = getContentIdFromResponse(response);
            newCardIds.push(id);
            sheet.getRange(i + 1, cardIdColumn + 1).setValue(id);
        }
    }

    deleteDocumentDiffs(previousCardIds, newCardIds, path + "/cards");
}

function getCardFromRow(row, cardNumber) {
    var cardObject = {};

    cardObject[ORDER_NUMBER] = cardNumber;

    cardObject[HEADER] = row[0];
    cardObject[BODY] = row[1];

    var attachment = row[2];
    if (attachment) {
        cardObject[ATTACHMENT_PATH] = row[2]
    }

    var youtubeId = row[3];
    if (youtubeId) {
        cardObject[YOUTUBE_ID] = youtubeId;
    } else {
        // If no video, then we can add images
        cardObject[IMAGES] = getImageUrlsFromRow(row);
    }
    return cardObject;
}

function getImageUrlsFromRow(row) {
    var imageUrls = [];
    for (var imageColumn = 4; imageColumn < 14; imageColumn++) {
        var imageUrl = row[imageColumn];
        if (imageUrl) {
            imageUrls.push(imageUrl);
        }
    }

    return imageUrls;
}

function getLanguageCodeForString(languageString) {
    switch (languageString) {
        case "Marathi":
            return "mr";
        case "English":
            return "en";
        case "Hindi":
            return "hi";
        case "Assamese":
            return "as";
        default:
            throw new Error("Unsupported language found: " + languageString);
    }
}

function getContentIdFromResponse(response) {
    const fullPath = response["name"];
    const id = fullPath.split("/").pop();
    return id;
}

function pullDocumentWithCards(documentPath) {
    const document = FirestoreApp.getDocumentFields(documentPath, email, key, projectId);

    const cardsPath = documentPath + "/cards";
    const cardIds = FirestoreApp.getDocumentIds(cardsPath, email, key, projectId);
    const cardsById = {};
    for (var i = 0; i < cardIds.length; i++) {
        var cardId = cardIds[i];
        var cardPath = cardsPath + "/" + cardId;
        var card = FirestoreApp.getDocumentFields(cardPath, email, key, projectId);
        cardsById[cardId] = card;
    }

    document["cardsById"] = cardsById;

    return document;
}