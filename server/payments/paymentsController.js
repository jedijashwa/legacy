var braintree = require("braintree");

module.exports.gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "sqnqd3tw9zy2825y",
  publicKey: "ygfyswpbrf99qwfs",
  privateKey: "4b9a44093df61968907db87bb9319854"
});
