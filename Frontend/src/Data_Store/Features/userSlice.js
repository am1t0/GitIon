import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import getAccessToken from '../../Utils/auth';

export const fetchUser  = createAsyncThunk('fetchUser', async () => { 
  try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/user-data`, {
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

const userSlice = createSlice({
    name : 'user',
    initialState:{
        isLoading: true,
        data : null,
        isLoggin: false,
        isError: false,
    },
    extraReducers: (builder)=>{

        //------------HANDLING API Call to fetchProjects-------------//
        builder.addCase(fetchUser.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchUser.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.isLoggin = true;
            state.data = action.payload;
        }) 
        builder.addCase(fetchUser.rejected, (state,action)=>{
            state.isLoading = false;
            state.isLoggin = false;
            state.isError = true;
        })
        
    },
    reducers:{

    }
})

export default  userSlice.reducer;