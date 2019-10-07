'use strict';

const CACHE_NAME = 'pwa-sample-cache-v1';
const urlsToCache = [
    './',
    './img/icons/android-chrome-192x192.png',
    './img/icons/android-chrome-512x512.png',
    './favicon.ico',
    './main.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
              .then((cache) => {
                  console.log('Opened cache');

                  // �w�肳�ꂽ���\�[�X���L���b�V���ɒǉ�����
                  return cache.addAll(urlsToCache);
              })
    );
});

self.addEventListener('activate', (event) => {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // �z���C�g���X�g�ɂȂ��L���b�V��(�Â��L���b�V��)�͍폜����
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
              .then((response) => {
                  if (response) {
                      return response;
                  }

                  // �d�v�F���N�G�X�g�� clone ����B���N�G�X�g�� Stream �Ȃ̂�
                  // ��x���������ł��Ȃ��B�����ł̓L���b�V���p�Afetch �p��2��
                  // �K�v�Ȃ̂ŁA���N�G�X�g�� clone ���Ȃ��Ƃ����Ȃ�
                  let fetchRequest = event.request.clone();

                  return fetch(fetchRequest)
                      .then((response) => {
                          if (!response || response.status !== 200 || response.type !== 'basic') {
                              return response;
                          }

                          // �d�v�F���X�|���X�� clone ����B���X�|���X�� Stream ��
                          // �u���E�U�p�ƃL���b�V���p��2��K�v�B�Ȃ̂� clone ����
                          // 2�� Stream ������悤�ɂ���
                          let responseToCache = response.clone();

                          caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });

                          return response;
                      });
              })
    );
});
