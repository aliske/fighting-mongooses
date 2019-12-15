async function getAnnouncements(page) {
  // raw query
  const data = await fetch(`${ROOT_URI}/api/announcements/`)
                  .then(resp => { return resp.json() });

  if(page === "announcements") {
    const headers = ['title','announcement','cdate'];

    let data_HTML = data.map(row => {
      const row_data = headers.map(header => {
        // defaults to '' if null
        if(header === 'cdate'){
          row[header] = new Date(row[header]).toLocaleString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
        }
        return `<td class="td-other">${row[header] || ''}</td>`
      }).join('');

      return `<tr>${row_data}<td class="td-other"><button class='btn btn-primary' id='edit-btn' onclick='showEditCard(this)'>Edit</button></td><td class='td-other'><button class='btn btn-danger' id='delete-btn' onclick='removeAnnouncement(${row['id']})'>Delete</button></td></tr>`
    }).join('') ;

    $('#announcement-tbody').html(data_HTML)
  }
  else if (page === "homepage") {
    let data_HTML = data.map(row => {
      let date = new Date(row['cdate']).toLocaleString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        let annBody = `<h4>${row['title']}</h4>`;
        annBody += `<h6>${date}</h6>`;
        annBody += `<h5 class="space_after">${row['announcement']}</h5>`;
        return annBody
    }).join('');

    $('#home-annc').html(data_HTML)
  }
}