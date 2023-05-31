import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../App'
import useSWR from 'swr'
import url from '../../url';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header';
import LineChart from '../../components/LineChart';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DashLoader from '../dashboard/DashLoader';
import NoDataLoader from '../NoneData/NoDataLoader';
import BarGraph from '../../components/BarGraph';
import Histogram from '../../components/Histogram';
import MarksheetForm from '../../components/MarksheetForm';
import DisplayInfo from '../../components/DisplayInfo';


const fetcher = async (...args) => {
    const resp = await axios.get(...args)
    console.log(resp.status);
    if (resp.status === 204) throw new Error('No content available')
    return resp.data.resp.schoolDetails;
}

function School() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const classNames = 'overflow-y-scroll element-class max-h-[90%] scrollbar-hide p-4'

    const { student } = useContext(userContext);
    const { data, isLoading, error } = useSWR(`${url}/school/${student.uid}`, fetcher)
    const [lineData, setLineData] = useState(null)

    const [currentClass, setCurrentClass] = useState();

    useEffect(() => {
        if (data && !error) {
            setLineData(data.map((school, index) => {
                const aggregate = school.aggregate;
                const isSGPA = aggregate.includes('sgpa');

                if (isSGPA) {
                    const sgpaValue = parseFloat(aggregate.split(' ')[0]);
                    const percentage = sgpaValue * 9.5;
                    return {
                        Class: school.Class,
                        aggregate: `${percentage} percentage`,
                    };
                } else {
                    return {
                        Class: school.Class,
                        aggregate,
                    };
                }
            }))
            setCurrentClass(data[0]);
        }
    }, [data])

    if (error) {
        console.log(error.message)
        return (
            <NoDataLoader />
        )
    }

    if (isLoading) {
        return (
            <div className='flex justify-center'>
                <Loader />
            </div>
        )
    }

    console.log( currentClass);
    
    const handleSelect = (classData) => {
        console.log(classData)
        setCurrentClass(classData);
    }

    return (
        <div className={classNames}>
            <Header title='SCHOOL' subtitle={`${student.name}'s school history and records`} />
            <div className='flex flex-col gap-2 my-2'>
                <div className='grid sm:grid-cols-6 md:grid-cols-12 grid-cols-3 gap-4  max-h-72 '>
                    {
                        data.map((val, index) => (
                            <div key={index} className={`rounded p-2 flex items-center h-8 bg-${currentClass?.Class==val.Class ? 'green-500' : '[#0081ff]'} cursor-pointer transition-colors duration-500 ease-in-out hover:bg-green-500`} onClick={() => handleSelect(val)}>{val.Class}</div>
                        ))
                    }
                </div>
            </div>
            <div className={`flex bg-[${colors.primary[400]}] max-w-[99%]`}>
                {lineData && <Histogram data={lineData} />}
            </div>
            <div className='mt-2'>
                <DisplayInfo data={currentClass} title={`SCHOOL : ${currentClass?.school.toUpperCase()}`}/>
            </div>
        </div>
    )
}

export default School
