import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import { Input,  Button, Skeleton, Typography } from 'antd';
import { Container, Row, Col } from 'reactstrap';
import Form from 'antd/lib/form/Form';
import { getApps, registerApp } from '../services/customerApi';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const Statistics = () => {
    const [registrationDate, setRegistrationDate] = useState("");
	const demoData = [{"id":null,"host":null,"email":"amote1234@mail.ru","name":"Igor Rykin","referral_code":"GIAvpAe0V","referrer":"marizev8@gmail.com","time_added":null,"client_id":"nLePbkmAhPgHilc737V8PqWfnVe1z2jx","accepted_time":null,"reward_claimed":null,"signed_up":null,"upgraded":null,"status":"An invitation has been sent"},{"id":null,"host":null,"email":"amote1234@mail.ru","name":"Igor Rykin","referral_code":"Nx6J51fr4","referrer":"rykinigor@gmail.com","time_added":null,"client_id":"nLePbkmAhPgHilc737V8PqWfnVe1z2jx","accepted_time":null,"reward_claimed":null,"signed_up":null,"upgraded":null,"status":"An invitation has been sent"},{"id":null,"host":null,"email":"amote1234@mail.ru","name":"zxvzvzd asdfasdf","referral_code":"DO9ifryje","referrer":"adsfasdf","time_added":null,"client_id":"nLePbkmAhPgHilc737V8PqWfnVe1z2jx","accepted_time":null,"reward_claimed":null,"signed_up":1613052728336,"upgraded":"1613052732428","status":"Invitation accepted"},{"id":null,"host":null,"email":"amote1234@mail.ru","name":"zxvzvzd asdfasdf","referral_code":"DO9ifryje","referrer":"adsfasdf","time_added":null,"client_id":"nLePbkmAhPgHilc737V8PqWfnVe1z2jx","accepted_time":null,"reward_claimed":null,"signed_up":1613052728336,"upgraded":"1613052732428","status":"Invitation accepted"},{"id":null,"host":null,"email":"dgfh@mail.ru","name":"sfgdfg sdfgsdg","referral_code":"2BvVvKTi3","referrer":"sdfgsdfg","time_added":null,"client_id":"nLePbkmAhPgHilc737V8PqWfnVe1z2jx","accepted_time":null,"reward_claimed":null,"signed_up":null,"upgraded":null,"status":"An invitation has been sent"}];
	
    
    return <div className="statistics">
		
	</div>
}

export default Statistics;