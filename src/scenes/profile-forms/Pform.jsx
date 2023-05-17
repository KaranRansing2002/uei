import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import Header from '../../components/Header';
import SchoolForm from './SchoolForm';
import InstituteForm from './InstituteForm';
import SkillsProjForm from './SkillsProjForm';
import WorkExp from './WorkExp';
import { userContext } from '../../App';
import { useNavigate } from 'react-router-dom';

function Pform() {

  const {student,uid} = useContext(userContext)
  const navigate = useNavigate();
  useEffect(() => {
    if (student.uid != uid) {
      console.log('hello')
      navigate('/')
    }
  })

  return (
    <div className='overflow-y-scroll element-class max-h-screen scrollbar-hide'>
      <div className='m-2'><Header title="EDUCATION" subtitle="Enter your education details" H={"h2"}/></div>
      
      {/* school */}
      <SchoolForm />
      
      {/* institute */}
      <InstituteForm />

      {/* skills */}
      <SkillsProjForm />
      
      <WorkExp/>
    </div>
  );
}

export default Pform
