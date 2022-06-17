const algosdk = require("algosdk");

const TOKEN = ""; // Top secret, do not share.
const SERVER = "https://node.algoexplorerapi.io";

exports.client = new algosdk.Algodv2(TOKEN, SERVER, 443);
