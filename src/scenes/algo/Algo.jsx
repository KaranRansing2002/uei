import React, { useContext, useEffect } from 'react';
import Header from '../../components/Header';
import useSWR from 'swr';
import url from '../../url';
import { userContext } from '../../App';
import axios from 'axios';
import Loader from '../../components/Loader/Loader';
import InfoCard from './InfoCard';
import { getRankName, getRankValue } from '../profile-forms/cf-utility';
import PieChart from '../../components/PieChart';
import { json } from 'react-router-dom';
import BarGraph from '../../components/BarGraph';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';

const fetcher = async (...args) => {
    try {
        const response = await axios.get(...args);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
};

const cfFetcher = async (cfusernames) => {
    const requests = cfusernames.map(user =>
        axios.get(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=10000`)
    );

    const responses = await axios.all(requests);

    const cfdata = {
        totalSolved: 0,
        tags: {},
        ratings: {},
        submissionDate: null,
    };

    responses.forEach(resp => {
        resp.data.result.forEach(prob => {
            if (prob.verdict === 'OK') {
                cfdata.totalSolved = cfdata.totalSolved === undefined ? 1 : cfdata.totalSolved + 1;
                prob.problem.tags.forEach(tag => {
                    cfdata.tags[tag] = cfdata.tags[tag] === undefined ? 1 : cfdata.tags[tag] + 1;
                });

                cfdata.ratings[prob.problem.rating] = cfdata.ratings[prob.problem.rating] === undefined
                    ? 1
                    : cfdata.ratings[prob.problem.rating] + 1;

                cfdata.submissionDate = prob.creationTimeSeconds;
            }
        });
    });

    const resp = await axios.get(`https://codeforces.com/api/user.info?handles=${cfusernames[0]};${cfusernames.length > 1 ? cfusernames[1] : ''}`);
    const { result } = resp.data;
    const rating = Math.max(result[0].maxRating, result.length > 1 ? result[1].maxRating : 0);
    const tag = getRankName(Math.max(getRankValue(result[0].maxRank), result.length > 1 ? getRankValue(result[1].maxRank) : 0));

    return { rating, tag, ...cfdata };
};

const ltFetcher = async (...args) => {
    const resp = await axios.get(...args);
    console.log(resp.data);
    return resp.data
}


function Algo() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { uid, student } = useContext(userContext);

    const { data, error } = useSWR(`${url}/project/${student.uid}`, fetcher);

    if (error) {
        return <div>Error: Failed to fetch data</div>;
    }


    let cfusernames, leetcodeUsername;
    data?.resp.dsa.forEach(obj => {
        if (obj.platform === 'Codeforces') {
            cfusernames = obj.usernames;
        } else {
            leetcodeUsername = obj.usernames[0];
        }
    });

    const { data: cfinfo, isLoading, error: cferror } = useSWR(() => cfusernames && `cfinfo-${cfusernames.join('-')}`, () => cfFetcher(cfusernames));

    const { data: ltinfo, isLoading: ltloading, error: lterror } = useSWR(() => leetcodeUsername && `https://leetcode-stats-api.herokuapp.com/${leetcodeUsername}`, ltFetcher);

    if (isLoading || !data || !cfinfo || !ltinfo) {
        return (
            <div className='text-lg p-2 h-[60vh] flex flex-col justify-center items-center'>
                <Loader />
                ...Loading
                <br />
                <h1 className='mt-4 text-green-400 text-center text-sm'>It may take a minute, but if it takes longer, there may be an API problem with the CP sites. Please try again in several minutes.</h1>
            </div>
        );
    }

    if (cferror) {
        console.error('Failed to fetch Codeforces data', cferror);
    }

    const ltpiedata = { 'tags': { 'easy': ltinfo.easySolved, 'medium': ltinfo.mediumSolved, 'hard': ltinfo.hardSolved } }

    return (
        <div className='p-2 overflow-y-scroll element-class max-h-[90%] scrollbar-hide'>
            <div className='m-2'>
                <Header title='DSA/CP' subtitle='Data-Structures and Algorithms / Competitive Programming' H='h2' />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 grid-rows-auto gap-4 mt-2'>
                <InfoCard info={cfinfo} platform='codeforces' />
                <InfoCard info={ltinfo} platform='Leetcode' />
                <div className='p-2 flex justify-center'>
                    <div className='border-2 border-blue-400 flex flex-col justify-center items-center border rounded-full h-28 w-28'>
                        <h2>Total Solved</h2>
                        <h2 className='text-xl'>{ltinfo.totalSolved + cfinfo.totalSolved}</h2>
                    </div>
                </div>
            </div>
            <div className='m-2 sm:flex'>
                <div className='h-72 w-2/3'><BarGraph ratingsData={cfinfo.ratings} /></div>
                <div className=' border border-white'>
                    <h2>Languages</h2>
                </div>
            </div>
            <div className='sm:grid sm:grid-cols-2 grid grid-cols-1'>
                <div className={`h-44 sm:h-72 flex m-2 `}>
                    <PieChart data={cfinfo} name='Codeforces' color={colors.primary[400]} />
                </div>
                <div className='h-44 sm:h-72 flex m-2'>
                    <PieChart data={ltpiedata} name='Leetcode' color={colors.primary[400]}/>
                </div>
            </div>
            
        </div>
    );
}

export default Algo;
