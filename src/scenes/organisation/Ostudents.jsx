import React, { useContext, useRef, useState } from 'react'
import { CssTextField } from '../profile-forms/textfield'
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useSWR from 'swr';
import url from '../../url';
import { userContext } from '../../App';
import axios from 'axios'
import NoDataLoader from '../NoneData/NoDataLoader';
import NoDataLoader1 from '../NoneData/NoDataLoader1';
import Header from '../../components/Header';
import DisplayInfo from '../../components/DisplayInfo';

const fetcher = async (...args) => {
  const resp = await axios.get(...args);
  return resp.data.resp;
}

function Ostudents() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user, uid, headerToken } = useContext(userContext);

  const { data, isLoading, error } = useSWR(`${url}/student/all`, fetcher)

  const [selected, setSelected] = useState();

  if (isLoading || error || !data) {
    return (
      <NoDataLoader1 />
    )
  }

  console.log(data,selected);
  return (
    <div className={` m-4 p-4 w-[90%] h-[85%]`}>
      <Header title='STUDENTS' subtitle="student's verification datas"/>
      <div className={` w-[90%] h-[85%]`}>
        <div className='grid grid-cols-3 gap-4'>
          {
            data?.map(obj => (
              <div className={`bg-[${colors.primary[400]}] flex p-4 gap-4 `} onClick={() => setSelected({ ...obj })} >
                <img className='h-8' src={obj.image} />
                <h2>{obj.name}</h2>
                <h3>{obj.uid}</h3>
              </div>  
            ))
          }
          {
            selected && (
              <div className={`bg-[${colors.primary[400]}] mt-4`}>
                  <DisplayInfo data={selected} title={`SCHOOL : ${selected?.school?.toUpperCase()}`}/>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Ostudents
