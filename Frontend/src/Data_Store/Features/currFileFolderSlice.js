import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFileContent = createAsyncThunk('fetchFileContent', async (item) => {
    try {
        const response = await fetch(item.download_url);

        if (!response.ok) {
            throw new Error(`Failed to fetch file content: ${response.status} ${response.statusText}`);
        }

        let fetchedContent;
        if (item.encode === 'base64') {
            // If the content is encoded in base64, decode it
            const arrayBuffer = await response.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            fetchedContent = btoa(String.fromCharCode.apply(null, bytes));
        } else {
            fetchedContent = await response.text();
        }

        return fetchedContent;
    } catch (error) {
        console.error('Error fetching file content:', error);
        throw error; // Re-throw the error to handle it in the component
    }
});

export const fetchFolderContent = createAsyncThunk('fetchFolderContent', async ({owner,repoName,path,selectedBranch})=>{
    try {
        let url = `https://api.github.com/repos/${owner}/${repoName}/contents`;

        if (path !== null) {
          url += `/${path}`;
        }
        url += `?ref=${selectedBranch}`;
  
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("leaderToken")}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch repository contents');
          }
  
          const data = await response.json();
          return data;

        } catch (error) {
          console.error('Error fetching folder contents:', error.message);
        }
})
export const currFileFolderSlice = createSlice({
    name:'currFileFolder',
    initialState:{
        isLoading:true,
        file: null,
        folder:null,
        isError: false
    },
    extraReducers: (builder) => {

        //-----------Handling fetching of file content-------------//
        builder.addCase(fetchFileContent.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchFileContent.fulfilled, (state,action)=>{
            state.file = action.payload;
            state.folder = null;
            state.isLoading = false;
        }) 
        builder.addCase(fetchFileContent.rejected, (state,action)=>{
            state.isError = true;
        })


         //-----------Handling fetching of folder content-------------//
         builder.addCase(fetchFolderContent.pending, (state,action)=>{
            state.isLoading = true;
        })
        builder.addCase(fetchFolderContent.fulfilled, (state,action)=>{
            state.folder = action.payload;
            state.file = null;
            state.isLoading = false;
        }) 
        builder.addCase(fetchFolderContent.rejected, (state,action)=>{
            state.isError = true;
        })
    }
})

export default currFileFolderSlice.reducer;