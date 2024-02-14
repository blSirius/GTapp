import React from 'react'

//router
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//context
import { UserAuthContextProvider } from './context/UserAuthContext.jsx';

//styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

//component
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import Register from './component/login/Register.jsx';
import Login from './component/login/Login.jsx';
import Home from './component/Home.jsx';
import Album from './component/Album.jsx';
import NewCollection from './component/NewCollection.jsx';
import ViewEmp from './component/ViewEmp.jsx';
import DeleteEmp from './component/DeleteEmp.jsx';
import Search from './component/Search.jsx';
import Test from './component/Test.jsx';

//create router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/home',
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: '/album',
    element: <ProtectedRoute><Album /></ProtectedRoute>
  },
  {
    path: '/newCollection',
    element: <NewCollection />
  },
  {
    path: '/viewEmp/',
    element: <ProtectedRoute><Album /></ProtectedRoute>
  },
  {
    path: '/viewEmp/:name',
    element: <ViewEmp />
  },
  {
    path: '/deleteEmp/:empID',
    element: <DeleteEmp />
  },
  {
    path: '/deleteEmp/',
    element: <ProtectedRoute><Album /></ProtectedRoute>
  },
  {
    path: '/search/',
    element: <Search/>
  },
  {
    path: '/test/',
    element: <Test/>
  },

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
);