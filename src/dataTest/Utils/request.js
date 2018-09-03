const requestRetry = require('requestretry');

const MAX_ATTEMPTS = 3;
const RETRY_DELAY = 100;


const checkBody = (body) => {
  if (!body) {
    throw new Error('body empty');
  } else if (body.error) {
    throw new Error(body.error);
  } else if (body[0] && body[0].errorCode) {
    throw new Error(body[0].errorCode);
  }
};

const defaultRetryStrategy = (err, response) =>
  (response && response.body && (response.statusCode < 200 || response.statusCode > 299));

module.exports = async (baseUrl, path, query, method, headers, data, retry, refreshToken) => {
  const options = {
    method,
    url: `${baseUrl}${path ? `/${path}` : ''}${query ? `?${query}` : ''}`,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    json: true,
  };

  Object.assign(options, refreshToken ? { form: data || {} } : { body: data || {} });


  if (retry) {
    Object.assign(options, { maxAttempts: MAX_ATTEMPTS, retryDelay: RETRY_DELAY, retryStrategy: defaultRetryStrategy });
  }
  const { error, response, body } = await requestRetry(options);
  if (error) {
    console.log('error:', error);
    return null;
  }
  if (response && response.statusCode && response.statusCode === 400) {
    console.log('statusCode:', response && response.statusCode);
    console.log(body);
    return response.statusCode;
  }
  if (response && response.statusCode && response.statusCode !== 200) {
    console.log('statusCode:', response && response.statusCode);
    console.log(body);
    return null;
  }
  if (body) {
    checkBody(body);
    return body;
  }
  return null;
};
