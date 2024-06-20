import './App.css';
import Footer from './Components/Common/Footer';
import Header from './Components/Common/Header';
import { useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { Outlet} from 'react-router-dom';
import {useDispatch ,useSelector} from 'react-redux';
import { fetchUser } from './Data_Store/Features/userSlice';
import { fetchProjects } from './Data_Store/Features/projectsSlice.js';

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoading, isError } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate('/login'); 
    }
  }, [isLoading, isError, navigate]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;