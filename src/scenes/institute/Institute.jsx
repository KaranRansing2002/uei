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
    return resp.data.resp;
}

function Institute() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const classNames = 'overflow-y-scroll element-class max-h-[90%] scrollbar-hide p-4'

    const { student } = useContext(userContext);
    const { data, isLoading, error } = useSWR(`${url}/institute/${student.uid}`, fetcher)
    const [lineData, setLineData] = useState(null)

    const [currentClass, setCurrentClass] = useState();
    const [currentYear, setCurrentYear] = useState()
    const [totalAgg, setTotalAgg] = useState()
    const [bestYear, setBestYear] = useState();

    useEffect(() => {
        if (data && !error) {
            let obj = [],sem=1,agg=0,maxAgg=0,best={};
            for (let x of data.instituteinfos) {
                let c = parseFloat(x.aggregate.split(" ")[0]);
                agg += c;
                if (c >= maxAgg) {
                    maxAgg = c;
                    best = { ...x };
                }
                obj.push({
                    Class: `Semester ${sem}`,
                    aggregate: x.semesters[0].Aggregate
                })
                obj.push({
                    Class: `Semester ${sem+1}`,
                    aggregate: x.semesters[1].Aggregate
                })
                setCurrentYear(x);
                sem += 2;
            }
            agg = agg / data.instituteinfos.length;
            console.log(best,maxAgg)
            setBestYear(best);
            setTotalAgg(agg);
            setLineData([...obj]);
            setCurrentClass(data.instituteinfos[0]);
        }
    }, [data])

    if (error) {
        console.log(error.message)
        return (
            <NoDataLoader />
        )
    }

    if (isLoading || !data) {
        return (
            <div className='flex justify-center'>
                <Loader />
            </div>
        )
    }

    console.log( currentClass,data);
    
    const handleSelect = (classData) => {
        console.log(classData)
        setCurrentClass(classData);
    }

    return (
        <div className={classNames}>
            <Header title='INSTITUTE' subtitle={`${student.name}'s institute/college history and records`} />
            <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 mb-2'>
                <div className={`bg-[${colors.primary[400]}] p-4`}>
                    <div className='flex gap-4'>
                        <Typography color={colors.greenAccent[100]} sx={{textDecoration: 'underline'}} variant="h5" fontWeight="600">DEGREE : {data.degree.toUpperCase()}</Typography>
                        <Typography color={colors.greenAccent[100]} sx={{textDecoration: 'underline'}} variant="h5" fontWeight="600">COURSE : {data.course.toUpperCase()}</Typography>
                    </div>
                    <Typography color={colors.greenAccent[100]} sx={{textDecoration: 'underline'}} variant="h5" fontWeight="600">UNIVERSITY : {data.university.toUpperCase()}</Typography>
                    <Typography color={colors.greenAccent[100]} sx={{textDecoration: 'underline'}} variant="h5" fontWeight="600">INSTITUTE : {data.institute.toUpperCase()}</Typography>
                </div>
                <div className={`bg-[${colors.primary[400]}] p-4`}>
                    <Typography color={colors.greenAccent[100]}  variant="h5" fontWeight="600">CURRENT YEAR : {currentYear?.Class.toUpperCase()}</Typography>
                    <Typography color={colors.greenAccent[100]}  variant="h5" fontWeight="600">CURRENT AGGREGATE : {currentYear?.aggregate.toUpperCase()}</Typography>
                    <Typography color={colors.greenAccent[100]}  variant="h5" fontWeight="600">BEST YEAR : {bestYear?.Class?.toUpperCase()} ({bestYear?.aggregate})</Typography>
                    <Typography color={colors.greenAccent[100]} variant="h5" fontWeight="600">TOTAL AGGREGATE TILL NOW : {totalAgg} SGPA</Typography>
                </div>
            </div> 
            <div className='flex flex-col gap-2 my-2'>
                <div className='grid grid-cols-4 gap-4  max-h-72 '>
                    {
                        data.instituteinfos.map((val, index) => (
                            <div key={index} className={`rounded p-2 flex items-center h-8 bg-${currentClass?.Class==val.Class ? 'green-500' : '[#0081ff]'} cursor-pointer transition-colors duration-500 ease-in-out hover:bg-green-500`} onClick={() => handleSelect(val)}>{val.Class}</div>
                        ))
                    }
                </div>
            </div>
            <div className={`flex justify-center w-full mt-4`}>
                <div className={`flex w-full bg-[${colors.primary[400]}]`}>{lineData && <Histogram data={lineData} />}</div>
            </div>
            <div className='mt-2'>
                <DisplayInfo data={currentClass} title={`INSTITUTE : ${data?.institute.toUpperCase()}`}/>
            </div>
        </div>
    )
}

export default Institute
