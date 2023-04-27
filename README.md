## Trip-planner
Repository related to the backend part of trip-planner project. To view the frontend side of the project, visit https://github.com/LauroAranha/trip-planner-FrontEnd 
## Table of contents

1. [About](#about)
2. [Enviroment configuration](#enviroment-configuration)
3. [Running the project](#running-the-project)
2. [VSCode Extensions](#vscode-extensions)
3. [Nodejs Configuration](#nodejs-configuration)

## About

This application was made using **NodeJS**, **Express** and **Firebase** (Storage, Firestore, Auth and Admin SDK), please, refer to the provided guide in order to configure your enviroment properly and run ther application.

## Enviroment configuration
### Prerequisites
To configure and run the application, you will nedd to install [NodeJS](https://nodejs.org/en/download).

To create the firebase project dependencies, refer to the firebase documentation:
https://firebase.google.com/?hl=pt

To add the AdminSDK to your project, refer to the AdminSDK documentation: 
https://firebase.google.com/docs/admin/setup?hl=pt-br
### Installing dependencies
To use the application properly you will need to run:
```npm install``` 

### Environment keys configuration
You will need to create a new `.env` file containing the API key and information of your firebase project in order to create a connection with the database, the file location must be in the root of the project (trip-planner-BackEnd/.env). To do that, use the following model:

### .env model
```
FIREBASE_APIKEY=
FIREBASE_AUTHDOMAIN=
FIREBASE_PROJECTID=
FIREBASE_STORAGEBUCKET=
FIREBASE_MESSAGINGSENDERID=
FIREBASE_APPID=
PORT=
```

Also, you need to add the AdminSDK key file in order to authenticate the Auth requests in the server side. After generation a new key, put it in the `donotcommit` folder, just like the following example:
`src\donotcommit\trip-planner-...u.json`

## Running the project
To run the project, just run `npm run dev` in the project root folder. *The nodemon dependency is installed and configured, so you probably won't need to shut down your server every time you change something*.

## VSCode Extensions
Some of the recommended vscode extensions for lint settings to work:

-   [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
-   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
-   [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

After installing the extensions, do the following configuration:

Inside your VSCode go to:

```
Preferences > Settings > Search for Default Formatter > Select Prettier - Code formatter
```

Inside your VSCode go to:

```
Preferences > Settings > Search for Format On Save > Activate the option
```

## NodeJS Configuration

Before starting development you need to add some packages in dev mode.
Run the following command in your terminal

For npm users

```sh
npm install --save-dev prettier eslint eslint-config-airbnb-base eslint-config-prettier eslint-plugin-import eslint-plugin-prettier
```

For yarn users

```sh
yarn add -D prettier eslint eslint-config-airbnb-base eslint-config-prettier eslint-plugin-import eslint-plugin-prettier
```
