# HabitTracker
Before you begin make sure you have Node.js (v18 or higher) installed on your computer.

Start by opening the terminal(mac), Command Prompt or PowerShell(windows)
then paste the following code:
node --version
npm --version

If they are not found follow the next steps:

Mac:
1. Go to [https://nodejs.org](https://nodejs.org) and download the LTS version
2. Open the downloaded file and follow the installer steps

Windows:
1. Go to [https://nodejs.org](https://nodejs.org) and download the LTS version
2. Open the downloaded file and follow the installer steps
3. Make sure to check "Add to PATH" during installation

Then verify they it has been installed by pasting the following code into the terminal(mac), Command Prompt or PowerShell(windows)
node --version
npm --version

Downloading the project:
1. Go to the repository on GitHub
2. Click the green "Code" button
3. Click "Download ZIP"
4. Unzip the downloaded file somewhere on your computer

You need to install the required packages for both the backend and frontend.

Mac - Open Terminal and paste in:
cd path/to/HabitTracker/server
npm install
cd ../client
npm install

> Replace `path/to/HabitTracker` with the actual location of the folder on your computer. For example `cd Downloads/HabitTracker/server` 

If you don't know your current location you can find it and the folders within it by writing:
pwd
ls

and then navigate to the HabitTracker using the above mentioned steps.

Windows - Open Command prompt or PowerShell and paste in:

cd path\to\HabitTracker\server
npm install
cd ..\client
npm install

> Replace `path/to/HabitTracker` with the actual location of the folder on your computer. For example `cd Downloads/HabitTracker/server` 

If you don't know your current location you can find it and the folders within it by writing:
cd
dir

and then navigate to the HabitTracker using the above mentioned steps.

Running the app:
You need to run both the backend server and the frontend at the same time. Open two terminal/command prompt/powershell windows or tabs.

Mac:
Terminal 1: Start the backend
    cd path/to/HabitTracker/server
    node index.js
You should see the server running on http://localhost:3001

Terminal 2: Start the frontend
    cd path/to/HabitTracker/client
    npm start
This will automatically open the app in your browser at http://localhost:3000.
if the browser doesn't open automatically, go to http://localhost:3000 manually.

Windows:
Terminal 1: Start the backend
    cd path\to\HabitTracker\server
    node index.js
You should see the server running on http://localhost:3001

Terminal 2: Start the frontend
    cd path\to\HabitTracker\server
    npm start
This will automatically open the app in your browser at http://localhost:3000.
if the browser doesn't open automatically, go to http://localhost:3000 manually.

Stopping the App:
Press Ctrl + c in each terminal window to stop the server and the frontend.


Built with

React
Express
better-sqlite3
Axios
React Router
Multer
