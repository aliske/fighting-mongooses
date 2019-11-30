async function putSurveyAnswersInDb() {
    // id       - in endpoint
    // user     - in endpoint
    // question - here
    // answer   - here

    const survey_table = $("#survey-form-tbody");

    // questions
    const id_tds = survey_table.find(".id-td");
    var questions = [];
    for (const id of id_tds) {
        questions.push(id.innerText);
    }
    console.log(questions);

    // answers
    for (const id of questions) {
        
    }
}