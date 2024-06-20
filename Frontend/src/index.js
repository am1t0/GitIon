import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import LandingPage from './Components/Entry/LandingPage';
import RegisterPage from './Components/Register';
import Login from './Components/Login';
import Home from './Components/Home';
import Todo from './Components/Todo/Todo.js';
import CreateTeam from './Components/Team/CreateTeam.js';
import Team from './Components/Team/Team.js';
import TeamIntro from './Components/Team/TeamIntro.js';
import {Provider} from 'react-redux'
import CreateProject from './Components/Project/CreateProject.js';
import ProjectIntro from './Components/Project/ProjectIntro.js';
import Project from './Components/Project/Project.js';
import ProjectTasks from './Components/Project/ProjectTasks.js';
import RepoFileFolder from './Components/RepoFileFolder.js'
import ProjectDocs from './Components/Project/ProjectDocs.js';
import FolderShow from './Components/FolderShow.js';
import store from './Data_Store/Store/Store.js';
import Repo from './Components/Repo/Repo.js';
import FileFolderContent from './Components/FileFolderContent.js';
import Profile from './Components/Profile.js';
import Dashboard from './Components/Dashboard/Dashboard.js';
import PullRequest from './Components/Project/PullRequest.js';
import PullReqCompare from './Components/Project/PullReqCompare.js';
import EachPullReqPage from './Components/Project/EachPullReqPage.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path:'/',element: <App/> , children:[
      {path:'/',element:<Home/> , children:[
        { path: '/', element: <LandingPage/> },
        {path:'/profile/:username',element:<Profile/>},
        { path: '/dashboard', element: <Dashboard /> },
        {path:'/create-project',element: <CreateProject/>}
      ]},
      {path:'/register',element: <RegisterPage/>},
      {path:"/login",element:<Login /> },

      {path:'/project/:projectName/:projectId',element:<Project/>,
     
      children:[
        {path:'/project/:projectName/:projectId',element:<ProjectIntro/>},
         {path:'/project/:projectName/:projectId/tasks',element:<ProjectTasks/>},
         {path:'/project/:projectName/:projectId/docs',element:<ProjectDocs/>,
         
         children:[
          {path:'/project/:projectName/:projectId/docs',element:<RepoFileFolder/>},
          {path:'/project/:projectName/:projectId/docs/pulls',element:<PullRequest/>},
          {path:'/project/:projectName/:projectId/docs/compare',element:<PullReqCompare/>},
          {path:'/project/:projectName/:projectId/docs/pull/:pullNumber',element:<EachPullReqPage/>}
         ]},
        {path:'/project/:projectName/:projectId/:folderName',element:<FolderShow/>},
      ]},
      {path:'/project/:projectName/content/:path', element: <Repo/>}
    ]
  },
  
])
root.render(
  <Provider store={store}>
      <RouterProvider router={router}>
    <App />
    </RouterProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
