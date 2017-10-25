function writeSubjectIds(subjectsSheet) {
    writeIds(subjectsSheet, SUBJECTS_COLUMNS[ID], generateSubjectIdFromRow);
}

function writeSubjectsToFirebaseForLanguage(languageCode, subjectsData, syllabusLessonData) {
    const subjectsById = getSubjectById(languageCode, subjectsData, syllabusLessonData);

    const subjectIds = Object.keys(subjectsById);
    for (var i = 0; i < subjectIds.length; i++) {
        var id = subjectIds[i];
        var subject = subjectsById[id];

        var path = "localized/" + languageCode + "/subjects/" + id;

        Logger.log(path);
        Logger.log(subject);
        Logger.log(FirestoreApp.updateDocument(path, subject, email, key, projectId));
    }

}

function getSubjectById(languageCode, subjectsData, syllabusLessonData) {
    var sortedData = getDataSortedByLanguage(subjectsData, SUBJECTS_COLUMNS, languageCode);

    var subjectsById = {};

    // Keep track of whether a parent subject has children (for
    //  populating a boolean field). Keep track of this outside
    //  the loop in case a child is encountered before parent.
    var subjectHasChildrenMap = {};

    var currentRow = 0;
    var row = sortedData[currentRow];

    while (row && row[SUBJECTS_COLUMNS[NAME][languageCode]]) {
        var idAndObject = getIdAndObjectFromRow(row, SUBJECTS_COLUMNS, languageCode);
        var subjectId = idAndObject[ID];
        var subjectObject = idAndObject[OBJECT];

        var parent = row[SUBJECTS_COLUMNS[PARENT_SUBJECT]];
        subjectObject[HAS_CHILDREN] = !!subjectHasChildrenMap[subjectId];

        if (parent) {
            subjectObject[PARENT_SUBJECT] = parent;
            subjectHasChildrenMap[parent] = true;

            if (subjectsById[parent]) {
                subjectsById[parent][HAS_CHILDREN] = true;
            }
        } else {
            subjectObject[PARENT_SUBJECT] = null;
        }

        addBoardDataToSubject(subjectId, subjectObject, syllabusLessonData);
        subjectsById[subjectId] = subjectObject;

        currentRow++;
        row = sortedData[currentRow];
    }

    return subjectsById;
}

function addBoardDataToSubject(subjectId, subject, syllabusLessonData) {
    // NOTE: This ignores language. Will show same standards/board for lessons in all languages.

    var syllabusLessonsForSubject = ArrayLib.filterByText(syllabusLessonData, SYLLABUS_COLUMNS[SUBJECT], subjectId);

    Logger.log("SYL LES FOR SUBJ:");
    Logger.log(syllabusLessonsForSubject);

    var uniqueBoards = ArrayLib.unique(syllabusLessonsForSubject, SYLLABUS_COLUMNS[BOARD]);

    Logger.log("UNIOQUE BOARDSJ:");
    Logger.log(syllabusLessonsForSubject);

    var boardsObject = {};
    var boardStandardsObject = {};

    for (var i = 0; i < uniqueBoards.length; i++) {
        var row = uniqueBoards[i];
        var boardId = row[SYLLABUS_COLUMNS[BOARD]];

        Logger.log("**BOARD ID:**");
        Logger.log(boardId);

        Logger.log("**BOARD STANDARDS**");
        var boardStandards = getBoardStandards(boardId, syllabusLessonData);
        Logger.log(boardStandards);

        boardsObject[boardId] = true;
        boardStandardsObject[boardId] = boardStandards;
    }

    subject["boardStandards"] = boardStandardsObject;
    subject["boards"] = boardsObject;
}

function getBoardStandards(boardId, syllabusLessonData) {
    var syllabusLessonsForBoard = ArrayLib.filterByText(syllabusLessonData, SYLLABUS_COLUMNS[BOARD], boardId);
    var uniqueStandards = ArrayLib.unique(syllabusLessonsForBoard, SYLLABUS_COLUMNS[LEVEL]);

    var standards = [];
    for (var i = 0; i < uniqueStandards.length; i++) {
        var row = uniqueStandards[i];
        var standard = row[SYLLABUS_COLUMNS[LEVEL]];

        standards.push(standard)
    }

    // Sort ascending
    return standards.sort(function(a, b){return a-b});
}

function generateSubjectIdFromRow(row) {
    var nameEnglish = row[SUBJECTS_COLUMNS[NAME][ENGLISH_LOCALE]];

    return nameEnglish.toLowerCase();
}