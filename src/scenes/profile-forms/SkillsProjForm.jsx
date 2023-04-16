import React, { useEffect, useReducer, useRef, useState } from 'react';
import axios from 'axios'
import { Button, Icon, IconButton, TextField, Typography } from '@mui/material';
import Header from '../../components/Header';
import { CssTextField } from './textfield';
import CloseIcon from '@mui/icons-material/Close';
import { getRankValue,getRankName } from './cf-utility';
import Profile from './Profile';
import { intersectionBy } from 'lodash';


const Dsa = ({platform,dispatch}) => {
    const [usernames, setUsernames] = useState([]);
    const [userName, setUserName] = useState('')
    const cp = useRef({
        platform: '',
        usernames: [],
        rating: '',
        tag: '',
        solved : 0
    });

    const mset = useRef(new Set());
    const apiPlatforms = ['Codeforces', 'Leetcode'];

    const [updatecnt, setUpdatecnt] = useState(0);

    useEffect(() => {
        
        cp.current['platform'] = platform;
        cp.current['usernames'] = usernames;
        // console.log(usernames)

        
        if (usernames.length > 0 && platform=='Codeforces') {
            try {
                axios.get(`https://codeforces.com/api/user.info?handles=${usernames[0]};${usernames.length > 1 ? usernames[1] : ''}`)
                    .then((resp) => {
                        const { result } = resp.data
                        cp.current.rating = Math.max(result[0].maxRating, result.length > 1 ? result[1].maxRating : 0);
                        cp.current.tag = getRankName(Math.max(getRankValue(result[0].maxRank), result.length > 1 ? getRankValue(result[1].maxRank) : 0))
                        setUpdatecnt((prev) => prev + 1);
                    });
                    let cnt = 0;
                axios.all(usernames.map(user=>axios.get(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=10000`)))
                    .then(resp => {
                        for (let i = 0; i < resp.length; i++){
                            resp[i].data.result.map((prob) => prob.verdict == 'OK' && cnt++);
                            // console.log(mset.current);
                        }
                        cp.current.solved = cnt;
                        setUpdatecnt((prev) => prev + 1);
                    })
            } catch (error) {
                console.log(error);
            }
        }
        if (usernames.length > 0 && platform == 'Leetcode') {
            axios.get(`https://leetcode-stats-api.herokuapp.com/${usernames[0]}`)
                .then((resp) => {
                    cp.current.rating = 1706;
                    cp.current.solved = resp.data.totalSolved;
                    cp.current.tag = 'NA'
                    setUpdatecnt(prev => prev + 1);
                }).catch((err) => {
                    alert('there may be some issue we are fixing it for leetcode api')
                })
        }
        // console.log(cp.current);
        if(usernames.length > 0 && platform!='') dispatch({ type: 'Add_Obj',payload : {objName : 'dsa' ,objValue : {platform,usernames}} })

    }, [platform, usernames])
    
    const handleDetails = (e) => {
        const { name, value } = e.target;
        cp.current = {
            ...cp.current,
            [name] : value
        }
        // console.log(cp.current);
    }

    return (
        <div className=''> 
            <Header title={platform} H="h4" />
            <div className={`flex flex-col m-2 mb-4 `}>
                <form onSubmit={(e) => { e.preventDefault(); setUsernames((prev) => prev.length < (platform=='Codeforces' ? 2 : 1) ? [...prev, userName] : prev); }}><CssTextField label='username' value={userName} onChange={(e)=>setUserName(e.target.value)}/></form>
                {
                    apiPlatforms.includes(platform) ? 
                        cp.current.usernames.length>0 && <div className='flex flex-col mt-2 border p-4 md:w-[450px]'>
                            <div className='flex'>
                                <h1 className='text-sm font-bold'>Accounts : </h1>
                                {usernames.map((user, index) => {
                                    return(
                                        <div key={index} className=' mx-2 rounded p-1 flex items-center h-8 bg-[#0081ff]'><a className='cursor-pointer' href={`https://codeforces.com/profile/${user}`} target="_blank">{user}</a><span className='ml-2'><CloseIcon sx={{ height: '10px', cursor: 'pointer' }} onClick={() => { const newU = [...usernames]; newU.splice(index, 1); setUsernames(newU); setUpdatecnt(prev=>prev+1)} } /></span></div>
                                    )
                                })}
                            </div>
                            <h1 className='text-sm font-bold'>Rating :  <span className='text-green-400 mx-2'>{cp.current.rating}</span></h1>
                            <h1 className='text-sm font-bold'>Tag : <span className='text-green-400 mx-2'>{cp.current.tag}</span></h1>
                            <h1 className='text-sm font-bold'>Solved : <span className='text-green-400 mx-2'>{cp.current.solved}</span></h1>
                        </div>
                        :
                        <div className=' mt-2 flex flex-wrap gap-2 items-center'>
                            <input className='bg-transparent border border-slate-400 w-20 text-center rounded h-8' name='rating' placeholder='rating' onChange={handleDetails}/>
                            <input className='bg-transparent border border-slate-400 w-20 text-center rounded h-8' name='tag' placeholder='tag' onChange={handleDetails}/>
                            <input className='bg-transparent border border-slate-400 w-20 text-center rounded h-8' name='solved' placeholder='Ques solved' onChange={handleDetails}/>
                        </div>
                }
            </div>
        </div>
    )
}

const Projects = ({mainDispatch}) => {
    const [userName, setUserName] = useState('');
    const [data, setData] = useState([]);
    const [projs,setProjs] = useState([])
    const handleGithub = (e) => {
        e.preventDefault(); 
        axios.get(`https://api.github.com/users/${userName}/repos?sort=updated`)
            .then(resp => {
                console.log(resp.data)
                // resp.data.map((obj,index)=>setProjs((prev)=>[...prev,{name : obj.name,url : obj.url}]))
                setData(resp.status!=404 ?  resp.data : []);
            })
    }
    
    const initialState = { projects: [] };
    const reducer = (state, action) => {
        switch (action.type) {
            case 'handle_project':
                const { id, desc } = action.payload;
                const isPresent = state["projects"].some(obj => obj.id === id);
                if (isPresent) {
                    const newProjects = state["projects"].map(obj => {
                        if (obj.id === id && desc) {
                        // create a new object with updated desc array
                        return { ...obj, desc: [...obj.desc, desc] };
                        } else {
                            return obj;
                        }
                    });
                    // filter out the object if desc is not provided
                    const filteredProjects = newProjects.filter(obj => obj.id !== id || obj.desc.length > 0);
                    return {
                        ...state,
                        projects: filteredProjects
                    };
                }
                else {
                    return {
                        ...state,
                        projects: [...state["projects"], { id: id, desc: [] }]
                    };
                }

            default: 
                return state
            
        }
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // console.log(state);
        mainDispatch({type : 'Add_Projects',payload : {projs : state.projects}})
    },[state,dispatch])

    return (
        <div className='border border-slate-400 mt-2 p-2'>
            <Header title="PROJECTS" H="h4" subtitle={"Link your github or add projects"} />
            <form onSubmit={handleGithub}><CssTextField label='username' value={userName} onChange={(e)=>setUserName(e.target.value)}/></form>
            {userName && 
                <div className='flex flex-col gap-2 my-2'>
                    <h1 className=''>Select atmost 4 of them and write a description..</h1>
                    <div className='flex gap-2 flex-wrap max-h-72 overflow-y-scroll'>
                    {
                        data.map((val, index) => (
                            <div key={index} className={`rounded p-2 flex items-center h-8 bg-${state.projects.some(obj => obj.id === val.id) ? 'green-500' : '[#0081ff]'} cursor-pointer transition-colors duration-500 ease-in-out hover:bg-green-500`} onClick={()=>dispatch({type : 'handle_project',payload : {id : val.id}})}>{val.name}</div>
                        ))
                    }
                    </div>
                </div>
            }
            {userName.length > 0 && data[0] && <div className='grid grid-cols-1 md:grid-cols-1 mt-8 gap-4 my-2 max-h-screen overflow-y-scroll'>
                {intersectionBy(data,state.projects,'id').map((obj, ind) => <Profile key={ind} {...obj} state={state} dispatch={dispatch} />)}
            </div>}
            {(userName.length > 0 && data[0]) ? <Typography variant="h5" color={"#8fcdaf"}>
                ...more <br/>
                Your Github is Successfully linked
            </Typography> : 
                <Typography variant="h5" color={"#8fcdaf"}>
                    Nothing found ! ...
                </Typography>
            }
        </div>
    )    
}

function SkillsProjForm() {
    const [toggle, setToggle] = useState(false)



    const initialState = {
        languages: [],
        frameworks: [],
        tools: [],
        skills: [],
        dsa: [],
        projects : []
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'Add_fields':
                const { name, value } = action.payload;
                if (value === '') return state;
                return {
                    ...state,
                    [name]: [...state[name], value]
                }
            case 'Remove_field':
                const { named, index } = action.payload;
                const newState = { ...state };
                newState[named] = newState[named].slice(0, index).concat(newState[named].slice(index + 1));                console.log(index,newState);
                return newState
            
            case 'Add_Obj':
                const { objName, objValue } = action.payload;
                const platformKey = 'platform'; // Change this to the key you want to check for duplicates
                
                // Check if an object with the same platform key exists in the array
                const ind = state[objName].findIndex(obj => obj[platformKey] === objValue[platformKey]);
                
                if (ind !== -1) {
                    // Replace the existing object with the new one
                    const newArray = [...state[objName]];
                    newArray[ind] = objValue;
                    return {
                    ...state,
                    [objName]: newArray
                    };
                } else {
                    // Add the new object to the array
                    return {
                    ...state,
                    [objName]: [...state[objName], objValue]
                    };
                }
                  
            case 'Add_Projects':
                const { projs } = action.payload;
                return {
                    ...state,
                    projects : projs
                }
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        console.log(state);
    }, [state])

    useEffect(() => {
        
    },[])
    

    const [language, setLanguage] = useState('');
    const [framework, setFramework] = useState('');
    const [tool,setTool] = useState('')
    const [skill, setSkill] = useState('');
    const [stream,setStream] = useState('')
    return (
        <div className='m-2 border border-slate-400 p-4'>
            <div className=''><Header title="SKILLS & PROJECTS" subtitle={"your skillsets and relevant projects "} H={"h3"} /></div>
            <div className='mb-2 text-lg text-green-300 '>Select Stream</div>
            <div className='flex gap-4 mb-2'>
                <Button onClick={() => { setToggle((prev) => true); setStream('cs') } } variant="filled" sx={stream === 'cs' ? { backgroundColor: '#0081ff'} : {}} >Computer Science</Button>
                <Button onClick={() => { setToggle((prev) => true); setStream('other') } } variant="filled" sx={stream === 'other' ? { backgroundColor: '#0081ff'} : {}} >Other</Button>
            </div>
            {
                toggle && stream == 'cs' ? 
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex gap-2 items-center flex-wrap'>
                            <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'Add_fields', payload: { name: 'languages', value: language } }); setLanguage(''); }}><CssTextField label='Prog. languages used' value={language} onChange={(e) => setLanguage(e.target.value)} /></form>
                            {
                                state.languages?.map((obj, index) => {
                                    return <div className='rounded p-2 flex items-center h-8 bg-[#0081ff]'>{obj}<span className='ml-2'><CloseIcon sx={{ height: '15px' }} onClick={() => dispatch({ type: 'Remove_field', payload: { named: 'languages', index } })} /></span></div>
                                })
                            }
                        </div>
                        <div className='flex gap-2 items-center flex-wrap'>
                            <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'Add_fields', payload: { name: 'frameworks', value: framework } }); setFramework(''); }}><CssTextField label='Frameworks/TechStacks' value={framework} onChange={(e) => setFramework(e.target.value)} /></form>
                            {
                                state.frameworks?.map((obj, index) => {
                                    return <div className='rounded p-2 flex items-center h-8 bg-[#0081ff]'>{obj}<span className='ml-2'><CloseIcon sx={{ height: '15px' }} onClick={() => dispatch({ type: 'Remove_field', payload: { named: 'frameworks', index } })} /></span></div>
                                })
                            }
                        </div>
                        <div className='flex gap-2 items-center flex-wrap'>
                            <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'Add_fields', payload: { name: 'tools', value: tool } }); setTool(''); }}><CssTextField label='Tools' value={tool} onChange={(e) => setTool(e.target.value)} /></form>
                            {
                                state.tools?.map((obj, index) => {
                                    return <div className='rounded p-2 flex items-center h-8 bg-[#0081ff]'>{obj}<span className='ml-2'><CloseIcon sx={{ height: '15px' }} onClick={() => dispatch({ type: 'Remove_field', payload: { named: 'tools', index } })} /></span></div>
                                })
                            }
                        </div>
                    </div>
                    <div className='border border-slate-400 p-2'>
                        <Header title={"DSA/CP"} H={"h4"} subtitle="your data-structures and algorithmics skills (press enter to save & search)" />
                            <Dsa dispatch={dispatch} platform="Codeforces" />
                            <Dsa dispatch={dispatch} platform="Leetcode" />
                            <Dsa dispatch={dispatch} platform="Codechef" />
                    </div>
                        
                </div> : 
                <div>
                    <div className='flex gap-2 items-center flex-wrap'>
                        <form onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'Add_fields', payload: { name: 'skills', value: skill } }); setSkill(''); }}><CssTextField label='skill sets' value={skill} onChange={(e) => setSkill(e.target.value)} /></form>
                        {
                            state.skills?.map((obj, index) => {
                                return <div className='border rounded p-2 flex items-center h-8 bg-[#0081ff]'>{obj}<span className='ml-2'><CloseIcon sx={{ height: '15px' }} onClick={() => dispatch({ type: 'Remove_field', payload: { named: 'skills', index } })} /></span></div>
                            })
                        }
                    </div>
                </div>    
            }
            <Projects mainDispatch={dispatch}/>
        </div>
    )
}

export default SkillsProjForm

