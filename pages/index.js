import Head from 'next/head'
import { useMoralis } from 'react-moralis';
import Feed from '../components/Feed'
import Header from '../components/Header'
import { Layout} from "antd";
import "antd/dist/antd.css";
import { useMoralisDapp } from '../providers/MoralisDappProvider/MoralisDappProvider';
import { useEffect, useState } from "react"
import FeedAvax from '../components/FeedAvax';
import FeedMultichain from '../components/Multichain/FeedMultichain';

export default function Home() {
  const {chainId} = useMoralisDapp();

  const [isAvax, setIsAvax] = useState(true);
  useEffect(() => {
      if(chainId == 0xa869){ // Avalanche testnet
          setIsAvax(true);
      }else if(chainId == 0x61){      // BSC testnet
          setIsAvax(false)
      }
  }, [chainId]);
  // const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } = useMoralis();

  // useEffect(() => {
  //   if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated, isWeb3Enabled]);


  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      <Head>
        <title>TAURUSnet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>




      <Header />

      {/* <FeedMultichain/> */}

      {isAvax ? (
        <FeedAvax />
      ) : (
        <Feed />
      )

      }
      {/* <Feed /> */}

      {/*Modal*/}

    </div>
  )
}
