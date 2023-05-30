import axios from 'axios';
import useSWR from 'swr';

const fetcher = async (...args) => {
    try {
        const response = await axios.get(...args);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
};

const { data, error } = useSWR(`${url}/project/${student.uid}`, fetcher);