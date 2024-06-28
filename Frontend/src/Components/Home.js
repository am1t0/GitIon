import React, { useEffect} from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  
  const { isLoading, isError } = useSelector((store) => store.user);
  
  useEffect(() => {
    if (isError) {
      navigate('/login'); 
    }
  }, [isError]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    !isLoading &&
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Home;
