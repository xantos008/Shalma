import React from 'react';
import { InlineWidget } from 'react-calendly';
import { CloseOutlined } from "@ant-design/icons";
import { Typography } from 'antd';

const TalkToUsModal = (props) => {
  const { onClose, duration } = props;
  const CALENDLY_USERNAME = "kamilla-kenzhekhankyzy";
  return (
    <div className="talk-modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="close-section" onClick={onClose}>
            <Typography style={{ fontSize: '16px', marginRight: '5px', color: '#787878' }}> Close </Typography>
            <CloseOutlined style={{ fontSize: '20px', color: '#787878' }} />
          </div>
        </div>
        <InlineWidget
          styles={{ width: '700px', height: '500px', borderRadius: '10px' }}
          url={`https://calendly.com/${CALENDLY_USERNAME}/${duration}`}
        />
        </div>
    </div>
  )
}

export default TalkToUsModal;