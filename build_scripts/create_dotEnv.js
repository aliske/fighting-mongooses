
//// TO DO FIRST:
// 1) Create Billing Account: https://console.cloud.google.com/billing
// 2) install gcloud beta commands in "Google Cloud SDK Shell":
// gcloud components install beta
// 3) login
// gcloud init
// gcloud auth login
// 4) Setup App Password



const { execSync } = require('child_process')


function exec(cmd, stdio=false /* 'inherit' */) {
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





const fs = require('fs')

function createDotEnv() {
  // DB vars
  const stdout = exec(`gcloud sql instances list --filter=name=${app_conf.projectID}-sql-instance`) //  |  Select-String -Pattern "\d{1,3}(\.\d{1,3}){3}" -AllMatches).Matches.Value
  let regex = /\d{1,3}(\.\d{1,3}){3}/
  const db_public_ip = stdout.match(regex)[0]

  let output = '';
  output += `DB_HOST=${db_public_ip}\n`
  output += `DB_USERNAME=${app_conf.mySqlUsername}\n`
  output += `DB_USERPASS=${app_conf.sqlUserPassword}\n`
  output += `DB_NAME=${app_conf.project_name}-db\n`
  output += `\n\n`

  // GCLOUD vars
  output += `GCLOUD_STORAGE_BUCKET=${app_conf.projectID}-storage-bucket\n`
  output += `GCLOUD_PROJECT_ID=${app_conf.projectID}\n`
  output += `GCLOUD_STORAGE_KEY_FILEPATH=key.json\n`
  output += `\n\n`

  // Gmail Email - App Creds
  output += `EMAIL_ADDRESS=${app_conf.gmail_email_account}\n`
  output += `EMAIL_APP_PASSWORD=${app_conf.gmail_app_password}\n`
  output += `\n\n`

  // EMAIL_ADDRESS=bitsandbytestesting@gmail.com
  // EMAIL_APP_PASSWORD=tllpmpmkllgibshz


  const data = exec('gcloud app describe')
  regex = /Hostname: .*\.com/
  const text = data.match(regex)[0]
  const app_host_url = text.slice(text.indexOf(': ') + 2)

  output += `APP_HOST_URL=${app_host_url}\n`

  fs.writeFileSync('.env', output)
}

createDotEnv()
