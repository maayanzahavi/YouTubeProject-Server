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
  CONNECTION_STRING="{your_mongoDB_connection_string}/YouTube_101"
  PORT={port_number}
  ```
  For example:
  ```bash
  CONNECTION_STRING="mongodb://localhost:27017/YouTube_101"
  PORT=8200
  ```

* Open MongoDB on your computer.
* Note that a JavaScript script will automatically run and initialize the Database when you first run the server. Please make sure you don't have other collections named Users, Videos,    or Comments.
  
## See the web application
* Run the server using __npm start__.
* On your browser search for: http://localhost:{port_number} (the same port number you chose earlier).

## Working Proccess
Initial Server Setup - 
At the start, we focused on building the server itself. We collaboratively wrote the server functions and organized them into routes, services, models, and controllers. Within each of these, we implemented the necessary functionalities for users, videos, comments, and tokens. We also set up and worked with MongoDB, creating the database structure and collections necessary for our application.

Work Distribution
Subsequently, we divided the tasks. Each team member worked on modifying the functionality in React to fetch the required data from the server using API commands.

Specific Tasks
We divided the tasks into separate components, focusing on:

* User-related screens: Editing, registration, and login.
* Video-related functionalities: Editing, viewing, adding likes and views.
* Comments functionalities: Adding, editing, and viewing comments on videos.
* Integrating these components: Ensuring seamless functionality across the application by integrating the user, video, and comment components.
* Additional components: Created screens for the user page and trending videos to enhance the user interface and user experience.

# Enjoy!



