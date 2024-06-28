import React from 'react'
import '../../Styles/Spinner.css'

export default function Spinner() {
    return (
        <div className='spinner-container'>
            <div class="spinner-border text-light spinner" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    )
}
