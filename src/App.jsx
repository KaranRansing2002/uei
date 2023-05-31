import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material'
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard/Dashboard';
import Login from './scenes/Login/Login';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import Pform from './scenes/profile-forms/Pform';
import './App.css'
import PersonalSetting from './scenes/PersonalSetting';
import url from './url';
import Algo from './scenes/algo/Algo';
import 'chart.js/auto';
import Projects from './scenes/projects/Projects';
import School from './scenes/school/School';
import Institute from './scenes/institute/Institute';
import Experience from './scenes/experience/Experience';

export const userContext = React.createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const { loginWithPopup, loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [headerToken, setHeaderToken] = useState('');
  const [uid, setUid] = useState(undefined);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently();
      setHeaderToken(token);  
      const resp = await axios.get(`${url}/signin`, {
        headers: {
          authorization : `Bearer ${token}`
        }
      })

      localStorage.setItem('student', JSON.stringify(resp.data));
      setStudent(resp.data);
      setUid(resp.data.uid);
      
      // console.log(location.pathname.split('/')[1]) 
      const path = location.pathname === '/' ? `/${resp.data.username}/dashboard` : location.pathname;
      navigate(path);
    };
    isAuthenticated && fetchData(); 
  },[isAuthenticated])

  const signin = async () => {
    try {
      await loginWithPopup();
    } catch (error) {
      console.log(error.message)
    }
  }
  // console.log(uid);

  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <userContext.Provider value={{ uid, headerToken,student,setStudent}}>
            {(isAuthenticated && uid && student!=null) ? <div className='app flex  '>
              <Sidebar isSidebar={isSidebar} student={student} />
              <main className='w-full'>
                <Topbar logout={logout} />
                <Routes>
                  <Route path={`/:username/dashboard`} exact element={<Dashboard />}></Route>
                  <Route path={`/:username/form`} exact element={<Pform />}></Route>
                  <Route path={`/:username/personal`} exact element={<PersonalSetting />}></Route>
                  <Route path={`/:username/school`} exact element={<School/>}></Route>
                  <Route path={`/:username/algo`} exact element={<Algo />}></Route>
                  <Route path={`/:username/projects`} exact element={<Projects />}></Route>
                  <Route path={`/:username/college`} exact element={<Institute />}></Route>
                  <Route path={`/:username/work`} exact element={<Experience/>}></Route>
                </Routes>
              </main>
            </div> :
              <Login loginwith={signin} />
            }
          </userContext.Provider>
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
/*

*/