import React, { useEffect, useReducer, useRef, useState } from 'react';
import InputForm from '../../components/InputForm';
import axios from 'axios'
import { Button, Icon, IconButton, TextField } from '@mui/material';
import Header from '../../components/Header';
import schoollogo from '../../assets/schoollogo.png'
import AddIcon from '@mui/icons-material/Add';
import { CssTextField } from './textfield';
import MarksheetForm from '../../components/MarksheetForm';

function SchoolForm() {

  const [toggle, setToggle] = useState(false);
  const [classes, setClasses] = useState([0]);

  const schoolInfo = useRef([]);

  const handleSave = () => {
    console.log(schoolInfo.current);
  }

  return (
    <div className={`m-2 border border-slate-400 p-4 flex flex-col gap-2`}>
      <div className=''><Header mb='10px' title="SCHOOL LEVEL" subtitle={"your school qualifications from class 1 to 12"} H={"h3"} /></div>
      <div><Button onClick={() => setToggle((prev) => !prev)} variant="contained" sx={{ backgroundColor: "#0081ff" }} >Add details</Button></div>
      <div className='overflow-y-auto max-h-screen'>
        {toggle &&
          classes.map((obj, index) => <MarksheetForm key={index} stateinfo={schoolInfo} info='school' />)
        }
        {toggle && <div className='mt-2'><IconButton onClick={() => setClasses(prev => [...prev, 0])}><AddIcon /></IconButton> Add Class</div>}
      </div>
      <div className='flex flex-col '>
        {toggle &&
          <div className='flex self-end'>

            <Button onClick={handleSave} variant="contained" color="success">Save Details</Button>
          </div>
        }
      </div>
    </div>
  )
}

export default SchoolForm
