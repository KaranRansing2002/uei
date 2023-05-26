import { Button, IconButton, Typography } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from '../../components/Header'
import { CssTextField } from './textfield'
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios'
import url from '../../url';
import { userContext } from '../../App';
import SnackbarL from '../../components/SnackbarL';

const Experience = ({handleAddExps,mobj,setOpen}) => {
    const Exp = useRef({
        company: mobj!=undefined ? mobj.company : '',
        position: mobj!=undefined ? mobj.position : '',
        yoe: mobj!=undefined ? mobj.yoe : '',
        desc : mobj!=undefined ? mobj.desc : []
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
                <CssTextField label="Years of Exp" type='number' name='yoe' value={Exp.current.yoe} onChange={handleExp}/>
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
                <Button onClick={mobj != undefined ? () => { setOpen(true);mobj = Exp.current } : ()=>handleAddExps(Exp.current)} variant='outlined' sx={{width : '100px',color : 'white' , backgroundColor : '#0082ff'}}>save</Button>
            </div>
        </div> 
    )
}

let prevObj = {};

function WorkExp() {
    const [field, setField] = useState("Work-Exp");
    const [update, setUpdate] = useState(false);
    const [state, setState] = useState({
        field: '',
        exps : []
    })

    const { headerToken, uid } = useContext(userContext)

    const [expsArray, setExpsArray] = useState([0]);

    useEffect(() => {
        try {
            const getDetails = async () => {
                const resp = await axios.get(`${url}/work/${uid}`, {
                    headers: {
                        authorization : `Bearer ${headerToken}`
                    }
                })
                console.log(resp.data.resp);
                if (resp.data.resp != undefined) {
                    // console.log("sdkfn")
                    prevObj = resp.data.resp;
                    setExpsArray([])
                    setUpdate(true);
                }
            }
            getDetails();
        } catch (error) {
            console.log(error);
        }
    },[])

    const handleAddExps = (newExpObj) => {
        const isDuplicate = state.exps.some((exp) => exp.id === newExpObj.id);
        if (!isDuplicate) {
          setState(prevState => {
            return {
              ...prevState,
              exps: [...prevState.exps, newExpObj]
            };
          });
        }
        setOpen(true)
    };
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

    const handleSave = async() => {
        console.log(state);
        const resp = await axios.post(`${url}/work`, { uid: uid, ...state }, {
            headers: {
                authorization : `Bearer ${headerToken}`
            }
        })
        console.log(resp);
        setOpen(true)
    }

    const [desc, setDesc] = useState('');

    const [open, setOpen] = useState(false);


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
            update && prevObj?.exps?.map((obj, index) => (
                <Experience key={index} mobj={prevObj.exps[index]} setOpen={setOpen} />  
            ))     
        }  
        {
            expsArray.map((obj, index) => (
                <Experience key={index} handleAddExps={handleAddExps}/>   
            ))      
        }  
        <div className='flex flex-col mt-2'>
            <div className='flex self-end'>
                <Button onClick={handleSave} variant="contained" color="success">Save Details</Button>
            </div>
        </div>
        <SnackbarL title='Details saved successfully' open={open} setOpen={setOpen} />
    </div>
  )
}

export default WorkExp

