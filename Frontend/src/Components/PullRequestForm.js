import React, { useState } from 'react';

const PullRequestForm = () => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [sourceBranch, setSourceBranch] = useState('');
  const [targetBranch, setTargetBranch] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pullRequestUrl, setPullRequestUrl] = useState(null);
  const [showForm, setShowForm] = useState(false); // New state variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/create-pull-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          sourceBranch,
          targetBranch,
          title,
          body,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setPullRequestUrl(responseData.pullRequestUrl);
        setError(null);
      } else {
        throw new Error('Error creating pull request. Please try again.');
      }
    } catch (error) {
      setError('Error creating pull request. Please try again.');
      setPullRequestUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePullRequestClick = () => {
    // Set the showForm state to true when the button is clicked
    setShowForm(true);
  };

  return (
    <div>
      {/* Show button only if the form is not visible */}
      {!showForm && (
        <button onClick={handleCreatePullRequestClick}>
          Create Pull Request
        </button>
      )}

      {/* Show form if the state is true */}
      {showForm && (
        <form onSubmit={handleSubmit}>
          {/* ... form fields for owner, repo, branches, title, body */}
          <label>
            Owner:
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              required
            />
          </label>

          <label>
          Repository:
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            required
          />
        </label>

        <label>
          Source Branch:
          <input
            type="text"
            value={sourceBranch}
            onChange={(e) => setSourceBranch(e.target.value)}
            required
          />
        </label>

        <label>
          Target Branch:
          <input
            type="text"
            value={targetBranch}
            onChange={(e) => setTargetBranch(e.target.value)}
            required
          />
        </label>

        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Body:
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </label>

          <button type="submit" disabled={isLoading}>
            Create Pull Request
          </button>
        </form>
      )}

      {error && <p>{error}</p>}
      {pullRequestUrl && <p>Pull request created: {pullRequestUrl}</p>}
    </div>
  );
};

export default PullRequestForm;
