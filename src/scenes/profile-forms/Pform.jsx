import React, { useEffect, useReducer, useRef, useState } from 'react';
import Header from '../../components/Header';
import SchoolForm from './SchoolForm';
import InstituteForm from './InstituteForm';
import SkillsProjForm from './SkillsProjForm';
import WorkExp from './WorkExp';

function Pform() {

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
