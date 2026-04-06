module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const redirectUri =
    req.headers['x-forwarded-proto'] +
    '://' +
    req.headers.host +
    '/api/callback';
  const scope = 'repo,user';

  res.redirect(
    'https://github.com/login/oauth/authorize' +
      '?client_id=' +
      encodeURIComponent(clientId) +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri) +
      '&scope=' +
      encodeURIComponent(scope)
  );
};
