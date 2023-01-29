import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {Amplify}  from 'aws-amplify';
import awsExports from './aws-exports';
import AppUtils from './appUtils'
// Configure redirectSignIn and redirectSignOut

const [ localRedirectSignIn, productionRedirectSignIn,]= awsExports.oauth.redirectSignIn.split(",");
const [ localRedirectSignOut, productionRedirectSignOut,]= awsExports.oauth.redirectSignOut.split(",");
const updatedAwsExports = {
  ...awsExports,
  oauth: {
    ...awsExports.oauth,
    redirectSignIn: AppUtils.isLocalHost() ? localRedirectSignIn : productionRedirectSignIn,
    redirectSignOut: AppUtils.isLocalHost() ? localRedirectSignOut : productionRedirectSignOut,
  }
}
// Configure Amplify
Amplify.configure(updatedAwsExports);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
