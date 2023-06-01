import React, { useContext, useRef, useState } from 'react'
import { CssTextField } from '../profile-forms/textfield'
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useSWR from 'swr';
import url from '../../url';
import { userContext } from '../../App';
import axios from 'axios'
import NoDataLoader from '../NoneData/NoDataLoader';
import NoDataLoader1 from '../NoneData/NoDataLoader1';
import Header from '../../components/Header';

const fetcher = async (...args) => {
  const resp = await axios.get(...args);
  if (!resp.data.resp.name) {
    throw new Error('No organisation registered')
  }
  return resp.data.resp;
}

function TransitionsModal({ open, setOpen }) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user, uid, headerToken } = useContext(userContext);

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

  const orginfo = useRef({
    name: '',
    address: '',
    date: '',
    email: '',
    grade: '',
    isGovernmentAffiliated: '',
    state: '',
    about: '',
    totalMembers: Number,
    // Access: [user.email],
    link: ''
  })

  const orgArr = Object.entries(orginfo.current);

  const handleAdd = async () => {
    console.log(orginfo.current)
    const resp = await axios.patch(`${url}/organisation/${uid}`, { uid,...orginfo['current']}, {
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
            <div className="flex flex-col h-[500px] w-[400px] overflow-y-scroll items-center gap-4 m-2 mr-4">
              {
                orgArr.map(([key,value]) => (
                  <CssTextField label={key} size='small'  onChange={(e) => orginfo.current[`${key}`] = e.target.value} />
                ))
              }
            </div>
            <Button color='success' onClick={handleAdd}>Add</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

function Odashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user, uid, headerToken } = useContext(userContext);

  const { data, isLoading, error } = useSWR(`${url}/organisation/${uid}`, fetcher)

  const [open, setOpen] = useState(false)

  if (error || !data) {
    console.log(error?.message)
    return (
      <>
        <NoDataLoader1 message={error?.message} setOpen={setOpen} />
        <TransitionsModal open={open} setOpen={setOpen} />
      </>
    )
  }

  return (
    <div className='p-4 overflow-y-scroll element-class max-h-[90%] scrollbar-hide'>
      <Header title='ORGANISATION' />
      <div className={`mt-4 bg-[${colors.primary[400]}] p-4`}>
        <Header title={`Institute Name : ${data.name.toUpperCase()}`} H='h2' />
        {
          Object.entries(data).map(([key, value]) => (
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">{key} {value}</Typography>
          ))
        }
      </div>
    </div>
  )
}

export default Odashboard
