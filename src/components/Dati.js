import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import * as firebase from "firebase/app";
import '@firebase/firestore'

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    }
  ));

function PaginaDati (){
    const classes = useStyles();
    const [citta, setCitta] = React.useState("Caricamento...");
    const [listaCitta, setListaCitta] = React.useState(["Caricamento..."])
  
    const handleChange = (event) => {
      const name = event.target.value;
      console.log(event.target.value);
      setCitta(name);
    };
  
    if (listaCitta[0] == "Caricamento..."){
      const db = firebase.firestore();
      db.collection("informazioni").doc("info").get()
        .then(doc => {
          setListaCitta(doc.data().lista_citta);
          setCitta("merano");
        })
    }
  
    return (
        <div>
            <Grid container direction="column" spacing={5}>
                <Grid key="titolo" item>
                    <Paper>
                        <Grid container direction="row" spacing={2}>
                            <Grid key="select" item justify="left" xs={12} sm={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>Città</InputLabel>
                                    <Select
                                        value={citta}
                                        onChange={handleChange}
                                        inputProps={{
                                        name: "città",
                                        id: "citta",
                                        }}
                                    >
                                        {listaCitta.map((citt) => <MenuItem value={citt}>{citt[0].toUpperCase() + citt.slice(1)}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid key="testo" item justify="center" xs={12} sm={6}>
                                <Typography variant="h3" component="h4">
                                {citta[0].toUpperCase() + citta.slice(1)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid key="contenuto" item>
                    <Paper>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container justify="center" spacing={2}>
                                    <Grid key="testo" item justify="center" xs={12} sm={6}>
                                        <Typography variant="h3" component="h4">
                                            CIAO SONO UN DATO
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
  }

  export default PaginaDati;