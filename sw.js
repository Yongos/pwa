const version = "7";

let fichiers_offline = [
  "/index.html",
  "/style.css",
  "/reset.css",
  "/app.js"
]

self.addEventListener("install",function(event) {
  console.warn("[SW] V."+version+" - INSTALL EVENT");
  self.skipWaiting();

  event.waitUntil(
    caches.open("cache-v1").then(function(cache) {
      console.log("[PWA] Caching pages during install");
      return cache.addAll(fichiers_offline);
    })
  )
})

self.addEventListener("activate",function(event) {
  console.warn("[SW] V."+version+" - ACTIVATE EVENT");
  event.waitUntil(self.clients.claim());
})

self.addEventListener("fetch",function(event) {
  console.warn("[SW] V."+version+" - FETCH EVENT");
  console.log(event.request);

  event.respondWith(
    fromCache(event.request).then(
      function(response) {
        console.warn("Il y a bien correspondance dans le cache "+event.request.url);

        // On appel le serveur pour charger la nouvelle version du fichier
        // pour la prochaine fois
        event.waitUntil(
          fetch(event.request).then(function(response) {
            console.log("maj cache pour prochain chargement");
            return updateCache(event.request, response);
          })
        )

        return response;
      },
      function(echec) {

        console.warn("Pas de fichier en cache... On va chercher en ligne sur le serveur avec fetch "+event.request.url);
        return fetch(event.request)
          .then(function(response) {
            // C'est un succès
           // event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function(error) {
            console.log(
              "Pas de cache et pb de réseau : " + error
            );
          });
      }
    )
  )
})

/* Fonctions Gestion Cache */

function fromCache(request) {
  // Vérifier si le fichier est en cache (cache.match)
  // Retourne la réponse
  // Sinon reject...
  return caches.open("cache-v1").then(function(cache) {
    return cache.match(request).then(function(matching) {
      console.log(matching)
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}


function updateCache(request, response) {
  console.log(request);
  console.log(response);
  return caches.open("cache-v1").then(function(cache) {
    return cache.put(request, response);
  });
}


self.addEventListener('push', function (ev) {
  ev.waitUntil(
    self.registration.showNotification('My Title', {
      body: 'Hello world!'
    })
  );
})
