import axios from 'axios';
import { customerApiUrl } from '../config';

axios.defaults.baseURL = customerApiUrl;

export const getApps = async ({
    userId
}) => {
    console.log('data is', userId);
    const resp = await axios.get(`/apps?userId=${userId}`);
    console.log('resp.data', resp.data);
    return resp.data;
}

export const registerApp = async ({
    appName,
    userId,
	domens,
    email
}) => {
    const resp = await axios.post('/apps', {
            client_name: appName,
            email,
            userId,
			domens
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

export const updateDomens = async ({ userId, domens }) => {
    const resp = await axios.patch('/apps/update', {
        userId,
        domens: domens
    });
    return resp.data;
}