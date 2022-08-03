import { ethers } from 'ethers';
import { useCallback, useContext, useEffect, useState } from 'react';
import Metamask from '../assets/metamask.svg';
import CopyTextLight from '../assets/copy-text-light.svg';
import CopyTextDark from '../assets/copy-text-dark.svg';
import ExternalLinkLight from '../assets/external-link-outline-light.svg';
import ExternalLinkDark from '../assets/external-link-outline-dark.svg';
import { ThemeContext } from './Layout';

interface IWallet {
  address: string,
  balance?: string,
  ethPrice?: string,
}

export default function Wallet() {
  const [wallet, setWallet] = useState<IWallet>({address: "",balance: "",ethPrice:""});
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const theme = useContext(ThemeContext);

  const connect = async () => {
    if (window.ethereum && !isConnected) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet({address: accounts[0]});
      setIsConnected(true);
        window.ethereum.on("accountsChanged", accountWasChanged);
        window.ethereum.on("chainChanged", chainWasChanged);
        window.ethereum.on("disconnect", userWasDisconnected);

    } else {
      alert("install metamask extension!!");
      setIsConnected(false);
    }
  }
  const accountWasChanged = () => {
    window.location.reload();     
  }
  const chainWasChanged = () => {
    window.location.reload();     
  }
  const userWasDisconnected = () => {
    setWallet({address:''});
    setIsConnected(false)   
  }


  const fetchBalance = useCallback(async () => {
    const balance = await window.ethereum.request({ method: "eth_getBalance", params: [wallet.address, "latest"] });
    const resp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=fals&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false');
    const data = await resp.json(); 
    setWallet({...wallet,balance: ethers.utils.formatEther(balance),ethPrice:data.ethereum.usd});

  }, [wallet]);

  useEffect(() => {
    if(!isConnected){
      connect()
    }else {
      fetchBalance();
    }

  }, [wallet.address])

  return (
    <div className="mx-auto max-w-2xl py-8">
      {!isConnected ? (
        <div className="flex flex-col items-center">
        <img src={Metamask} alt="metamask" className="w-60" />

        <span className="text-4xl font-medium tracking-widest">
          METAMASK
        </span>

        <button
          className="bg-green-500 rounded-md h-10 px-5 mt-10"
          type='button'
          onClick={connect}>
          Connect wallet
        </button>
      </div>
        
      ) : (
        <div className="w-full bg-slate-100 dark:bg-gray-800 flex flex-col itens-center bg-wallet p-4 rounded">
          <div className="flex justify-between border-b border-stone-700 pb-2">
            <span className="font-semibold flex items-center">
              <img
                src={'https://wiki.energi.world/energi_logo_-_icon.png'}
                alt="energi swap"
                className="w-4 h-4 mr-2" />
              Energi Network
            </span>
            <span className="flex items-center text-green-400 text-xs">
              <div className="bg-green-400 w-2 h-2 rounded-full mr-2" />
              Connected
            </span>
          </div>

          <div className="flex justify-between mt-4">
            <span className="flex text-sm">
              <img src={Metamask} alt="metamask icon" className="w-4 mr-2" />
              {wallet.address.slice(0, 5) + "..." + wallet.address.slice(-8)}
            </span>
            <div className="flex">
              <button onClick={() => { window.navigator.clipboard?.writeText(wallet.address) }}>
                <img src={theme === 'light' ? CopyTextDark : CopyTextLight} className="w-4" alt="copy" />
              </button>
              <a href={`https://etherscan.io/address/${wallet.address}`} className='ml-4' target="blank">
                <img src={theme === 'light' ? ExternalLinkDark : ExternalLinkLight} alt="external link" className='w-5' />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center mt-5 mb-20">
            <span className="text-gray-500 text-xs" >
              Total Balance
            </span>
            <span className="mt-5 flex items-center text-xl">
              <img
                src={'https://wiki.energi.world/energi_logo_-_icon.png'}
                alt="energi swap"
                className="w-7 h-7 mr-2" />
              {wallet.balance}
            </span>
            <span className="text-3xl whitespace-nowrap" >
              $ {parseFloat(wallet.balance || '0') *  parseInt(wallet.ethPrice|| "")}
            </span>
          </div>
        </div>

        
      )}
    </div>
  )
}