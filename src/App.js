import React, { Component } from 'react';
import * as mapsClass from './actions/gmap';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      favoriteStores: [],
      loadingStoresOnMap: false,
      showLoader: false
    }
  }

  componentDidMount() {
    mapsClass.addGmapListener(this.mapStarter);
  }

  componentWillUnmount() {
    mapsClass.removeGmapListener();
  }

  mapStarter = () => {
    let intervalLoader = setInterval(() => {this.setState({showLoader: !this.state.showLoader})}, 1000);
    this.setState({loadingStoresOnMap: true}, () => {
      mapsClass.initMap(this.markerHandler).then(() => {
        clearInterval(intervalLoader);
        this.setState({loadingStoresOnMap: false});
      }).then(() => {
        alert('You can click on map markers(Red baloon) to add them to your favorite Red Barn Stores');
      });
    });
  }

  markerHandler = (fav, item, marker) => {
    let { favoriteStores } = this.state;
    if(fav) {
      favoriteStores.push({ ...item, marker })
    } else {
      favoriteStores = favoriteStores.filter(i => (i.Name !== item.Name));
    }
    this.setState({favoriteStores});
  }

  removeFromFavorite = (marker, item) => {
    mapsClass.handleMarkerClick(marker, item, this.markerHandler);
  };

  render() {
    return (
      <div style={{flex: 1, display: 'flex', flexDirection: 'row'}}>
        <div style={{flex: 1, display: 'flex'}}>
          {this.state.favoriteStores.length ?
            <div style={{flex: 10}}>
              Below is the list of your favorite stores
              <ul>
                {this.state.favoriteStores.map((store, index) => <li key={index}>{store.Name}  &nbsp;&nbsp;<span onClick={e => this.removeFromFavorite(store.marker, store)} style={{color: 'red', cursor: 'pointer'}}><b>x</b></span></li>)}
              </ul>
            </div>
          : ''}
          <div id="map" style={{flex: 30}}></div>
        </div>
        {this.state.loadingStoresOnMap &&
          <div style={{flex: 1, position: 'absolute', zIndex: 99999999, display: 'flex',
            opacity: '0.7', height: '100%', width: '100%', justifyContent: 'center', backgroundColor: '#ccc'}}>
            {
              this.state.showLoader &&
                <h2>Loading Red Barn Stores from google maps...</h2>
            }
          </div>
        }
      </div>
    );
  }
}

export default App;
