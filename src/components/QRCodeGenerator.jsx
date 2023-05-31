import React, { useContext, useState } from 'react';
import {QRCodeCanvas} from 'qrcode.react';
import { tokens } from "../theme";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { CssTextField } from '../scenes/profile-forms/textfield';
import { userContext } from '../App';

const QRCodeGenerator = () => {
    const { student } = useContext(userContext);
  const [text, setText] = useState(`http://localhost:8000/${student.username}/dashboard`);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <QRCodeCanvas size={300} level='M' includeMargin={true} sx={{color:colors.grey[100]}} value={text} />
      <h1>&nbsp; </h1>
      <CssTextField fullWidth value={text}  />
    </div>
  );
};

export default QRCodeGenerator;