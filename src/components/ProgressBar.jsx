import React from 'react';

const ProgressBar = (props) => {
  const { completed } = props;

  const progressColor = completed > 66 ? '#82b14e' : completed > 33 ? '#f4d05e' : '#d95403';

  const containerStyles = {
    height: 10,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: progressColor,
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles} />
    </div>
  );
};

export default ProgressBar;
