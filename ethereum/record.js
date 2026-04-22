import web3 from './web3'
import Record from './build/Record.json';

const instance = new web3.eth.Contract(
    JSON.parse(Record.interface),
// '0xd9145CCE52D386f254917e481eB44e9943F39138'
    '0x4e48f0813D66E7bBCE817994B558b5760370a387'
);
export default instance;

