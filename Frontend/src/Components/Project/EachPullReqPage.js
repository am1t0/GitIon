import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../../Styles/EachPullReqPage.css'

export default function EachPullReqPage() {

  const { pullNumber } = useParams();

  // taking data from localstorage for api calling
  const token = localStorage.getItem('leaderToken')
  const owner = localStorage.getItem('owner')
  const repoName = localStorage.getItem('repoName')

  // loading while fetching data
  const [loading, setLoading] = useState(false)
  const [pullReqData, setPullReqData] = useState({});
  const [mergeable,setMergeable] = useState({});
  const [conflictingFiles,setConflictingFiles] = useState();

  const [commits,setCommits] = useState();

  const description =(body)=>{
    return body!==null?body:'No description provided.'
  }
  // fetching pull request data
  useEffect(() => {
    const fetchPullRequestData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        setPullReqData(data);
    
        setMergeable(data.mergeable);

      } catch (err) {
        console.log('error', err)
      } finally {
        setLoading(false);
      }
    };

    fetchPullRequestData();
  }, [])

  //fetching pull requests commit on compare
  useEffect(()=>{ 
     const fetchCommits = async()=>{
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/commits`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        setCommits(data)
      } catch (err) {
        console.log('error', err)
      }
     }

     fetchCommits();
  },[])

  //fetch conflicts if there : 
  useEffect(()=>{
    const fetchFiles = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls/${pullNumber}/files`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

          console.log('files are ',data)
          // Filter conflicting files based on status or other heuristic
          const conflicts = data.filter(file => file.status === 'modified' && file.patch.includes('<<<<<<'));
          setConflictingFiles(conflicts);
          console.log('now conflicting files are ',conflicts)
      } catch (err) {
        console.log('error', err);
      }
    };

    fetchFiles();
  },[])

  return (
    !loading ?
      <div className='eachPull'>
        <h4>{pullReqData.title} #{pullNumber}</h4>
      <div className='pullTop'>
        <h6 className='state'>
          <i class="fa-solid fa-code-pull-request" aria-hidden="true"></i>
          {pullReqData.state}
        </h6>
        <p className='aim'>pull request to merge {pullReqData.commits} commits from
          <h6>{pullReqData.base?.ref}</h6> to
          <h6>{pullReqData.head?.ref}</h6>
        </p>
        </div>
        <div className="pullComment">
           {description(pullReqData.body)}
        </div>
        <div className="commitList">
          <h5>commits</h5>
          <ul>
          {
            commits?.map((commit)=>(
              <div className='commits' key={commit.sha}>
                <i class="fa-solid fa-code-commit"></i>
                <li>{commit.commit.message}</li>
              </div>
            ))
          }             
          </ul>
        </div>

        <div className="mergeCond">
          <div className='mergeState'>
            {
              mergeable === null ? (
                <h6>Checking mergeability...</h6>
              ) : mergeable ? (
                <div className="conflictsOrNot">
                 <i class="fa-solid fa-check no-conflict-i"></i>
                   <h6>This branch has no conflicts with the base branch</h6>
                </div>
              ) : (
                <div className="conflictsOrNot">
                   <i class="fa-solid fa-triangle-exclamation conflict-i"></i>
                   <h6>There are conflicts that must be resolved before merging.</h6>

                   {/* currntly showing conflicts on github */}
                   <a 
                   href={`https://github.com/${owner}/${repoName}/pull/${pullNumber}/conflicts`}
                   target='_blank'
                   rel="noreferrer"
                   style={{marginLeft:'20px',color:'yellow'}}
                   >
                   See Conflicts</a>
                </div>
              )
            }
          </div>
          <div className="mergeBtn">
            <button disabled={!mergeable} className={!mergeable? 'disable Mbtn':'notDisable Mbtn'}>Merge pull request</button>
          </div>
        </div>
        <div className="addComment">
          <textarea placeholder='add your comment here...'/>
        </div>
      </div>
      : <h3>Loading...</h3>
  )
}
