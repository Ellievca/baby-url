const { nanoid } = require('nanoid');

const keyPool = []; // array to hold pre-generated codes
const POOL_SIZE = 100; // number of codes to keep in the pool

function fillPool() {
    // keeps adding codes until pool reaches POOL_SIZE
    while (keyPool.length < POOL_SIZE) {
        keyPool.push(nanoid(6)); // generate a 6 char code
    }
}

function getBabyCode() {
    if (keyPool.length < 10) fillPool(); // refills pool if its running low
    return keyPool.shift(); // removes and returns the first code in the pool 
}

// fill the pool once when the server starts
fillPool();

module.exports = { getBabyCode };