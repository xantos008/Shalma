import React from 'react';
import dayjs from 'dayjs';
import { Alert } from 'antd';

const SubscriptionAlert = ({ startDate, maxDays = 14 }) => {
    const nowDate = dayjs();
    const stDate = dayjs(startDate);
    const diff = maxDays - nowDate.diff(stDate, "days");
    if(diff > 0){
        return <Alert message={`You have ${diff} days of free subscription plan`} type="info" />;
    }else if(diff === 0){
        return <Alert message={`This is your last day of free subscription, please subscribe to a plan`} type="warning" />;
    }else{
        return <Alert message="You must renew your membership to continue using the app" type="error" />;
    }
}

export default SubscriptionAlert;
