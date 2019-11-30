async function enroll_student(id){
	
	var date = new Date();
	var year = date.getFullYear();
    const body = {
      'registered': year
    }
    const data = await fetch(`${ROOT_URI}/api/users/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
	.then(resp => { 
		if (resp.status === 200) {
			//alert('record updated successfully')
		}
		else 
			alert(data.msg);
	})

}