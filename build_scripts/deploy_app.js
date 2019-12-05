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

exec(`gcloud iam service-accounts keys create key.json --iam-account storage@${app_conf.projectID}.iam.gserviceaccount.com`, 'inherit')
exec('npm run create_env', 'inherit')
exec('gcloud app deploy --stop-previous-version', 'inherit')
exec('gcloud app describe', 'inherit')
