import React, { useEffect, useReducer, useRef, useState,useContext } from 'react';
import InputForm from '../../components/InputForm';
import axios from 'axios'
import { Button, Icon, IconButton, TextField } from '@mui/material';
import Header from '../../components/Header';
import schoollogo from '../../assets/schoollogo.png'
import AddIcon from '@mui/icons-material/Add';
import { CssTextField } from './textfield';
import MarksheetForm from '../../components/MarksheetForm';
import { useAuth0 } from '@auth0/auth0-react'
import { userContext } from '../../App';
import url from '../../url';

function SchoolForm() {

  const [toggle, setToggle] = useState(false);
  const [classes, setClasses] = useState([0]);
  const { getAccessTokenSilently } = useAuth0()
  const { headerToken, uid } = useContext(userContext)
  const [update,setUpdate] = useState(false)
  const schoolInfo = useRef(null);

  useEffect(() => {
    const handleGet = async () => {
      const resp = await axios.get(`${url}/school/${uid}`, {
        headers: {
          authorization: `Bearer ${headerToken}`
        }
      })
      // console.log(resp.data.resp?.schoolDetails)
      schoolInfo.current = resp.data.resp?.schoolDetails==undefined ? [] : resp.data.resp.schoolDetails
      setUpdate(true)
    }
    handleGet();
  },[])

  const handleSave = async() => {
    const resp = await axios.post(`${url}/school/`, {uid : uid, schoolDetails : schoolInfo.current }, {
      headers: {
        authorization : `Bearer ${headerToken}`
      }
    }); 
    console.log(resp);
  }

  return (
    <div className={`m-2 border border-slate-400 p-4 flex flex-col gap-2`}>
      <div className=''><Header mb='10px' title="SCHOOL LEVEL" subtitle={"your school qualifications from class 1 to 12"} H={"h3"} /></div>
      <div><Button onClick={() => setToggle((prev) => !prev)} variant="contained" sx={{ backgroundColor: "#0081ff" }} >Add details</Button></div>
      <div className='overflow-y-auto max-h-screen'>
        {
          toggle && update &&
          schoolInfo.current.map((obj, index) => <MarksheetForm key={index} stateinfo={schoolInfo} info='school' update={index} />)
        }
        {toggle && update &&
          classes.map((obj, index) => <MarksheetForm key={index} stateinfo={schoolInfo} info='school' />)
        }
        {toggle && <div className='mt-2'><IconButton onClick={() => setClasses(prev => [...prev, 0])}><AddIcon /></IconButton> Add Class</div>}
      </div>
      <div className='flex flex-col '>
        {toggle &&
          <div className='flex self-end'>

            <Button onClick={handleSave} variant="contained" color="success">Save Details</Button>
            {/* <Button onClick={handleGet} variant="contained" color="success">GET</Button> */}
          </div>
        }
      </div>
    </div>
  )
}

export default SchoolForm
