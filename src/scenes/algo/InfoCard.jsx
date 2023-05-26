import React, { useContext, useEffect, useState } from 'react';
import codeforces from '../../assets/codeforces.webp';
import leetcode from '../../assets/leetcode.png';
import { ColorModeContext, tokens } from "../../theme";
import { useTheme } from '@mui/material';


function InfoCard({ info, platform }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const totalSolved = info?.totalSolved;
    const tag = info?.tag;
    const contribution = info?.contributionPoints;
    console.log(totalSolved);
    return (
        <div className={` m-2 p-2 px-4 pr-8 border-slate-600 bg-[${colors.primary[400]}]`} >
            <div className="flex gap-2 items-center">
                <img className="h-6" src={platform.toLowerCase() === 'codeforces' ? codeforces : leetcode} alt={platform} />
                <h2 className="text-2xl">{platform}</h2>
            </div>
            <div className="mt-2 flex flex-col gap-2 "> 
                <h2 className='text-base text-[#47DCE5]'>{tag ? tag : `Contribution : ${contribution}`}</h2>
                <h2 className='text-base text-blue-400'>Total Ques Solved : <span className='text-green-400'>{totalSolved}</span></h2>
            </div> 
        </div>
    );
}

export default InfoCard;
