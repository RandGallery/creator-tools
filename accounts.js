const algosdk = require("algosdk");

let passphrases;

try {
  passphrases = require("./passphrases.json");
} catch (err) {
  console.error(
    "Please create a passphrases.json file by copying the passphrases.example.json file"
  );
  process.exit(1);
}

exports.accounts = passphrases.reduce((accounts, passphrase) => {
  const account = algosdk.mnemonicToSecretKey(passphrase);
  accounts[account.addr] = account;
  return accounts;
}, {});
