import React, { useEffect, useState } from 'react';
import '../../Styles/Checklist.css';
import { faAdd, faBoxOpen, faCheck, faCheckCircle, faCircle, faEdit, faSitemap, faTasks, faTrash, prefix } from '@fortawesome/free-solid-svg-icons';
import NoProjectProgItems from '../EmptyCases/NoProjectProgItems';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddItem from './AddItem';
import { useParams } from 'react-router-dom';
import getAccessToken from '../../Utils/auth';

const Checklist = ({ items, setItems }) => {

  const [addShow, setAddShow] = useState(false)
  const [updItem, setUpdItem] = useState(null)
  const { projectId } = useParams()

  const handleAddItem = async (item) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/${projectId}/add-milestone`, {
        method: 'POST',
        body: JSON.stringify({
          mileStone: item,
          completed: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      })

      if (!response.ok) {
        return Promise.reject(response);
      }

      let data = await response.json()


      setItems([...items, data.milestone]);

      setAddShow(false)

    } catch (error) {
      return error.message || "An error occurred while loading";
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/${projectId}/${itemId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      })

      if (!response.ok) {
        return Promise.reject(response);
      }

      setItems(items => items.filter(item => item._id !== itemId));

      console.log('success..')

    } catch (error) {
      return error.message || "An error occurred while loading";
    }
  }

  const handleCheckItem = async (itemId) => {
    setUpdItem(itemId)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/projects/${projectId}/${itemId}/completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAccessToken()}`
        },
      })

      if (!response.ok) {
        return Promise.reject(response);
      }

      setItems(items => items.map(item => {
        if (item._id === itemId)
          return { ...item, completed: !item.completed }

        else return item
      }))

      setUpdItem(null)

    } catch (error) {
      return error.message || "An error occurred while loading";
    }
  }

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length !== 0 ? items.length : 1;

  const progress = ((completedCount) / (totalCount)) * 100;

  return (
    <div className="checklist">
      <h5>Project progress</h5>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <button className='add-item-btn' onClick={() => setAddShow(true)}>+ Add Checklist Item</button>
      {addShow &&
        <AddItem
          setAddShow={setAddShow}
          handleAddItem={handleAddItem}
        />}

      {items.length > 0 ? (
        <ul className="project-list">
          {items.map(item => (
            <li key={item._id} className={`project-item ${item.completed ? 'completed' : ''}`}>
              <div className="item-content">

                {

                  updItem === item._id ? (
                    <div class="spinner-border item-check-load" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>)
                    : (item.completed ?
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        onClick={() => handleCheckItem(item._id)}
                        className='check-or-not'
                      />
                      : <FontAwesomeIcon
                        icon={faCircle}
                        onClick={() => handleCheckItem(item._id)}
                        className='check-or-not'
                      />)
                }

                <span className="milestone">{item.mileStone}</span>
              </div>
              <div className="actions">
                <FontAwesomeIcon
                  icon={faEdit}
                  className='edit-item'
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className='del-item'
                  onClick={() => handleDeleteItem(item._id)}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <NoProjectProgItems handleAdd={{ handleAddItem }} />
      )}
    </div>
  );
};

export default Checklist;
