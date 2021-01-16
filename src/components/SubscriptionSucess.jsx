import { Button, Result } from 'antd';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { updatePayment } from '../services/customerApi';

const SubscriptionSucess = () => {
    const history = useHistory();
    useEffect(() => {
        updatePayment();
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