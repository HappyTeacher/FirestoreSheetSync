function writeSubtopicIds(subtopicsSheet) {
    writeIds(subtopicsSheet, SUBTOPICS_COLUMNS[ID], generateSubtopicIdFromRow);
}

function writeSubtopicsToFirestoreForLanguage(languageCode, subtopicsData, topicsData, subjectsData, boardLessonTopicPairData) {

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
        subtopicObject[SYLLABUS_LESSONS] = getAssociatedSyllabusLessonsForSubtopic(subtopicId, boardLessonTopicPairData);

        var subtopicPath = subtopicsCollectionPath + "/" + subtopicId;
        FirestoreApp.updateDocument(subtopicPath, subtopicObject, email, key, projectId);
    });

    performDeletionsIfAvailable(subtopicsData, SUBTOPICS_COLUMNS, subtopicsCollectionPath);
}

function generateSubtopicIdFromRow(row) {
    var currentTitleInId = getLastPieceFromIdOrNull(row, BOARDS_COLUMNS);

    var topic = row[SUBTOPICS_COLUMNS[TOPIC]];
    var name = getNameFromRowForId(row, SUBTOPICS_COLUMNS, currentTitleInId);

    if (!topic) {
        throw new Error("Subtopic ID generation error: No topic given for row " + row);
    } else if (!name) {
        throw new Error("Subtopic ID generation error: No subtopic name given for row " + row);
    }

    return (topic + ID_DIV + name).toLowerCase();
}