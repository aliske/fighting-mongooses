# Fighting Mongooses

This is the class project for COSC 481W.


## Setup Development Environment

Ensure [node.js](https://nodejs.org/en/) is installed

### Clone from github and cd into repo
```
git clone https://github.com/cameronheard/fighting-mongooses.git && cd fighting-mongooses
```
### Install Node dependencies
```
npm install
```

### Run server and client
```
npm run start
```

### Access dev page
- Development client will be hosted @ http://localhost:8080

### Notes
- You may need to stop (ctrl+C) the server and restart it at times (npm run start).

## Resources
  - [Trello board](https://trello.com/b/ljpEvrvB/fightingmongooses-bitsandbytes)


## Deploy

Create config file /build_scripts/app_conf.json
``` json
{
  "billingAccountID": "xxxxxx-xxxxxx-xxxxxx",
  "project_name": "bits-and-bytes",
  "projectID": "bits-and-bytes-xxxxxx",
  "region": "us-east1",

  "sqlRootPassword": "password1",
  "mySqlUsername": "app-user",
  "sqlUserPassword": "password2",


  "gmail_email_account": "bitsandbytestesting@gmail.com",
  "gmail_app_password": "tlxxxxxxshz"
}
```




