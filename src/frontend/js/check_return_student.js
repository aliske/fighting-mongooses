async function checkReturnStudent(email){
    const data = await fetch(`${ROOT_URI}/api/users/`)
                    .then(resp => { return resp.json() })
	
	for(const elem of data) {
		if(email == elem["email"]){
			return true;
		}
		else {
			return false;
		}
	}
	
	

}