import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Homepage from './pages/Homepage';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <title>3dpcalc - 3d printing cost calculator</title>
        <link rel="canonical" href="https://3dpcalc.vercel.app/" />
        <meta name="description" content="3d printing cost calculator" />
        <meta name="robots" content="index, follow"/>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="3dpcalc - 3d printing cost calculator" />
        <meta property="og:description" content="3d printing cost calculator" />
        <meta property="og:image" content="https://3dpcalc.vercel.app/banner.png" />
        <meta property="og:url" content="PERMALINK" />
        <meta property="og:site_name" content="3dpcalc" />
      </Helmet>
      <Homepage/>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
