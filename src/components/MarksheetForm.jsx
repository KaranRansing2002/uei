import PhotoCamera from '@mui/icons-material/PhotoCamera';
import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { CssTextField } from '../scenes/profile-forms/textfield'
import Selector from './Selector';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import Header from './Header';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SnackbarL from './SnackbarL';
import { userContext } from '../App';
import FileBase64 from 'react-file-base64';
import imageCompression from 'browser-image-compression';

const Semester = ({ aggOption, sem, dispatch,updateObj }) => {
    const [agg, setAgg] = useState(updateObj!=undefined ? parseFloat(updateObj.semesters[sem-1].Aggregate.split(' ')[0]) : 0);
    const subjects = useRef(updateObj!=undefined ? updateObj.semesters[sem-1].subjects : []);
    const [updatecnt, setUpdateCnt] = useState(0);

    const handleAddSubject = () => {
        subjects.current.push({ subject: '', marks : '' })
        setUpdateCnt(prev => prev + 1);
    }

    const handleDeleteSub = (index) => {
        subjects.current = subjects.current.filter((obj, ind) => ind != index);
        setUpdateCnt(prev => prev + 1);
    }

    const handleChange = (e, index) => {
        subjects.current[index]['marks'] = e.target.value;
        if (aggOption != 'grade') {
            let aggr = 0;
            subjects.current.map(obj => { aggr += parseFloat(obj['marks']); });
            // console.log(aggr);
            setAgg(aggr / Math.max(subjects.current.length, 1));
        }

        setUpdateCnt(prev => prev + 1);
    }

    useEffect(() => {
        console.log(subjects);
    },[subjects])

    useEffect(() => {
        dispatch({ type: 'Add_Semester', payload: { semIndex: sem - 1, semester: { 'Aggregate': `${agg} ${aggOption}`, subjects: subjects.current } } })
    }, [agg])

    return (
        <div className='flex-1 flex flex-col gap-2 '>
            <div className='flex my-2 mt-4 gap-2 items-center justify-center'>
                <Header title={`Semester ${sem}`} H='h5' mb={"0px"} />
                <CssTextField InputLabelProps={agg > 0 ? { shrink: true } : {}} label='Agg.' size='small' sx={{ width: '70px' }} value={agg} onChange={(e) => setAgg(e.target.value)} />
            </div>
            <div className='ml-2 mb-2'>
                {
                    subjects.current.map((obj, index) => (
                        <div key={index} className='flex gap-4 justify-center my-2 items-center'>
                            <CssTextField label='subject' size='small' sx={{ width: '100px' }} value={subjects.current[index]['subject']} onChange={(e) => { subjects.current[index]['subject'] = e.target.value; setUpdateCnt(prev => prev + 1); }} />
                            <CssTextField label={aggOption} size='small' sx={{ width: '100px' }} value={subjects.current[index]['marks']} onChange={(e) => handleChange(e, index)} />
                            <Tooltip title='delete'><IconButton onClick={() => handleDeleteSub(index)}><DeleteOutlineIcon /></IconButton></Tooltip>
                        </div>
                    ))
                }
                <div>
                    <IconButton onClick={handleAddSubject}><AddIcon /></IconButton>
                    Add Subject
                </div>
            </div>
        </div>
    )
}

