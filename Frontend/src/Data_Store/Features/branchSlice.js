import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBranches = createAsyncThunk('fetchBranchesData', async ({project},thunkAPI) => {
    const {repo:{owner,repoName}} = project;

    try {
        const  response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/branches`, {
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

const branchSlice = createSlice({
    name: 'branches',
    initialState: {
        isLoading: true,
        data: null,
        isError: false,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBranches.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(fetchBranches.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        })
        builder.addCase(fetchBranches.rejected, (state, action) => {
            state.isLoading = true;
            state.isError = true;
        })
    },
})
export default branchSlice.reducer;
