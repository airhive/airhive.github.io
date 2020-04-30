import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import DataGrid from 'react-data-grid';
import 'react-data-grid/dist/react-data-grid.css';

import * as firebase from "firebase/app";
import '@firebase/firestore'

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    }
  ));

function Griglia (props){
    const [righe, setRighe] = React.useState([0]);
    const calcolaQuale = (_righe) => {
        let media = Math.round(_righe.map(riga => riga.airindex).reduce((a, b) => a + b, 0)/(righe.length*10))
        return media > 12 ? 12 : media
    }
    const columns = [
        { key: "citta", name: "Città" },
        { key: "nome", name: "Nome" },
        { key: "airindex", name: "Indice" },
        { key: "pm10", name: "Pm10" },
        { key: "no2", name: "NO2" },
        { key: "o3", name: "O3" }
      ];
    if ((righe[0] == 0 || props.aggiorna) && props.citta != "Caricamento..."){
        console.log("ANcora")
        const db = firebase.firestore();
        let query = db.collection('sensore').where('citta', '==', props.citta);

        query.onSnapshot(querySnapshot => {
            setRighe(querySnapshot.docs.map(v  => ({
                citta: v.data().citta, 
                nome: v.data().nome,
                pm10: v.data().pm10,
                no2: v.data().no2,
                o3: v.data().o3,
                airindex: ((v.data().no2/400) + (v.data().pm10/180) + (v.data().o3/240))*100
             })))
        }, err => {
        console.log(`Encountered error: ${err}`);
        });
        // Lancia un warning ma funziona bene, va capito come sistemarlo
        props.setAggiorna(false);
    }
    return (
        (righe[0] == 0) ? <Typography variant="h3" component="h4">
        Caricamento...
    </Typography> : 
    <Grid container direction="row" spacing={2} justify="center" alignItems="center">
        <Grid item xs={3} justify="right" alignItems="center">
            <Paper style={{textAlign: 'center'}}>
                <p>L'aria è {
                ["estremamente pulita", "molto pulita", "pulita", "pulita", "abbastanza pulita", "mediocre", "mediocre", "mediocre/sporca", "sporca", "cattiva", "pericolosa", "molto pericolosa", "estremamente pericolosa"][calcolaQuale(righe)]
                }</p>
                <p>Media indice: {righe.map(riga => riga.airindex).reduce((a, b) => a + b, 0)/righe.length}</p>
                <p>Media PM10: {righe.map(riga => riga.pm10).reduce((a, b) => a + b, 0)/righe.length}</p>
                <p>Media NO2: {righe.map(riga => riga.no2).reduce((a, b) => a + b, 0)/righe.length}</p>
                <p>Media O3: {righe.map(riga => riga.o3).reduce((a, b) => a + b, 0)/righe.length}</p>
            </Paper>
        </Grid>
        <Grid item xs={8} justify="left" alignItems="center">
            <DataGrid
                columns={columns}
                rows={righe}
            />
        </Grid>
    </Grid>
    )
}

function PaginaDati (){
    const classes = useStyles();
    const [citta, setCitta] = React.useState("Caricamento...");
    const [listaCitta, setListaCitta] = React.useState(["Caricamento..."])
    const [aggiorna, setAggiorna] = React.useState(true);
  
    const handleChange = (event) => {
      const name = event.target.value;
      console.log(event.target.value);
      setCitta(name);
      setAggiorna(true);
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
            <Grid container direction="column" spacing={2}>
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
                        <Griglia citta={citta} aggiorna={aggiorna} setAggiorna={setAggiorna}/>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
  }

  export default PaginaDati;