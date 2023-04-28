import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import InputForm from '../../components/InputForm';
import axios from 'axios'
import { Button, Icon, IconButton, TextField } from '@mui/material';
import Header from '../../components/Header';
import schoollogo from '../../assets/schoollogo.png'
import AddIcon from '@mui/icons-material/Add';
import { CssTextField } from './textfield';
import MarksheetForm from '../../components/MarksheetForm';
import url from '../../url';
import { userContext } from '../../App';

function InstituteForm() {

  const instituteinfo = useRef([]);
  const insinfo = useRef({});
  const [years, setYears] = useState([1])
  const [toggle, setToggle] = useState(false)
  const { headerToken, uid } = useContext(userContext)
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const handleGet = async () => {
      const resp = await axios.get(`${url}/institute/${uid}`, {
        headers: {
          authorization: `Bearer ${headerToken}`
        }
      })
      // console.log(resp.data.resp?.schoolDetails)
      insinfo.current = resp.data.resp == undefined ? {} : resp.data.resp;
      instituteinfo.current = resp.data.resp.instituteinfos;
      console.log(instituteinfo);
      setUpdate(true)
    }
    handleGet();
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    insinfo.current[name] = value;
  }

  const handleSave = async() => {
    insinfo.current['instituteinfos'] = [...instituteinfo.current]
    insinfo.current['uid'] = uid;
    console.log(insinfo);
    const resp = await axios.post(`${url}/institute`, insinfo.current, {
      headers: {
        authorization : `Bearer ${headerToken}`
      }
    })
    console.log(resp);
  }

  return (
    <div className='m-2 border border-slate-400 p-4 '>
      <div className=''><Header title="INSTITUTE LEVEL" subtitle={"your College qualifications "} H={"h3"} /></div>
      <Button onClick={() => setToggle((prev) => !prev)} variant="contained" sx={{ backgroundColor: "#0081ff" }} >Add details</Button>
      {
        toggle &&
        <div className='flex flex-col gap-2 my-2'>
          <div className=' flex gap-2'>
            <CssTextField label='Degree name' name='degree' onChange={handleChange} value={insinfo.current['degree']}/>
            <CssTextField label='Course name' name='course' onChange={handleChange} value={insinfo.current['course']}/>
          </div>
          <div className='flex gap-2'>
            <CssTextField label='Institute name' name='institute' onChange={handleChange} value={insinfo.current['institute']}/>
            <CssTextField label='University name' name='university' onChange={handleChange} value={insinfo.current['university']}/>
          </div>

        </div>
      }
      {
        toggle && update && 
        insinfo.current.instituteinfos.map((val, index) => {
          return (
            <MarksheetForm key={index} stateinfo={instituteinfo} info='college' update={index} />
          )
        })
      }
      {
        toggle &&
        years.map((val, index) => {
          return (
            <MarksheetForm key={index} stateinfo={instituteinfo} info='college' />
          )
        })
      }
      {toggle &&
        <div className='flex flex-col '>
          <div className='mt-2'><IconButton onClick={() => setYears(prev => [...prev, 0])}><AddIcon /></IconButton> Add Year</div>
          <div className='flex self-end'>
            <Button onClick={handleSave} variant="contained" color="success">Save Details</Button>
          </div>

        </div>}
    </div>
  )
}

export default InstituteForm
