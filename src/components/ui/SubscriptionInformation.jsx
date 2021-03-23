import React, { useEffect, useState } from 'react';
import { redirectToStripeCheckout } from '../../services/stripe';
import { getSessionId, getSetupData } from '../../services/customerApi';
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const SubscriptionInformation = () => {

    const [setupData, setSetupData] = useState({});

    async function fetchSetupData(){
        const setupData = await getSetupData();
        setSetupData(setupData);
    }
    useEffect(() => {
        fetchSetupData()
    }, []);
    
    return (
          <>
               <Button variant="warning" className="btn-subscribe" onClick={async () => {
                    const sessionIdData = await getSessionId({
                         priceId: setupData.basicPrice
                    });
                    redirectToStripeCheckout(sessionIdData.sessionId, setupData.publishableKey);
               }}><FontAwesomeIcon icon={faDollarSign}/>Subscribe</Button>
          </>
    )
}

export default SubscriptionInformation;