import React, {useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import Web3 from 'web3';

export default function Home() {
    const { user } = useAuth();
    const getUser = useUser();
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getUser();
        const fetchBalance = async () => {

          const nodeUrls = [
            'https://cloudflare-eth.com',
            'https://main-rpc.linkpool.io',
            'https://mainnet.eth.cloud.ava.do',
            'https://eth-mainnet.public.blastapi.io'
          ];
    
          let web3;
          let balanceWei;
    
          for (let url of nodeUrls) {
            try {
            web3 = new Web3(url);
            balanceWei = await web3.eth.getBalance(user.wallet_address);
              break;
            } catch (err) {
              console.error(`Error with node ${url}:`, err);
            }
          }
    
          if (balanceWei) {
            const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
            setBalance(parseFloat(balanceEth).toFixed(4));
          } else {
            setError('Unable to fetch balance from any node');
          }
        };
    
        if (user.wallet_address) {
          fetchBalance();
        }
    }, [ user.wallet_address ]);

    return (
        <div className='container mt-3'>
            <h2>
                <div className='row'>
                    <div className="mb-12">
                        { 
                            user?.email === undefined ? 'Please login first' : 
                            <div>
                                <p>Hello {user.first_name}, your public key is {user.wallet_address}</p>
                                <p>{balance ? `Your balance is ${balance}` :  "Loading..."}</p>
                            
                            </div>
                        }
                    </div>
                </div>
            </h2>
        </div>
    )
}
