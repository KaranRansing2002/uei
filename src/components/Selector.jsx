import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function Selector({aggOption,setAggOption}) {
     // state to hold the selected option

    const handleOptionChange = (event) => {
        setAggOption(event.target.value); // update the selected option
    };

    return (
        <FormControl>
        <Select
            labelId="selector-label"
            id="selector"
            value={aggOption}
            onChange={handleOptionChange} 
        >
            <MenuItem value="sgpa">SGPA</MenuItem>
            <MenuItem value="grade">Grade</MenuItem>
            <MenuItem value="percentage">Percentage</MenuItem>
        </Select>
        </FormControl>
    );
}

export default Selector
