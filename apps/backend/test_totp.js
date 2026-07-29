const speakeasy = require('speakeasy');

const secret = 'NFQX2XSLJYZUWRDNHRMHI4ZOEVLEKXSRFA4C6U33I43UIVCMJYXA';

const token = speakeasy.totp({
  secret: secret,
  encoding: 'base32',
});

console.log('Generated TOTP token:', token);
