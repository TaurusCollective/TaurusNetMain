import { MoralisProvider } from 'react-moralis';
// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
import 'antd/dist/antd.css';
import '../styles/globals.css'
import '../styles/marketAndaMyNfts.css'
import { MoralisDappProvider } from '../providers/MoralisDappProvider/MoralisDappProvider'

import React from "react" 
React.useLayoutEffect = React.useEffect 

const APP_ID = process.env.NEXT_PUBLIC_REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_REACT_APP_MORALIS_SERVER_URL;

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <MoralisDappProvider>
        <Component {...pageProps} />
      </MoralisDappProvider>
    </MoralisProvider>
  );
}

export default MyApp
