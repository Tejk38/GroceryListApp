# GroceryListApp


## Information about this repository

So, first after extracting the folder from zip,
use "npm install" command to install all the modules used in the app.

then use "npx expo start" command to start the app
then based on the device being used click 'w' for web or 'a' for android

also, simultaneously in another terminal  go to server folder within the app 
"cd server"
then user command "node server.js"

Also, one more important thing is that we need to change server in itemlistscreen, because both are hosted on different domains, the change needs to be made on line 48 of itemlistscreen.
for web: http://localhost:3000/api/scrape
for android: http://10.232.201.107:3000/api/scrape


