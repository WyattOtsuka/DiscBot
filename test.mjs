import { plot } from 'nodeplotlib';
import sha256 from 'crypto-js/sha256.js';
import hmac from 'crypto-js/hmac-sha256.js';

var seed = 5;
var hash = genGameHash(seed);
var crashs = [];
for (var i = 0; i < 1000; i++) {
    var salt = genGameHash(hash);
    console.log(crashPointFromHash(hash, salt));
    crashs.push(crashPointFromHash(hash, salt));
    hash = genGameHash(salt);
}

const data = [{
    x: crashs,
    type: 'histogram',
}, ];

console.log(crashs)

plot(data);

function crashPointFromHdash(serverSeed, salt) {
    // see: provably fair seeding event

    var hash = hmac(serverSeed, salt);

    // In 1 of 101 games the game crashes instantly.
    if (divisible(hash, 101))
        return 0;

    // Use the most significant 52-bit from the hash to calculate the crash point
    var h = parseInt(hash.slice(0, 52 / 4), 16);
    var e = Math.pow(2, 52);

    return (Math.floor((100 * e - h) / (e - h)) / 100).toFixed(2);
};

function genGameHash(serverSeed) {
    return sha256(serverSeed).toString()
};

function divisible(hash, mod) {
    // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
    var val = 0;

    var o = hash.length % 4;
    for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
        val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
    }

    return val === 0;
}