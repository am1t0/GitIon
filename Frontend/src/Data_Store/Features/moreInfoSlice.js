import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import getAccessToken from '../../Utils/auth';

export const fetchContent  = createAsyncThunk('fetchRepo', async ({owner,repoName,selectedBranch}) => {
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

const moreInfoSlice = createSlice({
    name: 'moreInfo',
    initialState: {
        content:[],
        fromRepo:false,
        currContent:{name:'nothing'},
    },
    extraReducers: (builder) => {
        builder.addCase(fetchContent.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(fetchContent.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        builder.addCase(fetchContent.rejected, (state, action) => {
            state.isLoading = true;
            state.isError = true;
        })
    },
    reducers:{ 
        toggleContent: (state, action) => {
            const index = state.content.indexOf(action.payload);
            if (index === -1) {
              state.content = [...state.content, action.payload]; 
              state.currContent = action.payload;
            } else {
              state.content = state.content.filter(item => item !== action.payload); 
            }
          },
          setCurr:(state,action)=>{
            state.currContent = action.payload;
          },
          changeBranch:(state,action)=>{
              state.selectedBranch = action.payload;
          },
          setFrom:(state,action)=>{
              state.fromRepo = true;
          }
    }
});

export const { changeBranch,toggleContent,setCurr,setFrom} = moreInfoSlice.actions;
export default moreInfoSlice.reducer;
