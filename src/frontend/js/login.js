async function tryLogin(req, res){

	const data = await fetch(`${ROOT_URI}/api/session/seeIfLoggedIn`, {
	  credentials: 'include'
	}).then(function(resp) { 
		return resp.json()
	})

	if(data.user)
	{
		console.log("tryLogin: Yes Login")
		var fname = data.fname
		var message = "<strong>Welcome, " + fname + `! (<a href='${ROOT_URI}/api/session/logout'>logout</a>)<strong>`
		makeMenu(data.type)
		$("#loginform").html(message)
		
	}
	else
	{
		makeMenu("none")
		var formcode = "";
    	formcode += "<form class='form-inline mt-2 mt-md-0 nav-login-form'>"
        formcode += "<input class='form-control mr-sm-2' type='text' placeholder='Username' id='username' aria-label='Username'>"
        formcode += "<input class='form-control mr-sm-2' type='password' placeholder='Password' id='password' aria-label='Password'>"
        formcode += "<button class='btn btn-dark my-2 my-sm-0' type='submit' id='login'>Login</button>"
    	formcode += "</form>"
    	formcode += "<button class='btn btn-dark my-2 my-sm-0 nav-register-btn' type='submit' id='register'>Register</button>"
		$("#loginform").html(formcode)
		console.log("tryLogin: No Login")
		
	}
}

function makeMenu(type){
	var menucode = ""
	console.log(type)
	if(type == "Admin"){
		menucode +="<ul class='navbar-nav mr-auto nav-links'>"
        menucode +="<li class='nav-item'>"
		menucode +="<a class='nav-link nav-link-text text-dark' href='../index.html'>Home</a>"
        menucode +="</li>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/gallery.html'>Gallery</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/Announcements.html'>Announcements</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/upload_page.html'>Uploads</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/surveys.html'>Surveys</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_files.html'>[Admin] Manage Files</a>"
        menucode +="</li>"
    	menucode +="</ul>"
	} else if(type == "Parent"){
		menucode +="<ul class='navbar-nav mr-auto nav-links'>"
        menucode +="<li class='nav-item'>"
		menucode +="<a class='nav-link nav-link-text text-dark' href='../index.html'>Home</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/gallery.html'>Gallery</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/upload_page.html'>Uploads</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/Registration.html'>Register Student</a>"
        menucode +="</li>"
    	menucode +="</ul>"
	} else if(type == "Student"){
		menucode +="<ul class='navbar-nav mr-auto nav-links'>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../index.html'>Home</a>"
        menucode +="</li>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/gallery.html'>Gallery</a>"
        menucode +="</li>"
    	menucode +="</ul>"
	} else if(type == "none") {
		menucode +="<ul class='navbar-nav mr-auto nav-links'>"
        menucode +="<li class='nav-item'>"
        menucode +="<a class='nav-link nav-link-text text-dark' href='../index.html'>Home</a>"
        menucode +="</li>"
   		menucode +="</ul>"
	}
	$("#menubar").html(menucode)
}
