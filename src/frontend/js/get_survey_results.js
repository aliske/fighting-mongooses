async function get_title(id) {
  const data = await fetch(`${ROOT_URI}/api/surveys/name/` + id)
    .then(resp => { return resp.json() })
  $("#survey_title").html(data[0].name)
}

async function get_questions(survey) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/surveys/questions/` + survey)
                  .then(resp => { return resp.json() })
  var headers_HTML = "<tr><th>Participant</th>"

  for(var i=0; i < data.length; i++)
  {
    headers_HTML += "<th>" + data[i].question + "</th>"
  }
  headers_HTML += "</tr>"
  $("#survey-thead").html(headers_HTML)

}

async function get_responses(survey) {
  const data = await fetch(`${ROOT_URI}/api/surveys/responders/` + survey)
    .then(resp => { return resp.json() })

  var body_HTML = ""

  for(var i=0; i< data.length; i++)
  {
    body_HTML += "<tr><td>" + data[i].lname + ", " + data[i].fname + "</td>"
    const question_data = await fetch(`${ROOT_URI}/api/surveys/questions/` + survey)
                    .then(resp => { return resp.json() })
    for(var x=0; x < question_data.length; x++)
    {

        const answer_data = await fetch(`${ROOT_URI}/api/surveys/response/` + question_data[x].id + `/` + data[i].user)
          .then(resp => { return resp.json() })
        if(answer_data[0] == "undefined" || answer_data[0] == null)
          body_HTML += "<td></td>"
        else
        {
          var answer = answer_data[0].answer
          answer = answer.replace("[\"", "").replace("\"]","").replace("\",\""," & ")
          body_HTML += "<td>" + answer + "</td>"
        }
    }
    body_HTML += "</tr>"
  }
  $("#survey-tbody").html(body_HTML)
  $("#survey_table").DataTable({
      "paging": false,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf'
    ]
    });
}
