function writeTopicIds(topicsSheet) {
    writeIds(topicsSheet, TOPICS_COLUMNS[ID], generateTopicIdFromRow);
}

function writeSubtopicIds(subtopicsSheet) {
    writeIds(subtopicsSheet, SUBTOPICS_COLUMNS[ID], generateSubtopicIdFromRow);
}

function writeTopicsToFirestoreForLanguage(languageCode, topicsData, subtopicsData, subjectsData, boardLessonTopicPairData) {

    const topicsCollectionPath = "localized/" + languageCode + "/topics";

    forRowsWithLanguageName(topicsData, TOPICS_COLUMNS, languageCode, function(row) {
        var idAndObject = getIdAndObjectFromRow(row, TOPICS_COLUMNS, languageCode);
        var topicId = idAndObject[ID];
        var topicObject = idAndObject[OBJECT];

        topicObject[SYLLABUS_LESSONS] = getAssociatedSyllabusLessonsForTopic(topicId, boardLessonTopicPairData);

        var path = topicsCollectionPath + "/" + topicId;
        FirestoreApp.updateDocument(path, topicObject, email, key, projectId);

        var topicSubjects = filterExactByText(subjectsData, SUBJECTS_COLUMNS[ID], topicObject[SUBJECT]);
        var subjectName = topicSubjects[0][SUBJECTS_COLUMNS[NAME][languageCode]];

        writeSubtopicsToTopic(path, topicId, topicObject[SUBJECT], topicObject[NAME], subjectName, languageCode, subtopicsData);
    });

    performDeletionsIfAvailable(topicsData, TOPICS_COLUMNS, topicsCollectionPath);
}

function writeSubtopicsToTopic(topicPath, topicId, subjectId, topicName, subjectName, languageCode, subtopicsData) {
    var subtopicsForTopic = filterExactByText(subtopicsData, SUBTOPICS_COLUMNS[TOPIC], topicId);

    const subtopicsCollectionPath =  topicPath + "/subtopics";
//todo: don't nest subtopics. it makes it harder to delete them.
    forRowsWithLanguageName(subtopicsForTopic, SUBTOPICS_COLUMNS, languageCode, function(row) {
        var idAndObject = getIdAndObjectFromRow(row, SUBTOPICS_COLUMNS, languageCode);
        var subtopicId = idAndObject[ID];
        var subtopicObject = idAndObject[OBJECT];
        subtopicObject[TOPIC] = topicId;
        subtopicObject[SUBJECT] = subjectId;
        subtopicObject[SUBJECT_NAME] = subjectName;
        subtopicObject[TOPIC_NAME] = topicName;

        var subtopicPath = subtopicsCollectionPath + "/" + subtopicId;
        FirestoreApp.updateDocument(subtopicPath, subtopicObject, email, key, projectId);
    });

    Logger.log("Deleting subtopics i think");
    performDeletionsIfAvailable(subtopicsData, SUBTOPICS_COLUMNS, subtopicsCollectionPath);
}

function getAssociatedSyllabusLessonsForTopic(topicId, boardLessonTopicPairData) {
    return getAssociatedLessonsForColumn(topicId, BOARDLESSON_TOPIC_PAIR_COLUMNS[TOPIC], boardLessonTopicPairData);
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
    var subject = row[TOPICS_COLUMNS[SUBJECT]];
    var topic = row[TOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
    return (subject + ID_DIV + topic).toLowerCase();
}

function generateSubtopicIdFromRow(row) {
    var topic = row[SUBTOPICS_COLUMNS[TOPIC]];
    var name = row[SUBTOPICS_COLUMNS[NAME][ENGLISH_LOCALE]];
    return (topic + ID_DIV + name).toLowerCase();
}