import React from 'react';
import {
    Accordion,
  } from 'react-bootstrap';


 export const Cart = (props) => {
    return <Accordion defaultActiveKey="0">{props}</Accordion>;
  };