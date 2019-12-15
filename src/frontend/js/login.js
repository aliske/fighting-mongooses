async function tryLogin(){

	const data = await fetch(`${ROOT_URI}/api/session/seeIfLoggedIn`, {
	  credentials: 'include'
	}).then(function(resp) { 
		return resp.json();
	});

	if(data.user)
	{
		let fname = data.fname;
		let message = "<strong>&nbsp;&nbsp;Welcome, " + fname + `! (<a href='${ROOT_URI}/api/session/logout'>logout</a>)<strong>`;
		makeMenu(data.type, data.user, data.status);
		$("#loginform").html(message);
		
	}
	else
	{
		makeMenu("none", null, null);
		let formcode = "<div style='padding-left: 10px'>";
    	formcode += "<form class='form-inline mt-2 mt-md-0 nav-login-form'>";
        formcode += "<input class='form-control mr-sm-2' type='text' placeholder='Username' id='username' aria-label='Username'>";
        formcode += "<input class='form-control mr-sm-2' type='password' placeholder='Password' id='password' aria-label='Password'>";
        formcode += "<button class='btn btn-dark my-2 my-sm-0' type='submit' id='login'>Login</button>";
    	formcode += "</form>";
    	formcode += "<p>Parents, new to Bits & Bytes? <a href='../StaticPages/sign-up.html' id='signup'>Sign Up!</a></p>";
    	formcode += "</div>";
		$("#loginform").html(formcode);
	}
}

function makeMenu(type, userId, status){
	let menucode = "";
	menucode +="<ul class='navbar-nav mr-auto nav-links'>";
	menucode +="<li class='nav-item'>";
	menucode +="<a class='nav-link nav-link-text text-dark' href='../index.html'>Home</a>";
	menucode +="</li>";
	menucode +="<li class='nav-item'>";
	if(type != null && type !== "none"){
	    menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/gallery.html'>Gallery</a>";
        menucode +="</li>";
        menucode +="<li class='nav-item'>";
		menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/Attendance.html'>Attendance</a>";
		menucode +="</li>";
		menucode +="<li class='nav-item'>";
		if(type === "Student"){
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/survey_respond.html'>Surveys</a>";
			menucode +="</li>";
			menucode +="<li class='nav-item'>";
			if(status === 0){
		        menucode += "<button type='button' style='margin-left: 10px;' class='btn btn-success' id='check-in-button' onclick='checkInOut("+ userId +", 1)'>Check In</button>";
		    } else {
		        menucode += "<button type='button' style='margin-left: 10px;' class='btn btn-success' id='check-out-button' onclick='checkInOut("+ userId +", 0)'>Check Out</button>";
			}
		} else if(type === "Parent"){
		    menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/upload_page.html'>Uploads</a>";
            menucode +="</li>";
            menucode +="<li class='nav-item'>";
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/Registration.html'>Register Student</a>";
			menucode +="</li>";
			menucode +="<li class='nav-item'>";
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/survey_respond.html'>Surveys</a>";
		} else if(type === "Admin"){
		    menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/upload_page.html'>Uploads</a>";
            menucode +="</li>";
            menucode +="<li class='nav-item'>";
			menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/Announcements.html'>Announcements</a>";
			menucode +="</li>";
            menucode +="<li class='nav-item'>";
            menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/surveys.html'>Surveys</a>";
            menucode +="</li>";
            // menucode +="<li class='nav-item'>";
            // menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_page.html'>Admin Page</a>";
            // menucode +="</li>";
            menucode += `
            <div class='nav-item dropdown'>
              <button class='btn btn-outline-secondary dropdown-toggle' type="button" id="dropdownAdminPages" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >Admin</a>
              <ul class="dropdown-menu" aria-labelledby="dropdownAdminPages">
                <li>
                  <a class='admin-link nav-link nav-link-text text-dark' href='../StaticPages/admin_page.html'>Registration + Student Records</a>
                </li>
                <li>
                  <a class='admin-link nav-link nav-link-text text-dark' href='../StaticPages/admin_files.html'>Manage Required Files + Photo Gallery</a>
                </li>
                <li>
                  <a class='admin-link nav-link nav-link-text text-dark' href='../StaticPages/admin_email.html'>Send Email</a>
                </li>
              </ul>
            </div>
            `
            // menucode +="<li class='nav-item'>";
            // menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_files.html'>[Admin] Manage Files</a>";
            // menucode +="</li>";
            // menucode +="<li class='nav-item'>";
            // menucode +="<a class='nav-link nav-link-text text-dark' href='../StaticPages/admin_email.html'>[Admin] Send Email</a>";
		}
	}
	menucode +="</li>";
	menucode +="</ul>";
  $("#menubar").html(menucode);

  // stop dropdown click propagation
  $('.admin-link').click(function(e){
    e.stopPropagation()
});
}
