# YouTube Server

## Run the server
1. Clone the repository.
2. Open terminal in the folder.
3. Install dependencies using npm install.

## Create a config folder
1. Create a new folder in the reposiroty named 'config'.
2. Inside the 'config' folder create the file .env.
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
  __Notice:__  a JavaScript script will automatically run and initialize the DataBase when you first run the server. Please make sure you don't have other collections named Users, Videos, or Comments.
* Run the server using npm start.
* On your browser search for: http://localhost:{port_number} (the same port number you chose in earlier).



