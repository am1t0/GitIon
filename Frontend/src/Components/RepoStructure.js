import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import FolderShow from './FolderShow';
import { useNavigate } from 'react-router-dom';
import FileShow from './FileShow';
import '../Styles/repoStructure.css';
import { fetchFileContent, fetchFolderContent } from '../Data_Store/Features/currFileFolderSlice';
import { setCurr, setFrom, toggleContent } from '../Data_Store/Features/moreInfoSlice';
import { fetchData } from '../Data_Store/Features/repoContentSlice';

export default function RepoStructure() {
  const dispatch = useDispatch();
  const repoContent = useSelector((store) => store.repo?.data)
  const selectedBranch = localStorage.getItem('selectedBranch');
  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem("repoName");
  const { content } = useSelector((store) => store.moreInfo)
  const { currContent } = useSelector((store) => store.moreInfo);
  const branches = useSelector((store) => store.branches.data)


  const handleOnClick = (item) => {
    dispatch(setFrom(true));
    dispatch(setCurr(item));
    if (content.includes(item.name)) {
      dispatch(toggleContent(item.name));
      return;
    }

    if (item.type === 'file') {
      dispatch(fetchFileContent(item));
    }

    else {
      dispatch(toggleContent(item.name));
      dispatch(fetchFolderContent({ owner, repoName, path: item.path, selectedBranch }));
    }
  }
  const handleBranchChange = (event) => {
    localStorage.setItem('selectedBranch', event.target.value);
    dispatch(fetchData({ project: { repo: { owner, repoName } }, selectedBranch: event.target.value }));
  }

  return (
    <div id='structure'>
      <div id="brnch-n-fileSrch">
        <div className="addf-bnch">
          <div id="brnch">
            <i class="fa-solid fa-code-branch my-2" aria-hidden="true"></i>
            <select value={selectedBranch} id="branchSelect" onChange={handleBranchChange}>
              {branches?.map((branch) => (
                <option key={branch?.name} value={branch?.name}>
                  {branch?.name}
                </option>
              ))}
            </select>
          </div>
           <div className="add">
           <i class="fa-solid fa-plus"></i>
            </div> 
        </div>
        <div id='file-s'>
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <input type="search"  placeholder='Search File'/>
        </div>
      </div>
      <div className="fileStructure">
        {
          repoContent?.map((item) => (

            <div className='repoItem' key={item.name}>
              <li id='listItem' onClick={() => { handleOnClick(item) }} style={{ background: (currContent.name === item.name || currContent === item.name) && 'brown' }} >
                {item?.type === 'file' ? <i className="fa-regular fa-file"></i> : <i className="fa-solid fa-folder"></i>}
                {item.name}
              </li>
              {(item.type !== 'file' && content.includes(item.name)) && <FolderShow path={item?.path} />}
            </div>
          ))
        }
      </div>
    </div>
  )
}
