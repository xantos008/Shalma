import React from 'react';
import dayjs from 'dayjs';
import { Card } from 'antd';
import ProgressBar from './ProgressBar';

const SubscriptionAlert = ({ startDate, maxDays = 14 }) => {
    const nowDate = dayjs();
    const stDate = dayjs(startDate);
    const diff = maxDays - nowDate.diff(stDate, "days");
    const progressPercentage = diff * 100 / maxDays;

    return (
        <Card
            style={{
                backgroundColor: '#284866',
                color: 'white',
                borderRadius: '10px',
        }}>
            <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}> {diff} out of 14 </span>
            </div>
            <div style={{ width: '100%', marginBottom: '10px' }}>
                <ProgressBar completed={progressPercentage} />
            </div>
            <div>
                <span> days of free subscription plan </span> 
            </div>
        </Card>
    );
    // if(diff > 0){
    //     return <Alert message={`You have ${diff} days of free subscription plan`} type="info" />;
    // }else if(diff === 0){
    //     return <Alert message={`This is your last day of free subscription, please subscribe to a plan`} type="warning" />;
    // }else{
    //     return <Alert message="You must renew your membership to continue using the app" type="error" />;
    // }
}

export default SubscriptionAlert;
