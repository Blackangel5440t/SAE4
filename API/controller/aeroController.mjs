'use strict'

import { aeroBDDao } from "../dao/aeroBDDao.mjs"


export const aeroController ={
    findAirportsByCity: async(nomville) =>{
        try{
            return await aeroBDDao.findAirportsByCity(nomville)
        }catch(e){
            return Promise.reject({message: "error"})
        }
    },
    findProposalFlightsStartDate: async (icao, date) =>{
        try{
            return await aeroBDDao.findProposalFlightsStartDate(icao, date)
        }catch(e){
            return Promise.reject({message: "error"})
        }
    },
    findFlightsStartDate : async (icao, date, arrivee) =>{
        try{
            return await aeroBDDao.findFlightsStartDate(icao, date, arrivee)
        }catch(e){
            return Promise.reject({message: "error"})
        }
    }
    
    
}