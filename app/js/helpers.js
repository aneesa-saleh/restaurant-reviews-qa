"use strict";var registerServiceWorker=function(){navigator.serviceWorker&&navigator.serviceWorker.register("/service-worker.js").catch(function(t){return console.log(t)})},cleanMapboxTilesCache=function(){caches.open("restaurant-reviews-map-tiles").then(function(n){return n.keys().then(function(t){var e=t.length;e<=12||t.slice(0,e-12).forEach(function(t){n.delete(t)})})})},openDatabase=function(t){return navigator.serviceWorker||t?idb.open("restaurant-reviews",4,function(t){switch(t.oldVersion){case 0:t.createObjectStore("restaurants",{keyPath:"id"});case 1:t.createObjectStore("reviews",{keyPath:"id"}).createIndex("restaurant_id","restaurant_id");case 2:t.createObjectStore("outbox",{keyPath:"request_id"});case 3:t.transaction.objectStore("outbox").createIndex("restaurant_id","restaurant_id")}}):Promise.resolve()};function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}var dbPromise=openDatabase(),DBHelper=function(){function s(){_classCallCheck(this,s)}return _createClass(s,null,[{key:"fetchRestaurants",value:function(){return dbPromise.then(function(n){var r="".concat(s.DATABASE_URL,"/restaurants");if(!n)return fetch(r).then(function(t){if(t.ok)return t.json();var e="Request failed. Returned status of ".concat(t.status);return Promise.reject(e)});var a=n.transaction("restaurants").objectStore("restaurants");return a.getAll().then(function(t){var e=fetch(r).then(function(t){if(t.ok)return t.clone().json().then(function(t){a=n.transaction("restaurants","readwrite").objectStore("restaurants"),t.forEach(function(t){a.put(t)})}),t.json();var e="Request failed. Returned status of ".concat(t.status);return Promise.reject(e)});return t&&1<t.length?t:e})})}},{key:"fetchRestaurantById",value:function(t,e){dbPromise.then(function(n){var r="".concat(s.DATABASE_URL,"/restaurants/").concat(t);if(!n)return fetch(r).then(function(t){if(t.ok)return t.json();var e="Request failed. Returned status of ".concat(t.status);return Promise.reject(e)});var a=n.transaction("restaurants").objectStore("restaurants");return a.get(Number.parseInt(t,10)).then(function(t){var e=fetch(r).then(function(t){if(t.ok)return t.clone().json().then(function(t){(a=n.transaction("restaurants","readwrite").objectStore("restaurants")).put(t)}),t.json();var e="Request failed. Returned status of ".concat(t.status);return Promise.reject(e)});return t||e})}).then(function(t){e(null,t)}).catch(function(t){e(t,null)})}},{key:"fetchReviewsByRestaurantId",value:function(t,e){dbPromise.then(function(r){var a="".concat(s.DATABASE_URL,"/reviews/?restaurant_id=").concat(t);if(!r)return fetch(a).then(function(t){if(t.ok)return t.json();var e="Request failed. Returned status of ".concat(t.status);return Promise.reject(e)});var o=r.transaction("reviews").objectStore("reviews");return o.index("restaurant_id").getAll(Number.parseInt(t,10)).then(function(t){var e=0;t&&t.length&&(e=t.length);var n=fetch(a).then(function(t){if(t.ok)return t.clone().json().then(function(t){o=r.transaction("reviews","readwrite").objectStore("reviews"),t.forEach(function(t){o.put(t)})}),t.json();var e="Request failed. Returned status of ".concat(t.status);return Promise.reject(e)});return e?t:n})}).then(function(t){e(null,t)}).catch(function(t){e(t,null)})}},{key:"fetchRestaurantByCuisine",value:function(n,r){s.fetchRestaurants().then(function(t){var e=t.filter(function(t){return t.cuisine_type==n});r(null,e)}).catch(function(t){r(t,null)})}},{key:"fetchRestaurantByNeighborhood",value:function(n,r){s.fetchRestaurants().then(function(t){var e=t.filter(function(t){return t.neighborhood==n});r(null,e)}).catch(function(t){r(t,null)})}},{key:"fetchRestaurantByCuisineAndNeighborhood",value:function(n,r,a){s.fetchRestaurants().then(function(t){var e=t;"all"!=n&&(e=e.filter(function(t){return t.cuisine_type==n})),"all"!=r&&(e=e.filter(function(t){return t.neighborhood==r})),a(null,e)}).catch(function(t){a(t,null)})}},{key:"fetchNeighborhoods",value:function(e){s.fetchRestaurants().then(function(n){var r=n.map(function(t,e){return n[e].neighborhood}),t=r.filter(function(t,e){return r.indexOf(t)==e});e(null,t)}).catch(function(t){e(t,null)})}},{key:"fetchCuisines",value:function(e){s.fetchRestaurants().then(function(n){var r=n.map(function(t,e){return n[e].cuisine_type}),t=r.filter(function(t,e){return r.indexOf(t)==e});e(null,t)}).catch(function(t){e(t,null)})}},{key:"urlForRestaurant",value:function(t){return"./restaurant.html?id=".concat(t.id)}},{key:"imageUrlForRestaurant",value:function(t,e){if(e){if("small"===e.size)return!0===e.singleValue?"https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F".concat(t.photograph_small_2x):"https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F".concat(t.photograph_small_1x," 1x, https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F").concat(t.photograph_small_2x," 2x");if("medium"===e.size)return!0===e.singleValue?"https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F".concat(t.photograph_medium_2x):"https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F".concat(t.photograph_medium_1x," 1x, https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F").concat(t.photograph_medium_2x," 2x");if("large"===e.size&&e.wide)return"https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F".concat(t.photograph_large_wide)}return"https://cdn.glitch.com/cf7f11e2-7748-444f-ba83-c77502031542%2F".concat(t.photograph_large)}},{key:"mapMarkerForRestaurant",value:function(t,e){var n=new L.marker([t.latlng.lat,t.latlng.lng],{title:t.name,alt:t.name,url:s.urlForRestaurant(t)});return n.addTo(newMap),n}},{key:"setRestaurantFavouriteStatus",value:function(t,e,n){var r="".concat(s.DATABASE_URL,"/restaurants/").concat(t,"/?is_favorite=").concat(e);fetch(r,{method:"PUT"}).then(function(t){return t.ok?t.json():Promise.reject()}).then(function(e){dbPromise.then(function(t){t.transaction("restaurants","readwrite").objectStore("restaurants").put(e)}),n(null,e)}).catch(function(t){n(t,null)})}},{key:"addReview",value:function(t,e,n,r,a){var o="".concat(s.DATABASE_URL,"/reviews"),c=JSON.stringify({restaurant_id:t,name:e,rating:n,comments:r});fetch(o,{method:"POST",body:c}).then(function(t){if(t.ok)return t.json();var e="Request failed. Returned status of ".concat(t.status);return Promise.reject(e)}).then(function(t){a(null,t)}).catch(function(t){a(t,null)})}},{key:"getOutboxReviews",value:function(e,n){dbPromise.then(function(t){if(t){t.transaction("outbox").objectStore("outbox").index("restaurant_id").getAll(Number.parseInt(e,10)).then(function(t){n(null,t)})}else{n("Error connecting to IndexedDB",null)}})}},{key:"DATABASE_URL",get:function(){return"https://api-restaurant-reviews.glitch.me"}}]),s}();function formatDate(t){var e=t.getDate(),n=["January","February","March","April","May","June","July","August","September","October","November","December"][t.getMonth()],r=t.getFullYear();return"".concat(n," ").concat(e,", ").concat(r)}function stringToBoolean(t){return"boolean"==typeof t?t:"true"===t}var toastTimer=null,pendingToasts=[],shouldRestartToastTimer=!1;function pauseToastTimer(){clearTimeout(toastTimer),shouldRestartToastTimer=!(toastTimer=null)}function restartToastTimer(){shouldRestartToastTimer&&(shouldRestartToastTimer=!1,toastTimer=setTimeout(hideToast,2e3))}function enqueueToast(t,e){pendingToasts.unshift({message:t,type:e}),null===toastTimer&&showToast()}function hideToast(){clearTimeout(toastTimer),toastTimer=null,shouldRestartToastTimer=!1;var t=document.getElementById("toast"),e=document.getElementById("toast-text");t.classList.remove("show"),setTimeout(function(){e.setAttribute("aria-live","polite"),showToast()},0)}function showToast(){var t=pendingToasts.pop();if(t&&t.message){var e=t.message,n=t.type,r=document.getElementById("toast"),a=document.getElementById("toast-text"),o=document.getElementById("toast-icon");a.setAttribute("aria-live","polite"),a.innerHTML=e,o.className="error"===n?(r.className="toast show error","fas fa-exclamation-triangle"):"success"===n?(r.className="toast show success","fas fa-check"):(r.className="toast show","fas fa-info-circle"),clearTimeout(toastTimer),setTimeout(function(){a.setAttribute("aria-live","off")},0),toastTimer=setTimeout(hideToast,8e3)}}var loadElement=function(){};function handleIntersection(t,n){t.forEach(function(t){if(t.isIntersecting){var e=t.target;n.unobserve(e),requestAnimationFrame(function(){loadElement(e)})}})}function registerObserver(t,e){loadElement=e;var n=new IntersectionObserver(handleIntersection);t.forEach(function(t){n.observe(t)})}function fetchImage(r){return new Promise(function(t,e){var n=new Image;n.src=r,n.onload=t,n.onerror=e})}
//# sourceMappingURL=../sourcemaps/helpers.js.map