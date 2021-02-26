import React from 'react';
//import { InlineWidget } from 'react-calendly';
//import { Grid } from 'react-flexbox-grid';
import { Container } from 'reactstrap';

const TalkToUsPage = () => {
  const CALENDLY_USERNAME = "ijan-1";
  return (
    <Container className="talk-page">
        <iframe
		  title="Avalanche Calendly"
          style={{ width: "700px", minHeight: '500px', height: '90%', borderRadius: '10px', border: 'none', marginBottom: 0 }}
          src={`https://calendly.com/${CALENDLY_USERNAME}?embed_domain=refer-customer-dashboard.vercel.app&embed_type=Inline`}
        />
    </Container>
  )
}

export default TalkToUsPage;