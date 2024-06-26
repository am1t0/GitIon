import { faInbox } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import '../../Styles/EmptyCases/NoProjectProgItems.css'

export default function NoProjectProgItems({handleAddItem}) {
  return (
    <div className="empty-message">
    <FontAwesomeIcon icon={faInbox} className='empty-list-icon' />
    <p>No checklist items. Add a new item to get started!</p>
    <button>Start</button>
  </div>
  )
}
