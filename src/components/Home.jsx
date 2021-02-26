import React, { useCallback, useEffect, useState } from 'react';
import { Input,  Button, Skeleton, Typography } from 'antd';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
//import { Grid, Col, Row } from 'react-flexbox-grid';
import { Container, Row, Col } from 'reactstrap';
import Form from 'antd/lib/form/Form';
import { getApps, registerApp, updateDomens } from '../services/customerApi';
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

    
    const [showSubscribtionAlert, setShowSubscribtionAlert] = useState(false);
    const [registrationDate, setRegistrationDate] = useState("");
    const [idKey, setIdKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [domens, setDomens] = useState([]);
    const { copyToClipBoard: copyIdClipBoardSuccess} = useCopyToClipboard("Site Key");
    const { copyToClipBoard: copyKeyClipBoardSuccess} = useCopyToClipboard("Secret Key");
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendlyModal, setShowCalendlyModal] = useState(false);
    const [adsMethod, setAdsMethod] = useState('');
    const [calendlyDuration, setCalendlyDuration] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
	const [inputList, setInputList] = useState([{value: ""}]);
	const [lastIndex, setLastIndex] = useState(0);
	
	const [formData, setFormData] = useState({
        appName: generateAppName(10),
		domens: inputList
    });	
    
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
			setDomens(activeApp.domens);
			setInputList(activeApp.domens[0]);
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
			domens: formData.domens,
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
			setDomens(activeApp.domens);
			setInputList(activeApp.domens[0]);
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
	
	const handleAddDomen = () => {
		setInputList([...inputList, { value: "" }]);
	};
	
	const handleRemoveDomen = index => {
		const list = [...inputList];
		list.splice(index, 1);
		setInputList(list);
	};
	
	const handleDomenChange = (e, index) => {
		const { value } = e.target;
		const list = [...inputList];
		list[index]['value'] = value;
		setInputList(list);
		setFormData(v => ({
                            ...v,
                            domens: inputList
                        }))
		setLastIndex(index);
	};
	
	const handleFocusChange = (index) => {
		if(index === lastIndex){
			return true;
		} else {
			return false;
		}
	}
	
	const handleUpdateDomens = useCallback(async () => {
		const token = await getIdTokenClaims();
		await updateDomens({
			domens: formData.domens,
            userId: token.sub,
        });
	}, [formData, getIdTokenClaims]);
	
	console.log('domens', domens)
	console.log('inputList', inputList)
	
	const DomensList = () => {
		if(domens && domens.length > 0){
			return (
			<div className="domensList">				
				{inputList.map((x, i) => {
					return (
						<div className="domen">
							<input name="domens[]" key={i} value={x.value} autoFocus={handleFocusChange(i)} placeholder="https://yoursite.address" onChange={e => handleDomenChange(e, i)} />
							<div className="addAndRemove">
								{inputList.length - 1 === i && 
									<div className="addDomen ant-btn ant-btn-primary" onClick={handleAddDomen}>
										+
									</div>
								}
								{inputList.length !== 1 &&
								<div className="removeDomen ant-btn ant-btn-primary redButton" onClick={() => handleRemoveDomen(i)}>
									-
								</div>
								}
							</div>
						</div>
					)
				})}
				
			</div>
			)
		} else {
			return ( 
			<div className="domensList">
				{inputList.map((x, i) => {
					return (
						<div className="domen">
							<input key={i} name="domens[]" autoFocus={handleFocusChange(i)} value={x.value} placeholder="https://yoursite.address" onChange={e => handleDomenChange(e, i)} />
							<div className="addAndRemove">
								{inputList.length - 1 === i && 
									<div className="addDomen ant-btn ant-btn-primary" onClick={handleAddDomen}>
										+
									</div>
								}
								{inputList.length !== 1 &&
								<div className="removeDomen ant-btn ant-btn-primary redButton" onClick={() => handleRemoveDomen(i)}>
									-
								</div>
								}
							</div>
						</div>
					)
				})}
			</div> 
			)
		}
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
        return <Container className="home">
            <Skeleton active />
        </Container>
    }
    const dt = dayjs(registrationDate);
	
    return idKey ? (<Container className="home">
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
		
		<DomensList />
		
		<Row middle="xs">
            <Col xs={4}>
                <Button className="full-width" type="primary" onClick={handleUpdateDomens} style={{ marginBottom: '20px', marginRight: '20px' }}>
                    Update Domains
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
    </Container>): <Container className="home">
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
			
			<DomensList />
			
			<br />
			<br />
			
            <Row center="xs">
                <Col xs={12}>
                <Button disabled={!formData.appName && !formData.domens} onClick={handleRegisterApp} size="large" type="primary">
                    Next
                </Button>
                </Col>
            </Row>
        </Form>
    </Container>
}

export default Home;