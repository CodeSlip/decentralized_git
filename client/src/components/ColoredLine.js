import React from 'react';


const ColoredLine = ({ color }) => (
    <hr
    style={{
        boxShadow: `15px 40px 15px ${color}`,
    }}
  />
);

export default ColoredLine;