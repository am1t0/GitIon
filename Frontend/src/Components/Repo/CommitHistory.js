import React, { useState, useEffect } from 'react';

const CommitHistory = ({ owner, repo, branch }) => {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    const fetchCommits = async () => {
      console.log('aayaa commits me ')
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("leaderToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch commits');
        }

        const data = await response.json();
        setCommits(data);
        console.log(data);
      } catch (error) {
        // console.error('Error fetching commits:', error.message);
      }
    };

    fetchCommits();
  }, [owner, repo, branch]);

  const calculateMonthsPassed = (commitDate) => {
    const today = new Date();
    const commitDateTime = new Date(commitDate);

    const monthsPassed = (today.getFullYear() - commitDateTime.getFullYear()) * 12 +
      today.getMonth() - commitDateTime.getMonth();

    return monthsPassed;
  };

  return (
    <div style={{background:'white',borderRadius:'10px', padding:'10px'}}>
      <h2>Commit History for {branch} branch</h2>
      <ul style={{background:'black'}}>
        {commits.map((commit) => (
          <li key={commit.sha}>
            <p>{commit.commit.message}</p>
            <p>{commit.commit.committer.login} committed {calculateMonthsPassed(commit.commit.author.date)} Months Ago</p>
            {/* <p>Sha: {commit.sha}</p> */}
            {/* <p>Months Ago: {calculateMonthsPassed(commit.commit.author.date)}</p> */}
            <a
              href={commit.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse Repository At this point
            </a>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitHistory;
