import React from 'react';
import './App.css';

// Import dei vari material-ui
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';

// Import di Firebase
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import '@firebase/firestore'

// I miei component
import HomePage from '../components/HomePage';
import PaginaMappa from '../components/PaginaMappa';

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
firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          console.log("Errore di cache, tab multiple con persistenza aperte.")
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          console.log("La persistenza non funziona in questo browser :(")
      }
  });

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
        <HomePage uiConfig={this.uiConfig}/>
      );
    }
    return (
      <PaginaMappa />
    );
  }
}

function App() {
  // L'equivalente del main
  return (
    <div>
      <ThemeProvider theme={theme}>
       <SignInScreen />
      </ThemeProvider>
    </div>
  );
}

export default App;