import React from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import './login.css'

function Login({loginwith,setRole}) {
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <div className="hello text-center text-5xl font-bold bg-transparent text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text gradient-x duration-3000">
        Unified Education Interface
      </div>
      <img src="https://logodix.com/logo/284396.png" alt="Image" className='scale-75' loading='lazy' />
      <div className='flex flex-wrap gap-4 justify-center'>
        <Button variant="contained" color="success" style={{ color: '#001830', fontWeight: 'bold' }} onClick={()=>{setRole('organisation');loginwith();}}>
          SIGNIN AS ORGANISATION
        </Button>
        <Button variant="contained" color="success" style={{ color: '#001830', fontWeight: 'bold' }} onClick={()=>{setRole('student');loginwith();}}>
          SIGNIN AS STUDENT
        </Button>
        
      </div>
    </Box>
  )
}

export default Login
