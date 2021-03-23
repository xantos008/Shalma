import React from 'react';
import dayjs from 'dayjs';

import { Alert, ProgressBar } from "react-bootstrap";

const SubscriptionAlert = ({ startDate, maxDays = 14 }) => {

    const nowDate = dayjs();
    
    const stDate = dayjs(startDate);
    
    const diff = maxDays - nowDate.diff(stDate, "days");

    const progressPercentage = ((maxDays - (diff < 0 ? 0 : diff)) / maxDays) * 100;

    return (
          <>
               <Alert variant="primary border-0 progress-status">
                    <div className="mb-2"><strong>{ diff < 0 ? 0 : diff } out of 14</strong></div>
                    <ProgressBar variant="primary" now={progressPercentage} />
                    <div className="mt-2"> days of free subscription plan </div> 
               </Alert>
          </>
    );
}

export default SubscriptionAlert;
