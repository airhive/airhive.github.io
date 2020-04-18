import React, {Component} from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {MapView} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';
import { HeatmapLayer, HexagonLayer } from '@deck.gl/aggregation-layers';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Carousel from 'react-material-ui-carousel'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

import { isMobile } from "react-device-detect";

import IconClusterLayer from './icon-cluster-layer';
import IconAtlas from './data/location-icon-atlas.png';
import IconMapping from './data/location-icon-mapping.json';

import * as firebase from "firebase/app";
import '@firebase/firestore'

// Set your mapbox token here
const MAPBOX_TOKEN = "pk.eyJ1IjoiYWlyaGl2ZXJlYWN0IiwiYSI6ImNrOGs5N2dweDBjdXoza25hYjUyZ2FodW0ifQ.S6qUfTDbUQei1hvfvhZGtw";

// Source data CSV
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json'; // eslint-disable-line

const MAP_VIEW = new MapView({repeat: true});
const INITIAL_VIEW_STATE = {
    longitude: 11.1525,
    latitude: 46.6713,
    zoom: 6.6,
    maxZoom: 20,
    pitch: 0,
    bearing: 0
};

const material = {
    ambient: 0.64,
    diffuse: 0.6,
    shininess: 32,
    specularColor: [51, 51, 51]
  };
  
  const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ];

