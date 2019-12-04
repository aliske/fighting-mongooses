async function getSurveysByUser() {

    // get surveys from database
    const data = await fetch(`${ROOT_URI}/api/surveys/by_user/`)
        .then(resp => { return resp.json() });

    // get an array of the survey ids & names
    var surveys = [];
    for (const elem of data) {
        surveys.push([elem["id"], elem["name"]]);
    }

    // add the survey names to options in dropdown
    const $names_choice = $("#survey-name");
    $names_choice.empty();
    $.each(surveys, function (idx, survey) {
        $names_choice.append("<option>" + survey[0] + " - " + survey[1] + "</option>")
    });
}