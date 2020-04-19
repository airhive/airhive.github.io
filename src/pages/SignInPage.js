import React from 'react';

// Import di Firebase
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import '@firebase/firestore'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import PaginaMappa from '../components/PaginaMappa';

// Import dei vari material-ui
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

let theme = createMuiTheme({
    palette: {
      primary: { main: '#ffd000' },
      secondary: { main: '#40bd47' },
    },
    status: {
      danger: 'orange',
    },
  });
theme = responsiveFontSizes(theme);


// Sistemare sto doppio login con firebase
const firebaseConfig = {
    apiKey: "AIzaSyBgHEi7pvK8fH0UKIUSzfdJB_CSgJyNtYE",
    authDomain: "airhive-app.firebaseapp.com",
    databaseURL: "https://airhive-app.firebaseio.com",
    projectId: "airhive-app",
    storageBucket: "airhive-app.appspot.com",
    messagingSenderId: "363013463834",
    appId: "1:363013463834:web:06c051b0e5c5e0194fd6a3"
  };
firebase.initializeApp(firebaseConfig);

class SignInScreen extends React.Component {

    // The component's Local state.
    // Occhio che questo è un modo vecchio che va bene per le classi,
    // per le funzioni usa const [ciao, setCiao] = useState(qualcosa per iniziare)
    // poi chiamo ciao quando vuoi e se vuoi cambiare lo stato fai setCiao(valore nuovo)
    state = {
      isSignedIn: false,
    };
  
    // Configure FirebaseUI.
    uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: 'popup',
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
      }
    };
  
    // Listen to the Firebase Auth state and set the local state.
    componentDidMount() {
      this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
          (user) => this.setState({isSignedIn: !!user})
      );
    }
  
    // Make sure we un-register Firebase observers when the component unmounts.
    componentWillUnmount() {
      this.unregisterAuthObserver();
    }
  
    // L'equivalente del main nella classe
    render() {
      // Se non è stato fatto login
      if (!this.state.isSignedIn) {
        return (
            <ThemeProvider theme={theme}>
                <Grid container direction="column"  justify="center"  alignItems="center">
                <Grid item xs={12} justify="center">
                        <Typography variant="h3">LOGIN</Typography>
                    </Grid>
                    <Grid item xs={12} justify="center">
                        <Paper style={{height:"80vh", width:"40vw"}} elevation={3}>
                            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                        </Paper>
                    </Grid>
                </Grid>
            </ThemeProvider>
        );
      }
      return (
        <ThemeProvider theme={theme}>
            <PaginaMappa />
        </ThemeProvider>
      );
    }
  }

export default SignInScreen;