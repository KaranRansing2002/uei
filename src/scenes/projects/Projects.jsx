import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../App'
import GitHubCalendar from 'react-github-calendar'
import Header from '../../components/Header';
import axios from 'axios';
import Profile from '../profile-forms/Profile';
import url from '../../url';
import GitProj from './GitProj';
import useSWR from 'swr'
import loader from '../../assets/load.svg'


const fetcher = async (...args) => {
    const resp = await axios.get(...args);
    return resp.data.resp;
}

const gtFetcher = async (...args) => {
    const resp = await axios.get(...args);
    return resp.status != 404 ? resp.data : []
}

function Projects() {
    const { student } = useContext(userContext)
    const githubUserName = student.additionalInfo.github?.split('https://github.com/')[1];
    console.log(student.additionalInfo,githubUserName)

    const { data, isLoading: gtLoading, error: gtError } = useSWR(`https://api.github.com/users/${githubUserName}/repos?sort=updated`, gtFetcher);

    const [selected, setSelected] = useState([]);

    const { data: projs, isLoading, error } = useSWR(`${url}/project/${student.uid}`, fetcher);

    useEffect(() => {
        if (!isLoading && !error && projs) {
            setSelected(projs.projects.map(ob => ob.id))
        }
    }, [projs])

    if (isLoading || gtLoading) {
        return <div className='grid place-items-center h-full'>
            <img className='h-72' src={loader} />
        </div>
    }


    const handleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(p => p.filter(ob => ob != id));
        }
        else setSelected(p => [...p, id]);
    }



    console.log(projs, data)
    function findDescById(id) {
        const Projects = projs.projects;
        for (let i = 0; i < Projects.length; i++) {
            if (Projects[i].id === id) {
                return Projects[i].desc;
            }
        }
        return []; // If ID is not found
    }

    return (
        <div className='p-2 overflow-y-scroll element-class max-h-[90%] scrollbar-hide'>
            <Header title='PROJECTS' subtitle='Projects from github' />
            <div className='p-4'>
                <GitHubCalendar username={githubUserName} />
                <div className='flex flex-col gap-2 my-2'>
                    <div className='flex gap-2 flex-wrap max-h-72 overflow-y-scroll'>
                        {
                            data.map((val, index) => (
                                <div key={index} className={`rounded p-2 flex items-center h-8 bg-${selected.includes(val.id) ? 'green-500' : '[#0081ff]'} cursor-pointer transition-colors duration-500 ease-in-out hover:bg-green-500`} onClick={() => handleSelect(val.id)}>{val.name}</div>
                            ))
                        }
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    {
                        data.map((val, index) => (
                            selected.includes(val.id) && <GitProj val={val} desc={findDescById(val.id)} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Projects
