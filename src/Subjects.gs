function writeSubjectIds(subjectsSheet) {
    writeIds(subjectsSheet, SUBJECTS_COLUMNS[ID], generateSubjectIdFromRow);
}

function writeSubjectsToFirestoreForLanguage(languageCode, subjectsData, syllabusLessonData) {
    const subjectsById = getSubjectById(languageCode, subjectsData, syllabusLessonData);

    const subjectCollectionPath = "localized/" + languageCode + "/subjects";
    const previousIds = FirestoreApp.getDocumentIds(subjectCollectionPath, email, key, projectId);
    const newIds = [];

    const subjectIds = Object.keys(subjectsById);
    for (var i = 0; i < subjectIds.length; i++) {
        var id = subjectIds[i];
        var subject = subjectsById[id];

        newIds.push(id);

        var path = subjectCollectionPath + "/" + id;

        FirestoreApp.updateDocument(path, subject, email, key, projectId);
    }

    deleteDocumentDiffs(previousIds, newIds, subjectCollectionPath)
}

function getSubjectById(languageCode, subjectsData, syllabusLessonData) {
    var subjectsById = {};

    // Keep track of whether a parent subject has children (for
    //  populating a boolean field). Keep track of this outside
    //  the loop in case a child is encountered before parent.
    var subjectHasChildrenMap = {};

    forRowsWithLanguageName(subjectsData, SUBJECTS_COLUMNS, languageCode, function(row){
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

        addBoardDataToSubject(subjectId, subjectObject, syllabusLessonData, languageCode);
        subjectsById[subjectId] = subjectObject;
    });

    return subjectsById;
}

function addBoardDataToSubject(subjectId, subject, syllabusLessonData, languageCode) {
    var syllabusLessonsForSubject = filterExactByText(syllabusLessonData, SYLLABUS_COLUMNS[SUBJECT], subjectId);

    var boardsObject = {};
    var boardStandardsObject = {};

    forRowsWithLanguageName(syllabusLessonsForSubject, SYLLABUS_COLUMNS, languageCode, function(row) {
        var boardId = row[SYLLABUS_COLUMNS[BOARD]];

        if (!boardsObject[boardId]) {
            var boardStandardsForSubject = getBoardStandards(boardId, syllabusLessonsForSubject, languageCode);

            boardsObject[boardId] = true;
            boardStandardsObject[boardId] = boardStandardsForSubject;
        }
    });

    subject["boards"] = boardsObject;
    subject["boardStandards"] = boardStandardsObject;
}

function getBoardStandards(boardId, syllabusLessonData, languageCode) {
    var syllabusLessonsForBoard = filterExactByText(syllabusLessonData, SYLLABUS_COLUMNS[BOARD], boardId);

    // Keep a "set" (standard -> true) of all standards encountered in the loop
    var standardsSet = {};
    var standards = [];

    forRowsWithLanguageName(syllabusLessonsForBoard, SYLLABUS_COLUMNS, languageCode, function(row) {
        var standard = row[SYLLABUS_COLUMNS[LEVEL]];

        if (!standardsSet[standard]) {
            standards.push(standard);
            standardsSet[standard] = true;
        }

    });

    // Sort ascending
    return standards.sort(function(a, b){return a-b});;
}

function generateSubjectIdFromRow(row) {
    var nameEnglish = row[SUBJECTS_COLUMNS[NAME][ENGLISH_LOCALE]];

    return nameEnglish.toLowerCase();
}