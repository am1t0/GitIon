import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import formatDate from '../../Utils/date';
import '../../Styles/Date.css'

const Date = ({ label, date }) => {

  const setId=(label)=>{
     return label==='Start Date'?'start':'end'
  }

  return (
    <div className="date-component">
      <div className="icon-container" id={setId(label)}>
        <FontAwesomeIcon icon={faCalendarAlt} />
      </div>
      <div className='date-info'>
        <span className="date-label">{label}</span>
        <span className="date-value">{formatDate(date)}</span>
      </div>
    </div>
  );
};

export default Date;
