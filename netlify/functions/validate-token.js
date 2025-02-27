exports.handler = async (event, context) => {
  const cookieHeader = event.headers.cookie || '';
  // Überprüfe, ob der "token" Cookie existiert
  const isValid = cookieHeader.includes('token=');
  
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.420pharma.de", // muss exakt übereinstimmen
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Credentials": "true", // wichtig für Credentials
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valid: isValid }),
  };
};
