
exports.handler = async (event, context) => {
  const cookieHeader = event.headers.cookie || '';
  // Überprüfe, ob der "token" Cookie existiert
  const isValid = cookieHeader.includes('token=');
  
  return {
    statusCode: 200,
    body: JSON.stringify({ valid: isValid }),
  };
};
