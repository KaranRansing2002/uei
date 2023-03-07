import React, { useState } from 'react'
import { ColorModeContext, useMode } from './theme';
import {CssBaseline,ThemeProvider} from '@mui/material'
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard/Dashboard';
import Login from './scenes/Login/Login';
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const { loginWithPopup, loginWithRedirect, logout, user, isAuthenticated,getAccessTokenSilently } = useAuth0()

  

  const signin = async () => {
    let token = "";
    try {
      await loginWithPopup();
      token = await getAccessTokenSilently();
      console.log(token)
      const resp = await axios.get('http://localhost:8000/protect', {
        headers: {
          authorization : `Bearer ${token}`
        }
      })
      console.log(resp.data);
    } catch (error) {
      console.log(error.message)
      console.log(token);
    }
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          { isAuthenticated ? <div className='app flex  '>
            <Sidebar isSidebar={isSidebar}/>
            <main className='w-full'>
                <Topbar logout={logout} />
              <Dashboard/>
            </main>
            </div> :
            <Login loginwith={signin} />
          }
        </CssBaseline>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
/*

*/