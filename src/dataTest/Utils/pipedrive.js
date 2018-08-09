const requestretry = require('requestretry');

const urlPipedrive = process.env.pipedriveUrl;
const urlPipedriveOauth = process.env.pipedriveUrlOauth;

// const apiToken = '8a248db22705fa85b9f25dbe82572d06c2b16aa6'; // Token prod pipedrive samy
// const apiToken = '5e271bab709f9e74189421d4cc49a60110a312e1'; // Token prod pipedrive Baptiste
// const apiToken = 'a86eb36af4331b509045bd3ffe209b2c699e439d'; // Token Test Pipedrive

const get = async (path, apiToken, oAuth) => {
  try {
    const urlApiToken = oAuth ? '' : `&api_token=${apiToken}`;
    const options = {
      uri: `${oAuth ? urlPipedriveOauth : urlPipedrive}${path}${urlApiToken}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      json: true,
    };

    console.log('options :', options);

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
