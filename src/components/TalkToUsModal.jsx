import React from 'react';
//import { InlineWidget } from 'react-calendly';
import { CloseOutlined } from "@ant-design/icons";
import { Typography } from 'antd';

const TalkToUsModal = (props) => {
  const { onClose } = props;
  const CALENDLY_USERNAME = "ijan-1";
  return (
    <div className="talk-modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="close-section" onClick={onClose}>
            <Typography style={{ fontSize: '16px', marginRight: '5px', color: '#787878' }}> Close </Typography>
            <CloseOutlined style={{ fontSize: '20px', color: '#787878' }} />
          </div>
        </div>
        <iframe
		  title="Avalanche Calendly"
		  style={{ width: '700px', height: '500px', borderRadius: '10px', border: 'none' }}
          src={`https://calendly.com/${CALENDLY_USERNAME}?embed_domain=refer-customer-dashboard.vercel.app&embed_type=Inline`}
        />
        </div>
    </div>
  )
}

export default TalkToUsModal;