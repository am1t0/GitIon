import React, { useEffect, useState } from 'react';
import '../../Styles/PullRequest.css'
import { Link, useParams } from 'react-router-dom';

const PullRequests = () => {
  const [pullRequests, setPullRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {projectName,projectId} = useParams();
  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem('repoName');

  useEffect(() => {
    const fetchPullRequests = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls?state=all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('leaderToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPullRequests(data);
        console.log('Pull requests are ',data);

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPullRequests();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;


  return (
    <div className='pullRequest'>
      <ul className='pullReqList'>
        <div className="upOfPull">
        <div className="reqVar">
            <p>opened</p>
            <p>closed</p>
        </div>
        <div className="newPull">
          <button>
            <Link 
             to={`/project/${projectName}/${projectId}/docs/compare`}>
              New pull request
            </Link>
          </button>
        </div>
        </div>
        {pullRequests.map(pr => (
          <li key={pr.id} className='eachPr'>
             <i class="fa-solid fa-code-pull-request"></i>
            <Link
             to={`/project/${projectName}/${projectId}/docs/pull/${pr.number}`}
            >
             <p>
             {pr.title}
             </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PullRequests;
