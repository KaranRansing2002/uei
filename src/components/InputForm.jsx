import React, { useEffect, useReducer, useRef, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { tokens } from '../theme';
import { Tooltip, Typography, useTheme } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Calendar } from 'react-date-range';
import { DateRangePicker } from 'react-date-range';
import AddIcon from '@mui/icons-material/Add';


const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#9eb9cf',
    },
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
            borderColor: '#9eb9cf',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#9eb9cf ',
        },
    },
});

// const semSet = new Set()
const NameClass = 'bg-transparent border border-blue-200 w-16 text-center m-1';
function SemDetails(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { sems, dispatch, state, classIndex,aggregate,setAggregate} = props
    const [done, setDone] = useState(false)
    const semSet = useRef(new Set());
    useEffect(() => {
        if (!semSet.current.has(sems)) {
            semSet.current.add(sems);
            dispatch({ type: 'Add_Semester', payload: { sems , classIndex } })
            if (!done) {
                setDone(true)
            }
        }
        // console.log(state)
    }, [dispatch, sems]);
    
    const [count, setCount] = useState(0);

    const subState = useRef([]);

    const [percentage,setPercentage] = useState()

    const handleChange = (event, index) => {
        const { name, value } = event.target;
        subState.current[index] = {
            ...subState.current[index],
            [name] : value
        }
        // console.log(subState)
        if (subState.current[index].marksObtained && subState.current[index].totalMarks) {
            let val = subState.current[index].marksObtained / subState.current[index].totalMarks * 100;
            val = val.toFixed(2);
            subState.current[index] = {
                ...subState.current[index],
                percentage : val
            }
            setPercentage(val);
        }

    }

    const handleSave = () => {
        let agg = 0;
        subState.current.map((subjectDetails) => {
            agg += parseInt(subjectDetails.percentage);
            dispatch({ type: 'Add_Subjects', payload: { semIndex: sems-1, subjectDetails, classIndex } });
        })
        agg = agg / (subState.current.length);
        agg = agg.toFixed(2);
        setAggregate(agg)
        dispatch({type : 'Add_Aggregate',payload : {classIndex,aggregate : agg}})
        console.log("save",state);
    }

    return (
        <div className='flex-1 '>
            <h3 className='text-center m-2 text-lg'>{`Semester ${sems}`}</h3>
            {
                subState.current.map((obj, index) => {
                    return (
                        <div className='flex-1 flex justify-center '>
                            <input className={NameClass} name='subject' onChange={(e)=>handleChange(e,index)} placeholder='subject'/>
                            <Tooltip title='marks obtained'><input className={NameClass} name='marksObtained' onChange={(e)=>handleChange(e,index)}/></Tooltip>
                            <Tooltip title='total marks'><input className={NameClass} name='totalMarks' onChange={(e) => handleChange(e, index)} /></Tooltip>
                            <Tooltip title='percentage'><h3 className={NameClass}>{subState.current[index].percentage}%</h3></Tooltip>
                        </div>
                    )
                })   
            }
            <div className='flex items-center'>
                <IconButton onClick={() => { subState.current.push({}); setCount((counts)=>counts+1) } }>
                    <AddIcon />
                </IconButton>
                <h3>add subjects</h3>
            </div>
            {subState.current.length>0 && <div className='flex justify-center'><Button onClick={handleSave} sx={{color:colors.grey[100],backgroundColor : colors.blueAccent[600]}} variant='outlined'>Save</Button></div>}
        </div>
    )
}


function InputForm(props) {
    const [toggle, setToggle] = useState(false)
    const { ClassN, state, dispatch, year} = props
    
    const Class = ClassN
    useEffect(() => {
        if (Class) {
            dispatch({ type: 'Add_Class', payload: { Class : Class+1 } });
        }
        else {
            dispatch({ type: 'Add_Year', payload: { year : year } });
        }
    }, [ClassN, dispatch,year]);

    const [aggregate,setAggregate] = useState(0)

    return (
        <div className='mt-2 border p-4 '>
            <div className='flex  gap-2 w-full '>
                <div className='border border-slate-400 w-28 text-slate-300 text-lg p-2 rounded flex justify-center items-center'>{`${year==undefined ? 'Class' : 'Year'} ${year==undefined ? Class+1 : year}`}</div>
                {/* <CssTextField id="custom-css-outlined-input" value={`class ${Class}`} sx={{width : "100px"}} /> */}
                <CssTextField label="Aggreagate" id="custom-css-outlined-input" value={aggregate} sx={{ width: "100px", fontSize : "100px" }} />
                <div className='flex'>
                    <IconButton color="secondary" aria-label="upload picture" component="label">
                        <input hidden accept="pdf/*" type="file" />
                        <PhotoCamera />
                    </IconButton>
                </div>
            </div>

            <h3 className='m-1 cursor-pointer' onClick={() => setToggle(x => !x)}>Expand</h3>

            {toggle &&
                <div>
                    <input type='date' className='border border-blue-200 bg-transparent' />
                    <div className='h-auto flex '>
                        <SemDetails sems={1} dispatch={dispatch} state={state} classIndex={ClassN ? ClassN : year} aggregate={aggregate} setAggregate={setAggregate}/>
                        <SemDetails sems={2} dispatch={dispatch} state={state} classIndex={ClassN ? ClassN : year} aggregate={aggregate} setAggregate={setAggregate}/>
                    </div>
                </div>
            }
        </div>
    )
}

export default InputForm
/*
 
                    {
                        subs.map((val) => {
                            return(
                            <div className='flex wrap gap-2 w-60'>
                                <input className='bg-transparent border border-blue-200 w-24 text-center' placeholder='subject' />
                                <input className='bg-transparent border border-blue-200 w-16 text-center' type="number" />
                            </div> )
                        })     
                    }
                <div className='flex items-center'>
                        <IconButton onClick={()=>setSubs((old)=>[...old,"sd"])}>
                            <AddIcon/>   
                        </IconButton> 
                        <h3>add subjects</h3>   
                    </div>
*/