import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import App from './App';

import { Auth0Provider } from "@auth0/auth0-react";
import reportWebVitals from './reportWebVitals';
import { auth0ClientId, auth0Domain } from './config';

ReactDOM.render(
     
     <React.StrictMode>
          <Auth0Provider cacheLocation="localstorage" domain={auth0Domain} clientId={auth0ClientId} redirectUri={window.location.origin}>
               <HelmetProvider>
                     <Helmet>
                       <title>Avalanche Dashboard</title>
                     </Helmet>
                    <App/>
               </HelmetProvider>
          </Auth0Provider>
     </React.StrictMode>,
       
     document.getElementById('root')
);

reportWebVitals();
