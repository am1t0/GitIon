import './App.css';
import Footer from './Components/Common/Footer';
import Header from './Components/Common/Header';
import { useEffect} from 'react';
import { Outlet} from 'react-router-dom';
import {useDispatch ,useSelector} from 'react-redux';
import { fetchUser } from './Data_Store/Features/userSlice';
import { fetchProjects } from './Data_Store/Features/projectsSlice.js';
import 'animate.css/animate.min.css';
import Spinner from './Components/Common/Spinner.js';
import AppContent from './Components/Entry/AppContent.js';
import Authorize from './Components/Entry/Authorize.js';
import Login from './Components/Login.js';


function App() {

  const dispatch = useDispatch();
  
  //fetching user and all it's associated project's data
  useEffect(() => {
    dispatch(fetchUser());
    
    dispatch(fetchProjects());
  }, [dispatch]);
  
  const { isLoading , isError } = useSelector((store) => store.user);

  return (
    isLoading ? <Spinner/>     // showing spiner on load
    
    : isError ? (              // checking if any error in fetching user data

         <Authorize/>          // sending user to register/login himself
       )
         :(                    // if user is authorized then show content
       <AppContent>          
          <Header/>
          <Outlet/>
          <Footer/>
      </AppContent>)
  );
}

export default App;