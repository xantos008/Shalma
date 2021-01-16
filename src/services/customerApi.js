import axios from 'axios';
import jwt from 'jwt-decode';
import { customerApiUrl } from '../config';

axios.defaults.baseURL = customerApiUrl;

export const getApps = async () => {
    const data = jwt(localStorage.getItem("access_token"));
    console.log('data is', data);
    const resp = await axios.get(`/apps?userId=${data.sub}`);
    return resp.data;
}

export const registerApp = async ({
    appName
}) => {
    const data = jwt(localStorage.getItem("access_token"));
    console.log('data is', data);
    const resp = await axios.post('/apps', {
            client_name: appName,
            email: data.email,
            userId: data.sub
    });
    return resp.data;
}

export const getSetupData = async () => {
    const resp = await axios.get('/stripe/setup');
    return resp.data;
}

export const getSessionId = async ({ priceId }) => {
    const resp = await axios.post('/stripe/create-checkout-session', {
        priceId,
        successUrl: `${window.location.origin}/subscribtion/success`,
        cancelUrl: `${window.location.origin}/subscribtion/cancel`
    });
    return resp.data;
}

export const updatePayment = async () => {
    const data = jwt(localStorage.getItem("access_token"));
    const params = new URLSearchParams();
    const resp = await axios.patch('/apps', {
        userId: data.sub,
        paymentId: params.get('session_id')
    });
    return resp.data;
}