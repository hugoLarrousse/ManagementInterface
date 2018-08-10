const requestretry = require('requestretry');
const config = require('config');

const pipedrive = config.get('pipedrive');

const get = async (path, apiToken, oAuth) => {
  try {
    const urlApiToken = oAuth ? '' : `&api_token=${apiToken}`;
    const options = {
      uri: `${oAuth ? pipedrive.apiUrlProxy : pipedrive.apiUrl}${path}${urlApiToken}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
    };

    if (oAuth) {
      Object.assign(options, {
        headers: {
          ...options.headers,
          Authorization: `Bearer ${apiToken}`,
        },
      });
    }


    const { error, body } = await requestretry(options);

    if (error) {
      console.log('error pipedrive request');
      return 'error';
    }

    return body;
  } catch (e) {
    throw new Error(`${__filename}
      ${get.name}
      ${e.message}`);
  }
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }

  return `${date.getFullYear()}-${month}-${day}`;
};

const formatHours = (timestamp) => {
  const date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
};


exports.get = get;
exports.formatDate = formatDate;
exports.formatHours = formatHours;
