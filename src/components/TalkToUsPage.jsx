import React from 'react';
import { InlineWidget } from 'react-calendly';
import { Grid } from 'react-flexbox-grid';

const TalkToUsPage = () => {
  const CALENDLY_USERNAME = "kamilla-kenzhekhankyzy";
  return (
    <Grid className="talk-page">
        <InlineWidget
          styles={{ width: '700px', minHeight: '500px', height: '90%', borderRadius: '10px', marginBottom: 0 }}
          url={`https://calendly.com/${CALENDLY_USERNAME}`}
        />
    </Grid>
  )
}

export default TalkToUsPage;