import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import "./App.css";
import { useState, useEffect } from "react";
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {

  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId)

      const sepoliaChainId = '0xaa36a7'

      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const sepoliaChainId = '0xaa36a7'

    if (chainId !== sepoliaChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  });

  return (
    <>
    <Box 
      sx={{
       
        width: '100%',
        alignItems: 'center',
        
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
      }}
    >
      <div sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', top: 0 }}>
  {theme.palette.mode} mode
  <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
    {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
  </IconButton>
</div>

    
    <div> 
    {currentAccount === '' ? (
      <button
      className='connect_button'
      onClick={connectWallet}
      >
      Connect Wallet
      </button>
      ) : correctNetwork ? (
        <div className="app">
          <Sidebar />
          <Feed />
          <Widgets />
        </div>
      ) : (
      <div className='prompt'>
      <div>----------------------------------------</div>
      <div>Please connect to the Sepolia Testnet</div>
      <div>and reload the page</div>
      <div>----------------------------------------</div>
      </div>
    )}
    </div>
    </Box>
    </>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

