// netlify/functions/validate-token.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Lese den Token aus dem Query-Parameter oder dem Request-Body
  const { token } = event.queryStringParameters || {};
  if (!token) {
    return { statusCode: 200, body: JSON.stringify({ valid: false }) };
  }

  // An DocCheck Validate-Endpunkt schicken
  try {
    const validateResponse = await fetch('https://login.doccheck.com/service/oauth/access_token/checkToken.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`
      },
    });
    const validateData = await validateResponse.json();
    // Laut Doku: boolIsValid=true => Token ungültig, boolIsValid=false => Token gültig
    const isValid = (validateData.boolIsValid === false);

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
