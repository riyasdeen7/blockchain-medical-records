import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" }); // Forces MetaMask to pop up
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server OR the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
// 'http://127.0.0.1:7545'  
 'https://sepolia.infura.io/v3/f05f1b0b1dba457580e000fdd15b20fe'
  );
  web3 = new Web3(provider);
}

export default web3;