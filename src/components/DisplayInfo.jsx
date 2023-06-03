import React, { useState } from 'react'
import { tokens } from "../theme";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { CssTextField } from '../scenes/profile-forms/textfield';
import PanoramaIcon from '@mui/icons-material/Panorama';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import NoImage from '../assets/Noimage.webp'


function TransitionsModal({image,open,setOpen}) {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    console.log('here')
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
                <img src={image ? image : NoImage} />
            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }


const SemesterDisp = ({ data, sem }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <div className='flex flex-col items-center mt-2'>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">Semester {sem} ({data.Aggregate})</Typography>
            <div>
                {
                    data.subjects.map(sub => (
                        <div className='flex gap-4 m-2 mt-4'>
                            <CssTextField label="Subject" value={sub.subject} size='small' sx={{width : '100px'}} />
                            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">Marks : {sub.marks} {}</Typography>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}


function DisplayInfo({ data, title }) {
    console.log(data)
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [toggle, setToggle] = useState(false);

    const [open,setOpen] = useState(false)

    console.log(data)

    if (!data) {
        return (
            <div className='flex justify-center'>...Loading</div>
        )
    }

    return (
        <div className={`bg-[${colors.primary[400]}] p-4`}>
            <div>
                <Typography color={colors.grey[100]} variant="h4" fontWeight="600">{title}</Typography>
            </div>
            <div className='mt-2 grid grid-cols-2'>
                <div>
                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600">CLASS : {data?.Class}</Typography>
                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600">Date : {data?.Date?.split("T")[0]}</Typography>
                </div>
                <div className='flex flex-col items-end '>
                    <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">Aggregate</Typography>
                    <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">{data.aggregate}</Typography>
                </div>
            </div>
            <div className='mt-2'>
                <Button variant='contained' fullWidth color='secondary' onClick={() => setToggle(p => !p)} >Expand</Button>
            </div>
            {
                toggle && data?.semesters[0] && 
                <div >
                    {
                        (data?.semesters[0].Aggregate && data.semesters[1].Aggregate) ?
                            <div className='grid grid-cols-2 place-items-center mt-4'>
                                <SemesterDisp data={data.semesters[0]} sem={1} />
                                <SemesterDisp data={data.semesters[1]} sem={2} />
                            </div> :
                            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">No Data Available</Typography>

                    }
                </div>
            }
            <div className='mt-2'>
                <Button varinat='contained' color='secondary' onClick={()=>setOpen(true)}>
                    <PanoramaIcon sx={{ color: colors.grey[100], margin : '4px' }} />
                    View Image
                </Button>
                <TransitionsModal image={data.image} open={open} setOpen={setOpen}/>
            </div>
        </div>
    )
}

export default DisplayInfo
