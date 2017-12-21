function writeTopicIds(topicsSheet) {
    writeIds(topicsSheet, TOPICS_COLUMNS[ID], generateTopicIdFromRow);
}

function writeTopicsToFirestoreForLanguage(languageCode, topicsData, boardLessonTopicPairData) {

    const topicsCollectionPath = "localized/" + languageCode + "/topics";

    forRowsWithLanguageName(topicsData, TOPICS_COLUMNS, languageCode, function(row) {
        var idAndObject = getIdAndObjectFromRow(row, TOPICS_COLUMNS, languageCode);
        var topicId = idAndObject[ID];
        var topicObject = idAndObject[OBJECT];

        topicObject[SYLLABUS_LESSONS] = getAssociatedSyllabusLessonsForTopic(topicId, boardLessonTopicPairData);

        var path = topicsCollectionPath + "/" + topicId;
        FirestoreApp.updateDocument(path, topicObject, email, key, projectId);
    });

    performDeletionsIfAvailable(topicsData, TOPICS_COLUMNS, topicsCollectionPath);
}

function getAssociatedSyllabusLessonsForTopic(topicId, boardLessonTopicPairData) {
    return getAssociatedLessonsForColumn(topicId, BOARDLESSON_TOPIC_PAIR_COLUMNS[TOPIC], boardLessonTopicPairData);
}

function getAssociatedSyllabusLessonsForSubtopic(subtopicId, boardLessonTopicPairData) {
    return getAssociatedLessonsForColumn(subtopicId, BOARDLESSON_TOPIC_PAIR_COLUMNS[SUBTOPIC], boardLessonTopicPairData);
}

function getAssociatedLessonsForColumn(id, columnNumber, boardLessonTopicPairData) {
    var lessonIdColumn = 0;

    var lessonsForTopic = filterExactByText(boardLessonTopicPairData, columnNumber, id);
    var associatedLessons = {};

    for (var i = 0; i < lessonsForTopic.length; i++) {
        var lessonId = lessonsForTopic[i][lessonIdColumn];
        associatedLessons[lessonId] = true;
    }

    return associatedLessons;
}

function generateTopicIdFromRow(row) {
    var currentTopicNameInId = getLastPieceFromIdOrNull(row, BOARDS_COLUMNS);

    var subject = row[TOPICS_COLUMNS[SUBJECT]];
    var topic = getNameFromRowForId(row, TOPICS_COLUMNS, currentTopicNameInId);

    if (!subject) {
        throw new Error("Topic ID generation error: No subject given for row " + row);
    } else if (!topic) {
        throw new Error("Topic ID generation error: No topic name given for row " + row);
    }

    return (subject + ID_DIV + topic).toLowerCase();
}