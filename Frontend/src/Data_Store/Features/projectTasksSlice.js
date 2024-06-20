import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAccessToken from '../../Utils/auth';

export  const fetchTasks = async (projectId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/tasks/getTasks/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      });

      if (!response.ok) {
        return Promise.reject(response);
      }
      const res = await response.json();

      return res.data;

    } catch (error) {
      return error.message || "An error occurred while loading";
    }
  }
const projectTasksSlice = createSlice({
    name: 'tasks',
    initialState: {
         isLoading:true,
         tasks:[],
         isError:false,
    },
    extraReducers: (builder) => {
         //------------HANDLING API Call to fetchCurrProjects-------------//
         builder.addCase(projectTasksSlice.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(projectTasksSlice.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.data = action.payload;
        }) 
        builder.addCase(projectTasksSlice.rejected, (state,action)=>{
            state.isLoading = false;
            state.isError = true;
        })
    },
    reducers: {
    },
});
export default projectTasksSlice.reducer;
