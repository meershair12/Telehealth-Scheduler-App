// generate-keys.js (run on server admin machine)
const { generateKeyPairSync } = require('crypto');
const fs = require('fs');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

fs.writeFileSync('rsa_public.pem', publicKey);
fs.writeFileSync('rsa_private.pem', privateKey);
console.log('Keys generated: rsa_public.pem, rsa_private.pem');
