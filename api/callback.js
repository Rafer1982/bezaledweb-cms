module.exports = async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  let token = '';
  let errorMessage = '';

  try {
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const data = await tokenResponse.json();
    token = data.access_token || '';
    if (!token) {
      errorMessage = data.error_description || 'No access token returned';
    }
  } catch (err) {
    errorMessage = err.message;
  }

  const provider = 'github';

  if (errorMessage) {
    const html =
      '<!DOCTYPE html><html><body><script>' +
      '(function() {' +
      '  function receiveMessage(e) {' +
      '    window.opener.postMessage(' +
      '      "authorization:' +
      provider +
      ':error:" + ' +
      JSON.stringify(errorMessage) +
      ',' +
      '      e.origin' +
      '    );' +
      '  }' +
      '  window.addEventListener("message", receiveMessage, false);' +
      '  window.opener.postMessage("authorizing:' +
      provider +
      '", "*");' +
      '})();' +
      '</script></body></html>';

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  const content = JSON.stringify({ token: token, provider: provider });
  const message =
    'authorization:' + provider + ':success:' + content;

  const html =
    '<!DOCTYPE html><html><body><script>' +
    '(function() {' +
    '  function receiveMessage(e) {' +
    '    window.opener.postMessage(' +
    '      ' +
    JSON.stringify(message) +
    ',' +
    '      e.origin' +
    '    );' +
    '  }' +
    '  window.addEventListener("message", receiveMessage, false);' +
    '  window.opener.postMessage("authorizing:' +
    provider +
    '", "*");' +
    '})();' +
    '</script></body></html>';

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};
