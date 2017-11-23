function writeSubtopicIds(subtopicsSheet) {
    writeIds(subtopicsSheet, SUBTOPICS_COLUMNS[ID], generateSubtopicIdFromRow);
}

function writeSubtopicsToFirestoreForLanguage(languageCode, subtopicsData, topicsData, subjectsData) {

    const subtopicsCollectionPath = "localized/" + languageCode + "/subtopics";

    forRowsWithLanguageName(subtopicsData, SUBTOPICS_COLUMNS, languageCode, function(row) {
        var idAndObject = getIdAndObjectFromRow(row, SUBTOPICS_COLUMNS, languageCode);
        var subtopicId = idAndObject[ID];
        var subtopicObject = idAndObject[OBJECT];

        var topicId = subtopicObject[TOPIC];

        var topicRows = filterExactByText(topicsData, TOPICS_COLUMNS[ID], topicId);
        var topicRow = topicRows[0];

        var topicName = topicRow[TOPICS_COLUMNS[NAME][languageCode]];
        var subjectId = topicRow[TOPICS_COLUMNS[SUBJECT]];
        var topicSubjects = filterExactByText(subjectsData, SUBJECTS_COLUMNS[ID], subjectId);
        var subjectName = topicSubjects[0][SUBJECTS_COLUMNS[NAME][languageCode]];

        subtopicObject[SUBJECT] = subjectId;
        subtopicObject[SUBJECT_NAME] = subjectName;
        subtopicObject[TOPIC_NAME] = topicName;

        var subtopicPath = subtopicsCollectionPath + "/" + subtopicId;
        FirestoreApp.updateDocument(subtopicPath, subtopicObject, email, key, projectId);
    });

    performDeletionsIfAvailable(subtopicsData, SUBTOPICS_COLUMNS, subtopicsCollectionPath);
}

function generateSubtopicIdFromRow(row) {
    var currentTitleInId = getLastPieceFromIdOrNull(row, BOARDS_COLUMNS);

    var topic = row[SUBTOPICS_COLUMNS[TOPIC]];
    var name = getNameFromRowForId(row, SUBTOPICS_COLUMNS, currentTitleInId);
    return (topic + ID_DIV + name).toLowerCase();
}