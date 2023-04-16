import { Button, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/Header'
import { CssTextField } from './textfield'
import AddIcon from '@mui/icons-material/Add';


const Experience = ({handleAddExps}) => {
    const Exp = useRef({
        company: '',
        position: '',
        yoe: '',
        desc : []
    })

    const [upd, setUpd] = useState(0);
    
    const handleExp = (e) => {
        const { name, value } = e.target;
        Exp.current[name] = value;
        setUpd(prev => prev + 1);
    }

    const [desc, setDesc] = useState('');

    const [expsArray, setExpsArray] = useState([]);

    return (
        <div className='flex flex-col gap-2 border pt-4 border-slate-400 p-2'>
            <div className='flex gap-2 flex-wrap'>
                <CssTextField label="Company-Name" name='company' value={Exp.current.company} onChange={handleExp}/> 
                <CssTextField label="Position / Role" name='position' value={Exp.current.position} onChange={handleExp}/> 
                <CssTextField label="Years of Exp" name='yoe' value={Exp.current.yoe} onChange={handleExp}/>
                {/* <CssTextField label="site-link"/> */}
            </div>  
            <div className='grid gap-2 '>
                <form  onSubmit={(e) => { e.preventDefault(); Exp.current["desc"].push(desc); setDesc(''); setUpd(prev=>prev+1)}}><CssTextField sx={{width : `80%`}} label="description" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder="type and press enter (write atmost 5)" /></form>  
                <ul className='' style={{ listStyleType: 'disc',paddingLeft : "1.3rem" }}>
                {
                    Exp.current.desc.map((obj, index) => (
                    <li key={index} className="text-base">{obj}</li>
                    ))
                }
                </ul>
            </div>  
            <div className=''>
                <Button onClick={()=>handleAddExps(Exp.current)} variant='outlined' sx={{width : '100px',color : 'white' , backgroundColor : '#0082ff'}}>save</Button>
            </div>
        </div> 
    )
}

function WorkExp() {
    const [field, setField] = useState("Work-Exp");

    const [state, setState] = useState({
        field: '',
        exps : []
    })

    const handleAddExps = (newExpObj) => {
        setState(prevState => {
            return {
              ...prevState,
              exps: [...prevState.exps, newExpObj]
            }
          });
    }
    useEffect(() => {
        setState((prev) => {
            return {
                ...prev,
                field : field
            }
        })
    }, [field])
    
    const Exp = useRef({
        company: '',
        position: '',
        yoe: '',
        desc : []
    })

    const [upd, setUpd] = useState(0);
    
    const handleExp = (e) => {
        const { name, value } = e.target;
        Exp.current[name] = value;
        setUpd(prev => prev + 1);
    }

    useEffect(() => {
        console.log("state", state);
    },[state])

    const [desc, setDesc] = useState('');

    const [expsArray, setExpsArray] = useState([]);


  return (
      <div className='m-2 p-4 border border-slate-400 flex flex-col gap-2'>
        <Header title="WORK / INTERNSHIPS" H="h3" subtitle="Your work-exp job-role and description" />
        <div className='flex gap-4 mb-2'>
            <Button onClick={()=>setField("Work-Exp")} variant="filled" sx={field === 'Work-Exp' ? { backgroundColor: '#0081ff'} : {}} >Work-Exp</Button>
            <Button onClick={()=>setField("Internship")} variant="filled" sx={field === 'Internship' ? { backgroundColor: '#0081ff'} : {}} >Internship</Button>
        </div>
        <div className='flex items-center'>
            <IconButton onClick={()=>setExpsArray(prev=>[...prev,1])}>
                <AddIcon />
            </IconButton>  
            <Typography>Add Experience</Typography>  
        </div>
        {
            expsArray.map((obj, index) => (
                <Experience handleAddExps={handleAddExps}/>   
            ))      
        }  
    </div>
  )
}

export default WorkExp

