import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAccessToken from '../../Utils/auth';

export const fetchCurrProject  = createAsyncThunk('fetchCurrProject', async (projectId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/currProject/${projectId}`, {
          method: 'GET',  
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
          },
        });

        if (!response.ok) {
          return  Promise.reject(response);
        }
       const res = await response.json();

       return res.data;
        
      } catch (error) {
        return  error.message || "An error occurred while loading";
      }
})
const currProjectSlice = createSlice({
    name: 'currProject',
    initialState: {
         isLoading:true,
         data:null,
         isError:false,
    },
    extraReducers: (builder) => {
         //------------HANDLING API Call to fetchCurrProjects-------------//
         builder.addCase(fetchCurrProject.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchCurrProject.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.data = action.payload;
        }) 
        builder.addCase(fetchCurrProject.rejected, (state,action)=>{
            state.isLoading = false;
            state.isError = true;
        })
    },
    reducers: {
    },
});
export default currProjectSlice.reducer;
