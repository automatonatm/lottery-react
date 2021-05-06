
import './App.css';
import React, {useEffect, useState} from "react";
import web3 from './web3'

import lottery from  './lottery'
import Message from "./Message";


const App = ()  => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [manager, setManager] = useState('');
    const [lastWinner, setLastWinner] = useState('');
    const [balance, setBalance] = useState('');
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');
    const [entryAmount, setEnterAmount] = useState('');
    const [players, setPlayers] = useState([]);


    useEffect( () => {

         lottery.methods.manager().call().then(m => {setManager(m)});

        // lottery.methods.lastWinner().call().then(w => {setLastWinner(w)});

         web3.eth.getAccounts().then(a => setCurrentAccount(a[0]))

         lottery.methods.getPlayers().call().then(p => setPlayers(p));

         web3.eth.getBalance(lottery.options.address).then(b => setBalance(b));


    },[]);

    const clear = () => setMessage('');

    const submitHandler =  async (e) => {
        e.preventDefault();

        setLoading(true);

        console.log(currentAccount)


        if(entryAmount === '')  {
            setMessage(`Enter Some Ethers to Continue`);
            setType('danger');
            setLoading(false);
            return
        }


        const accounts  = await web3.eth.getAccounts();

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(entryAmount, 'ether')
        });

        setLoading(false);
        setMessage(`You have entered the Lottery Successfully`);
        setType('success')


    };

    const pickWinnerHandler = async () => {
        setLoading(true);
        if(balance < 0) {
            setMessage(`Contract Balance is Zero `);
            setType('danger');
            setLoading(false);
            return
        }

        await lottery.methods.pickWinner().send({from: manager});

        setLoading(false)
        setMessage(`Lottery Ended`);
        setType('success')




    }


  return (
    <div className="container">
        <div className="row">
            <div className="justify-content-center pt-10">
                <h2>Lottery Contract</h2>
                <div className="col-md-12">
                    <p className="">
                        Manager: {manager}
                    </p>

                    <p className="">
                        Current User  : {currentAccount}
                    </p>


                    <p>
                        There are currently {players.length} people entered, competing to win  {web3.utils.fromWei(balance, 'ether')} ether!
                    </p>


                    <div className="col-md-6 offset-2">
                        <h4>Wanna try your Luck? </h4>

                        <form onSubmit={submitHandler}>
                            <div className="col-md-12 mb-1">
                                <label>Amount of Enter</label>
                                <input onChange={(e) => setEnterAmount(e.target.value)} className="form-control" type="text"/>

                            </div>
                            {message && <Message clear={clear} message={message} type={type} />}

                            {
                                manager !== currentAccount ?
                                    (<button type="submit" disabled={loading}  className="btn btn-sm btn-success ml-2">{loading ? 'Entering Please Wait...' : 'Enter Lottery' }</button>)
                                    :  (<button type="button" onClick={pickWinnerHandler} disabled={loading}  className="btn btn-sm btn-success ml-2">{loading ? ' Please Wait...' : 'Pick Winner' }</button>)
                            }


                        </form>

                    </div>

                </div>

            </div>
        </div>

    </div>
  );
};

export default App;
