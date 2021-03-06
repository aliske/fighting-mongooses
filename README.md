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

# Deployment [Configure Local Environment]

#### 1. Install dependencies
- [gcloud SDK](https://cloud.google.com/sdk/install)
  - Note: This SHOULD also install 'gsutil'
- [node.js](https://nodejs.org/en/)
- Setup local environment using insturcitons above: clone repository + run 'npm install'

#### 2. Ensure PATH environment variables are set
Ensure version numbers are displayed in a cmd.exe or bash shell for each of the following commands. If not, please install the dependencies and/or validate PATH environment variables.
```
    node --version
    npm --version
    gcloud --version 
    gsutil --version
```

#### 3. Login to Google and get billing account
- [GCloud Billing URL](https://console.cloud.google.com/billing)
- Create and enable billing account
- Save **'Billing account ID'** for step 5
    - It looks like this: "xxxxxx-xxxxxx-xxxxxx"

#### 4. Get email Application Credentials
- [How to get application password](https://support.google.com/accounts/answer/185833)
- Save **'Email Address'** + **'Application Password'** for step 5

#### 5. Build Config File
Using /build_scripts/app_conf_template.json as a template:
- **create** config file **/build_scripts/app_conf.json**
- **populate values**

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

#### Deployment [Setup Google Cloud Environment]
These commands only need to be done once
```
    npm run build_gcloud
    npm run build_db
```


# Deployment [Deploy app]
- **This step requires app_conf.json file to be present in /build_scripts/app_conf.json**

"Updating service..." may take up to 10min. Please be patient.
```
npm run deploy
```
Deployed resources can be found on the [Google Cloud Console](https://console.cloud.google.com/)

**NOTE:** App details can be seen by running 'gcloud app describe' in a terminal with the Gcloud SDK

**NOTE 2:** New storage keys are genearted for each deployment. This app does not clean up previous keys which should be purged manually (or update the depoly script). [Service Accounts Page](https://console.cloud.google.com/iam-admin/serviceaccounts)

**NOTE 3:** The app is deployed as HTTP and HTTPS. You should never use the HTTP site. Please use HTTPS. Custom domains and SSL certificates will need to be configured after deployment.

---
# Other Resources
  - [Trello board](https://trello.com/b/ljpEvrvB/fightingmongooses-bitsandbytes)






