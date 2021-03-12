import React, { useCallback, useEffect, useState } from 'react';
import { Input,  Button, Skeleton, Typography } from 'antd';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
//import { Grid, Col, Row } from 'react-flexbox-grid';
import { Container, Row, Col } from 'reactstrap';
import Form from 'antd/lib/form/Form';
import { getApps, registerApp, updateDomens, getUiPreferences } from '../services/customerApi';
import SubscriptionAlert from './SubscriptionAlert';
import dayjs from 'dayjs';
import SubscriptionButton from './SubscriptionButton';
import { useAuth0 } from '@auth0/auth0-react';
import TalkToUsModal from './TalkToUsModal';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Card from './Card';
import ContactCard from './ContactCard';

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
	const [lastIndexPoint, setLastIndexPoint] = useState(0);
	
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
		const uiPreferences = await getUiPreferences({
			userId: token.sub
		});
        setIsLoading(false);
        const activeApp = apps[0];
		if(uiPreferences && uiPreferences.uiPreferences){
			localStorage.setItem('uiPreferences', JSON.stringify(uiPreferences.uiPreferences));
		} else {
			localStorage.setItem('uiPreferences', undefined);
		}
        if(activeApp){			
			localStorage.setItem('client_id', activeApp.client_id);
			localStorage.setItem('userId', token.sub);
						
            setIdKey(activeApp.client_id);
            setSecretKey(activeApp.client_secret);
			setDomens(activeApp.domens);
			setInputList(activeApp.domens);
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
		const uiPreferences = await getUiPreferences({
			userId: token.sub
		});
		
        const activeApp = apps[0];
		if(uiPreferences && uiPreferences.uiPreferences){
			localStorage.setItem('uiPreferences', JSON.stringify(uiPreferences.uiPreferences));
		} else {
			localStorage.setItem('uiPreferences', undefined);
		}
        if(activeApp){
			localStorage.setItem('client_id', activeApp.client_id);
			localStorage.setItem('userId', token.sub);
						
            setIdKey(activeApp.client_id);
            setSecretKey(activeApp.client_secret);
			setDomens(activeApp.domens);
			setInputList(activeApp.domens);
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
		setLastIndexPoint(e.target.selectionStart);
		setCaretPosition(e.target, lastIndexPoint);
		//start = e.target.selectionStart;
		//end = e.target.selectionEnd;		
	};
	
	const handleDomenClick = (e, i) => {
		setLastIndex(i);
		setLastIndexPoint(e.target.selectionStart);
	}
	
	const setCaretPosition = (ctrl, pos) => {
	  // Modern browsers
	  if (ctrl.setSelectionRange) {
		ctrl.focus();
		ctrl.setSelectionRange(pos, pos);
	  
	  // IE8 and below
	  } else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	  }
	}
	
	const handleFocusChange = (index) => {
		if(index === lastIndex){
			return true;
		} else {
			return false;
		}
	}
	
	const handleOnFocus = (e,i) => {
		setCaretPosition(e.target, lastIndexPoint);
	}
	
	const unFocusDomens = () => {
		setLastIndex(999);
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
						<div className="domen" key={i ? i : 0}>
							<input
                                name="domens[]"
                                key={i ? i : 0}
                                value={x.value}
                                onClick={e => handleDomenClick(e,i)}
                                onFocus={e => handleOnFocus(e,i)} autoFocus={handleFocusChange(i)}
                                placeholder="https://yoursite.address"
                                onChange={e => handleDomenChange(e, i)}
                                class="domain-input"
                            />
							<div className="addAndRemove">
								{inputList.length - 1 === i && 
									<div
                                        className="addDomen ant-btn"
                                        style={{ backgroundColor: '#82b14e', color: 'white', border: 'none' }}
                                        onClick={handleAddDomen}
                                    >
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
						<div className="domen" key={i ? i : 0}>
							<input
                                key={i ? i : 0}
                                name="domens[]"
                                onClick={e => handleDomenClick(e,i)}
                                onFocus={e => handleOnFocus(e,i)}
                                autoFocus={handleFocusChange(i)}
                                value={x.value}
                                placeholder="https://yoursite.address"
                                onChange={e => handleDomenChange(e, i)}
                                class="domain-input"
                            />
							<div className="addAndRemove">
								{inputList.length - 1 === i && 
									<div
                                        className="addDomen ant-btn ant-btn-primary"
                                        onClick={handleAddDomen}
                                        style={{ backgroundColor: '#82b14e', color: 'white', border: 'none' }}
                                    >
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
        {showSubscribtionAlert && 
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '30px',
                }}>
                <SubscriptionButton />
            </div>
        }
        {showSubscribtionAlert && <Row middle="xs">
            <Col xs={4}>
                <SubscriptionAlert startDate={dt} />
            </Col>
            <Col xs={4}>
                <Card
                    title="Site Key"
                    bgColor="#2abbb5"
                    bodyText={idKey}
                    onClickCopy={() => copyIdClipBoardSuccess(idKey)}
                />
            </Col>
            <Col xs={4}>
                <Card
                    title="Secret Key"
                    bgColor="#2eb384"
                    bodyText={secretKey}
                    onClickCopy={() => copyKeyClipBoardSuccess(secretKey)}
                />
            </Col>
        </Row>}
        <br />
        <br />
		
        <div className="domainsListContainer">
            <div style={{ marginBottom: '20px' }}>
                <span
                    style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textAlign: 'start',
                        color: '#484848',
                    }}>
                        Domains List
                </span>   
            </div>
            <DomensList />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Col xs={4} style={{ justifySelf: 'flex-end' }}>
                        <Button
                            className="full-width"
                            type="primary"
                            onClick={handleUpdateDomens}
                            style={{
                                backgroundColor: '#6eb8aa',
                                borderRadius: '10px',
                                height: '48px',
                                border: 'none'
                            }}
                        >
                            Update Domains
                        </Button>
                    </Col>
            </div>
        </div>
		
        <br />
        <br />
		<Row middle="xs" style={{ padding: '20px' }}>
            <div style={{ marginRight: '20px', marginBottom: '20px' }}>
                <ContactCard type="sales" onContactClick={handleSalesCalendly} />
            </div>
            <div style={{ marginRight: '20px', marginBottom: '20px' }}>
                <ContactCard type="engineer" onContactClick={handleEngineerCalendly} />
            </div>
            <Button
                style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.2)',
                    height: '100px',
                    width: 'fit-content',
                    padding: '15px',
                }}
                target="_blank"
                href={TUTORIAL_URL}
            >
                <div style={{ marginBottom: '10px' }}>
                    <img src="/tutorial.png" width={70} height={70} alt="Tutorial" />
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}> Tutorial </span>
                </div>
            </Button>
        </Row>
        {showCalendlyModal && (
            <div style={{ width: '100vw' }}>
                <TalkToUsModal onClose={handleCloseCalendly} duration={calendlyDuration} />
            </div>
        )}
    </Container>): <Container className="home">
        <Row style={{ marginBottom: '30px' }}>
            <Col xs={3} style={{ display: 'flex' }}>
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
                <Col xs={3} style={{ display: 'flex' }}>
                    App Name
                </Col>
                <Col xs={6}>
                    <Input value={formData.appName} onChange={(e) => {
                        setFormData(v => ({
                            ...v,
                            appName: e.target.value
                        }))
						unFocusDomens()
                    }} />
                </Col>
            </Row>
			
            <br />
			<br />
            <div className="domainsListContainer">
                <div style={{ marginBottom: '20px' }}>
                    <span
                        style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            textAlign: 'start',
                            color: '#484848',
                        }}>
                            Domains List
                    </span>   
                </div>
                <DomensList />
            </div>
			
			<br />
			<br />
			
            <Row center="xs">
                <Col xs={12}>
                <Button
                    disabled={!formData.appName || (formData.domens && formData.domens[0] && formData.domens[0].value.length === 0)}
                    onClick={handleRegisterApp}
                    size="large"
                    type="primary"
                    style={{
                        backgroundColor: '#6eb8aa',
                        borderRadius: '10px',
                        height: '48px',
                        border: 'none'
                    }}
                >
                    Next
                </Button>
                </Col>
            </Row>
        </Form>
    </Container>
}

export default Home;