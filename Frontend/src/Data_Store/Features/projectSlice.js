import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAccessToken from '../../Utils/auth';

export const fetchProjects  = createAsyncThunk('fetchProjects', async (teamId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/projects/${teamId}`, {
          method: 'GET',  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
        });

        if (!response.ok) {
          console.error('Error:', response.statusText);
          return;
        }
       const res = await response.json();
       
       console.log('projects for user is ',res.data);
       return res.data;

        
      } catch (error) {
        return  error.message || "An error occurred while loading";
      }
})

const projectSlice = createSlice({
    name : 'project',
    initialState:{
        isLoading: true,
        data : [],
        isError: false,
    },
    extraReducers: (builder)=>{

        //------------HANDLING API Call to fetchProjects-------------//
        builder.addCase(fetchProjects.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchProjects.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.data = action.payload;
        }) 
        builder.addCase(fetchProjects.rejected, (state,action)=>{
            console.log("Error : "+action.payload);
            state.isError = true;
        })
        
    },
    reducers:{

    }
})

export default  projectSlice.reducer;