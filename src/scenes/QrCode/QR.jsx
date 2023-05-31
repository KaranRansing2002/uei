import React from 'react';
import Header from '../../components/Header';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CertBox from "../../components/CertBox";
// import "../components/Table.css";
import { useContext } from "react";
import { userContext } from "../../App";
import QRCodeGenerator from '../../components/QRCodeGenerator';

const QR = () => {
    const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const classNames = 'overflow-y-scroll element-class max-h-[88%] scrollbar-hide'
  const { student } = useContext(userContext);
  return (
    <div className={classNames}>
        <div className='m-2 m-30'><Header title="SCAN THIS QR CODE" subtitle={`Check out ${student.name}'s profile by scanning this QR Code!`} H={"h2"}/></div><Box
        display="grid"
        m = "30px 30px"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="flex"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 12"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p = "30px 0"
        >
            <QRCodeGenerator sx={colors.primary[400]} />
        </Box>
      </Box>
      
    </div>
  );
};

export default QR;