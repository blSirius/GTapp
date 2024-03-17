import React  from 'react'

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
import TestSearchPic from './component/TestSearchPic.jsx';
import Modall from './component/ModalTest/Modal.jsx';
// import Md from './component/ModalTest/Md.jsx';
import Example from './component/tt.jsx';
import Conclude from './component/Conclude.jsx';

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
    element: <ProtectedRoute><Modall /></ProtectedRoute>
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
    path: '/history/',
    element: <Search/>
  },
  {
    path: '/searchbyimg/',
    element: <TestSearchPic/>
  },
  {
    path: '/tt/:name',
    element: <Example/>
  },
  {
    path: '/conclude',
    element: <Conclude/>
  },
  {
    path: '/history/:name',
    element: <Search/>
  },



]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
);