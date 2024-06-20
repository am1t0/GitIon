import { configureStore} from '@reduxjs/toolkit'
import projectReducer from '../Features/projectSlice';
import repoReducer from '../Features/repoContentSlice'
import userReducer from '../Features/userSlice'
import projectsReducer from '../Features/projectsSlice'
import currTeamReducer from '../Features/currTeamSlice';
import currProjectReducer from '../Features/currProjectSlice';
import moreInfoReducer from '../Features/moreInfoSlice';
import currFileFolderReducer from '../Features/currFileFolderSlice'
import branchesReducer from '../Features/branchSlice'
import memberReducer from '../Features/memberSlice'
import tasksReducer from '../Features/projectTasksSlice'


const store = configureStore({
    reducer:{
       project : projectReducer,
       repo: repoReducer,
       user: userReducer,
       projects: projectsReducer,
       currTeam: currTeamReducer,
       currProject: currProjectReducer,
       repo: repoReducer,
       moreInfo: moreInfoReducer,
       currFileFolder: currFileFolderReducer,
       branches: branchesReducer,
       member: memberReducer,
    //    tasks: tasksReducer
    }
})

export default store;