# Event Management UI

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) .

This template uses [React Bootsrap](https://react-bootstrap.netlify.com/) as UI framework.

## Prerequisites

1. Install yarn:

  ```bash
  npm install --global yarn
  ```

  NOTE: Why did I decided to change from npm to yarn?  Amplify seems to assume the build tool based on package.json details [see](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html) , and even if locally I was using npm the build was executing yarn. There were discrepancies observed between yarn and npm builds which were fixed once I completely moved to yarn , no other reason for the move.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eslint .`

ESLint validation.

## Amplify

amplify configure

Some next steps:
"amplify status" will show you what you've added already and if it's locally configured or deployed
"amplify add <category>" will allow you to add features like user login or a backend API
"amplify push" will build all your local backend resources and provision it in the cloud
"amplify console" to open the Amplify Console and view your project status
"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud    

## UI Components

1. https://react-bootstrap.netlify.app/components/alerts
1. https://github.com/jbetancur/react-data-table-component
1. https://github.com/primefaces/primereact

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## ToDo

1. https://www.npmjs.com/package/react-places-autocomplete?activeTab=readme