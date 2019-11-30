async function getSurveyNames() {

    // get surveys from database
    const data = await fetch(`${ROOT_URI}/api/surveys/by_user/`)
        .then(resp => { return resp.json() });

    // get an array of the survey names
    var names = [];
    for (const elem of data) {
        names.push(elem["name"]);
    }

    // add the survey names to options in dropdown
    const $names_choice = $("#survey-name");
    $names_choice.empty();
    $.each(names, function (idx, name) {
        $names_choice.append("<option>" + name + "</option")
    });
}