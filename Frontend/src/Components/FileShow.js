import React, { useEffect, useState } from 'react';
import '../Styles/Folder.css'
import { useSelector } from 'react-redux';

const FileShow = ({ content,isOpen }) => {
  const [fileContent, setFileContent] = useState('');
  const {data} = useSelector((store)=> store.currFileFolder)
  useEffect(() => {
    console.log('IDHAR FILE ME DATA TO KUCH IS PRAKAR HAI')
    console.log(data);
    const fetchData = async () => {
      try {
        const response = await fetch(content.download_url);
        if (!response.ok) {
          throw new Error(`??????????????Failed to fetch file content: ${response.status} ${response.statusText}`);
        }

        const fetchedContent = await response.text();

        // Check if the content is encoded in base64
        if (content.encoding === 'base64') {
          const decodedContent = atob(fetchedContent);
          setFileContent(decodedContent);
        } else {
          setFileContent(fetchedContent);
        }
      } catch (error) {
        console.error('Error fetching file content:', error);
      }
    };

    fetchData();
  }, [content.download_url, content.encoding]);

  return (
    <div style={{display:(isOpen)?'block':'none'}}>
      {
      fileContent  && (
        <h4>{fileContent}</h4>)
      }
    </div>
  );
};

export default FileShow;
