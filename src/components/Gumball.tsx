import React, { useState } from 'react';
import styled, { css } from 'styled-components';

interface GumballProps {
  color: string;
}

const GumballContainer = styled.div<{ isHovered: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  transition: transform 0.3s ease;

  ${(props) =>
  props.isHovered &&
  css`
      transform: scale(1.5);
    `}
`;

const Gumball: React.FC<GumballProps> = ({ color }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <GumballContainer
      color={color}
      isHovered={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
};

export default Gumball;
