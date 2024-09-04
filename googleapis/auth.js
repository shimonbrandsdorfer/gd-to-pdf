const axios = require("axios");
const qs = require("qs");

const BASE_URL = `https://accounts.google.com/o/oauth2/v2/auth`;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SCOPES = ["https://www.googleapis.com/auth/drive"];
let redirect_uri = `http://localhost:${process.env.PORT}/google-callback`;
  

const service = {
  getGoogleAuthLink,
  handleGoogleResponse,
  getGoogleCode,
  exchangeForToken
};

function getGoogleAuthLink() {
  let scope = SCOPES.join(" ");
  return `${BASE_URL}?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`;
}

async function handleGoogleResponse({ code }) {
  service.code = code;
  await exchangeForToken(code);
  return {success : true};
}

function getGoogleCode() {
  return service.code;
}

async function exchangeForToken(code) {
  try{
  let {data} = await axios({
    url: "https://oauth2.googleapis.com/token",
    method : 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data : qs.stringify({
        client_id : CLIENT_ID,
        client_secret : CLIENT_SECRET,
        code,
        redirect_uri,
        grant_type : 'authorization_code'
    })
  });

  service.access_token = data.access_token;
  return data;
} catch(e){
  console.log(e);
}
}

module.exports = service;