/* eslint-disable react/no-deprecated */
class Mappa extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: 0,
      y: 0,
      hoveredObject: null,
      expandedObjects: null
    };
    this._onHover = this._onHover.bind(this);
    this._onClick = this._onClick.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderhoveredItems = this._renderhoveredItems.bind(this);
  }

  _onHover(info) {
    if (this.state.expandedObjects) {
      return;
    }
    

    const {x, y, object} = info;
    this.setState({x, y, hoveredObject: object});
  }

  _onClick(info) {
    const {showCluster = true} = this.props;
    const {x, y, objects, object} = info;

    if (object && showCluster) {
      this.setState({x, y, expandedObjects: objects || [object]});
    } else {
      // this._closePopup();
    }
  }

  _closePopup() {
    if (this.state.expandedObjects) {
      this.setState({expandedObjects: null, hoveredObject: null});
    }
  }

  _renderhoveredItems() {
    const {x, y, hoveredObject, expandedObjects} = this.state;

    // OnClick
    if (expandedObjects) {
      return (
        <Box style={{ width: '13vw', margin: 'auto', marginLeft:"85vw", marginTop: '20vh' }}>
          <Carousel autoPlay={true}>
            {["pm10", "no2", "o3"].map((cosa) => 
              <Card >
                <CardHeader
                  // action={
                  //   <IconButton aria-label="settings" onClick={() => console.log("CLICK MERDE")}>
                  //     <CloseIcon/>
                  //   </IconButton>
                  // }
                  title="Dettaglio"
                  // subheader="September 14, 2016"
                />
                <CardContent>
                  {/* <Typography color="textSecondary" gutterBottom>
                    Dettaglio
                  </Typography> */}
                  <Typography component="h5">
                    {cosa}
                  </Typography>
                  <Typography color="textSecondary">
                    valore medio
                  </Typography>
                  <Typography variant="body2" component="p">
                    {expandedObjects.map(obj => obj[cosa]).reduce((partial_sum, a) => partial_sum + a,0)/expandedObjects.length}
                  </Typography>
                </CardContent>
                {/* <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions> */}
              </Card>
            )}
          </Carousel>
        </Box>
      );
    }

    if (!hoveredObject) {
      return null;
    }

    return null;

    // OnHover
    // return hoveredObject.cluster ? (
    //   <div className="tooltip" style={{left: x, top: y}}>
    //     <h5>{hoveredObject.point_count} records</h5>
    //   </div>
    // ) : (
    //   <div className="tooltip" style={{left: x, top: y}}>
    //     <h5>
    //       {hoveredObject.name} {hoveredObject.pm10 ? `(${hoveredObject.pm10})` : ''}
    //     </h5>
    //   </div>
    // );
  }

  _renderLayers() {
    if (this.state.sensori === undefined){
        return undefined
      }
    const {
        data = this.state.sensori,
        iconMapping = IconMapping,
        iconAtlas = IconAtlas,
        showCluster = true
    } = this.props;

    const layerProps = {
      data,
      pickable: true,
      getPosition: d => d.coordinates,
      iconAtlas,
      iconMapping,
      onHover: this._onHover
    };

    const layer = showCluster
      ? new IconClusterLayer({...layerProps, id: 'icon-cluster', sizeScale: 60})
      : new IconLayer({
          ...layerProps,
          id: 'icon',
          getIcon: d => 'marker',
          sizeUnits: 'meters',
          sizeScale: 2000,
          sizeMinPixels: 6
        });

    return [layer];
  }

    _renderLayersHeatMap() {
        const {intensity = 6, threshold = 0.03, radiusPixels = 60} = this.props;
        const data = this.state.sensori.map((sensore) => [...sensore.coordinates, sensore.intensity]);
        return [
            new HeatmapLayer({
                data,
                id: 'heatmp-layer',
                pickable: false,
                getPosition: d => [d[0], d[1]],
                getWeight: d => d[2],
                radiusPixels,
                intensity,
                threshold
            })
        ];
    }

  _renderLayersHeatMap3d() {
    const {radius = 100, upperPercentile = 80, coverage = 0.6} = this.props;
    const data = this.state.sensori.map((sensore) => [...sensore.coordinates, sensore.intensity]);

    return [
      new HexagonLayer({
        id: 'heatmap',
        // colorRange,
        coverage,
        data,
        elevationRange: [0, 3000],
        elevationScale: data && data.length ? 50 : 0,
        extruded: true,
        getPosition: d => [d[0], d[1]],
        getColorWeight: d => d[2],
        getElevationWeight: d => d[2],
        onHover: this.props.onHover,
        pickable: Boolean(this.props.onHover),
        radius,
        upperPercentile,
        material,
        colorAggregation: 'MEAN',

        transitions: {
          elevationScale: 3000
        }
      })
    ];
  }

  componentDidMount() {
    this.mounted = true;
    const db = firebase.firestore();

    if (this.state.sensori === undefined){
      // In futuro questo pezzo va messo un livello sopra così da non venire richiamato a ogni cambio pagina
      db.collection("informazioni").doc("info").get()
        .then(val => {
          let doc = db.collection('sensore').limit(val.data().sensori_totali);
          doc.onSnapshot(querySnapshot => {
            if(this.mounted){
              this.setState({sensori : querySnapshot.docs.map( (value) => ({
                coordinates : [value.data().lng, value.data().lat],
                intensity : value.data().pm10 / 40,
                pm10: value.data().pm10,
                citta: value.data().citta,
                name: value.data().nome,
                no2: value.data().no2,
                o3: value.data().o3,
                prec: value.data().prec,
                temp: value.data().temp,
                vento: value.data().vento,
                umi: value.data().umi,
                tempo: value.data().tempo
              }))})
            }
          }, err => {
            console.log(`Encountered error: ${err}`);
          });
        })
      }
    }

    componentWillUnmount(){
      this.mounted = false;
    }

  render() {
    const {mapStyle = 'mapbox://styles/mapbox/dark-v9'} = this.props;

    return (
      <div>
      <DeckGL
      layers={
          this.props.modalita == "marker" ?
          this._renderLayers() :
          this.props.modalita == "heatmap" ?
           this._renderLayersHeatMap() : 
           (this.props.modalita == "heatmap3d" ? this._renderLayersHeatMap3d() : undefined)
          }
        views={MAP_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{dragRotate: false}}
        onViewStateChange={this._closePopup}
        onClick={this._onClick}
      >
        <StaticMap
          reuseMaps
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
        {this._renderhoveredItems}
      </DeckGL>
      </div>
    );
  }
}

export default Mappa
