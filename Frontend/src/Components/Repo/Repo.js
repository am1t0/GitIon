import React, { useEffect, useState } from 'react'
import RepoStructure from '../RepoStructure';
import FileFolderContent from '../FileFolderContent';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrProject } from '../../Data_Store/Features/currProjectSlice';
import { fetchData } from '../../Data_Store/Features/repoContentSlice';
import '../../Styles/Repo.css'
import { fetchBranches } from '../../Data_Store/Features/branchSlice';

export default function Repo() {
  const dispatch = useDispatch();
  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem('repoName');
  const repo = {owner,repoName};
  const selectedBranch = localStorage.getItem('selectedBranch');
  

    useEffect(()=>{
       dispatch(fetchData({project:{repo},selectedBranch}));
       dispatch(fetchBranches({project:{repo}}));
    },[])

  return (
    <div id="repo">
    <div id="repo-upper">
      <center>Yha pe github jaisi details dalengii</center>
    </div>
    <div id='repo-lower'>
        <RepoStructure/>
        <FileFolderContent/>
    </div>
    </div>
  )
}
