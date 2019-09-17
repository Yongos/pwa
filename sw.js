const version = "7";

let fichier_offline = [
    '/index.html',
    '/style.css',
    '/reset.css',
    '/app.js'

]

self.addEventListener("install",function(event){
    console.warn("[SW] ver "+version+" - Install Event ");
    self.skipWaiting()
    event.waitUntil(
        caches.open("cache-v1").then(function(cache){
            console.log("Mise en cache");
            return cache.addAll(fichier_offline)
        })
        .catch(function(erreur){
            console.log(erreur);
        })
    )

})

self.addEventListener("activate",function(event){
    console.warn("[SW] ver - Activate Event");

})

self.addEventListener("fetch",function(event){
    console.warn("[SW] - Fetch Event");
    console.log(event.request);
  //  event.respondWith;
    /*if(event.request.url == "http://localhost:5000/page2.html"){
        event.respondWith(
            new Response("Unlucky requête interceptée et modifiée")
        )
    }*/
        event.respondWith(
            fromcache(event.request).then(function(response){
                console.warn("Il y a correspondance avec le cache "+event.request.url);
                return response
            })
            .catch(function(response){
                console.warn("Pas de fichier en cache... on va chercher en ligne sur le serveur");
                return fetch(event.request)
            })
        )
})

//récupérer des fichiers en cache
function fromcache(request){
   return caches.open("cache-v1").then(function(cache){
        return caches.match(request).then(function(matching){
            if (!matching || matching.status == 404){
                return Promise.reject("no-match mec")
            }
            else{
                return matching;
            }
        });
    });
}