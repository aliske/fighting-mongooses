async function tryLogin(req, res){

const data = await fetch(`${ROOT_URI}/api/session/seeIfLoggedIn`, {
  credentials: 'include'
})
	.then(resp => { return resp.json() })

console.log(data.msg)
}
