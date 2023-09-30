"use strict";function _objectWithoutProperties(e,t){if(null==e)return{};var r,a,n=_objectWithoutPropertiesLoose(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],0<=t.indexOf(r)||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}function _objectWithoutPropertiesLoose(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],0<=t.indexOf(r)||(n[r]=e[r]);return n}var restaurant,reviews,outboxReviews,newMap,previouslyConnected,matchesMediaQuery=!0,mediaQuery="(min-width: 800px)",ø=Object.create(null);document.addEventListener("DOMContentLoaded",function(e){previouslyConnected=navigator.onLine,window.matchMedia&&(matchesMediaQuery=window.matchMedia(mediaQuery).matches),updateRestaurantContainerAria(),window.caches&&setInterval(cleanMapboxTilesCache,5e3),navigator.serviceWorker&&navigator.serviceWorker.addEventListener("message",function(e){var t=e.data,r=t.type,a=t.requestId,n=t.review,i=t.error;"update-review"===r&&(i?(enqueueToast("An error occurred while submitting your review","error"),requestAnimationFrame(updateReviewHTML.bind(ø,!0,a))):(enqueueToast("".concat(n.name,"'s review has been saved"),"success"),requestAnimationFrame(updateReviewHTML.bind(ø,!1,a,n))))}),"onLine"in navigator&&(window.addEventListener("online",showConnectionStatus),window.addEventListener("offline",showConnectionStatus),requestAnimationFrame(showConnectionStatus)),fetchRestaurantFromURL(function(e,t){e?console.error(e):(requestAnimationFrame(fillBreadcrumb.bind(ø,t)),requestAnimationFrame(fillRestaurantHTML.bind(ø,t)),requestAnimationFrame(initMap),requestAnimationFrame(DBHelper.mapMarkerForRestaurant.bind(ø,self.restaurant,self.newMap)),fetchReviews(t.id))})});var initMap=function(){self.newMap=L.map("map",{center:[restaurant.latlng.lat,restaurant.latlng.lng],zoom:16,scrollWheelZoom:!1}),L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1IjoiYW5lZXNhLXNhbGVoIiwiYSI6ImNqa2xmZHVwMDFoYW4zdnAwYWplMm53bHEifQ.V11dDOtEnWSwTxY-C8mJLw",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',id:"mapbox.streets"}).addTo(newMap)};window.addEventListener("resize",function(){if(window.matchMedia){var e=window.matchMedia(mediaQuery).matches;e!==matchesMediaQuery&&(matchesMediaQuery=e,updateRestaurantContainerAria())}});var previouslyFocusedElement,updateRestaurantContainerAria=function(){var e=document.getElementById("restaurant-container"),t=document.getElementById("accessible-restaurant-container");matchesMediaQuery?(e.setAttribute("aria-hidden","true"),t.setAttribute("aria-hidden","false")):(e.setAttribute("aria-hidden","false"),t.setAttribute("aria-hidden","true"))},showErrorLoadingRestaurant=function(){document.getElementById("main-error").classList.add("show"),document.getElementById("wrap-main-content").classList.add("hide")},fetchRestaurantFromURL=function(r){if(self.restaurant)r(null,self.restaurant);else{var e=getUrlParam("id");if(e)DBHelper.fetchRestaurantById(e,function(e,t){(self.restaurant=t)?r(null,t):requestAnimationFrame(showErrorLoadingRestaurant)});else{r("No restaurant id in URL",null),requestAnimationFrame(showErrorLoadingRestaurant)}}},fillRestaurantHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML+=e.address;var t=document.getElementById("restaurant-picture"),r=document.createElement("source");r.media="(min-width: 800px)",r.srcset=DBHelper.imageUrlForRestaurant(e,{size:"large",wide:!0}),r.type="image/jpeg",t.appendChild(r);var a=document.createElement("source");a.media="(min-width: 600px)",a.srcset=DBHelper.imageUrlForRestaurant(e,{size:"medium"}),a.type="image/jpeg",t.appendChild(a);var n=document.createElement("source");n.srcset=DBHelper.imageUrlForRestaurant(e,{size:"small"}),n.type="image/jpeg",t.appendChild(n);var i=document.createElement("img");i.className="restaurant-img",i.src=DBHelper.imageUrlForRestaurant(e),i.alt=e.alt,t.appendChild(i),document.getElementById("accessible-restaurant-img").setAttribute("aria-label",e.alt),document.getElementById("restaurant-cuisine").innerHTML="Cuisine: ".concat(e.cuisine_type),document.getElementById("accessible-restaurant-cuisine").innerHTML="Cuisine: ".concat(e.cuisine_type);var o=document.getElementById("add-review-button");o.setAttribute("aria-label","Add a review for ".concat(e.name)),o.removeAttribute("disabled"),document.getElementById("add-review-overlay-heading").innerHTML="Add review for ".concat(e.name),document.getElementById("mark-as-favourite").removeAttribute("disabled"),document.getElementById("add-review-button").removeAttribute("disabled"),e.operating_hours&&fillRestaurantHoursHTML(),Object.hasOwnProperty.call(e,"is_favorite")&&fillMarkAsFavouriteHTML()},fillRestaurantHoursHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var a=document.createElement("tr"),n=document.createElement("td");n.innerHTML=r,a.appendChild(n);var i=document.createElement("td");i.innerHTML=e[r],a.appendChild(i),t.appendChild(a)}},markRestaurantAsFavourite=function(e){var t=e.querySelector("i");e.querySelector("span").innerHTML="Unmark restaurant as favourite",t.classList.add("fas","marked"),t.classList.remove("far","unmarked"),t.setAttribute("aria-label","Restaurant is currently marked as favourite")},unmarkRestaurantAsFavourite=function(e){var t=e.querySelector("i");e.querySelector("span").innerHTML="Mark restaurant as favourite",t.classList.add("far","unmarked"),t.classList.remove("fas","marked"),t.setAttribute("aria-label","Restaurant is not currently marked as favourite")},fillMarkAsFavouriteHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.is_favorite,t=document.getElementById("mark-as-favourite");stringToBoolean(e)?markRestaurantAsFavourite(t):unmarkRestaurantAsFavourite(t)},fetchReviews=function(r){DBHelper.fetchReviewsByRestaurantId(r,function(e,t){(self.reviews=t)?(requestAnimationFrame(fillReviewsHTML.bind(ø,t)),DBHelper.getOutboxReviews(r,function(e,t){e?console.log(e):(self.outboxReviews=t,requestAnimationFrame(fillSendingReviewsHTML.bind(ø,t)))})):console.error(e)})},fillReviewsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.reviews;if(!e||0===e.length){var t=document.createElement("p");return t.innerHTML="No reviews yet!",void container.appendChild(t)}var r=document.getElementById("reviews-list");e.forEach(function(e){r.insertBefore(createReviewHTML(e),r.firstChild)})},fillSendingReviewsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.outboxReviews;if(e&&0!==e.length){var a=document.getElementById("reviews-list");e.forEach(function(e){var t=e.request_id,r=_objectWithoutProperties(e,["request_id"]);a.insertBefore(createReviewHTML(r,!0,t),a.firstChild)})}},createReviewHTML=function(e,t,r){var a=document.createElement("article");a.className="review";var n=document.createElement("span");n.className="review-header";var i=document.createElement("p");i.innerHTML=e.name,i.className="review-name",n.appendChild(i);var o=document.createElement("p");if(t){var s=document.createElement("i");s.classList.add("far","fa-clock");var u=document.createElement("span");u.innerHTML="Sending",o.appendChild(s),o.appendChild(u)}else{var d=formatDate(new Date(e.updatedAt));o.innerHTML=d}o.className="review-date",n.appendChild(o),a.appendChild(n);var c=document.createElement("span");c.className="review-content";var l=document.createElement("p");l.innerHTML="Rating: ".concat(e.rating),l.className="review-rating",c.appendChild(l);var m=document.createElement("p");return m.innerHTML=e.comments,c.appendChild(m),a.appendChild(c),t&&(a.setAttribute("data-id",r),a.setAttribute("aria-busy","true"),a.classList.add("sending")),a},updateReviewHTML=function(e,t,r){var a=document.querySelector('[data-id="'.concat(t,'"]'));if(e){if(a){var n=a.querySelector(".review-date");n.innerHTML="";var i=document.createElement("i");i.classList.add("fas","fa-exclamation-triangle");var o=document.createElement("span");o.innerHTML="Sending failed",n.appendChild(i),n.appendChild(o),n.classList.add("error")}}else if(document.getElementById("reviews-list")&&self.restaurant)if(a){a.classList.remove("sending");var s=a.querySelector(".review-date"),u=formatDate(new Date(r.updatedAt));s.innerHTML=u}else createReviewHTML(r,!1)},fillBreadcrumb=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),r=document.createElement("li");r.innerHTML=e.name,t.appendChild(r)},getUrlParam=function(e,t){t=t||window.location.href,e=e.replace(/[\[\]]/g,"\\$&");var r=new RegExp("[?&]".concat(e,"(=([^&#]*)|&|#|$)")).exec(t);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null},setMarkAsFavouriteFetchingState=function(e,t){e.setAttribute("disabled",!0),e.setAttribute("aria-busy","true"),t.classList.add("show")},removeMarkAsFavouriteFetchingState=function(e,t){e.removeAttribute("disabled"),e.setAttribute("aria-busy","false"),t.classList.remove("show")},toggleRestaurantAsFavourite=function(){var r,a,n,e=stringToBoolean(self.restaurant.is_favorite),t=!e&&"false"!==e,i=self.restaurant.id,o=document.getElementById("mark-as-favourite"),s=document.getElementById("favourite-spinner");n=t?(markRestaurantAsFavourite(o),r=unmarkRestaurantAsFavourite,a="Restaurant has been marked as favourite","An error occurred marking restaurant as favourite"):(unmarkRestaurantAsFavourite(o),r=markRestaurantAsFavourite,a="Restaurant has been unmarked as favourite","An error occurred unmarking restaurant as favourite"),setMarkAsFavouriteFetchingState(o,s),DBHelper.setRestaurantFavouriteStatus(i,t,function(e,t){if(removeMarkAsFavouriteFetchingState(o,s),!t)return console.error(e),r(o),void enqueueToast(n,"error");self.restaurant=t,enqueueToast(a,"success")})};function showConnectionStatus(){navigator.onLine&&!previouslyConnected?enqueueToast("You are back online","success"):!navigator.onLine&&previouslyConnected&&enqueueToast("You are offline","error"),previouslyConnected=navigator.onLine}function openModal(){previouslyFocusedElement=document.activeElement;var e=document.querySelector(".overlay"),t=e.querySelectorAll("button, input, textarea");e.classList.add("show"),document.body.classList.add("has-open-modal"),document.addEventListener("keydown",trapTabKey),setTimeout(function(){t[0].focus()},100)}function closeModal(){clearFormErrors(),document.querySelector(".overlay").classList.remove("show"),document.body.classList.remove("has-open-modal"),document.removeEventListener("keydown",trapTabKey),previouslyFocusedElement&&previouslyFocusedElement.focus()}function trapTabKey(e){if(e.key&&"Escape"===e.key)closeModal();else{var t=document.querySelector(".overlay").querySelectorAll("button, input"),r=t[0],a=t[t.length-1];e.key&&"Tab"===e.key&&(e.shiftKey&&e.target===r?(e.preventDefault(),a.focus()):e.shiftKey||e.target!==a||(e.preventDefault(),r.focus()))}}function setNameInputError(){var e=document.getElementById("name"),t=document.getElementById("name-error");e.classList.add("has-error"),e.setAttribute("aria-invalid","true"),e.setAttribute("aria-describedby","name-error"),t.classList.add("show")}function clearNameInputError(){var e=document.getElementById("name"),t=document.getElementById("name-error");e.classList.remove("has-error"),e.removeAttribute("aria-invalid"),e.removeAttribute("aria-describedby"),t.classList.remove("show")}function setRatingInputError(){var e=document.getElementById("rating"),t=document.getElementById("rating-error");e.classList.add("has-error"),e.setAttribute("aria-invalid","true"),e.setAttribute("aria-describedby","rating-error"),t.classList.add("show")}function clearRatingInputError(){var e=document.getElementById("rating"),t=document.getElementById("rating-error");e.classList.remove("has-error"),e.removeAttribute("aria-invalid"),e.removeAttribute("aria-describedby"),t.classList.remove("show")}function setCommentInputError(){var e=document.getElementById("comments"),t=document.getElementById("comments-error");e.classList.add("has-error"),e.setAttribute("aria-invalid","true"),e.setAttribute("aria-describedby","comments-error"),t.classList.add("show")}function clearCommentInputError(){var e=document.getElementById("comments"),t=document.getElementById("comments-error");e.classList.remove("has-error"),e.removeAttribute("aria-invalid"),e.removeAttribute("aria-describedby"),t.classList.remove("show")}var errorFunctions={name:{setError:setNameInputError,clearError:clearNameInputError},rating:{setError:setRatingInputError,clearError:clearRatingInputError},comments:{setError:setCommentInputError,clearError:clearCommentInputError}};function validateInput(e,t){var r,a=document.getElementById(e).cloneNode();return r=void 0!==t?t:a.value,(r="rating"===e?Number.parseInt(r,10):r)?(errorFunctions[e].clearError(),!0):(requestAnimationFrame(errorFunctions[e].setError),!1)}function validateAllInputs(){var t=!1,r=[];return["name","rating","comments"].forEach(function(e){validateInput(e)||(r.push(e),t=!0)}),{error:t,invalidInputs:r}}function handleRangeChange(e){document.querySelector(".rating-value").innerHTML="".concat(e.target.value,"/5"),validateInput(e.target.name,e.target.value)}function handleInputKeyUp(e){e.key&&"Tab"===e.key||validateInput(e.target.name,e.target.value)}function handleInputBlur(e){validateInput(e.target.name,e.target.value)}function getFormInputValues(){var t={};return["name","rating","comments"].forEach(function(e){t[e]=document.getElementById(e).value}),t}function clearForm(){document.getElementById("name").value="",document.getElementById("rating").value="0",document.querySelector(".rating-value").innerHTML="0/5",document.getElementById("comments").value=""}function clearFormErrors(){document.getElementById("name-error").classList.remove("show"),document.getElementById("rating-error").classList.remove("show"),document.getElementById("comments-error").classList.remove("show"),document.getElementById("add-review-form-error").classList.remove("show"),document.getElementById("add-review-form-error").innerHTML="",document.getElementById("name").classList.remove("has-error"),document.getElementById("rating").classList.remove("has-error"),document.getElementById("comments").classList.remove("has-error")}function handleAddReviewSubmit(){var e=validateAllInputs(),t=e.error,r=e.invalidInputs;if(t){var a=document.getElementById("add-review-form-error"),n="Invalid input for: ".concat(r.join(", "));a.innerHTML=n,a.classList.add("show"),document.getElementById(r[0]).focus()}else{var i=getFormInputValues(),o=i.name,s=i.rating,u=i.comments;if(navigator.serviceWorker&&navigator.serviceWorker.controller){var d="".concat(self.restaurant.id,"-").concat(Date.now()),c={name:o,rating:s,comments:u,restaurant_id:self.restaurant.id},l=document.getElementById("reviews-list");l.insertBefore(createReviewHTML(c,!0,d),l.firstChild),"onLine"in navigator&&!navigator.onLine&&enqueueToast("Your review will be submitted when you are back online"),closeModal(),clearForm(),navigator.serviceWorker.controller.postMessage({type:"post-review",review:c,requestId:d})}else{var m=document.getElementById("add-review-submit");m.setAttribute("disabled",!0),m.setAttribute("aria-busy","true"),DBHelper.addReview(self.restaurant.id,o,s,u,function(e,t){if(m.removeAttribute("disabled"),m.setAttribute("aria-busy","false"),e)enqueueToast("An error occurred. Please try again","error"),console.log(e);else{enqueueToast("".concat(o,"'s review has been saved"),"success");var r=document.getElementById("reviews-list");r.insertBefore(createReviewHTML(t),r.firstChild),closeModal(),clearForm()}})}}}function handleFormSubmit(e){e.preventDefault()}
//# sourceMappingURL=../sourcemaps/restaurant_info.js.map
