import React, { useContext, useEffect, useRef, useState } from 'react'
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
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade'
import CertBox from '../../components/CertBox'

const fetcher = async (...args) => {
    const resp = await axios.get(...args)
    console.log(resp.status);
    if (resp.status === 204) throw new Error('No content available')
    console.log(resp.data.resp);
    return resp.data.resp;
}


function Certificates() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const classNames = 'overflow-y-scroll element-class max-h-[90%] scrollbar-hide p-4'
    const { student } = useContext(userContext)
    const { data, isLoading, error } = useSWR(`${url}/student/certificate/${student.uid}`, fetcher)

    if (error) {
        console.log(error.message)
        return (
            <NoDataLoader message={error?.message} />
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
            <Header title='CERTIFICATES' H='h2' subtitle={`${student.name}'s Certificates`} />
            <div className='grid md:grid-cols-3 grid-cols-1 gap-4 '>
                {
                    data.map((certificate, index) => (
                        <div className=''>
                            <Box
                                gridColumn="span 6"
                                backgroundColor={colors.primary[400]}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                p="30px 0"
                            >
                                <CertBox
                                    isReq={false}
                                    title={`Course: ${certificate.course}`}
                                    subtitle={`Organisation : ${certificate.organisation}`}
                                    subsubtitle={`Duration : ${certificate.duration}`}
                                    subs="Link: "
                                    subsubsubtitle={`${certificate.link}`}
                                    link={certificate.link}
                                />

                            </Box>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Certificates
