async function unenroll_student(id){
	
	var unregistered = 0;
    const body = {
      'registered': unregistered
    }
    const data = await fetch(`${ROOT_URI}/api/users/unenroll/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
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