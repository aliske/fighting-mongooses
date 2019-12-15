async function getAnnouncements(page) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/announcements/`)
                  .then(resp => { return resp.json() });

  if(page === "announcements")
  {
    const headers = ['id', 'title', 'announcement', 'cdate'];

    let data_HTML = data.map(row => {
      const row_data = headers.map(header => {
        // defaults to '' if null
        return `<td class="td-other">${row[header] || ''}</td>`
      }).join('');

      return `<tr>${row_data}<td class="td-other"><button class='btn btn-primary' id='edit-btn' onclick='showEditCard(this)'>Edit</button></td><td class='td-other'><button class='btn btn-danger' id='delete-btn' onclick='removeAnnouncement(${row['id']})'>Delete</button></td></tr>`
    }).join('');

    $('#announcement-tbody').html(data_HTML)
  } else if (page === "homepage") {

    let body_HTML = "";
    for(let i=0; i < data.length; i++)
    {
      body_HTML += "<div class='alert alert-success'>";
      body_HTML += "<span style='font-size: 1.3em; font-weight: bold;'>" + data[i].title + "</span>";
      let date = data[i].cdate;
      date = date.split("T");
      date = date[0];
      body_HTML += "<br/><span style='font-style: italic; font-size: 0.8em; padding-left: 10px;'>" + date + "</span>";
      body_HTML += "<hr>";
      body_HTML += data[i].announcement + "</div><br/>"
    }


    $('#announcements-div').html(body_HTML);
    let scrollDiv = document.getElementById("announcements-div");
    if(scrollDiv.scrollHeight > scrollDiv.offsetHeight){
      $('#scroll-more-div').removeAttr('hidden');
    }
  }
}
