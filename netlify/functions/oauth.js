// netlify/functions/oauth.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { code, state } = event.queryStringParameters || {};

  // 1) Prüfen, ob "code" vorhanden
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code missing' }),
    };
  }

  // 2) Environment-Variablen lesen
  const client_id = process.env.CLIENT_ID;     // z.B. '2000000021573'
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = 'https://login.420pharma.de/.netlify/functions/oauth'; 
  // Stelle sicher, dass diese URL auch in CReaM als "Ziel-URL" hinterlegt ist.

  // 3) Code gegen Access Token tauschen
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

  // 4) Bestimme Weiterleitungs-URL (falls "state" vorhanden, hänge es an)
  // z.B. state="/fachbereich/arzt"
  let redirectUrl = 'https://www.420pharma.de/fachbereich'; // Fallback
  if (state && state.trim() !== '') {
    redirectUrl = `https://www.420pharma.de${state}`;
  }

  // 5) Hänge Access Token an URL-Parameter an
  // (Statt es in einem Cookie zu speichern)
  const finalRedirect = `${redirectUrl}?token=${tokenData.access_token}`;

  // 6) 302-Redirect an die finale Seite
  return {
    statusCode: 302,
    headers: {
      Location: finalRedirect,
    },
  };
};
