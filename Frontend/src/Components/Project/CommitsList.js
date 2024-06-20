import React from 'react';
import '../../Styles/CommitsList.css'

function CommitsList({ commits }) {
  const groupedCommits = groupCommitsByDate(commits);

  return (
    <div className='aheadComp'>
      <h4>Commits</h4>
      {Object.keys(groupedCommits).map(date => (
        <div key={date}>
        <div className="commitDate">
          <i class="fa-solid fa-code-commit"></i>
          <p>{date}</p>
        </div>
          <ul className='eachCommit'>
            {groupedCommits[date].map(commit => (
              <li key={commit.sha}><h6>{commit.commit.message}</h6></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default CommitsList;

// Helper function
function groupCommitsByDate(commits) {
  return commits.reduce((groupedCommits, commit) => {
    const date = new Date(commit.commit.author.date).toDateString();
    if (!groupedCommits[date]) {
      groupedCommits[date] = [];
    }
    groupedCommits[date].push(commit);
    return groupedCommits;
  }, {});
}
