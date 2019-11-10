async function tryLogin(req, res){

	const data = await fetch(`${ROOT_URI}/api/session/seeIfLoggedIn`, {
	  credentials: 'include'
	}).then(function(resp) { 
		return resp.json()
	})

	if(data.user)
	{
		var fname = data.fname
		var message = "Welcome, " + fname + "!"
		$("#welcome").html(message)
	}
	else
		console.log("tryLogin: No Login")
}