const { execSync } = require('child_process')


function exec(cmd, stdio=false /* 'inherit' for interactive */) {
  try {
    const stdout = execSync(cmd, { stdio: stdio })
    return stdout.toString()
  } catch (err) {
    console.log('ERROR: ' + err)
  }
}




const app_conf = require('./app_conf.json')
console.log(app_conf)

hasBlankConfigValues = (obj) => {
  if (obj === undefined || typeof obj != 'object')
    return true

  return Object.keys(obj).reduce((acc, key) => { console.log(obj[key]); return obj[key] == '' || acc }, false)

}

if (hasBlankConfigValues(app_conf))
  throw 'Please ensure all values in config file are populated'




/********** login **********/
// exec('gcloud init')
exec('gcloud auth login')



// install beta module
exec(`gcloud components install beta`, 'inherit')




/********** Create Project  **********/ // gcloud projects delete $app_conf.projectID
exec(`gcloud projects create ${app_conf.projectID} --name ${app_conf.project_name}`)
exec(`gcloud config set project ${app_conf.projectID}`)
// link to billing account
exec(`gcloud beta billing projects link ${app_conf.projectID} --billing-account=${app_conf.billingAccountID}`)




/********** enable services **********/
const services = ['iam.googleapis.com', 'sqladmin.googleapis.com']
// $services = $('bigquery-json.googleapis.com','bigquerystorage.googleapis.com','cloudbilling.googleapis.com','clouddebugger.googleapis.com','cloudresourcemanager.googleapis.com','cloudtrace.googleapis.com','datastore.googleapis.com','iam.googleapis.com','iamcredentials.googleapis.com','logging.googleapis.com','monitoring.googleapis.com','servicemanagement.googleapis.com','serviceusage.googleapis.com','sqladmin.googleapis.com','storage-api.googleapis.com','storage-component.googleapis.com')
services.forEach(service => {
  exec(`gcloud services enable ${service}`)
})



/********** create service accounts **********/

// storage
// create account
const service_account = 'storage'
exec(`gcloud iam service-accounts create ${service_account}`)
// // create keys/credentials : key.json file
exec(`gcloud iam service-accounts keys create key.json --iam-account ${service_account}@${app_conf.projectID}.iam.gserviceaccount.com`)

//// grant permissions to storage account
exec(`gcloud projects add-iam-policy-binding ${app_conf.projectID} --member serviceAccount:${service_account}@${app_conf.projectID}.iam.gserviceaccount.com --role roles/storage.objectAdmin`)

//// create storage service bucket
// const bucket_name = `${app_conf.project_name}-storage-bucket`
exec(`gsutil mb -p ${app_conf.projectID} -c standard -l ${app_conf.region} -b on gs://${app_conf.projectID}-storage-bucket/`)



/********** create mySQL instance   **********/ // gcloud sql instances delete $app_conf.project_name-sql-instance
const instanceID = `${app_conf.projectID}-sql-instance`
console.log('Creating sql instance, this may take a few minutes...')
exec(`gcloud sql instances create ${instanceID} --tier=db-n1-standard-1 --region=${app_conf.region} --verbosity info`, 'inherit')
// set root password
console.log('Setting root password')
exec(`gcloud sql users set-password root --host % --instance ${instanceID} --password ${app_conf.sqlRootPassword}`)
// create user with password
console.log(`Creating sql instance user account: ${app_conf.mySqlUsername}`)
exec(`gcloud sql users create ${app_conf.mySqlUsername} --host % --instance ${instanceID} --password ${app_conf.sqlUserPassword}`)
////// Assign user permissions to tables


////// create mySQL Database
exec(`gcloud sql databases create ${app_conf.project_name}-db --instance ${instanceID}`)

// authorize IP range
// assign authorized network 0.0.0.0/0
console.log('Assigning 0.0.0.0/0 as authorized external network')
exec(`gcloud sql instances patch ${instanceID} --authorized-networks=0.0.0.0/0 --quiet`, 'inherit')







//// create app engine
console.log('Creating app engine...')
exec(`gcloud app create --region ${app_conf.region}`)



// RUN
// npm run build_db
// npm run deploy

