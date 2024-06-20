import React, { useEffect, useRef, useState } from 'react'
import '../../Styles/NewPullReqForm.css'
import { useSelector } from 'react-redux';

export default function NewPullReqForm({base,head}) {

  const user = useSelector((store)=> store.user.data);

  const titleRef = useRef(null);
  const bodyRef = useRef(null);
  const [message, setMessage] = useState('');

  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem('repoName');

  const handlePullReqSubm = async (e) => {
    e.preventDefault();

    const title = titleRef.current.value;
    const body = bodyRef.current.value;

    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.gitToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        head,
        base,
        body,
      })
    });

    const data = await response.json();
    console.log('response ka data after pull request ',data)

    if (response.ok) {
      alert(`Pull request created successfully: #${data.number} - ${data.title}`);
    } else {
      alert(`Failed to create pull request: ${data.message}`);
    }
  };

  return (
      <form className='pullForm' onSubmit={handlePullReqSubm}>
        <div className='pullInps'>
          <label>Add a title</label>
          <input
            type="text"
            ref={titleRef}
            required
          />
        </div>
        <div className='pullInps'>
          <label>Add a description</label>
          <textarea
            ref={bodyRef}
          />
        </div>
        <button type="submit">Create Pull Request</button>
      </form>
  )
}
