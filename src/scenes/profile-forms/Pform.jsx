import React, { useEffect, useReducer, useRef, useState } from 'react';
import InputForm from '../../components/InputForm';
import axios from 'axios'
import { Button, Icon, IconButton, TextField } from '@mui/material';
import Header from '../../components/Header';
import schoollogo from '../../assets/schoollogo.png'
import AddIcon from '@mui/icons-material/Add';
import { alpha, styled } from '@mui/material/styles';

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

function Pform() {

  ///////////////////////////////////school//////////////////////////////////////////////////////////
  const initialState = {
    classes: [],
  };
  const ClassSet = new Set();
  const reducer = (state, action) => {
    switch (action.type) {
      case 'Add_Class': {
        const { Class } = action.payload
        const ok = ClassSet.has(Class);
        ClassSet.add(Class)
        const newClasses = [...state.classes];
        if (!ok) {
          newClasses.push({Class: Class,semesters : [] })
        }
        return {
          ...state,
          classes: newClasses
        }
      }
      case 'Add_Semester': {
        let { sems, classIndex } = action.payload;
        const newClasses = [...state.classes];
        console.log("semester",classIndex)
        newClasses[classIndex] = {
            ...newClasses[classIndex], 
            semesters: [...newClasses[classIndex].semesters, {sem : sems,subjects : []}],
        };
        return {  
          ...state,
          classes: newClasses
        }
      }
      case 'Add_Subjects': {
        const { subjectDetails, classIndex, semIndex } = action.payload;
        const newClasses = [...state.classes];
        // console.log(classIndex,newClasses)
        const newSubjects = newClasses[classIndex].semesters[semIndex].subjects
        let ok = false;
        for (let i = 0; i < newSubjects.length; i++){
          if (newSubjects[i].subject == subjectDetails.subject) {
            newSubjects[i] = subjectDetails;
            ok = true;
            break;
          }
        }
        if (ok) {
          newClasses[classIndex].semesters[semIndex] = {
            ...newClasses[classIndex].semesters[semIndex],
            subjects : newSubjects
          }
        }
        else {
          newSubjects.push(subjectDetails)
          newClasses[classIndex].semesters[semIndex] = {
            ...newClasses[classIndex].semesters[semIndex],
            subjects : newSubjects
          }
        }
      }
      case 'Add_Aggregate':
        const { aggregate, classIndex } = action.payload;
        const newClasses = [...state.classes];
        newClasses[classIndex].aggregatePercentage = aggregate;
        return {
          ...state,
          classes: newClasses
        }
        
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [classes, setClasses] = useState(() => {
    let arr = [];
    for (let i = 1; i <= 12; i++) {
      arr.push(i);
    }
    return arr;
  })
  ////////////////////////////school-end////////////////////////////////////////////////////////

  const insInitialState = {
    years: [],
    degree: '',
    course : '',
    instituteName: '',
    universityName : ''
  }
  const yearSet = new Set();
  const Ireducer = (state, action) => {
    switch (action.type) {
      case 'Add_Year': {
        const { year } = action.payload
        const ok = yearSet.has(year);
        yearSet.add(year)
        const newClasses = [...state.years];
        if (!ok) {
          newClasses.push({year: year,semesters : [] })
        }
        return {
          ...state,
          years : newClasses
        }
      }
      case 'Add_Semester': {
        let { sems, classIndex } = action.payload;
        const newClasses = [...state.years];
        console.log("semester",classIndex)
        newClasses[classIndex] = {
            ...newClasses[classIndex], 
            semesters: [...newClasses[classIndex].semesters, {sem : sems,subjects : []}],
        };
        return {  
          ...state,
          years: newClasses
        }
      }
      case 'Add_Subjects': {
        const { subjectDetails, classIndex, semIndex } = action.payload;
        const newClasses = [...state.years];
        // console.log(classIndex,newClasses)
        const newSubjects = newClasses[classIndex].semesters[semIndex].subjects
        let ok = false;
        for (let i = 0; i < newSubjects.length; i++){
          if (newSubjects[i].subject == subjectDetails.subject) {
            newSubjects[i] = subjectDetails;
            ok = true;
            break;
          }
        }
        if (ok) {
          newClasses[classIndex].semesters[semIndex] = {
            ...newClasses[classIndex].semesters[semIndex],
            subjects : newSubjects
          }
        }
        else {
          newSubjects.push(subjectDetails)
          newClasses[classIndex].semesters[semIndex] = {
            ...newClasses[classIndex].semesters[semIndex],
            subjects : newSubjects
          }
        }
      }
      case 'Add_Aggregate':
        const { aggregate, classIndex } = action.payload;
        const newClasses = [...state.years];
        newClasses[classIndex].aggregatePercentage = aggregate;
        return {
          ...state,
          years: newClasses
        }
        
      case 'Add_Institute':
        const { iname } = action.payload;
        return {
          ...state,
          instituteName : iname
        }
      case 'Add_University':
        const { uname } = action.payload;
        return {
          ...state,
          universityName : uname
        }
      case 'Add_Degree':
        const { dname } = action.payload;
        return {
          ...state,
          universityName : dname
        }
      case 'Add_Course':
        const { cname } = action.payload;
        return {
          ...state,
          universityName : cname
        }
      default:
        return state;
    }
  };

  const [insState, idispatch] = useReducer(Ireducer, insInitialState);
  const [years, setYears] = useState([1])
  
  useEffect(() => {
    console.log(insState)
  },[insState])
  //////////////////////////////Inst-end///////////////////////////////////////////////

  /////////////////////////skills///////////////////////////////////////////////
  

  const [toggle, setToggle] = useState(()=>[false, false, false, false]);
  
  return (
    <div className=''>
      <div className='m-2'><Header title="EDUCATION" subtitle="Enter your education details" /></div>
      
      {/* school */}
      <div className={`m-2 border p-4  ${toggle[0] && 'overflow-y-scroll max-h-screen'}`}>
        <div className=''><Header title="SCHOOL LEVEL" subtitle={"your school qualifications from class 1 to 12"} /></div>
        <Button onClick={() => { let newToggle = [...toggle]; newToggle[0] = !newToggle[0]; setToggle(newToggle)}} variant="contained" sx={{ backgroundColor : "#0081ff" }} >Add details</Button>
        { toggle[0] && 
          classes.map((Class, index)=>{
            return (
              <InputForm ClassN={index} state={state} dispatch={dispatch} />
            )
          })
        }
      </div>
      
      {/* institute */}
      <div className='m-2 border p-4 '>
        <div className=''><Header title="INSTITUTE LEVEL" subtitle={"your College qualifications "} /></div>
        <div className='mb-2'><Button onClick={() => { let newToggle = [...toggle]; newToggle[1] = !newToggle[1]; setToggle(newToggle)}} variant="contained" sx={{ backgroundColor : "#0081ff" }} >Add details</Button></div>
        {
          toggle[1] && 
          <div className='flex flex-col gap-2'>
              <div className=' flex gap-2'>
                <CssTextField label='Degree name' value={insState.degree} onChange={(e) => idispatch({ type: 'Add_Degree', payload: { dname: e.target.value } })} />
                <CssTextField label='Course name' value={insState.course} onChange={(e)=>idispatch({type : 'Add_Course',payload : {cname : e.target.value}})}/>
              </div>
              <div className='flex gap-2'>
                <CssTextField label='Institute name' value={insState.instituteName} onChange={(e)=>idispatch({type : 'Add_Institute',payload : {iname : e.target.value}})}/>
                <CssTextField label='University name' value={insState.universityName} onChange={(e)=>idispatch({type : 'Add_University',payload : {uname : e.target.value}})}/>
              </div>
              
          </div>
        }
        {toggle[1] && 
          years.map((val, index) => {
            return (
              <InputForm year={index+1} state={insState} dispatch={idispatch}/>
            )
          })
        }
        {toggle[1] && <div className='mt-2'><IconButton onClick={()=>setYears((prev)=>[...prev,1])}><AddIcon/></IconButton> Add Year</div>}
      </div>

      {/* skills */}
    </div>
  );
}

export default Pform
