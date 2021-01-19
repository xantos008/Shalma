import axios from 'axios';
import { customerApiUrl } from '../config';

axios.defaults.baseURL = customerApiUrl;

export const getApps = async ({
    userId
}) => {
    console.log('data is', userId);
    const resp = await axios.get(`/apps?userId=${userId}`);
    return resp.data;
}

export const registerApp = async ({
    appName,
    userId,
    email
}) => {
    const resp = await axios.post('/apps', {
            client_name: appName,
            email,
            userId
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

export const updatePayment = async ({ userId }) => {
    const { searchParams } = new URL(window.location);
    const resp = await axios.patch('/apps', {
        userId,
        paymentId: searchParams.get('session_id')
    });
    return resp.data;
}