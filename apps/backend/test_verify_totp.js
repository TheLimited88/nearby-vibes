const speakeasy = require('speakeasy');

const secret = 'NFQX2XSLJYZUWRDNHRMHI4ZOEVLEKXSRFA4C6U33I43UIVCMJYXA';

// Generate a token
const token = speakeasy.totp({
  secret: secret,
  encoding: 'base32',
});

console.log('Generated token:', token);

// Verify it immediately
const verified = speakeasy.totp.verify({
  secret: secret,
  encoding: 'base32',
  token: token,
  window: 2,
});

console.log('Verified:', verified);
