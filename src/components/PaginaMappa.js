import React from 'react';

import { isMobile } from "react-device-detect";

// Import dei vari material-ui
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import Toolbar from '@material-ui/core/Toolbar';

// Icone di material-ui
import BarChartIcon from '@material-ui/icons/BarChart';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import RoomIcon from '@material-ui/icons/Room';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';

import { AmbientLight, PointLight, LightingEffect, MapView } from '@deck.gl/core';

import * as firebase from "firebase/app";
import '@firebase/firestore'

import logo from '../images/logo.svg'
import PaginaDati from './Dati';
import Mappa from './Mappa';
const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/icon/meteorites.json';

// const MAPBOX_TOKEN = "pk.eyJ1IjoiYWlyaGl2ZXJlYWN0IiwiYSI6ImNrOGthMXc3NzAzN3czbXA2ZHA1YjZpYzgifQ.TxZyiOnAI1bEapXypdGD6A";
const MAPBOX_TOKEN = "pk.eyJ1IjoiYWlyaGl2ZXJlYWN0IiwiYSI6ImNrOGs5N2dweDBjdXoza25hYjUyZ2FodW0ifQ.S6qUfTDbUQei1hvfvhZGtw";

const MAP_VIEW = new MapView({repeat: true});

const drawerWidth = 240;

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000]
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

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

const elevationScale = {min: 1, max: 50};

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  radioGroup: {
    margin: theme.spacing(1, 0),
  },
  speedDial: {
    position: 'absolute',
    marginBottom: "80px",
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  }
));

const INITIAL_VIEW_STATE = {
  longitude: 11.1525,
  latitude: 46.6713,
  zoom: 6.6,
  // minZoom: 5,
  // maxZoom: 15,
  pitch: 40.5,
  bearing: -27.396674584323023
};

function MappaAppBar(props) {
    const classes = useStyles();
    // const theme = useTheme();

    var displayName = firebase.auth().currentUser.displayName;
    var photoUrl = undefined;

    if (firebase.auth().currentUser.photoURL){
      photoUrl = firebase.auth().currentUser.photoURL;
    }
    return (
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={props.handleDrawerToggle}
              className={classes.menuButton}
            >
            <MenuIcon />
          </IconButton>
          <div className={useStyles().grow} />
          {/* https://github.com/mui-org/material-ui/issues/4059 */}
          {/* <Avatar alt={displayName} src={photoUrl}/> */}
          <img src={photoUrl} height="40" style={{margin:5, borderRadius: 20,}} alt="Utente"/>
          <IconButton color="inherit" aria-label="logout" onClick={() => {firebase.auth().signOut()}}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    )
}

function PaginaMappa() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [modalita, setModalita] = React.useState("marker");
  const [open, setOpen] = React.useState(false);
  const [vediMappa, setVediMappa] = React.useState(true);

  const classes = useStyles();

  var percentualeGrandezzaLogo = 0.6;

  const handleClose = () => {
    setOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const drawer = (
    <div>
      <Card style={{margin: drawerWidth*((1-percentualeGrandezzaLogo)/2), width: drawerWidth*percentualeGrandezzaLogo, backgroundColor: 'transparent'}} elevation={0}>
          <CardMedia
              style={{
              backgroundColor: 'transparent',
              }}
              image={logo}
              title="AirHive"
              component="img"
          />
      </Card>
      <Divider />
      <List>
        <ListItem button onClick={() => setVediMappa(!vediMappa)} >
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary={vediMappa ? "Dati per città" : "Mappa" } />
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  const speeddial = (
    <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        hidden={false}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction="up"
      >
        <SpeedDialAction
            key="marker"
            icon={<RoomIcon />}
            tooltipTitle="marker"
            onClick={() => {
              setOpen(false);
              setModalita("marker");
            }}
          />
        <SpeedDialAction
          key="heatmap"
          icon={<GraphicEqIcon />}
          tooltipTitle="heatmap"
          onClick={() => {
            setOpen(false);
            setModalita("heatmap");
          }}
        />
        <SpeedDialAction
          key="heatmap3d"
          icon={<BarChartIcon />}
          tooltipTitle="heatmap3d"
          onClick={() => {
            setOpen(false);
            setModalita("heatmap3d");
          }}
        />
      </SpeedDial>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <MappaAppBar
      handleDrawerToggle={handleDrawerToggle}
      />
      {vediMappa ? speeddial : undefined}
        <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
        </nav>
        <main className={classes.content} style={{marginLeft: isMobile ? "0px" : drawerWidth.toString() + "px"}}>
          {vediMappa ? 
          <Mappa 
            modalita={modalita}
          /> :
          // <Mappa 
          // modalita={modalita}
          // /> : 
          <PaginaDati />}
        </main>
    </div>
  )
}

  export default PaginaMappa;
