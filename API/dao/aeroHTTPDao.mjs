'use strict'
//acces au .env
import * as dotenv from 'dotenv'
dotenv.config()
const AERO_BASE_URL = process.env.AERO_BASE_URL
const AIRPORT_BASE_URL = process.env.AIRPORT_BASE_URL
const DEPARTS_BASE_URL = process.env.DEPARTS_BASE_URL
const aerokey = process.env.AERO_KEY


import fetch from 'node-fetch';
/*import HttpsProxyAgent from 'https-proxy-agent';


let agent = null
if (proxy != undefined) {
    agent =  new HttpsProxyAgent(proxy);
}
else {
    //pour pouvoir consulter un site avec un certificat invalide
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
*/



import Vol from '../model/vol.mjs';
import Airport from '../model/airport.mjs'
import  HttpsProxyAgent  from 'https-proxy-agent'

const proxy = process.env.https_proxy
let agent = null
if (proxy != undefined) {
  agent = new HttpsProxyAgent(proxy);
}
else {
  //pour pouvoir consulter un site avec un certificat invalide
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': aerokey,
    'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
  },
  agent: agent
};

// Exemple donné par l'API pour effectuer un fetch
/*
fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
*/

export const aeroHTTPDao = {

  findAirportsByCity: async(ville) =>{
    try{
      const urlAero = AIRPORT_BASE_URL+ `lat=${ville.lat}&lon=${ville.lon}&radiusKm=50&limit=10`
      let response = options!=null ? await fetch(urlAero, options) : await fetch(urlAero)
      let data = await response.json()

      let aeros = new Array()


      data.items.forEach(aero => {
        let icao = aero.icao
        let name = aero.name
        const newAero = new Airport(
          {
            id: icao,
            nom: name,
            ville_nom: ville.nom
          }
        )
        aeros.push(newAero)
      })

      return aeros

    }catch(e){
      return Promise.reject(e)
    }
  },
  
  findProposalFlightsStartDate: async (icao, date) =>{
    try{
      const urlVols = DEPARTS_BASE_URL+`${icao}`+`/${date}T08:00`+`/${date}T20:00?direction=Departure&withCancelled=false&withCargo=false&withPrivate=false`
      let response = options!=null ? await fetch(urlVols, options) : await fetch(urlVols)
      

      let data = await response.json()


      let vols = new Array()
      let max = 8

      if (data.departures.length<8){
          max = data.departures.length
      }

      for (let i = 0; i<max; i++){
        let vol = new Vol(
          {
            number : data.departures[i].number,
            destination : data.departures[i].movement.airport.name,
            airline : data.departures[i].airline.name,
            terminal : data.departures[i].movement.terminal,
            heurelocale : data.departures[i].movement.scheduledTimeLocal,
            model : data.departures[i].aircraft.model,
            aeroid : icao
          }
        )
        vols.push(vol)
      }
      
      return vols

    }catch(e){
      return Promise.reject(e)
    }
  },
  findFlightsStartDate : async (icao, date, arrivee) =>{
    try{
      const urlVols = DEPARTS_BASE_URL+`${icao}`+`/${date}T08:00`+`/${date}T20:00?direction=Departure&withCancelled=false&withCargo=false&withPrivate=false`
      let response = options!=null ? await fetch(urlVols, options) : await fetch(urlVols)
      let data = await response.json()
      let vols = new Array()

      data.departures.forEach(elt => {
        if (elt.movement.airport.name.toLowerCase() == arrivee.toLowerCase()){
          let vol = new Vol(
            {
            number : elt.number,
            destination : elt.movement.airport.name,
            airline : elt.airline.name,
            terminal : elt.movement.terminal,
            heurelocale : elt.movement.scheduledTimeLocal,
            model : elt.aircraft.model,
            aeroid : icao
            }
          )
          vols.push(vol)
        }
      });
      return vols
      
    }catch(e){
      return Promise.reject(e)
    }
  }
}


