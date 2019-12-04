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

---

# Deployment [Setup Google Cloud Environment]

#### 1. Install dependencies
- [gcloud SDK](https://cloud.google.com/sdk/install)
- [node.js](https://nodejs.org/en/)

#### 2. Ensure PATH environment variables are set
Ensure version numbers are displayed in a cmd.exe or bash shell. If not, please install the dependencies or validate path dependencies.
```
    gcloud --version
```

#### 3. Login to Google and get billing account
a) [GCloud Billing URL](https://console.cloud.google.com/billing)
b) Create billing account
c) Save **'Billing account ID'** for step 5
    - It looks like this: "xxxxxx-xxxxxx-xxxxxx"

#### 4. Get email Application Credentials
a) [How to get application password](https://support.google.com/accounts/answer/185833)
b) Save**'Email Address'** + **'Application Password'** for step 5

#### 5. Build Config File
Using /build_scripts/app_conf_template.json as a template:
a) **create** config file **/build_scripts/app_conf.json**
b) **populate values**

``` json
{
  "billingAccountID": "xxxxxx-xxxxxx-xxxxxx", <<-- From previous step
  "project_name": "bits-and-bytes",
  "projectID": "bits-and-bytes-xxxxxx", <<-- This must be a unique number.
  "region": "us-east1",

  "sqlRootPassword": "password1",
  "mySqlUsername": "app-user",
  "sqlUserPassword": "password2",


  "gmail_email_account": "bitsandbytestesting@gmail.com",
  "gmail_app_password": "tlxxxxxxshz"
}
```
**NOTE:** Save your configuration file in a safe location. You will need it for future releases.

#### 6. Deploy gcloud Environment
```
    npm run build_gcloud
    npm run build_db
```


# Deployment [Deploy app]
**NOTE:** This step requires the GCloud environment to be setup AND the user is logged into the gcloud environment. (gcloud auth login)
```
npm run deploy
```

---
# Other Resources
  - [Trello board](https://trello.com/b/ljpEvrvB/fightingmongooses-bitsandbytes)






