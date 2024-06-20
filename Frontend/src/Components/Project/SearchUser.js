import React from 'react'
import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/debounce';
import getAccessToken from '../../Utils/auth';
import '../../Styles/SearchUser.css'
import github from '../../Images/github.png'

export default function SearchUser(props) {

  const {addInvite,remove} = props;

  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null)

  const profileImg = (user) => {

    return user.githubData ? user.githubData.avatar_url : github;
  }

  const fetchUsers = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/all-users?q=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Fetch users error:', error);
      throw error;
    }
  };
  const debouncedQuery = useDebounce(query, 300);

  const handleChange = (value) => {
    setQuery(value);
  };

  // searching user on the basis of changing input
  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      fetchUsers(debouncedQuery)
        .then((data) => { setUsers(data) })
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  return (
    <div className='sa'>
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder='Enter username to add'
      />
      {users.length > 0 &&

        <div className="result">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}

          {users.map((user) => (
            <li key={user._id} id='user' onClick={() => setQuery(user.username)}>
              <img src={profileImg(user)} alt="img" />
              <p>{user.username}</p>
            </li>
          ))}
        </div>
      }
      <div className="saLogo" onClick={()=> addInvite(query)} >
        <i className="fa-solid fa-plus"></i>
      </div>

    </div>
  )
}
