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
# install client dependencies
npm run install_client
# install server dependencies
npm run install_server

# OR install both client and server dependencies at the same time
npm run install_all
```

### Run server and client
```
# run client
npm run start_client
# run server
npm run start_server

# OR run both client and server dependencies at the same time
npm run start_all
```

### Access dev page
- Development client will be hosted @ http://localhost:8080
- Development API Server will be hosted @ http://localhost:3000

Note: You may need to stop (ctrl+C) the server and restart it (npm run start_all).
I'm not sure how this will work on a non-windows machine at this point as I had to play with windows paths to get it to work. We can improve moving forward if needed.

## Resources
  - [Trello board](https://trello.com/b/ljpEvrvB/fightingmongooses-bitsandbytes)







