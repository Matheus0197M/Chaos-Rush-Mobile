const CACHE_NAME = "chaos-rush-v3";
const RUNTIME_CACHE = "chaos-rush-runtime-v3";

const FILES_TO_CACHE = [

  "./",
  "./index.html",

  "./css/style.css",

  "./js/phaser.min.js",
  "./js/main.js",
  "./js/supabaseClient.js",
  "./js/VirtualJoystick.js",

  "./js/scene/LoginScene.js",
  "./js/scene/RegisterScene.js",
  "./js/scene/MenuScene.js",
  "./js/scene/MainScene.js",

  "./js/entities/Player/player.js",
  "./js/entities/Player/PlayerClass.js",
  "./js/entities/Player/StatsPlayer.js",
  "./js/entities/Player/DamagePlayer.js",

  "./js/entities/Enemy/enemy.js",
  "./js/entities/Enemy/EnemyBullet.js",

  "./js/systems/UpgradeSystem.js",
  "./js/systems/ClassSystems.js",
  "./js/systems/WeaponSystem.js",

  "./js/systems/PassiveSystem/PassiveSystem.js",
  "./js/systems/PassiveSystem/PassiveAlquimista.js",
  "./js/systems/PassiveSystem/PassiveCoveiro.js",
  "./js/systems/PassiveSystem/PassiveSentinela.js",

  "./js/Director/SpawnDirector.js",

  "./js/XPOrb.js",

  "./assets/icon-192.png",
  "./assets/icon-512.png"
];

// ======================================
// INSTALL
// ======================================

self.addEventListener("install", event => {

  console.log("[SW] Instalando...");

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(async cache => {

        for (const file of FILES_TO_CACHE) {

          try {

            await cache.add(file);
            console.log("[SW] Cacheado:", file);

          } catch (err) {

            console.warn("[SW] Falha ao cachear:", file, err);

          }

        }

      })

  );

  self.skipWaiting();

});

// ======================================
// ACTIVATE
// ======================================

self.addEventListener("activate", event => {

  console.log("[SW] Ativando...");

  event.waitUntil(

    caches.keys().then(cacheNames => {

      return Promise.all(

        cacheNames.map(cacheName => {

          if (
            cacheName !== CACHE_NAME &&
            cacheName !== RUNTIME_CACHE
          ) {

            console.log("[SW] Limpando cache:", cacheName);

            return caches.delete(cacheName);

          }

        })

      );

    })

  );

  self.clients.claim();

});

// ======================================
// FETCH
// ======================================

self.addEventListener("fetch", event => {

  const request = event.request;

  // Ignorar requests não GET
  if (request.method !== "GET") return;

  // NÃO INTERCEPTAR SUPABASE
  if (
    request.url.includes("supabase.co") ||
    request.url.includes("googleapis") ||
    request.url.includes("gstatic")
  ) {
    return;
  }

  event.respondWith(

    caches.match(request)
      .then(cachedResponse => {

        // CACHE FIRST
        if (cachedResponse) {

          return cachedResponse;

        }

        // NETWORK
        return fetch(request)

          .then(networkResponse => {

            // Resposta inválida
            if (
              !networkResponse ||
              networkResponse.status !== 200
            ) {

              return networkResponse;

            }

            // Não cachear requests externos
            if (
              !request.url.startsWith(self.location.origin)
            ) {

              return networkResponse;

            }

            // Clonar resposta
            const responseClone =
              networkResponse.clone();

            // Guardar em runtime cache
            caches.open(RUNTIME_CACHE)
              .then(cache => {

                cache.put(request, responseClone);

              });

            return networkResponse;

          })

          .catch(err => {

            console.warn(
              "[SW] Erro fetch:",
              err
            );

            return new Response(
              "Offline",
              {
                status: 503,
                statusText: "Offline"
              }
            );

          });

      })

  );

});