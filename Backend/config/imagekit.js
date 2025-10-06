const { config } = require("dotenv");
const ImageKit = require("imagekit");

config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

module.exports = imagekit;
