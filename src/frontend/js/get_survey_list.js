async function getSurveyList(page) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/surveys/`)
                  .then(resp => { return resp.json() })
  if(page == "survey")
  {
    const headers = [
    {
        'internal_name': 'name',
        'display_name': 'Name'
      },
      {
        'internal_name': 'startdate',
        'display_name': 'Start Date'
      },
      {
        'internal_name': 'enddate',
        'display_name': 'End Date'
      },
      {
        'internal_name': 'type',
        'display_name': 'Parent / Child'
      }
    ]
    let headers_HTML = headers.map(header => { return `<th>${header.display_name}</th>` }).join('')
    headers_HTML = `<tr>${headers_HTML}` + `<th>Management</th></tr>`

    let data_HTML = data.map(row => {
      const row_data = headers.map(header => {
        // defaults to '' if null
        return `<td>${row[header.internal_name] || ''}</td>` 
      }).join('')

      return `<tr>${row_data}<td><a href="survey_questions.html?id=${row['id']}" style="color: white;">Add Questions</a><br><a href="survey_results.html?id=${row['id']}" style="color: white;">View Results</a><br></td></tr>`
    }).join('') 

    $('#survey_table').html(headers_HTML + data_HTML)

  }
}

async function getQuestionList(page, survey) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/surveys/questions/` + survey)
                  .then(resp => { return resp.json() })
  var headers_HTML = "<tr><th>Question</th><th>Type</th><th>Options</th><tr>"
  var body_HTML = ""
  for(var i=0; i < data.length; i++)
  {
    body_HTML += "<tr><td>" + data[i].question + "</td><td>" + data[i].type + "</td>"
    if(data[i].type != "Short Answer")
    {
      body_HTML += "<td><ul>"
      const option_data = await fetch(`${ROOT_URI}/api/surveys/options/` + data[i].id)
                  .then(resp => { return resp.json() })
      for(var x=0; x< option_data.length; x++)
      {
        body_HTML += "<li>" + option_data[x].option_value + "</li>"
      }
      body_HTML += "</td></ul>";
    }
    else
      body_HTML += "<td></td>"
    body_HTML += "</tr>"
  }
  $("#question_table").html(headers_HTML + body_HTML)

}