import React from 'react';
import styled from 'styled-components';
import Gumball from './Gumball';

const GumballMachineContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  height: 300px;
  border: 2px solid #000;
  padding: 10px;
  background-color: #f1f1f1;
`;

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF4'];

const GumballMachine: React.FC = () => {
  return (
    <GumballMachineContainer>
      {colors.map((color, index) => (
        <Gumball key={index} color={color} />
      ))}
    </GumballMachineContainer>
  );
};

export default GumballMachine;
