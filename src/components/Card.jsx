import React from 'react';
import { Card, Input, Button } from 'antd';

const MainCard = ({ title, bgColor, bodyText, onClickCopy }) => {
    return (
        <Card
            style={{
                backgroundColor: bgColor,
                color: 'white',
                borderRadius: '10px',
        }}>
            <div style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}> {title} </span>
            </div>
            <div style={{ width: '100%', marginBottom: '10px', display: 'flex'}}>
                <Input
                  style={{
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginRight: '10px'
                  }}
                  value={bodyText}
                  disabled
                />
                <Button
                  style={{
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                  onClick={onClickCopy}
                >
                    Copy  
                </Button>
            </div>
        </Card>
    );
}

export default MainCard;
