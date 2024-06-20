import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchData = createAsyncThunk('fetchData', async ({project,selectedBranch},thunkAPI) => {
    const {repo:{owner,repoName}} = project;
    let branch = selectedBranch;;
    try {
        const  response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents?ref=${branch}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('leaderToken')}`
            },
        });
     if (!response.ok) {
            console.error('Error:', response.statusText);
            return;
        }
        const res = await response.json();

        return res;    
          
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || "An error occurred while loading");
    }
})

const repoContentSlice = createSlice({
    name: 'repo',
    initialState: {
        isLoading: true,
        data: null,
        isError: false,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchData.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        builder.addCase(fetchData.rejected, (state, action) => {
            state.isLoading = true;
            state.isError = true;
        })
    },
})
export default repoContentSlice.reducer;
