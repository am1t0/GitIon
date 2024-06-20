import React, { useState ,useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FileShow from '../../../Frontend/src/Components/FileShow';
import FolderShow from './FolderShow';
import { getMouseEventOptions } from '@testing-library/user-event/dist/utils';
import CommitHistory from '../../../Frontend/src/Components/Repo/CommitHistory';
import InitialPushinComands from '../../../Frontend/src/Components/InitialPushinComands';
import Branches from '../../../Frontend/src/Components/Branch/Branches';
import PullRequestForm from './PullRequestForm';
import {useSelector} from 'react-redux';
import getAccessToken from '../Utils/auth.js';
import { useDispatch } from 'react-redux';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import '../Styles/RepoFileFolder.css';
import {changeBranch, setCurr } from '../Data_Store/Features/moreInfoSlice.js';
import { fetchData } from '../Data_Store/Features/repoContentSlice.js';
import  {fetchFileContent, fetchFolderContent} from '../Data_Store/Features/currFileFolderSlice.js'
import { toggleContent } from '../Data_Store/Features/moreInfoSlice.js';
import { fetchBranches } from '../Data_Store/Features/branchSlice.js';


export default function FilesAndFolders() {
  
  const [commits,setCommits] = useState(false);
  const [link,setLink] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Current Project details 
  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem('repoName');
  const {projectName} = useParams();
  // const {repo: {owner,repoName},name}= useSelector((store)=>store.currProject.data);
 
  // ALL CONTENTS OF REPO ASSOCIATED WITH PROJECT
  const  repoContent = useSelector((state) => state.repo.data);
  
  const selectedBranch = localStorage.getItem('selectedBranch');
  const trimmedName = projectName.trim();

  // LINK OF REPO
  const repoLink = `https://github.com/${owner}/${repoName}.git`;
  const [copyStatus,setCopyStatus] = useState(false);

   // COPY TEXT FUNCTION 
   const onCopyText = () =>{
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000); // Reset status after 2 seconds
    }

  const handleItemClick=(item)=>{
    
  const selectedBranch = localStorage.getItem('selectedBranch');

       dispatch(setCurr(item));

       if(item.type==='file') dispatch(fetchFileContent(item)).then(()=>{
               navigate(`/project/${trimmedName}/content/${item?.path}`);
       })

       else{
        dispatch(toggleContent(item.name));
         dispatch(fetchFolderContent({owner,repoName,path: item.path,selectedBranch})).then(()=>{
               navigate(`/project/${trimmedName}/content/${item?.path}`);
         })
       }
        
  }
  const handleCommitShow=()=>{
    if(commits) 
       setCommits(false);
     
    else
    setCommits(true);
  }

  const handleBranchChange = (event) => {
    localStorage.setItem('selectedBranch', event.target.value);
    dispatch(fetchData({project:{repo:{owner,repoName}},selectedBranch: event.target.value}));
  };
  return ( repoContent ?
    <div> 
      <hr/>
      <div id='top'>
        
       {/* -------BRANCH RELATED CONTENT HERE */}
       <Branches handleBranchChange={handleBranchChange} selectedBranch={selectedBranch}/>
      
        {/* ------COMMITS INFO HERE  SUDHARNA HAI PROPS KO----- */}
        <div id='commitInfo' onClick={handleCommitShow}>
        <i className="fa-solid fa-timeline"></i>
        <h6>commits</h6>
       {
        // WE HAVE TO SHOW THIS COMMITHISTORY IN A NEW PAGE ONCE REDUX IS IMPLEMENTED 
       commits && <CommitHistory repo={repoName} owner={owner}  branch={selectedBranch}/>
       }
       </div>

        {/* REPO LINK BUTTON  */}
       <div className="codeBtn">
        <div className="code">
        <i className="fa-solid fa-code"></i>
        <button onClick={()=>{setLink(!link)}}>code</button>
      
        </div>
        { link &&
           <>
          <div id="codeLink">  
            <h6>{repoLink}</h6>
          {/* COPY  TO CLIPBOARD:  */}
          <div id="copy">
            <CopyToClipboard text={repoLink}  onCopy={onCopyText}>
             <i className="fa-solid fa-copy"></i>
            </CopyToClipboard>
          </div>
          </div>
          { copyStatus && 
          <div className="status">
           <p>Copied !</p>
          </div>
          }
          </>
        }
       </div>
      </div>
      
        {/* FILES AND FOLDERS STRUCURE  */}
      <ul id='file-n-folders'>
         <h6 className='first-row'>owner : {owner}</h6>
         <div className="line"></div>
        { 
            repoContent?.map((item) => (
              
          <li key={item.name}>
    
            {/* FOR FILES  */}
            {item.type === 'file' ? (

            <div className='file-fol'>

             <i className="fa-regular fa-file"></i>

              <p onClick={()=> {handleItemClick(item)}}>
                {item.name}
               </p>
              </div>
            ) : (
              <div className='file-fol'> 
                 <i className="fa-solid fa-folder"></i>
                <p onClick={()=> handleItemClick(item)}>
                  {item.name}</p>
              </div>
            )}
          </li>
        ))
      }
      </ul>
      <div id="readMe">
      <h1>README DALNA HAI ?</h1>
    </div>
    </div>: <InitialPushinComands owner={owner} repoName={repoName}/>      // if the repo content is empty it has no files and folders
  );
};