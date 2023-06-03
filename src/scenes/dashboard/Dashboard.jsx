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
import { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../../App";
import useSWR from 'swr';
import url from "../../url";
import axios from 'axios';
import DashLoader from "./DashLoader";
import NoDataLoader from "../NoneData/NoDataLoader";
import codeforces from '../../assets/codeforces.webp'
import leetcode from '../../assets/leetcode.png'
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { CssTextField } from "../profile-forms/textfield";


const fetcher = async (...args) => {
  const resp = await axios.get(...args);
  // console.log(resp.data, resp.status);
  if (resp.status === 204) throw new Error(resp.data.message);
  return resp.data;
}

const CpInfo = ({ data, contData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // console.log(data);
  const ext = (extn) => {
    if (extn == 'codeforces')
      return 'webp';
    else
      return 'png';
  }
  return (
    <div className='grid md:grid-cols-3 grid-cols-1 gap-4 w-full'>
      {
        data.map((obj) => (
          <div className={`p-4 bg-[${colors.primary[400]}] `}>
            <div className={`flex items-center gap-4`}>
              <img className="h-8" src={obj.platform == 'Codeforces' ? codeforces : leetcode} />
              <h2 className="text-xl">{obj.platform}</h2>
            </div>
            <div className="relative">
              <h2 className="text-[#23A8E0] text-[17px] mt-2">{obj.tag}</h2>
              <h2 className="text-[17px] mt-2 text-green-400">Rating : {obj.rating}</h2>
              <div className="absolute top-[-12px] left-44 grid place-items-center gap-2">
                <div className=""><ProgressCircle /></div>
                <h2 className="text-[15px]">Solved : {obj.solved}</h2>
              </div>
            </div>
          </div>
        ))
      }
      <Contact data={contData} />
    </div>
  )
}

const Contact = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // console.log(data);
  return (
    <div className={`flex justify-evenly items-center gap-4 bg-[${colors.primary[400]}] p-4`}>
      <div className="grid place-items-center cursor-pointer">
        <a href={data.linkedin ? data.linkedin : 'linkedin.com'} target="_blank"><LinkedInIcon sx={{ fontSize: '40px' }} /></a>
        <h2 className="text-[15px] mt-2 ">{200}+ conn.</h2>
      </div>
      <div className="grid place-items-center cursor-pointer">
        <a href={data.github ? data.github : 'github.com'} target="_blank"><GitHubIcon sx={{ fontSize: '40px' }} /></a>
        <h2 className="text-[15px] mt-2">Github</h2>
      </div>
      <div className="grid place-items-center cursor-pointer">
        <a ><WebIcon sx={{ fontSize: '40px' }} /></a>
        <h2 className="text-[15px] mt-2">{200}+ conn.</h2>
      </div>
    </div>
  )
}

const AcadInfo = ({ data, contData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  console.log(data);
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 w-full gap-4">
      <div className={`p-4 bg-[${colors.primary[400]}]`}>
        <div className="flex  gap-4 ">
          <h2 className="text-lg text-[#23A8E0]">{data.institute}</h2>
        </div>
        <div className="flex  gap-4 mt-2">
          <h2 className="text-lg text-[#23A8E0]">{data.degree}</h2>
          <h2 className="text-lg text-[#23A8E0]">{data.course.toUpperCase()}</h2>
          <h2 className="text-lg text-[#23A8E0]">{data.university.toUpperCase()}</h2>
        </div>
        <div className="flex gap-4">
          <h2 className="text-lg text-green-400">{data.currentYear.Class}</h2>
          <h2 className="text-lg text-green-400">{data.currentYear.aggregate.toUpperCase()}</h2>
          <h2 className="text-lg text-green-400 ml-auto">{data.currentYear.Date?.split("T")[0]}</h2>
        </div>
      </div>
      <Contact data={contData} />
    </div>
  )
}

const ModalAch = ({ open, setOpen }) => {
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
  const { uid, headerToken } = useContext(userContext);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const rec = useRef({
    title: '',
    desc: '',
    date: Date.now()
  })

  const handleAdd = async () => {
    rec.current.date = new Date(Date.now());
    rec.current.date = rec.current.date.toLocaleDateString();
    console.log(rec.current.date)
    try {
      const resp = await axios.patch(`${url}/dashboard/${uid}`, { ...rec['current'] }, {
        headers: {
          authorization: `Bearer ${headerToken}`
        }
      })
      console.log(resp.data);
      alert('achievement Added')
    } catch (error) {
      console.log(error)
      alert("some error occured try again");
    }
  }

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
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
            <div className="flex flex-col gap-4 m-2 mr-4">
              <CssTextField label='title' size='small' sx={{ width: '100px' }} onChange={(e) => rec.current.title = e.target.value} />
              <CssTextField label='description' size='small' sx={{ width: '340px' }} onChange={(e) => rec.current.desc = e.target.value} />
            </div>
            <Button color='success' onClick={handleAdd}>Add</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const classNames = 'overflow-y-scroll element-class max-h-[90%] scrollbar-hide p-4 '
  const { student,uid } = useContext(userContext);
  const [open, setOpen] = useState(false)

  const { data, isLoading, error } = useSWR(`${url}/dashboard/${student.uid}`, fetcher)

  if (error) {
    console.log(error.message)
    return (
      <NoDataLoader message={"No sufficient data Try searching for profile karan ransing to view how data is visualized"} />
    )
  }

  if (isLoading) {
    return (
      <div className={`h-[90%] w-full bg-[${colors.primary[400]}] grid place-items-center`}>
        <DashLoader />
      </div>
    )
  }

  console.log(data.middle.recentAchievements);

  return (
    <div className={classNames}>
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      <div className="flex w-full">
        {data.upper.cpinfo ? <CpInfo data={data.upper.cpinfo} contData={data.upper} /> : <AcadInfo data={data.upper1} contData={data.upper} />}
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4">
        <div className={`grid md:col-span-2  bg-[${colors.primary[400]}]`}><LineChart mainData={data.middle.lineDataSem} isDashboard={true} /></div>
        <div className="">
          <div className={`bg-[${colors.primary[400]}] p-4`}>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Achievements
            </Typography>
          </div>

          <div className=" max-h-44 overflow-y-scroll">
            {data.middle.recentAchievements.map((transaction, i) => (
              <div className={`bg-[${colors.primary[400]}] mt-2`}>
                <Box
                  key={`${transaction.title}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {transaction.title}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {transaction.desc}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>{transaction.date}</Box>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    {4}
                  </Box>
                </Box>
              </div>
            ))}
          </div>

          { <div className={`bg-[${colors.primary[400]}] p-2 mt-2 flex items-center gap-2`}>
            <IconButton onClick={() => setOpen(true)}><AddIcon /></IconButton>
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Add Achievement
            </Typography>
            <ModalAch open={open} setOpen={setOpen} />
          </div>}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
