const axios = require("axios");
const AuthService = require("./auth");

async function getDocumentContnet(fileId) {
  let url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  return callWithAccesToken(url);
}

async function exportAsPdf(fileId) {
  let url = `https://www.googleapis.com/drive/v3/files/${fileId}/export`;
  return callWithAccesToken(
    url,
    {
      mimeType: "application/pdf",
    },
    {
      responseType: "arraybuffer",
    }
  );
}

//helpers

async function callWithAPIKey(url, additional_params = {}, config = {}) {
  let { data } = await axios.get(url, {
    params: {
      key: process.env.GOOGLE_API_KEY,
      ...additional_params,
    },
    ...config,
  });
  return data;
}

async function callWithAccesToken(url, additional_params = {}, config = {}) {
  try {
    let { data } = await axios.get(url, {
      params: {
        ...additional_params,
      },
      headers: {
        Authorization: `Bearer ${AuthService.access_token}`,
      },
      ...config,
    });
    return data;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  getDocumentContnet,
  exportAsPdf,
};
