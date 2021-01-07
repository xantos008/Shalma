import React, { useEffect, useState } from 'react';

import { Input,  Button } from 'antd';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { Grid, Col, Row } from 'react-flexbox-grid';
import { useAuth0 } from '@auth0/auth0-react';

// const register = () => {
//     const options = {
//         method: 'POST',
//         url: 'https://use-avalanche.us.auth0.com/oidc/register',
//         headers: {'content-type': 'application/json'},
//         data: {
//           client_name: 'My Dynamic Application',
//           redirect_uris: [
//             'https://application.example.com/callback',
//             'https://application.example.com/callback2'
//           ]
//         }
//       };
      
//       axios.request(options).then(function (response) {
//         console.log(response.data);
//       }).catch(function (error) {
//         console.error(error);
//       });

// }



const Home = () => {
    const { getIdTokenClaims } = useAuth0();
    const [idKey, setIdKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const { copyToClipBoard: copyIdClipBoardSuccess} = useCopyToClipboard("Site Key");
    const { copyToClipBoard: copyKeyClipBoardSuccess} = useCopyToClipboard("Secret Key");
    
    async function setToken(){
        const token = await getIdTokenClaims();
        localStorage.setItem("access_token", token.__raw);
        const appInfo = token["http://user/apps"];
        if(appInfo){
            setIdKey(appInfo.client_id);
            setSecretKey(appInfo.client_secret);
        }
        

    }
    useEffect(() => {
        setToken();
    }, []);
    return <Grid className="home">
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
    </Grid>
}

export default Home;