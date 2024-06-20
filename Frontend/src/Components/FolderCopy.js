import React,{useState,useEffect} from 'react'
import FileShow from '../../../Frontend/src/Components/FileShow';
import { useDispatch, useSelector } from 'react-redux';
import '../Styles/Folder.css'
import { setContents} from '../Data_Store/Features/moreInfoSlice';
import '../Styles/FolderShow.css'

export default function FolderCopy({path}) {

  const {selectedBranch} = useSelector((store)=>store.moreInfo)
  const {repo: {owner,repoName}}= useSelector((store)=>store.currProject);
  const [contents, setContents] = useState([]);
  const dispatch = useDispatch();
  const {folderArr} = useSelector((store)=>store.moreInfo);
  const {currContent} = useSelector((store)=> store.moreInfo)

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
       dispatch(setContents({name:item.name,content: item}));
  }
  return (
    <div className='file-explorer'>
      <ul>
        {contents?.map((item) => (
          <li key={item.name}>
            {item.type === 'file' ? (
              <div className='file-n-folder'>
               <p onClick={()=> {handleItemClick(item)}} style={{background:(currContent===item.name)&&'rgb(61, 61, 61)'}}>
               <i className="fa-regular fa-file"></i> 
                {item.name}
               </p>
              </div>
            ) : (
              <div>
               <div className="file-n-folder" 
                onClick={()=> {handleItemClick(item)}}
                style={{background:(currContent===item.name)&&'rgb(61, 61, 61)'}
                }>
                <p>
                <i className="fa-solid fa-folder"></i>
                  {item.name}
                </p>
               </div>
                {
                (folderArr.includes(item.name)) && <FolderCopy  path={item?.path}/>
                }
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

