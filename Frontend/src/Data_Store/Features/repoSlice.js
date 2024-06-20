import {createSlice,createAsyncThunk} from  '@reduxjs/toolkit'
import getAccessToken from '../../Utils/auth'

export const fetchRepo  = createAsyncThunk('fetchRepo', async ({owner,repoName,selectedBranch}) => {
    console.log('repo name achieved here ')
    console.log(owner,repoName);
    console.log('okay')
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents?ref=${selectedBranch}`, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          },
        });

        if (!response.ok) {
          console.error('Error:', response.statusText);
          return;
        }
       const res = await response.json();

       return res.data;
        
      } catch (error) {
        return  error.message || "An error occurred while loading";
      }
})

const repoSlice = createSlice({
    name : 'project',
    initialState:{
        isLoading: true,
        data : null,
        isError: false,
    },
    extraReducers: (builder)=>{

        //------------HANDLING API Call to fetchProjects-------------//
        builder.addCase(fetchRepo.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchRepo.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.data = action.payload;
        }) 
        builder.addCase(fetchRepo.rejected, (state,action)=>{
            state.isError = true;
        })
        
    },
    reducers:{

    }
})

export default  repoSlice.reducer;
