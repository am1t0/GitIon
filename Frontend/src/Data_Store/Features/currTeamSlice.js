import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import getAccessToken from '../../Utils/auth';


export const fetchCurrTeam  = createAsyncThunk('fetchCurrTeam', async (teamId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/teams/currTeam/${teamId}`, {
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

const currTeamSlice = createSlice({
    name: 'currTeam',
    initialState: {
         isLoading: true,
         data : null,
         isError: false,
    },
    extraReducers:(builder)=>{

        //------------HANDLING API Call to fetchProjects-------------//
        builder.addCase(fetchCurrTeam.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchCurrTeam.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.data = action.payload;
        }) 
        builder.addCase(fetchCurrTeam.rejected, (state,action)=>{
            state.isLoading = false;
            state.isError = true;
        })
        
    }
    
    ,reducers: {
       
    },
});

export default currTeamSlice.reducer;
