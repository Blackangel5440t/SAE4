import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/style/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, BrowserRouter as Router, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/js/error-page.mjs';
import Login from './components/js/login.mjs';
import Signup from './components/js/signup.mjs';


const routeur = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "login",
    element:<Login/>
  },
  {
    path: "signup",
    element:<Signup/>
  },

]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<React.StrictMode>
  <RouterProvider router={routeur} />
</React.StrictMode>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
