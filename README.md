# YouTube Server

## Run the server
1. Clone the repository to your computer.
2. Open terminal in the cloned folder.
3. Run __npm install__ to install dependencies.

## Create a config folder
1. Create a new folder in the repository named __config__.
2. Inside the __config__ folder create the file .env.
3. Add the following content to the .env file:
  ```bash
  CONNECTION_STRING="{your_mongoDB_connection_string}"
  PORT={port_number}
  ```
  For example:
  ```bash
  CONNECTION_STRING="mongodb://localhost:27017"
  PORT=8200
  ```

* Open MongoDB on your computer.
* Note that a JavaScript script will automatically run and initialize the DataBase when you first run the server. Please make sure you don't have other collections named Users, Videos,    or Comments.
  
## See the web application
* Run the server using __npm start__.
* On your browser search for: http://localhost:{port_number} (the same port number you chose earlier).

# Enjoy!



