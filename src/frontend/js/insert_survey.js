async function insertSurvey(){
  const name = $('#name').val()
  const startdate = $('#startdate').val()
  const enddate = $('#enddate').val()
  const type = $('#type').val()

// VALIDATE USER INPUT HERE

const body = {
  'name': name,
  'startdate': startdate,
  'enddate': enddate,
  'type': type,
}

const data = await fetch(`${ROOT_URI}/api/surveys`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
.then(resp => { 
  if (resp.status === 200) {
    window.location.reload();
  }
  else 
    alert(data.msg);
})
}

async function insertQuestion(){
  const survey = $('#survey').val()
  const question = $('#question').val()
  const type = $('#type').val()
  const option1 = $('#option1').val()
  const option2 = $('#option2').val()
  const option3 = $('#option3').val()
  const option4 = $('#option4').val()
  const option5 = $('#option5').val()
  const option6 = $('#option6').val()

// VALIDATE USER INPUT HERE

var body = {
  'survey': survey,
  'question': question,
  'type': type,
}

const data = await fetch(`${ROOT_URI}/api/surveys/question`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})
.then(resp => { 
  if (resp.status === 200) {
    return resp.json();
  } else
    alert(data.msg);
})
//alert(data.insertID);
if(data.insertID > 0 && type != "Short Answer" && option1 != "")
{
  var body = {
    'question': data.insertID,
    'option_value': option1,
  }
  const data1 = await fetch(`${ROOT_URI}/api/surveys/question/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => { 
    if (resp.status === 200) {
      return resp.json();
    } else
      alert(data1.msg);
  })
}
if(data.insertID > 0 && type != "Short Answer" && option2 != "")
{
    var body = {
    'question': data.insertID,
    'option_value': option2,
  }
  const data2 = await fetch(`${ROOT_URI}/api/surveys/question/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => { 
    if (resp.status === 200) {
      return resp.json();
    } else
      alert(data2.msg);
  })
  
}
if(data.insertID > 0 && type != "Short Answer" && option3 != "")
{
    var body = {
    'question': data.insertID,
    'option_value': option3,
  }
  const data3 = await fetch(`${ROOT_URI}/api/surveys/question/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => { 
    if (resp.status === 200) {
      return resp.json();
    } else
      alert(data3.msg);
  })
}
if(data.insertID > 0 && type != "Short Answer" && option4 != "")
{
  var body = {
    'question': data.insertID,
    'option_value': option4,
  }
  const data4 = await fetch(`${ROOT_URI}/api/surveys/question/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => { 
    if (resp.status === 200) {
      return resp.json();
    } else
      alert(data4.msg);
  })
}
if(data.insertID > 0 && type != "Short Answer" && option5 != "")
{
  var body = {
    'question': data.insertID,
    'option_value': option5,
  }
  const data5 = await fetch(`${ROOT_URI}/api/surveys/question/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => { 
    if (resp.status === 200) {
      return resp.json();
    } else
      alert(data5.msg);
  })
}
if(data.insertID > 0 && type != "Short Answer" && option6 != "")
{
  var body = {
    'question': data.insertID,
    'option_value': option6,
  }
  const data6 = await fetch(`${ROOT_URI}/api/surveys/question/options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(resp => { 
    if (resp.status === 200) {
      return resp.json();
    } else
      alert(data6.msg);
  })
}

}