import { useAuth0 } from '@auth0/auth0-react';
import { Button, Result } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { updatePayment } from '../services/customerApi';

const SubscriptionSucess = () => {
    const { getIdTokenClaims } = useAuth0();
    const history = useHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const token = await getIdTokenClaims();
        updatePayment({
            userId: token.sub
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <Result
    status="success"
    title="Successfully Subscribed!"
    subTitle="Now you can use your app keys, cloud server configuration takes 1-5 minutes, please wait."
    extra={[
      <Button type="primary" key="console" onClick={() => {
        history.push('/');
      }}>
        Go To Home Page
      </Button>
    ]}
  />
}

export default SubscriptionSucess;