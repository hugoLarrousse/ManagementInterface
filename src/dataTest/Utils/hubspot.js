const requestRetry = require('requestretry');

const urlHubspot = process.env.hubspotUrl;

const request = async (info, authRequest = false) => {
  let options = {};

  if (authRequest) {
    options = {
      url: `${urlHubspot}${info.path}`,
      method: info.method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      form: info.data,
      json: true,
    };
  } else {
    options = {
      url: `${urlHubspot}${info.path}`,
      method: info.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: info.token,
      },
      json: true,
    };
  }

  try {
    const { error, body } = await requestRetry(options);

    if (error) {
      console.log('error : ', error);
      return null;
    }

    if (body) {
      return body;
    }
    return null;
  } catch (e) {
    throw new Error(`${__filename}
      ${request.name}
      ${e.message}`);
  }
};


  // Fonction de rafraichissement du token du User
exports.refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    console.log(__filename, refreshToken.name, 'no token found');
    return null;
  }
  const infos = {
    path: '/oauth/v1/token',
    method: 'POST',
    data: {
      grant_type: process.env.hubspot_grant_type_refresh_token,
      client_id: process.env.hubspot_client_id,
      client_secret: process.env.hubspot_client_secret,
      refresh_token: refreshToken,
      redirect_uri: process.env.hubspot_uri,
    },
  };

  // On lance le rafraichissement du Token
  const hubResult = await request(infos, true);

  if (hubResult && hubResult.access_token) {
    return hubResult.access_token;
  }
  console.log(__filename, 'refreshToken', 'no hubResult or no hubResult.access_token', { hubResult });
  return null;
};

exports.request = request;
