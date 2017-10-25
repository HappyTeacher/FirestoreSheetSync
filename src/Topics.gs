function writeTopicIds(topicsSheet) {
    writeIds(topicsSheet, TOPICS_COLUMNS[ID], generateTopicIdFromRow);
}

function writeSubtopicIds(subtopicsSheet) {
    writeIds(subtopicsSheet, SUBTOPICS_COLUMNS[ID], generateSubtopicIdFromRow);
}

function writeTopicsToFirestoreForLanguage(languageCode, topicsData, subtopicsData) {
    forRowsWithLanguageName(topicsData, TOPICS_COLUMNS, languageCode, function(row) {
        var idAndObject = getIdAndObjectFromRow(row, TOPICS_COLUMNS, languageCode);
        var topicId = idAndObject[ID];
        var topicObject = idAndObject[OBJECT];

        var path = "localized/" + languageCode + "/topics/" + topicId;
        FirestoreApp.updateDocument(path, topicObject, email, key, projectId);

        writeSubtopicsToTopic(path, topicId, languageCode, subtopicsData);
    });
}

function writeSubtopicsToTopic(topicPath, topicId, languageCode, subtopicsData) {
    var subtopicsForTopic = filterExactByText(subtopicsData, SUBTOPICS_COLUMNS[TOPIC], topicId);

    forRowsWithLanguageName(subtopicsForTopic, SUBTOPICS_COLUMNS, languageCode, function(row) {
        var idAndObject = getIdAndObjectFromRow(row, SUBTOPICS_COLUMNS, languageCode);
        var subtopicId = idAndObject[ID];
        var subtopicObject = idAndObject[OBJECT];

        var subtopicPath = topicPath + "/subtopics/" + subtopicId;
        FirestoreApp.updateDocument(subtopicPath, subtopicObject, email, key, projectId);
    });
}

function generateTopicIdFromRow(row) {
    var subject = row[TOPICS_COLUMNS[SUBJECT]];
    var topic = row[TOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
    return (subject + ID_DIV + topic).toLowerCase();
}

function generateSubtopicIdFromRow(row) {
    var topic = row[SUBTOPICS_COLUMNS[TOPIC]];
    var name = row[SUBTOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
    return (topic + ID_DIV + name).toLowerCase();
}