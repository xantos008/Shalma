import axios from 'axios';
import jwt from 'jwt-decode';
import { avalancheApiUrl } from '../config';

axios.defaults.baseURL = avalancheApiUrl;

export const getApps = async () => {
    const data = jwt(localStorage.getItem("access_token"));
    console.log('data is', data);
    const resp = await axios.get(`/apps?userId=${data.sub}`);
    return resp.data;
}

export const registerApp = async ({
    appName,
    appUrls,
}) => {
    const data = jwt(localStorage.getItem("access_token"));
    console.log('data is', data);
    const resp = await axios.post('/register-app', {
            client_name: appName,
            redirect_uris: appUrls.split(',').map(v => v.trim()),
            email: data.email,
            userId: data.sub
    });
    return resp.data;
}