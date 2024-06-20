import React from 'react'

export default function InitialPushinComands({repoName,owner}) {
  return (
    <>
     <h2>Push Your First Commit from cmd</h2>

     <div className="container" style={{border:'2px solid red',background:'gray',borderRadius:'20px'}}>
        <p>git init</p>
        <p>git add README.md</p>
        <p>git commit -m "first commit</p>
        <p>git branch -M main</p>
        <p>git remote add origin https://github.com/{owner}/{repoName}.git</p>
        <p>git push -u origin main</p>
     </div>
    </>
  )
}

// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/am1t0/git-practice.git
// git push -u origin main
