import React, { useEffect, useState } from 'react';
import {  Button } from 'antd';
import { DollarCircleOutlined } from '@ant-design/icons';
import { redirectToStripeCheckout } from '../services/stripe';
import { getSessionId, getSetupData } from '../services/customerApi';


const SubscriptionButton = () => {

    const [setupData, setSetupData] = useState({});

    async function fetchSetupData(){
        const setupData = await getSetupData();
        setSetupData(setupData);
    }
    useEffect(() => {
        fetchSetupData()
    }, []);
    
    return <div className="subscription-button">
        <Button
            icon={<DollarCircleOutlined />}
            type="primary"
            onClick={async () => {
            const sessionIdData = await getSessionId({
                priceId: setupData.basicPrice
            });
            redirectToStripeCheckout(sessionIdData.sessionId, setupData.publishableKey);
            }}
            style={{
                color: 'white',
                fontWeight: 450,
                backgroundImage: 'linear-gradient(to right, #ffb347 0%, #ffcc33  75%, #ffb347  100%)',
                borderRadius: '10px',
                height: '48px',
                border: 'none',
                width: '120px'
            }}         
        >
            Subscribe
        </Button>
    </div>
}

export default SubscriptionButton;
