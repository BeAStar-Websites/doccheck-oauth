const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { code, state } = event.queryStringParameters || {};
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code missing' }),
    };
  }

  const client_id = process.env.DOCCHECK_CLIENT_ID;
  const client_secret = process.env.DOCCHECK_CLIENT_SECRET;
  const redirect_uri = 'https://login.420pharma.de/.netlify/functions/oauth';  // Diese URL muss in DocCheck CReaM als Ziel-URL eingetragen sein.

  const tokenResponse = await fetch('https://login.doccheck.com/service/oauth/access_token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id,
      client_secret,
    }),
  });
  const tokenData = await tokenResponse.json();
  if (tokenData.error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: tokenData.error_description }),
    };
  }
  
  // Bestimme das Ziel basierend auf "state" oder als Standard
  let redirectUrl = 'https://www.420pharma.de/fachbereich';
  if (state && state.trim() !== '') {
    redirectUrl = `https://www.420pharma.de${state}`;
  }
  
  // Hänge den Access Token als URL-Parameter an
  const finalRedirect = `${redirectUrl}?token=${tokenData.access_token}`;
  
  return {
    statusCode: 302,
    headers: {
      Location: finalRedirect,
    },
  };
};
