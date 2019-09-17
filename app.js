let fichiers_offline = [
    '/index.html',
    '/style.css',
    '/reset.css',
    '/app.js'
  ]
  
  
  self.addEventListener("install",function(event){
    console.warn("[SW] - Install Event")
    self.skipWaiting()
    event.waitUntil(
      caches.open("cache-v1")
      .then(function(cache) {
                 console.log("Mise en cache des fichiers")
                 return cache.addAll(fichiers_offline)
      })
      .catch(function(erreur){
        console.log(erreur)
      })
    )
  })
  
  self.addEventListener("activate",function(event){
    console.warn("[SW] - Activate Event")
  })
  
  self.addEventListener("fetch",function(event){
    console.warn("[SW] - Fetch Event")
    console.log(event.request);
    // if(event.request.url == "http://localhost:5000/page2") {
    //   event.respondWith(
    //     new Response("Pas de chance... requête interceptée et modifée...")
    //   )
    // }
  
    event.respondWith(
      fromCache(event.request)
      .then(function(response) {
             console.warn("Il y a bien correspondance dans le cache "+event.request.url);
             return response;
      })
      .catch(function(response) {
             console.warn("Pas de fichier en cache... On va chercher en ligne sur le serveur avec fetch "+event.request.url);
             return fetch(event.request)
      })
    )
  })
  
  
  /* Récupérer les fichiers en cache */
  /* Fonctions Gestion Cache */
  
  function fromCache(request) {
    // Vérifier si le fichier est en cache (cache.match)
    // Retourne la réponse
    // Sinon reject...
    return caches.open("cache-v1").then(function(cache) {
      return cache.match(request).then(function(matching) {
                if (!matching || matching.status === 404) {
                  return Promise.reject("no-match");
                }
                else {
                  return matching;
                }
      });
    });
  }