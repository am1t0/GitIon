import React from 'react'
import '../../Styles/ChangedFile.css'

export default function ChangedFiles({file}) {
    const renderDiff = (file) => {
        const lines = file.patch.split('\n');
        return lines.map((line, index) => {
          let className = 'comments';
          if (line.startsWith('+')) {
            className = 'sameProp added-line';
          } else if (line.startsWith('-')) {
            className = 'sameProp removed-line';
          }
          return (
         <pre key={index} className={className}>{line}</pre>
          );
        });
      };

  return (
    <div className="diff">
        <div className="file-mnp">
          <h6>{file.filename}</h6>
        </div>
        <div className='file-content'>
         {renderDiff(file)}
        </div>
    </div>
  )
}
