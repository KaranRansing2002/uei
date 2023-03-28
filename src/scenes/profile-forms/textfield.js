import { alpha, styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

export const CssTextField = styled(TextField)({
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