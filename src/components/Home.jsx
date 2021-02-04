import React, { useCallback, useEffect, useState } from 'react';
import { Input,  Button, Skeleton, Typography } from 'antd';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { Grid, Col, Row } from 'react-flexbox-grid';
import Form from 'antd/lib/form/Form';
import { getApps, registerApp } from '../services/customerApi';
import SubscriptionAlert from './SubscriptionAlert';
import dayjs from 'dayjs';
import SubscriptionButton from './SubscriptionButton';
import { useAuth0 } from '@auth0/auth0-react';
import TalkToUsModal from './TalkToUsModal';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const Home = () => {
    const { getIdTokenClaims } = useAuth0();
    const TUTORIAL_URL = "https://mohit21gojs.github.io/avalanche.github.io/";

    const generateAppName = (length) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     };

    const [formData, setFormData] = useState({
        appName: generateAppName(10)
    });
    const [showSubscribtionAlert, setShowSubscribtionAlert] = useState(false);
    const [registrationDate, setRegistrationDate] = useState("");
    const [idKey, setIdKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const { copyToClipBoard: copyIdClipBoardSuccess} = useCopyToClipboard("Site Key");
    const { copyToClipBoard: copyKeyClipBoardSuccess} = useCopyToClipboard("Secret Key");
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [adsMethod, setAdsMethod] = useState('');
    const [calendlyDuration, setCalendlyDuration] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    async function setToken(){
        setIsLoading(true);
        const token = await getIdTokenClaims();
        const apps = await getApps({
            userId: token.sub
        });
        setIsLoading(false);
        const activeApp = apps[0];
        if(activeApp){
            setIdKey(activeApp.client_id);
            setSecretKey(activeApp.client_secret);
            setRegistrationDate(activeApp.createdAt);
            setShowSubscribtionAlert(activeApp.status === "registered" ? true : false);
        }
    }
    useEffect(() => {
        setToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheck = () => {
        let hasErrorMessage = false;
        const adsMethodStorage = localStorage.getItem('ads_method');
        if (!adsMethodStorage) {
            hasErrorMessage = true;
            setErrorMessage("Choose option");
        }
        return hasErrorMessage;
    };

    const handleRegisterApp = useCallback(async () => {
        const hasError = handleCheck();
        if (hasError) return;
        setIsLoading(true);
        const token = await getIdTokenClaims();
        await registerApp({
            appName: formData.appName,
            appUrls: formData.redirectUris,
            userId: token.sub,
            email: token.email,
        });
        
        const apps = await getApps({
            userId: token.sub
        });
        const activeApp = apps[0];
        if(activeApp){
            setIdKey(activeApp.client_id);
            setSecretKey(activeApp.client_secret);
            setRegistrationDate(activeApp.createdAt);
            setShowSubscribtionAlert(activeApp.status === "registered" ? true : false);
        }
        setIsLoading(false);
    }, [formData, getIdTokenClaims]);

    const handleMenuClick = (e) => {
        setAdsMethod(`${e.key}`);
        localStorage.setItem('ads_method', e.key);
        if (e.key.length > 1) {
            setErrorMessage('');
        }
    }

    const handleSalesCalendly = () => {
        setCalendlyDuration("30min");
        setShowCalendlyModal(true);
    };

    const handleEngineerCalendly = () => {
        setCalendlyDuration("60min");
        setShowCalendlyModal(true);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
          <Menu.Item key="Google">
            Google
          </Menu.Item>
          <Menu.Item key="Quora">
            Quora
          </Menu.Item>
          <Menu.Item key="Betalist">
            Betalist
          </Menu.Item>
          <Menu.Item key="Hackernews">
            Hackernews
          </Menu.Item>
          <Menu.Item key="Stackoverflow">
            Stackoverflow
          </Menu.Item>
          <Menu.Item key="Other">
            Other
          </Menu.Item>
        </Menu>
      );

    const handleCloseCalendly = () => {
        setShowCalendlyModal(false);
    };

    if(isLoading){
        return <Grid className="home">
            <Skeleton active />
        </Grid>
    }
    const dt = dayjs(registrationDate);
    return idKey ? (<Grid className="home">
        {showSubscribtionAlert && <SubscriptionButton />}
        {showSubscribtionAlert && <Row middle="xs">
            <Col xs={12}>
                <SubscriptionAlert startDate={dt} />
            </Col>
        </Row>}
        <br />
        <Row middle="xs">
            <Col xs={1}>
                Site Key:
            </Col>
            <Col xs={6}>
                <Input value={idKey} disabled />
            </Col>
            <Col xs={4}>
                <Button className="full-width" type="primary" onClick={(e) => {
                        copyIdClipBoardSuccess(idKey);
                    }}>
                    Copy Site Key
                </Button>
            </Col>
        </Row>
        <br />
        <Row middle="xs">
            <Col xs={1}>
                Secret Key:
            </Col>
            <Col xs={6}>
                <Input value={secretKey} disabled />
            </Col>
            <Col xs={4}>
                <Button className="full-width" type="primary" onClick={(e) => {
                        copyKeyClipBoardSuccess(secretKey);
                    }}>
                    Copy Secret Key
                </Button>
            </Col>
        </Row>
        <br />
        <br />
        <Row middle="xs">
            <Col xs={4}>
                <Button type="primary" onClick={handleSalesCalendly} style={{ marginBottom: '20px', marginRight: '20px' }}>
                    Talk to Sales
                </Button>
            </Col>
            <Col xs={4}>
                <Button type="primary" onClick={handleEngineerCalendly} style={{ marginBottom: '20px', marginRight: '20px' }}>
                    Talk to Engineers
                </Button>       
            </Col>
            <Col xs={4}>
                <Button
                    type="primary"
                    href={TUTORIAL_URL}
                    style={{ marginBottom: '20px', marginRight: '20px' }}
                    target="_blank"
                >
                    Tutorial
                </Button> 
            </Col>
        </Row>
        {showCalendlyModal && (
            <TalkToUsModal onClose={handleCloseCalendly} duration={calendlyDuration} />
        )}
    </Grid>): <Grid className="home">
        <Row style={{ marginBottom: '30px' }}>
            <Col xs={3} style={{ display: 'flex', marginLeft: '130px' }}>
                <Typography style={{ marginRight: '10px' }}> How did you hear about us? </Typography>
            </Col>
            <Col xs={6}>
                <Dropdown overlay={menu}>
                    <Button
                        style={{
                            width: '150px',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        {adsMethod || 'Select'}  <DownOutlined />
                    </Button>
                </Dropdown>
                <Typography
                    style={{ width: '150px', textAlign: 'left', color: 'red', fontSize: '13px', marginTop: '5px', marginLeft: '3px' }}
                >
                    {errorMessage}
                </Typography>
            </Col>
        </Row>
        <Form>
            <Row>
                <Col xs={3} style={{ display: 'flex', marginLeft: '130px' }}>
                    App Name
                </Col>
                <Col xs={6}>
                    <Input value={formData.appName} onChange={(e) => {
                        setFormData(v => ({
                            ...v,
                            appName: e.target.value
                        }))
                    }} />
                </Col>
            </Row>
            <br />
            <br />
            <Row center="xs">
                <Col xs={12}>
                <Button disabled={!formData.appName} onClick={handleRegisterApp} size="large" type="primary">
                    Next
                </Button>
                </Col>
            </Row>
        </Form>
    </Grid>
}

export default Home;