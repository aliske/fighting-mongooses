const { execSync } = require('child_process')


function exec(cmd, stdio=false /* 'inherit' */) {
  try {
    const stdout = execSync(cmd, { stdio: stdio })
    return stdout.toString()
  } catch (err) {
    console.log('ERROR: ' + err)
  }
}






//// TO DO FIRST:
// 1) Create Billing Account: https://console.cloud.google.com/billing
// 2) install gcloud beta commands in "Google Cloud SDK Shell":
// gcloud components install beta
// 3) login
// gcloud init
// gcloud auth login
// 4) Setup App Password


const app_conf = require('./app_conf.json')
console.log(app_conf)

const fs = require('fs')

function createDotEnv() {
  // DB vars
  const stdout = exec(`gcloud sql instances list`) //  |  Select-String -Pattern "\d{1,3}(\.\d{1,3}){3}" -AllMatches).Matches.Value
  const regex = /\d{1,3}(\.\d{1,3}){3}/
  const db_public_ip = stdout.match(regex)[0]

  let output = '';
  output += `DB_HOST=${db_public_ip}\n`
  output += `DB_USERNAME=${app_conf.mySqlUsername}\n`
  output += `DB_USERPASS=${app_conf.sqlUserPassword}\n`
  output += `DB_NAME=${app_conf.project_name}-db\n`
  output += `\n\n`

  // GCLOUD vars
  output += `GCLOUD_STORAGE_BUCKET=${app_conf.project_name}-storage-bucket\n`
  output += `GCLOUD_PROJECT_ID=${app_conf.projectID}\n`
  output += `GCLOUD_STORAGE_KEY_FILEPATH=key.json\n`
  output += `\n\n`

  // Gmail Email - App Creds
  output += `EMAIL_ADDRESS=${app_conf.gmail_email_account}\n`
  output += `EMAIL_APP_PASSWORD=${app_conf.gmail_app_password}\n`

  // EMAIL_ADDRESS=bitsandbytestesting@gmail.com
  // EMAIL_APP_PASSWORD=tllpmpmkllgibshz


  fs.writeFileSync('output.txt', output)
}

createDotEnv()



return







/********** login **********/
// exec('gcloud init')
exec('gcloud auth login')




/********** Create Project  **********/ // gcloud projects delete $projectID
exec(`gcloud projects create ${projectID} --name ${project_name}`)
// link to billing account
exec(`gcloud beta billing projects link ${projectID} --billing-account=${billingAccountID}`)




/********** enable services **********/
const services = ['iam.googleapis.com']
// $services = $('bigquery-json.googleapis.com','bigquerystorage.googleapis.com','cloudbilling.googleapis.com','clouddebugger.googleapis.com','cloudresourcemanager.googleapis.com','cloudtrace.googleapis.com','datastore.googleapis.com','iam.googleapis.com','iamcredentials.googleapis.com','logging.googleapis.com','monitoring.googleapis.com','servicemanagement.googleapis.com','serviceusage.googleapis.com','sqladmin.googleapis.com','storage-api.googleapis.com','storage-component.googleapis.com')
for ($service in $services) {
  exec(`gcloud services enable ${service}`)
}



/********** create service accounts **********/

// storage
// create account
const service_account = 'storage'
exec(`gcloud iam service-accounts create ${service_account}`)
// create keys/credentials : key.json file
exec(`gcloud iam service-accounts keys create key.json --iam-account ${service_account}@${projectID}.iam.gserviceaccount.com`)

//// grant permissions to storage account
exec(`gcloud projects add-iam-policy-binding ${projectID} --member serviceAccount:${service_account}@${projectID}.iam.gserviceaccount.com --role roles/storage.objectAdmin`)

////// create storage service bucket
// const bucket_name = `${project_name}-storage-bucket`
exec(`gsutil mb -p ${projectID} -c standard -l $region -b on gs://${project_name}-storage-bucket/`)





/********** create mySQL instance   **********/ // gcloud sql instances delete $project_name-sql-instance
const instanceID = `${project_name}-sql-instance3`
console.log('Creating sql instance, this may take a few minutes...')
exec(`gcloud sql instances create ${instanceID} --tier=db-n1-standard-1 --region=${region}`)
// set root password
console.log('Setting root password')
exec(`gcloud sql users set-password root --host % --instance ${instanceID} --password ${sqlRootPassword}`)
// create user with password
console.log(`Creating sql instance user account: ${mySqlUsername}`)
exec(`gcloud sql users create ${mySqlUsername} --host % --instance ${instanceID} --password ${sqlUserPassword}`)
////// Assign user permissions to tables


////// create mySQL Database
exec(`gcloud sql databases create ${project_name}-db --instance ${instanceID}`)
// authorize IP range
// assign authorized network 0.0.0.0/0
console.log('Assigning 0.0.0.0/0 as authorized external network')
exec(`gcloud sql instances patch $instanceID --authorized-networks=0.0.0.0/0 --quiet`)







//// create app engine
exec(`gcloud app create --region ${region}`)
exec(`gcloud app deploy`, 'inherit')

// RUN
// npm run build_db
// npm run deploy

