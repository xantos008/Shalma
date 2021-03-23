import React from 'react';

const Help = () => {
  const CALENDLY_USERNAME = "ijan-1";

  return (
     <div className="container__help">
          <iframe frameBorder="0" width="100%" height="100%" title="Avalanche Calendly" src={`https://calendly.com/${CALENDLY_USERNAME}?embed_domain=refer-customer-dashboard.vercel.app&embed_type=Inline`}></iframe>
     </div>
  )
}

export default Help;