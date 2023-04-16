import React, { useEffect, useReducer, useRef, useState } from 'react';
import InputForm from '../../components/InputForm';
import axios from 'axios'
import { Button, Icon, IconButton, TextField } from '@mui/material';
import Header from '../../components/Header';
import schoollogo from '../../assets/schoollogo.png'
import AddIcon from '@mui/icons-material/Add';
import { CssTextField } from './textfield';

function SchoolForm() {

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
                // classIndex -= 1;
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

    const handleSave = () => {
        console.log("schoolstate", state);
    }

    const [toggle, setToggle] = useState(false);
  return (
    <div className={`m-2 border border-slate-400 p-4 ${toggle && 'overflow-y-scroll max-h-screen'}`}>
        <div className=''><Header title="SCHOOL LEVEL" subtitle={"your school qualifications from class 1 to 12"} H={"h3"} /></div>
        <Button onClick={() => setToggle((prev)=>!prev) } variant="contained" sx={{ backgroundColor : "#0081ff" }} >Add details</Button>
        { toggle && 
          classes.map((Class, index)=>{
            return (
              <InputForm ClassN={index} state={state} dispatch={dispatch} />
            )
          })
        }
        <div className='flex flex-col my-2'>
            <div className='flex self-end'><Button onClick={handleSave} variant="contained" color="success">Save Details</Button></div>
        </div>  
    </div>
  )
}

export default SchoolForm
