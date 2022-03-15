import {precacheAndRoute} from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST)
// registerRoute(
//     new RegExp('/.*'),
//     new workbox.strategies.NetworkFirst()
// );