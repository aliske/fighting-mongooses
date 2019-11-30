async function enroll_student(id){
    const body = {
      'registered': getFullYear()
    }
    await fetch(`${ROOT_URI}/api/users/$(id)`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
    window.location.reload(true);
}