import React, { useContext, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { userContext } from '../../App'
import useSWR from 'swr'
import url from '../../url'
import NoDataLoader from '../NoneData/NoDataLoader'
import axios from 'axios'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Loader from '../../components/Loader/Loader'
import DashLoader from '../dashboard/DashLoader'
import { CssTextField } from '../profile-forms/textfield'

const fetcher = async (...args) => {
  const resp = await axios.get(...args)
  console.log(resp.status);
  if (resp.status === 204) throw new Error('No content available')
  return resp.data.resp;
}

function Experience() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const classNames = 'overflow-y-scroll element-class max-h-[90%] scrollbar-hide p-4'
  const { student } = useContext(userContext)
  const { data, isLoading, error } = useSWR(`${url}/work/${student.uid}`, fetcher)
  const [expps,setExpps] = useState()

  useEffect(() => {
    if (data && data.exps.length < 2) {
      console.log(data.exps);
      data.exps.push({ ...data.exps[0] });
      data.exps.push({ ...data.exps[0] });
      data.exps.push({ ...data.exps[0] });
    }
  },[data])

  if (error) {
    console.log(error.message)
    return (
      <NoDataLoader message={error.message} />
    )
  }

  if (isLoading || !data) {
    return (
      <div className={`h-[90%] w-full bg-[${colors.primary[400]}] grid place-items-center`}>
        <DashLoader />
        ...Loading
      </div>
    )
  }

  

  console.log(data)

  return (
    <div className={classNames}>
      <Header title='EXPERIENCE' H='h2' subtitle={`${student.name}'s Work/Internship history and Records`} />
      <div className='grid grid-cols-1 gap-4'>
        {/* <Typography color={colors.grey[100]} sx={{textDecoration : 'underline'}} variant="h4" fontWeight="600">{data.field}</Typography> */}
        <div><Button variant='contained' color='success'>{data.field}</Button></div>
        {
          data.exps.map((exp, ind) => (
            <div className={`bg-[${colors.primary[400]}] flex flex-col gap-2 p-4 border border-blue-400`}>
              <div className='flex gap-2 flex-wrap'>
                <CssTextField label="Company-Name" name='company' value={exp.company}  />
                <CssTextField label="Position / Role" name='position' value={exp.position}  />
                <CssTextField label="Years of Exp" type='number' name='yoe' value={exp.yoe}  />
                {/* <CssTextField label="site-link"/> */}
              </div>
              <div className='grid gap-2 '>
                {/* <form onSubmit={(e) => { e.preventDefault(); Exp.current["desc"].push(desc); setDesc(''); setUpd(prev => prev + 1) }}><CssTextField sx={{ width: `80%` }} label="description" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="type and press enter (write atmost 5)" /></form> */}
                <ul className='' style={{ listStyleType: 'disc', paddingLeft: "1.3rem" }}>
                  {
                    exp?.desc?.map((obj, index) => (
                      <li key={index} className="text-base">{obj}</li>
                    ))
                  }
                </ul>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Experience
