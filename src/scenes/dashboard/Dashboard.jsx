import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarGraph";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import PieChart from "../../components/PieChart";
import code from '../../assets/codeforces.png'
import codeC from '../../assets/cc-logo.svg'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WebIcon from '@mui/icons-material/Web';
import { Link } from "react-router-dom";
import AttendanceBarGraph from "../../components/Attendance";
import { useContext } from "react";
import { userContext } from "../../App";
import useSWR from 'swr';
import url from "../../url";
import axios from 'axios';
import DashLoader from "./DashLoader";

const fetcher = async (...args) => {
  const resp = await axios.get(...args);
  return resp.data;
}

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const classNames = 'overflow-y-scroll element-class max-h-screen scrollbar-hide p-4'
  const { student } = useContext(userContext);

  const {data,isLoading,error} = useSWR(`${url}/dashboard/${student.uid}`,fetcher)

  if (isLoading) {
    return (
      <div className={`h-full w-full bg-[${colors.primary[400]}] grid place-items-center`}>
        <DashLoader/>
      </div>
    )
  }

  return (
    <div className={classNames}>
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
    </div>
  );
};

export default Dashboard;