async function tryLogin(){

	const data = await fetch(`${ROOT_URI}/api/session/seeIfLoggedIn`, {
	  credentials: 'include'
	}).then(function(resp) { 
		return resp.json();
	});

	if(data.user)
	{
		console.log("tryLogin: Yes Login");
		let fname = data.fname;
		let message = "<strong>&nbsp;&nbsp;Welcome, " + fname + `! (<a href='${ROOT_URI}/api/session/logout'>logout</a>)<strong>`;
		makeMenu(data.type);
		$("#loginform").html(message);
		
	}
	else
	{
		makeMenu("none");
		let formcode = "<div style='padding-left: 10px'>";
    	formcode += "<form class='form-inline mt-2 mt-md-0 nav-login-form'>";
        formcode += "<input class='form-control mr-sm-2' type='text' placeholder='Username' id='username' aria-label='Username'>";
        formcode += "<input class='form-control mr-sm-2' type='password' placeholder='Password' id='password' aria-label='Password'>";
        formcode += "<button class='btn btn-dark my-2 my-sm-0' type='submit' id='login'>Login</button>";
    	formcode += "</form>";
    	formcode += "<p>Parents, new to Bits & Bytes? <a href='../StaticPages/sign-up.html' id='signup'>Sign Up!</a></p>";
    	formcode += "</div>";
		$("#loginform").html(formcode);
		console.log("tryLogin: No Login");

	}
}

function makeMenu(type){
	let menucode = "";
	console.log(type);
	menucode +="<ul class='navbar-nav mr-auto nav-links'>";
	menucode +="<li class='nav-item'>";
	menucode +="<a class='nav-link nav-link-text text-dark' href='../index.html'>Home</a>";
	menucode +="</li>";
	menucode +="<li class='nav-item'>";
	if(type != null && type !== "none"){
	    menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/gallery.html'>Gallery</a>"
        menucode +="</li>";
        menucode +="<li class='nav-item'>";
		menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/upload_page.html'>Uploads</a>";
		menucode +="</li>";
		menucode +="<li class='nav-item'>";
		if(type === "Parent"){
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/Registration.html'>Register Student</a>";
		} else if(type === "Admin"){
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/Announcements.html'>Announcements</a>";
			menucode +="</li>";
			menucode +="<li class='nav-item'>";
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_required_files.html'>[Admin] Manage Required Files</a>";
			menucode +="</li>";
			menucode +="<li class='nav-item'>";
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_attendance_status.html'>[Admin] Attendance Status</a>";
            menucode +="</li>"
            menucode +="<li class='nav-item'>"
            menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/surveys.html'>Surveys</a>"
            menucode +="</li>"
            menucode +="<li class='nav-item'>"
            menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_files.html'>[Admin] Manage Files</a>"
            menucode +="</li>"
            menucode +="<li class='nav-item'>"
            menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_email.html'>[Admin] Send Email</a>"
		}
	}
	menucode +="</li>";
	menucode +="</ul>";
	$("#menubar").html(menucode);
}
