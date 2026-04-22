const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledRecord = require('./build/Record.json');

const provider = new HDWalletProvider({
  mnemonic: { phrase: 'gesture cave insane husband hope kidney habit long push garage shrug capable' },
  providerOrUrl: 'https://sepolia.infura.io/v3/f05f1b0b1dba457580e000fdd15b20fe',
  networkCheckTimeout: 1000000, 
  timeoutBlocks: 200            
});


const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    
    // 1. Fix: Ensure bytecode has exactly ONE '0x' prefix
    const bytecode = compiledRecord.bytecode.startsWith('0x') 
      ? compiledRecord.bytecode 
      : '0x' + compiledRecord.bytecode;

    const deploymentData = { data: bytecode };
    console.log('Attempting to deploy from account', accounts[0]);

    // 2. Fix: Parse ABI if it's a string, or use directly if it's an object
    const abi = typeof compiledRecord.interface === 'string' 
      ? JSON.parse(compiledRecord.interface) 
      : compiledRecord.abi;

    const contract = new web3.eth.Contract(abi);

    // 3. Dynamic Gas Estimation
    const estimatedGas = await contract.deploy(deploymentData).estimateGas();
    console.log('Estimated Gas needed:', estimatedGas);

    // 4. Fix: Use a standard 1.2x safety buffer (4.1x is way too high)
    const result = await contract
      .deploy(deploymentData)
      .send({ 
        gas: Math.floor(estimatedGas * 1.2), 
        gasPrice: web3.utils.toWei('1.5', 'gwei'), // Fixed price for consistency
        from: accounts[0] 
      });

    console.log('Contract successfully deployed to:', result.options.address);
  } catch (err) {
    console.error('DEPLOYMENT ERROR:', err.message);
  } finally {
    provider.engine.stop(); // Cleanly close the connection
  }
};

deploy();