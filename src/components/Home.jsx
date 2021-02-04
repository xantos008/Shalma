import React, { useCallback, useEffect, useState } from 'react';
import { Input,  Button, Skeleton } from 'antd';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { Grid, Col, Row } from 'react-flexbox-grid';
import Form from 'antd/lib/form/Form';
import { getApps, registerApp } from '../services/customerApi';
import SubscriptionAlert from './SubscriptionAlert';
import dayjs from 'dayjs';
import SubscriptionButton from './SubscriptionButton';
import { useAuth0 } from '@auth0/auth0-react';
import TalkToUsModal from './TalkToUsModal';

const Home = () => {
    const { getIdTokenClaims } = useAuth0();
    const [formData, setFormData] = useState({
        appName: ''
    });
    const [showSubscribtionAlert, setShowSubscribtionAlert] = useState(false);
    const [registrationDate, setRegistrationDate] = useState("");
    const [idKey, setIdKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const { copyToClipBoard: copyIdClipBoardSuccess} = useCopyToClipboard("Site Key");
    const { copyToClipBoard: copyKeyClipBoardSuccess} = useCopyToClipboard("Secret Key");
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
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

    const handleRegisterApp = useCallback(async () => {
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

    const handleShowCalendly = () => {
        setShowCalendlyModal(true);
    };

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
    </Grid>): <Grid className="home">
        <Button type="primary" onClick={handleShowCalendly} style={{ marginBottom: '20px' }}>
            Talk to Us!
        </Button>
        {showCalendlyModal && (
            <TalkToUsModal onClose={handleCloseCalendly} />
        )}
        <Form>
            <Row>
                <Col xs={4}>
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
            <Row center="xs">
                <Col xs={12}>
                <Button disabled={!formData.appName} onClick={handleRegisterApp} size="large" type="primary">
                    Register App
                </Button>
                </Col>
            </Row>
        </Form>
    </Grid>
}

export default Home;