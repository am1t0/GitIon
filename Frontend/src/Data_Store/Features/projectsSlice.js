import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAccessToken from '../../Utils/auth';

export const fetchProjects  = createAsyncThunk('fetchProjects', async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/projects-for-user`,
        {
          method:'GET',
          headers:{
            "Authorization":`Bearer ${getAccessToken()}`
          }
        })

        if (!response.ok) {
         return  Promise.reject(response.statusText);
       }
       const data = await response.json();
       return data;

   } catch (error) {
      console.error('Error fetching user data:', error.message);
   }
})

const projectsSlice = createSlice({
    name : 'projects',
    initialState:{
        isLoading: true,
        data : null,
        isError: false,
        newTeamStatus: {
              adding: false,
              error:false
        }
    },
    extraReducers: (builder)=>{

        //------------HANDLING API Call to fetchProjects-------------//
        builder.addCase(fetchProjects.pending, (state,action)=>{
            // console.log('pending...')
            state.isLoading = true;
        })
        builder.addCase(fetchProjects.fulfilled, (state,action)=>{
          // console.log('fulfilled')
            state.isLoading = false;
            state.data = action.payload;
        }) 
        builder.addCase(fetchProjects.rejected, (state,action)=>{
          // console.log('rejected')
            state.isError = true;
        })

    },
})

export default  projectsSlice.reducer;