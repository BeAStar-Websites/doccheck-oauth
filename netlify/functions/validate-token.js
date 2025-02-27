exports.handler = async (event, context) => {
  const cookieHeader = event.headers.cookie || '';
  // Überprüfe, ob der "token" Cookie existiert
  const isValid = cookieHeader.includes('token=');

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "https://www.420pharma.de", // oder "*" für alle, aber besser auf deine Domain beschränken
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ valid: isValid }),
  };
};
