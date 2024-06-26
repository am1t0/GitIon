import { faCancel, faCheck, faCross, faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import '../../Styles/AddItem.css'

export default function AddItem({ setAddShow,handleAddItem }) {

    const [item,setItem] = useState(null)

    return (
        <div className='add-project-parts'>
            <input 
              type="text"
              onChange={(e)=> setItem(e.target.value)}
              placeholder='enter the item' 
            />
            <div className="btns">
                <FontAwesomeIcon
                    icon={faCheck}
                    className='listAddDel-btn add'
                    onClick={()=> handleAddItem(item)}
                />
                <FontAwesomeIcon
                    icon={faTimes}
                    className='listAddDel-btn  cancel'
                    onClick={() => setAddShow(false)}
                />
            </div>
        </div>
    )
}
