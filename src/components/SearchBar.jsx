import React, { useEffect, useState } from 'react'
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import useSWR from 'swr'
import axios from 'axios';
import url from '../url';
import { userContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';

const fetcher = async (...args) => {
    try {
      const response = await axios.get(...args);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data');
    }
  };

function SearchBar({color}) {
    
    const { student,setStudent } = useContext(userContext);
    const { data, error, isLoading } = useSWR(`${url}/student/all`, fetcher)
    const [width, setWidth] = useState(300);
    const navigate = useNavigate()
    
    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth < 550) {
            setWidth(100);
          } else {
            setWidth(250);
          }
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (event, value) => {
        setSelectedOption(value);
        console.log(value); 
        if (value != null && value != '' && value.uid !== undefined) {
            navigate(`/${value.username}/dashboard`)
            setStudent(value)
        }
    };

    return (
        <div className='ml-[-8px]'>
            <Autocomplete
                sx={{ width: width,backgroundColor : color}}
                options={data}
                size='small'
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} >
                        <img
                            loading="lazy"
                            width="20"
                            src={option.image}
                            alt="image"
                        />
                        {option.name}
                        
                    </Box>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Student"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
                onChange={handleOptionChange} // Capture the selected option here
                value={selectedOption} // Set the selected option
                // renderValue={(option) => option.name} 
            />
        </div>
    )
}

export default SearchBar
