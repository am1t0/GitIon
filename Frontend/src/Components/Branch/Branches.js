import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../Styles/Branch.css'
import { fetchBranches } from '../../Data_Store/Features/branchSlice';
import Project from '../Project/Project';
// import fetch from 'node-fetch';

export default function Branches({handleBranchChange, selectedBranch}) {

  const createdBranch = useRef();
  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem('repoName');
  const branches = useSelector((store)=>store.branches.data)
  const [creatingBranch, setCreatingBranch] = useState(false);


  const handleBranchCreate = async () => {
    const newBranchName = createdBranch.current.value;
    createdBranch.current.value = '';
    if (newBranchName) {
      setCreatingBranch(true);
  
      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/git/refs`;
      const baseBranch = selectedBranch;

      const createBranchBody = {
        ref: `refs/heads/${newBranchName}`,
        sha: (await getBranchSha(owner, repoName, baseBranch,localStorage.getItem("leaderToken"))).object.sha,
      };

   
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${""}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createBranchBody),
        });

        if (response.ok) {
          /// isme jb tak response ni aata tb tak kro---> 
            // window.location.reload();
            alert('successful');
            console.log('hogay username dekh')
        } else {
          console.error(`Failed to create branch. Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error creating branch:', error);
      } finally {
        setCreatingBranch(false);
      }
    }
  };

  const getBranchSha = async (owner, repo, branch, token) => {

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${selectedBranch}`;
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return response.json();
      } else {
        console.error(`Failed to get branch SHA. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error getting branch SHA:', error);
    }
  };

  return (
    <div className='branch-main'>
      <div id='cre-len'>
        <div id="branchInp">
          <input type="text" placeholder={`create branch from ${selectedBranch}`} ref={createdBranch} />
          <button onClick={handleBranchCreate}>
          <i className="fa-solid fa-plus"></i>
          </button>
        </div>
  
       {creatingBranch && <h6 id='createBranch'>Creating branch...</h6>}
      </div>
  
    <div id='branch'>
      <div className="branchNames">
      <div className="branchLogo">
      <i className="fa-solid fa-code-branch my-2"></i>
        </div>
      <select value={selectedBranch} id="branchSelect" onChange={handleBranchChange}>
        {branches?.map((branch) => (
          <option key={branch?.name} value={branch?.name}>
            {branch?.name}
          </option>
        ))}
      </select>
      </div>
      <div id="branchNum">
        <div className="branchLogo">
      <i className="fa-solid fa-code-branch my-1"></i>
        </div>
      <>
          {branches?.length} Branch
      </>
      </div>
    </div>
  </div>
  
  );
}