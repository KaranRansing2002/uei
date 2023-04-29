import React, { useContext, useEffect, useRef, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import FileBase64 from 'react-file-base64'
import { Button, IconButton, InputAdornment } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { CssTextField } from './profile-forms/textfield';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from 'axios'
import url from '../url';
import { userContext } from '../App';
import SnackbarL from '../components/SnackbarL';

function PersonalSetting({ student }) {
  console.log(student);
  let name = '';
  student.name.split(' ').map(word => name += word.charAt(0).toUpperCase() + word.slice(1) + " ")
  const [image, setImage] = useState(student.image);
  const [change,setChange] = useState(0)

  const maininfo = useRef({});
  const addtinfo = useRef({});
  const bio = useRef('')
  const { headerToken, uid } = useContext(userContext);

  const handleUpdateMaininfo = async () => {
    console.log(maininfo.current);
    const resp = await axios.patch(`${url}/student/${uid}`, maininfo.current, {
      headers: {
        Authorization : `Beare ${headerToken}`
      }
    })
    console.log(resp);
  }
  const handleUpdateAddtinfo = async () => {
    console.log(addtinfo.current);
    const resp = await axios.patch(`${url}/student/${uid}`, { additionalInfo: addtinfo.current }, {
      headers: {
        Authorization : `Beare ${headerToken}`
      }
    })
    console.log(resp);
  }
  
  const handleUpdateImage = async () => {
    console.log(maininfo.current);
    const resp = await axios.patch(`${url}/student/${uid}`, {image : image}, {
      headers: {
        Authorization : `Beare ${headerToken}`
      }
    })
    console.log(resp);
  }

  useEffect(() => {
    if(change>0) handleUpdateImage();
  },[image])

  return (
    <div className='p-4 flex flex-col gap-8 overflow-y-scroll element-class max-h-screen scrollbar-hide'>
      <div className='sm:flex flex-wrap'>
        <div className='h-72 rounded-full w-72 m-2 relative '>
          <img src={image} className='h-full w-auto rounded-full' />
          <div className='rounded flex justify-center items-center gap-1 h-8 bottom-[-0.7rem] left-[5.4rem] cursor-pointer  absolute bg-slate-800 p-2 '>
            <IconButton color="secondary" aria-label="upload picture" component="label" >
              <div className='bg-yellow-400 w-32 flex hidden'>
                <FileBase64
                  type="file"
                  multiple={false}
                  style={{ height: '10px' }}
                  onDone={({ base64 }) => { setImage(base64);setChange(p=>p+1) }}
                />
              </div>
              <PhotoCamera />
            </IconButton>
            <h1 className='text-lg'>Edit</h1><EditIcon />
          </div>
          <h1 className='text-center m-4 text-xl'>{name}</h1>
        </div>

        <div className='sm:flex sm:mt-8 sm:justify-center flex-wrap gap-4 sm:ml-4 mt-12 sm:mt-2 sm:ml-8'>
          <div className='mt-4 border border-slate-400 p-8 flex flex-col gap-4 w-72'>
            <CssTextField label='username' helperText="Please enter username" onChange={(e)=>maininfo.current.username=e.target.value} />
            <CssTextField label='name' helperText='Please enter your full name' onChange={(e)=>maininfo.current.name=e.target.value} />
            <CssTextField type='date' helperText='Please enter your date of birth' onChange={(e)=>maininfo.current.dob=e.target.value} />
            <Button variant='contained' color='secondary' onClick={handleUpdateMaininfo}>Update</Button>
          </div>
          <div className='mt-4 border border-slate-400 p-8 flex flex-col gap-4 w-72'>
            <CssTextField label='phone no.' helperText="Please enter valid 10 digit number" onChange={(e)=>addtinfo.current={...addtinfo.current,phone : e.target.value}} />
            <CssTextField label='social link' InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkedInIcon />
                </InputAdornment>
              ),
            }} helperText='Please enter your linkedin link' onChange={(e)=>addtinfo.current={...addtinfo.current,linkedin : e.target.value}} />
            <CssTextField label='social link' InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GitHubIcon />
                </InputAdornment>
              ),
            }} helperText='please enter your github link' onChange={(e)=>addtinfo.current={...addtinfo.current,github : e.target.value}} />
            <Button variant='contained' color='secondary' onClick={handleUpdateAddtinfo}>Update</Button>
          </div>
        </div>
      </div>


      <div className=' flex justify-center md:ml-4'>
        <div className='sm:w-3/4 w-full'><CssTextField InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Button variant='contained' color='success' onClick={handleUpdateMaininfo}>Save</Button>
                </InputAdornment>
              ),
            }} id="outlined-multiline-flexible" label='Bio/Write about yourself' fullWidth multiline maxRows={5} sx={{ width: '100%' }} onChange={(e)=>maininfo.current={...maininfo.current,bio : e.target.value}}/></div>
      </div>
    </div>
  )
}

export default PersonalSetting
