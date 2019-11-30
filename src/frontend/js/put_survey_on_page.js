async function putSurveyOnPage() {
    
    // get the ID of survey being taken
    const $names_choice = $("#survey-name");
    const choice = $names_choice.children("option:selected").val();
    const survey_id = choice.split(" ")[0];

    // get the questions for that survey
    const questions = await fetch(`${ROOT_URI}/api/surveys/questions/${survey_id}`)
        .then(resp => { return resp.json() });

    // get the options for each question
    var options = []
    for (const elem of questions) {
        const question_options = await fetch(`${ROOT_URI}/api/surveys/options/${elem['id']}`)
            .then(resp => { return resp.json() });
        options.push(question_options);
    }

    // make the survey title visible
    $("survey-title").removeAttr("hidden");
    
    // build the HTML to display quesions/options in a table on the page
    var table_data = "";
    for (var i = 0; i < questions.length; i++) {
        
        table_data += "<tr>";

        // current question ID get a column (should eventually probably be hidden from user)
        table_data += "<td class='id-td'>";
        table_data += questions[i]['id'];
        table_data += "</td>";

        // current question gets a column
        table_data += "<td class='question-td'>";
        table_data += questions[i]['question'];
        table_data += "</td>";

        // current answer gets a column
        table_data += "<td class='option-td'>";
        if (questions[i].type == "Short Answer") {

            // short answer (textarea to input answer)
            table_data += `<fieldset id='form-${questions[i]["id"]}'><legend>Write a short response:</legend>`;
            table_data += `<textarea id='answer-${questions[i]["id"]}'></textarea>`;
            table_data += "</fieldset>";

        } else if (questions[i].type == "Single Choice") {

            // single choice (radio button for each option)
            table_data += `<fieldset id='form-${questions[i]["id"]}'><legend>Choose one:</legend>`;
            for (const option of options[i]) {
                table_data += `<input type='radio' name='answer-${questions[i]["id"]}' value='${option['option_value']}'> ${option['option_value']}<br>`
            }
            table_data += "</fieldset>";

        } else if (questions[i].type == "Multiple Choice") {

            // multiple choice (checkbox for each option)
            table_data += `<fieldset id='form-${questions[i]["id"]}'><legend>Choose one or more:</legend>`;
            for (const option of options[i]) {
                table_data += `<input type='checkbox' name='answer-${questions[i]["id"]}' value='${option['option_value']}'> ${option['option_value']}<br>`
            }
            table_data += "</fieldset>";

        }
        table_data += "</td>";

        table_data += "</tr>";
    }

    // insert HTML into table on survey response page
    $("#survey-form-tbody").html(table_data);

    // make the survey submit button visible
    $("#survey-submit").removeAttr("hidden");
}