function MarksheetForm({ stateinfo, info, update }) {
    let updateObj = update != undefined ? stateinfo.current[update] : undefined;
    const [expand, setExpand] = useState(false)
    const [Class, setClass] = useState(update!=undefined ? updateObj.Class : '');
    const [aggOption, setAggOption] = useState(update!=undefined ? updateObj.aggregate.split(' ')[1] : 'percentage');
    const [Aggregate, setAggregate] = useState(update!=undefined ? updateObj.aggregate.split(' ')[0] : '');
    const [school, setSchool] = useState(() => {
        if (stateinfo.current.length && stateinfo.current[stateinfo.current.length - 1].school)
            return stateinfo.current[stateinfo.current.length - 1].school
        return '';
    })
    useEffect(() => {
        // console.log(Class, Aggregate);
        if(update) console.log(updateObj)
    },[Class,Aggregate])
    const [open, setOpen] = useState(false);

    const reducer = (state, action) => {
        switch (action.type) {
            case 'Add_Class':
                const { Class } = action.payload;
                return {
                    ...state,
                    Class: Class
                }
            case 'Add_Date':
                const { date } = action.payload;
                console.log(date);
                return {
                    ...state,
                    Date: date
                }
            case 'Add_Image':
                const { image } = action.payload;
                return {
                    ...state,
                    image : image
                }
            case 'Add_Aggregate':
                const { aggregate,aggOption } = action.payload
                console.log(aggOption);
                const nagg = `${aggregate} ${aggOption}`
                // console.log(aggregate,typeof aggregate)
                return {
                    ...state,
                    'aggregate': nagg
                }
            case 'Add_Semester':
                const { semIndex, semester } = action.payload;
                const newSem = [...state.semesters];
                newSem[semIndex] = semester;
                return {
                    ...state,
                    semesters: newSem
                }
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(reducer, { Class: Class, aggregate: Aggregate, semesters: (update!=undefined ? updateObj.semesters : [{}, {}]),Date : (update!=undefined ? updateObj.Date.toString().substring(0.10) :  new Date()),image : (update!=undefined ? updateObj.image :  undefined)});

    useEffect(() => {
        console.log(Aggregate,aggOption);
        dispatch({ type: 'Add_Aggregate', payload: { aggregate: Aggregate ,aggOption} });
    }, [Aggregate,aggOption])

    useEffect(() => {
        dispatch({ type: 'Add_Class', payload: { Class } })
    }, [Class])

    const handleChange = (e) => {
        setAggregate(e.target.value);
    }
    const handleSave = async() => {
        let isPresent = false;
        for (let i = 0; i < stateinfo.current.length; i++) {
            if (stateinfo.current[i].Class == state.Class) {
                info=='school' ? stateinfo.current[i] = { ...state,school : school } : stateinfo.current[i] = { ...state}
                // console.log("here x : ",x)
                isPresent = true;
                break;
            }
        }
        if (!isPresent) {
            if (info == 'school') {
                update!=undefined ? stateinfo.current[update]={ ...state, school } :  stateinfo.current.push({ ...state, school });
            } else {
                update!=undefined ? stateinfo.current[update]={ ...state} :  stateinfo.current.push({ ...state });
            }
        }
        console.log(stateinfo.current);
        // console.log(stateinfo.current.pop());
        setOpen(true);
    }

    return (
        <div className='border border-slate-400 p-4 flex flex-col gap-2 mb-2'>
            <div className='sm:flex sm:gap-2 grid grid-cols-2 gap-y-2 auto-rows-max  '>
                <div><CssTextField label={`Enter ${info == 'college' ? 'Year' : 'Class'}`} sx={{ width: "120px", fontSize: "100px" }} placeholder={`ex ${info == 'college' ? 'Year' : 'Class'} 1`} value={Class} onChange={(e) => setClass(e.target.value)} /></div>
                <div><CssTextField label="Aggregate" id="custom-css-outlined-input" sx={{ width: "100px", fontSize: "100px" }} value={Aggregate} onChange={handleChange} /></div>
                <div><Selector aggOption={aggOption} setAggOption={setAggOption} /></div>
                <div className='flex items-center ml-auto'>
                    Upload Marksheet
                    <IconButton color="secondary" aria-label="upload picture" component="label" >
                        <div className='bg-yellow-400 w-32 flex hidden'>
                            <FileBase64
                                type="file"
                                multiple={false}
                                style={{height : '10px'}}
                                onDone={({ base64 }) => dispatch({type : 'Add_Image',payload : {image : base64}})}
                            />
                        </div>
                        <PhotoCamera />
                    </IconButton>
                </div>
            </div>
            {info == 'school' && <CssTextField InputLabelProps={school !='' ? { shrink: true } : {}}  label='School Name' sx={{width : '70%'}} value={school} onChange={(e)=>setSchool(e.target.value)}/>}
            <div className='flex gap-2 '>
                <Button variant="filled" size='small' onClick={() => setExpand(prev => !prev)}>Expand <ExpandMoreIcon /></Button>
                <Button variant="filled" size='small' onClick={handleSave}>Save <SaveIcon sx={{ margin: "2px", height: '15px' }} /></Button>
                <input type='date' value={state.Date} className='bg-transparent' onChange={(e)=>dispatch({type : 'Add_Date',payload : {date : e.target.value}})}/>
            </div>

            {
                expand &&
                <div className='border border-slate-400 sm:flex'>
                    <Semester aggOption={aggOption} sem={1} dispatch={dispatch} updateObj={updateObj}/>
                    <Semester aggOption={aggOption} sem={2} dispatch={dispatch} updateObj={updateObj}/>
                </div>
            }
            {
                <SnackbarL title='Class saved successfully' open={open} setOpen={setOpen} />
            }
        </div>
    )
}

export default MarksheetForm
