import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import Header from '../../components/Header';
import SchoolForm from './SchoolForm';
import InstituteForm from './InstituteForm';
import SkillsProjForm from './SkillsProjForm';
import WorkExp from './WorkExp';
import { userContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade'
import { CssTextField } from './textfield';
import axios from 'axios';
import url from '../../url';

function TransitionsModal({ open, setOpen }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { student, uid, headerToken } = useContext(userContext);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const certinfo = useRef({
    course: '',
    organisation: '',
    id: '',
    link: '',
    duration: ''
  })

  const handleAdd = async () => {
    const resp = await axios.patch(`${url}/student/certificate/${uid}`, { ...certinfo['current'] }, {
      headers: {
        authorization: `Bearer ${headerToken}`
      }
    })
    alert('data added');
    console.log(resp);
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="flex flex-col items-center gap-4 m-2 mr-4">
              <CssTextField label='Course Name' size='small' sx={{ width: '340px' }} onChange={(e) => certinfo.current.course = e.target.value} />
              <CssTextField label='Organisation Name' size='small' sx={{ width: '340px' }} onChange={(e) => certinfo.current.organisation = e.target.value} />
              <CssTextField label='Certificate id' size='small' sx={{ width: '340px' }} onChange={(e) => certinfo.current.id = e.target.value} />
              <CssTextField label='Certificate link' size='small' sx={{ width: '340px' }} onChange={(e) => certinfo.current.link = e.target.value} />
              <CssTextField label='Course duration' size='small' sx={{ width: '340px' }} onChange={(e) => certinfo.current.duration = e.target.value} />
            </div>
            <Button color='success' onClick={handleAdd}>Add</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

function Pform() {

  const { student, uid } = useContext(userContext)
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (student.uid != uid) {
      console.log('hello')
      navigate('/')
    }
  })

  return (
    <div className='overflow-y-scroll element-class max-h-[90%] scrollbar-hide'>
      <div className='m-2'><Header title="EDUCATION" subtitle="Enter your education details" H={"h2"} /></div>

      {/* school */}
      <SchoolForm />

      {/* institute */}
      <InstituteForm />

      {/* skills */}
      <SkillsProjForm />

      <WorkExp />

      <div className='flex m-2 items-center p-2'>
        <IconButton onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
        <h2 className='text-lg ml-2'>Add Certificate</h2>
        <TransitionsModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}

export default Pform
