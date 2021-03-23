import React, { useCallback, useEffect, useState } from 'react';
import { Container, Row, Card, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import { getApps, registerApp, updateDomens, getUiPreferences } from '../../services/customerApi';

import SubscriptionInformation from '../../components/ui/SubscriptionInformation';
import SubscriptionAlert from '../SubscriptionAlert';
import { useAuth0 } from '@auth0/auth0-react';
import dayjs from 'dayjs';

const Dashboard = () => {
    const { getIdTokenClaims } = useAuth0();

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

    const [adsMethod, setAdsMethod] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
     const [inputList, setInputList] = useState([{value: ""}]);
     const [lastIndex, setLastIndex] = useState(0);
     const [lastIndexPoint, setLastIndexPoint] = useState(0);
     
     const [formData, setFormData] = useState({
          appName: generateAppName(10),
          domens: inputList
     });     
	 
	 console.log(adsMethod);
    
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

         // console.log(e.target.value);
        setAdsMethod(`${e.target.value}`);
        localStorage.setItem('ads_method', e.target.value);
        if (e.target.value.length > 1) {
            setErrorMessage('');
        }
    }


     
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
     
     const DomensList = () => {
          if(domens && domens.length > 0){
               return (
                    <>
                    <div className="domensList">    
                         {inputList && inputList.map((x, i) => {
                              return (
                                   <div className="domen input-group mb-3" key={i ? i : 0}>
                                        <input
                                     name="domens[]"
                                     key={i ? i : 0}
                                     value={x.value}
                                     onClick={e => handleDomenClick(e,i)}
                                     onFocus={e => handleOnFocus(e,i)} autoFocus={handleFocusChange(i)}
                                     placeholder="https://yoursite.address"
                                     onChange={e => handleDomenChange(e, i)}
                                     className="domain-input form-control"/>
                                        <div className="addAndRemove input-group-append">
                                             {inputList.length !== 1 && <div className="removeDomen btn btn-danger redButton" onClick={() => handleRemoveDomen(i)}>Remove domain</div>}
                                        </div>
                                   </div>
                              )
                         })}
                    </div>
                    <Button className="addDomen" variant="primary" onClick={handleAddDomen}>Add one more domain</Button>
               </>
               )
          } else {
               return ( 
               <>
               <div className="domensList">
                    {inputList && inputList.map((x, i) => {
                         return ( <div className="domen input-group mb-3" key={i ? i : 0}>
                                   <input key={i ? i : 0} name="domens[]" onClick={e => handleDomenClick(e,i)} onFocus={e => handleOnFocus(e,i)} autoFocus={handleFocusChange(i)} value={x.value} placeholder="https://yoursite.address"
                                onChange={e => handleDomenChange(e, i)} className="domain-input form-control"/>
                                   <div className="addAndRemove input-group-append">
                                        {inputList.length !== 1 && <div className="removeDomen btn btn-danger redButton" onClick={() => handleRemoveDomen(i)}>Remove domain</div>}
                                   </div>
                              </div>
                         )
                    })}
               </div>
               <Button className="addDomen" variant="primary" onClick={handleAddDomen}>Add one more domain</Button>
               </>
               )
          }
     };

     if(isLoading){
        return <div className="container__loading"><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
     }
     
     const dt = dayjs(registrationDate);

     return idKey ? <div className="p-4">

                         

                         {showSubscribtionAlert && <div className="sidebar__subscription-status"><SubscriptionAlert startDate={dt}/></div>}

                         <h4 className="mb-4 d-flex justify-content-between">Your Apps {showSubscribtionAlert && <SubscriptionInformation /> }</h4>
                         
                         <Container className="container_home">
                         
                         {showSubscribtionAlert && 
                              
                                   <Row>

                                        <Card className="border-0 col-md-6">
                                             <Card.Body>
                                                  <Card.Title>App</Card.Title>
                                                  <InputGroup className="mb-3">
                                                       <FormControl disabled placeholder="Site Key" aria-label="Site Key" aria-describedby="site-key" value={idKey}/>
                                                       <InputGroup.Append>
                                                            <Button variant="outline-secondary" onClick={() => copyIdClipBoardSuccess(idKey)}>Copy</Button>
                                                       </InputGroup.Append>
                                                  </InputGroup>
                                                  <InputGroup className="mb-3">
                                                       <FormControl disabled placeholder="Secret Key" aria-label="Secret Key" aria-describedby="secret-key" value={secretKey}/>
                                                       <InputGroup.Append>
                                                            <Button variant="outline-secondary" onClick={() => copyKeyClipBoardSuccess(secretKey)}>Copy</Button>
                                                       </InputGroup.Append>
                                                  </InputGroup>                                   
                                             </Card.Body>
                                        </Card>

                                   </Row>
                              
                         }
                         </Container>

                         <h4 className="mt-4 mb-4">Your Domains</h4>
                         <Container className="container_home">
                              
                              <Row>
                                   <Card className="border-0 col-md-6">
                                        <Card.Body>
                                             <div className="mb-3">
                                             <DomensList/>
                                             </div>
                                             <Button variant="primary" onClick={handleUpdateDomens}>Update Domains</Button>
                                        </Card.Body>
                                        
                                   </Card>                                     
                              </Row>
                         </Container>
          
                    </div>
     : 
                    <div className="p-4">
                         <h4 className="mb-4">Create App</h4>
                         <Container className="container_home">               
                              <Row>
                                   <Card className="border-0 col-md-6">
                                        <Card.Body>
                                             {errorMessage}
                                             <Form>
                                                  <Form.Group controlId="exampleForm.SelectCustom" onChange={handleMenuClick}>
                                                       <Form.Label>How did you hear about us?</Form.Label>
                                                       <Form.Control as="select" defaultValue="">
                                                            <option value="">Select</option>
                                                            <option value="Google">Google</option>
                                                            <option value="Quora">Quora</option>
                                                            <option value="Betalist">Betalist</option>
                                                            <option value="Hackernews">Hackernews</option>
                                                            <option value="Stackoverflow">Stackoverflow</option>
                                                            <option value="Other">Other</option>    
                                                       </Form.Control>
                                                  </Form.Group>
                                                  <Form.Group controlId="exampleForm.ControlInput1">
                                                       <Form.Label>App Name</Form.Label>
                                                       <Form.Control value={formData.appName} onChange={(e) => {
                                                            setFormData(v => ({ ...v, appName: e.target.value })) 
                                                            unFocusDomens() 
                                                       }}/>
                                                  </Form.Group>
                                                  <Form.Group controlId="exampleForm.ControlInput1">
                                                       <Form.Label>Domains List</Form.Label>
                                                       <DomensList />
                                                  </Form.Group>
                                                  <Button variant="primary" onClick={handleRegisterApp} disabled={!formData.appName || (formData.domens && formData.domens[0] && formData.domens[0].value.length === 0)}>
                                                      Next
                                                  </Button>
                                             </Form>                                
                                        </Card.Body>
                                   </Card>                              
                              </Row>
                         </Container>
                    </div>
}

export default Dashboard;