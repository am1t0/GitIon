import React, { useEffect, useRef, useState } from 'react'
import '../../Styles/PullReqCompare.css'
import ChangedFiles from './ChangedFiles';
import { useSelector } from 'react-redux';
import { fetchBranches } from '../../Data_Store/Features/branchSlice';
import NewPullReqForm from './NewPullReqForm';
import CommitsList from './CommitsList';

export default function PullReqCompare() {
  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem('repoName');

  const [comparison, setComparison] = useState(null);        // for storing different files
  const [branches,setBranches] = useState([])                // branches list
  const [createPullReq,setCreatePullReq] = useState(false);  // when user want's to create new pull request

  const [baseBranch,setBaseBranch] = useState('main')
  const [headBranch,setHeadBranch] = useState('main')

  const selectFirstRef = useRef(null)     
  const selectSecondRef = useRef(null)

  useEffect(() => {
    fetchAllBranches();
    fetchComparisons();
  }, []);

  //fetching all breanches
  const fetchAllBranches=async()=>{
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

          setBranches(res);
             
        
  } catch (error) {
     console.log('Error in fetching branches',error);
  }
  }
  const fetchComparisons=async()=>{
    const baseBranch = selectFirstRef?.current?.value||'main'
    const compareBranch = selectSecondRef.current?.value||'main'

    fetch(`https://api.github.com/repos/${owner}/${repoName}/compare/${baseBranch}...${compareBranch}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('leaderToken')}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => response.json())
    .then(data => {setComparison(data)
      console.log('what is the difference fetching ',data)
    })
    .catch(error => console.error('Error:', error));
  }

  // showing merging message according to status
  const renderComparisonStatus = (status) => {
    switch (status) {
      case 'identical':
        return <div className='noPull'>
            <i class="fa-solid fa-code-pull-request" aria-hidden="true"></i>
            <h4>There isn’t anything to compare.</h4>
            <p>You’ll need to use two different branch names to get a valid comparison.</p>
          </div>;
      case 'behind':
        return <div className='noPull'>
        <i class="fa-solid fa-code-pull-request" aria-hidden="true"></i>
        <h4>There isn’t anything to compare.</h4>
        <p>The compare branch is behind the base branch. You may want to update your compare branch.</p>
      </div>;
      case 'ahead':
        return (
          <div className='aheadComp'>
          <CommitsList commits={comparison.commits}/>
          <h4>Changed Files</h4>
          <ul>
            {comparison?.files?.map(file => (
              <li key={file.filename}>
                <p>{file.filename}</p>
               <ChangedFiles file={file}/>          
              </li>
            ))}
          </ul>
        </div>
        );
        case 'diverged': 
          return(
            <div className='aheadComp'>
            <CommitsList commits={comparison.commits}/>
            <h4>Changed Files</h4>
            <ul>
              {comparison?.files?.map(file => (
                <li key={file.filename}>
                  <p>{file.filename}</p>
                 <ChangedFiles file={file}/>          
                </li>
              ))}
            </ul>
          </div>
          )
      default:
        return null;


    }
  };

  const handleCreatePullReq = ()=>{
    setBaseBranch(selectFirstRef.current.value);     // setting base and compare branch from select tags
    setHeadBranch(selectSecondRef.current.value);

    setCreatePullReq(true);   // showing the form now for creating pull request
  }
  return (
    comparison &&
     <section>
      <h6>diverged wala case bhi yaad rkhiyega bhaiya ji</h6>
       <div className="mergeInstructions">
          <h4>Compare changes</h4>
          <p>Compare branches and merge them to update current project</p>
       </div>

      <div className="compBox">

 {/* comparing branches selection here  */}
       <div className="branchesToMerge">
       <i class="fa-solid fa-code-pull-request"></i>
        <select ref={selectFirstRef}  onChange={fetchComparisons}>
        {
            branches?.map((branch)=>{
              return <option value={branch.name}>{branch.name}</option>
            })
           }
        </select>
        <i class="fa-solid fa-arrow-left-long"></i>
        <select ref={selectSecondRef} onChange={fetchComparisons}>
           {
            branches?.map((branch)=>{
              return <option value={branch.name}>{branch.name}</option>
            })
           }
        </select>
       </div>  
     {/* creating new pull request button    */}
       <div className="newPull">
        { 
          (comparison.status==='ahead' && !createPullReq) &&
          <button onClick={handleCreatePullReq}>create pull request</button>
        }
      </div>            
   </div>

      {/* new pull request form component  */}
      {
        createPullReq && <NewPullReqForm base={baseBranch}  head={headBranch}/>
      }

      <div className="actionAccStatus">
         {renderComparisonStatus(comparison.status)}
      </div>
     </section>
  )
}
