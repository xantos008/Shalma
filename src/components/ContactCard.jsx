import React from 'react';
import { Button } from 'antd';

const ContactCard = ({ type, onContactClick }) => {

    return (
        <Button
            style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.2)',
                height: '100px',
                width: 'fit-content',
                padding: '15px',
            }}
            onClick={onContactClick}
        >
            <div style={{ marginBottom: '10px' }}>
                <img src={type === 'sales' ? '/business.png' : '/computer.png'} width={70} height={70} alt="talk to sales" />
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}> {type === 'sales' ? 'Talk to sales' : 'Talk to engineers' } </span>
            </div>
        </Button>
    );
}

export default ContactCard;