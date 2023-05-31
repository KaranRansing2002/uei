import { Box, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const CertBox = ({ title, subtitle, subsubtitle, subs, subsubsubtitle, icon, progress, increase ,isReq,link}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const classp = useRef((isReq!=undefined) ? "none" : "block")
  // console.log(isReq,classp.current)
  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            noWrap={false}
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box sx={{display : classp.current}}>
          <ProgressCircle progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subsubtitle}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500], '&:hover': { textDecoration: 'underline' }, whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
          {subs}
        <a href={link} target="_blank" >
          {subsubsubtitle} <OpenInNewIcon sx={{width:18}}/>
        </a>
        </Typography>
      </Box>
    </Box>
  );

};

export default CertBox;