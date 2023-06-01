import React, { useContext } from 'react'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import './NoDataLoader.css'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../App';

function NoDataLoader1({message,setOpen}) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const classNames = 'overflow-y-scroll element-class max-h-screen scrollbar-hide p-4'
    return (
        <div className={`h-[90%] w-[95%] bg-[${colors.primary[400]}] grid place-items-center ml-4`}>
            <div class="cube">
                <div class="face front"></div>
                <div class="face back"></div>
                <div class="face right"></div>
                <div class="face left"></div>
                <div class="face top"></div>
                <div class="face bottom"></div>
            </div>
            <h2 className='text-2xl'>{message ? message : 'No Data Available '}</h2>
            {<Button variant='contained' size='Large' color='success' onClick={() => setOpen(true)}>Register</Button>}
        </div>
    )
}

export default NoDataLoader1
