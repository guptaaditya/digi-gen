import * as storeDetails from '../../store_directory.json';

const googleDefaultIcon = "http://maps.google.com/mapfiles/kml/paddle/red-circle.png";
const favoriteStoreIcon = "https://cdn2.iconfinder.com/data/icons/social-buttons-2/512/memori-24.png";

export function handleMarkerClick(marker, item, markerHandler) {
  if(marker.customInfo === 'favorite') {
    marker.customInfo = '';
    marker.setIcon(googleDefaultIcon);
  } else {
    marker.customInfo = 'favorite';
    marker.setIcon(favoriteStoreIcon);
  }
  if(markerHandler) {
    markerHandler(marker.customInfo, item, marker);
  }
};

export function decodeAddress(item, map, google, failedDecodings, markerHandler) {
  return new Promise(function(res, rej){
    setTimeout(function(){
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': item.Address}, function(results, status) {
        if (status === 'OK') {
          let marker = new google.maps.Marker({
              map,
              position: results[0].geometry.location,
              title: item.Name,
              icon: googleDefaultIcon
          });
          map.setCenter(results[0].geometry.location);
          google.maps.event.addListener(marker, 'click', () => {
            handleMarkerClick(marker, item, markerHandler)
          });
        } else {
          item.status = status
          failedDecodings.push(item);
        }
        res();
      });
    }, 250);
  });
}

export function addGmapListener(listner) {
  document.addEventListener("gmap-loaded", listner);
}

export function removeGmapListener(listner) {
  document.removeEventListener("gmap-loaded", listner);
}

export function initMap(markerHandler) {
  let mexico = {lat: 19.4733487, lng: -99.157019};
  let map = new window.google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: mexico
  });

  var p = emptyPromise();
  var failedDecodings = [];
  storeDetails.default.forEach(item => {
    p = p.then(() => {
      return decodeAddress(item, map, window.google, failedDecodings, markerHandler);
    })
  });
  p = p.then(() => {
    console.log(`Failed geocoding for ${failedDecodings.length} stores`, failedDecodings);
    //retry for over limit failures
    var failedRetryDecodings = [];
    let queryOverLimitFailedDecodings = failedDecodings.filter(i => (i.status === 'OVER_QUERY_LIMIT'));
    console.log(`Retrying for over usage failures`, queryOverLimitFailedDecodings);
    var p1 = emptyPromise();
    queryOverLimitFailedDecodings.forEach(item => {
      p1 = p1.then(() => {
        return decodeAddress(item, map, window.google, failedRetryDecodings);
      });
    });
    return p1;
  });
  p.then(() => {
    map.setZoom(11);
    map.setCenter(mexico);
  });
  return p;
}

export function emptyPromise(){
  return new Promise(function(resolve, reject){
    setTimeout(resolve, 0);
  });
}
