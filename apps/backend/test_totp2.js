const speakeasy = require('speakeasy');
const secret = process.argv[1];
const token = speakeasy.totp({
  secret: secret,
  encoding: 'base32',
});
console.log(token);
