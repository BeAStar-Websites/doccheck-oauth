<script>
  (function() {
    // Rufe den Validierungs-Endpunkt (Netlify Function) auf, der den HttpOnly-Cookie auswertet
    fetch('https://login.420pharma.de/.netlify/functions/validate-token', {
      credentials: 'include'  // Cookies werden mitgesendet
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (!data.valid) {
          // Kein gültiger Token gefunden – leite zur Login-Seite um
          window.location.href = '/fachbereich-doccheck';
        }
      })
      .catch(function(error) {
        console.error("Token-Validierung fehlgeschlagen:", error);
        window.location.href = '/fachbereich-doccheck';
      });
  })();
</script>
