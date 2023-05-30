import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../App'
import useSWR from 'swr'
import url from '../../url';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header';
import LineChart from '../../components/LineChart';

const fetcher = async (...args) => {
    const resp = await axios.get(...args)
    return resp.data.resp.schoolDetails;
} 

function School() {
    const { student } = useContext(userContext);
    const { data, isLoading, error } = useSWR(`${url}/school/${student.uid}`, fetcher)
    const [lineData,setLineData] = useState({})

    const [selected,setSelected] = useState([])

    useEffect(() => {
        if (data && !error) {
            setLineData(data.map((item, index) => {
                return {
                  x: item.Class,
                  y: parseFloat(item.aggregate.split(" ")[0])
                };
              }))
        }
    },[data])

    if (isLoading) {
        return (
            <div className='flex justify-center'>
                <Loader />
            </div>
        )
    }
    

    return (
        <div className='p-4'>
            <Header title='SCHOOL' subtitle={`${student.name}'s school history and records`} />
            <div className='flex flex-col gap-2 my-2'>
                <div className='flex gap-2 flex-wrap max-h-72 '>
                    {
                        data.map((val, index) => (
                            <div key={index} className={`rounded p-2 flex items-center h-8 bg-${selected.includes(val.Class) ? 'green-500' : '[#0081ff]'} cursor-pointer transition-colors duration-500 ease-in-out hover:bg-green-500`} onClick={() => handleSelect(val.Class)}>{val.Class}</div>
                        ))
                    }
                </div>
            </div>
            <div>
                <LineChart mainData={lineData} />
            </div>
        </div>
    )
}

export default School
