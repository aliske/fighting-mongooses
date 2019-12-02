async function putSurveyAnswersInDb() {
    // id       - in endpoint
    // user     - in endpoint
    // question - here
    // answer   - here

    const survey_table = $("#survey-form-tbody");

    // get an array of the questions
    const id_tds = survey_table.find(".id-td");
    var questions = [];
    for (const id of id_tds) {
        questions.push(id.innerText);
    }

    // get an array of the answers

    // get the fieldset containing each answer
    const option_tds = survey_table.find(".option-td");
    var fieldsets = [];
    for (const option of option_tds) {
        fieldsets.push(option.firstChild);
    }

    var answers = [];

    // check whether each fieldset is short answer or single/multiple choice
    for (const fs of fieldsets) {
        
        // if single/multiple choice, add each "checked" answer to an array...
        if (fs.className == "choice-fieldset") {
            var ans = [];
            for (const child of fs.children) {
                if (child.className == "choice-answer" && child.checked) {
                    ans.push(child.value);
                }
            }

            // ...then save that array into "answers" array
            answers.push(ans);

        // if short answer, simply save the value
        // of the text area into "answers" array
        } else if (fs.className == "text-fieldset") {
            answers.push(fs.lastChild.value);
        }
    }

    // send each question and answer to the database
    for (var i = 0; i < questions.length; i++) {
        
        // get current question and answer
        const Q = questions[i];
        const A = answers[i];

        // VALIDATE USER INPUT HERE

        // put them into json form for the endpoint
        const body = {
            'question': Q,
            'answer': A
        };

        // POST survey answers to database
        const data = await fetch(`${ROOT_URI}/api/surveys/response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        .then(resp => {
            if (resp.status === 200) {
                alert("Survey submitted! Thank you for your feedback.");
                window.location.reload();
            } else {
                alert("Something went wrong. Please try again.");
                window.location.reload();
            }
        });
    }
}