## TO DO FIRST:
# 1) Create Billing Account: https://console.cloud.google.com/billing
# 2) install gcloud beta commands in 'Google Cloud SDK Shell':
# gcloud components install beta
# 3) login
# gcloud init
# gcloud auth login


###### VARIABLES ######
## Project Variables
$project_name = 'bits-and-bytes'
$projectID = 'bits-and-bytes-12345'
$region = 'us-east1'
$zone = '' # ??


## Billing Variables
$billingAccountID = '013B65-6B183E-F3C112'	

## Sql Variables
$sqlRootPassword = 'password1'
$mySqlUsername = 'app-user'
$sqlUserPassword = 'password2'





#### Create Project  ## gcloud projects delete $projectID
gcloud projects create $projectID --name $project_name
# link to billing account
gcloud beta billing projects link $projectID --billing-account=$billingAccountID




#### enable services
$services = $('iam.googleapis.com')
# $services = $('bigquery-json.googleapis.com','bigquerystorage.googleapis.com','cloudbilling.googleapis.com','clouddebugger.googleapis.com','cloudresourcemanager.googleapis.com','cloudtrace.googleapis.com','datastore.googleapis.com','iam.googleapis.com','iamcredentials.googleapis.com','logging.googleapis.com','monitoring.googleapis.com','servicemanagement.googleapis.com','serviceusage.googleapis.com','sqladmin.googleapis.com','storage-api.googleapis.com','storage-component.googleapis.com')
foreach ($service in $services) {
    gcloud services enable $service
}



#### create service accounts

# storage
# create account
$service_account = 'storage'
gcloud iam service-accounts create $service_account
# create keys/credentials : key.json file
gcloud iam service-accounts keys create key.json --iam-account $service_account@$projectID.iam.gserviceaccount.com

## grant permissions to storage account   
gcloud projects add-iam-policy-binding $projectID --member serviceAccount:$service_account@$projectID.iam.gserviceaccount.com --role roles/storage.objectAdmin

### create storage service bucket
$bucket_name = "$project_name-storage-bucket"
gsutil mb -p $projectID -c standard -l $region -b on gs://$project_name-storage-bucket/





### create mySQL instance   ## gcloud sql instances delete $project_name-sql-instance
$instanceID = "$($project_name)-sql-instance2"
write-host 'Creating sql instance, this may take a few minutes...'
gcloud sql instances create $instanceID --tier=db-n1-standard-1 --region=$region
# set root password
write-host 'Setting root password'
gcloud sql users set-password root --host % --instance $instanceID --password $sqlRootPassword
# create user with password
write-host "Creating sql instance user account: $($mySqlUsername)"
gcloud sql users create $mySqlUsername --host % --instance $instanceID --password $sqlUserPassword
### Assign user permissions to tables


### create mySQL Database
gcloud sql databases create $project_name-db --instance $instanceID
# authorize IP range
# assign authorized network 0.0.0.0/0
write-host "Assigning 0.0.0.0/0 as authorized external network"
gcloud sql instances patch $instanceID --authorized-networks=0.0.0.0/0 --quiet


# get db ip
$db_public_ip = (gcloud sql instances list  |  Select-String -Pattern "\d{1,3}(\.\d{1,3}){3}" -AllMatches).Matches.Value







## create app engine
gcloud app create --region $region

# RUN
# npm run create_env
# npm run build_db
# npm run deploy



### STOP HERE AND BUILD DB #####

# download mysql shell
# run setup script
# Set-Location SQLSERVER:\SQL\MyComputer\MyInstance

# $sqllocation = 'mysql://35.188.30.108:3306/bits-and-bytes-db'
# Invoke-Sqlcmd -Query "SELECT * FROM annoucement" -ServerInstance $sqllocation

# add admin account
# INSERT INTO user (username, password) VALUES ('admin', PASSWORD('1234'))











