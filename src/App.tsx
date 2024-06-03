import React from 'react';
import GumballMachine from './components/GumballMachine';
import GlobalStyles from './styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <GumballMachine />
    </>
  );
};

export default App;
