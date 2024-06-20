import React,{useState,useEffect} from 'react'
import FileShow from '../../../Frontend/src/Components/FileShow';
import { useDispatch, useSelector } from 'react-redux';
import '../Styles/Folder.css'
import { setContents, setCurr, toggleContent} from '../Data_Store/Features/moreInfoSlice';
import '../Styles/FolderShow.css'
import { fetchFileContent, fetchFolderContent } from '../Data_Store/Features/currFileFolderSlice';

export default function FolderShow({path}) {

  const {content,currContent} = useSelector((store)=>store.moreInfo)
  const selectedBranch = localStorage.getItem('selectedBranch');
  const owner = localStorage.getItem('owner');
  const repoName = localStorage.getItem('repoName');
  const [contents, setContents] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRepoContents = async () => {
      try {
      let url = `https://api.github.com/repos/${owner}/${repoName}/contents`;
      
      if (path !== null) {
        url += `/${path}`;
      }
      url += `?ref=${selectedBranch}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("leaderToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch repository contents');
        }

        const data = await response.json();
        setContents(data);
      } catch (error) {
        console.error('Error fetching repository contents:', error.message);
      }
    };

    fetchRepoContents();
  }, [owner, repoName,selectedBranch]);

  const handleItemClick=(item)=>{
    
    // set current clicked file or folder
    dispatch(setCurr(item));
   
    if(item.type==='file') dispatch(fetchFileContent(item));

    else{ 
        dispatch(toggleContent(item.name));

        // if already opened then don't fetch data
        if(!content.includes(item));
           dispatch(fetchFolderContent({owner, repoName,path: item.path,selectedBranch}));
    }
  }    
  return (
    <div className='file-explorer'>
      <ul>
        {contents?.map((item) => (
          <li key={item.name}>
            {item.type === 'file' ? (
              <div className='file-n-folder'>
               <p 
               onClick={()=> {handleItemClick(item)}}  
               style={{background:(currContent.name===item.name) && 'brown'}}>
               <i className="fa-regular fa-file"></i> 
                {item.name}
               </p>
              </div>
            ) : (
              <div>
               <div className="file-n-folder" 
                onClick={()=> {handleItemClick(item)}}
                >
                <p  
                style={{background:(currContent===item.name) && 'brown'}}>
                <i className="fa-solid fa-folder"></i>
                  {item.name}
                </p>
               </div>
                {
                 content.includes(item?.name) && <FolderShow  path={item?.path}/>
                }
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

