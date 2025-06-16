'use strict'

import {PrismaClient} from '@prisma/client'

import Ville from '../model/ville.mjs'

import { villeHTTPDao } from './villeHTTPDao.mjs'
import { villeController } from '../controller/villeController.mjs'

import Vol from '../model/vol.mjs'
import { aeroHTTPDao } from './aeroHTTPDao.mjs'
import Airport from '../model/airport.mjs'


let prisma = new PrismaClient()

const UpdateAirportBD = async (ville) =>{
    let res = await aeroHTTPDao.findAirportsByCity(new Ville(ville))


    
    await aeroBDDao.insertAirport(res)
    

}

const UpdateVolBD = async (icao, date) =>{
    let res = await aeroHTTPDao.findProposalFlightsStartDate(icao, date)

    await aeroBDDao.majVol()

    
    await aeroBDDao.insertVol(res)
    
}

const UpdateVolBDArrivee = async (icao, date, arrivee) =>{
    let res = await aeroHTTPDao.findFlightsStartDate(icao, date, arrivee)

    await aeroBDDao.majVol()

    await aeroBDDao.insertVol(res)
}


export const aeroBDDao = {
    findAirportsByCity: async(nomville) =>{
        try{
            nomville = await villeHTTPDao.verifName(nomville)

            let ville =(await prisma.ville.findUnique({
                where:{nom : nomville},
                include: {aeros: {
                    include:{vols: true} }}
            }))



            if (ville == null){
                
                ville = await villeController.findByName(nomville)
                await UpdateAirportBD(new Ville(ville))

                const elt= (await prisma.airport.findMany({
                    where:{ville_nom: nomville},
                    include:{vols: true}
                }))


                
                return aeroBDDao.renduAirport(elt)

            }else{
                if (ville.aeros.length == 0){
                    await UpdateAirportBD(new Ville(ville))

                    const elt= (await prisma.airport.findMany({
                        where:{ville_nom: nomville},
                        include:{vols: true}
                    }))
                        return aeroBDDao.renduAirport(elt)

                }else{
                    
                    return aeroBDDao.renduAirport(ville.aeros)
                }
                
            }

            
            //return elt == null ? null : new Ville(elt)
        }catch(e){
            return Promise.reject(e)
        }
    },
    insertAirport: async(airports) =>{

        const elt= await Promise.all(
            airports.map(airport => {
                return prisma.airport.create({
                    data:{
                        id: airport.id,
                        nom: airport.nom,
                        ville_nom: airport.ville_nom,
                        vols:{create: []}
                    }
                })
            })
        )

        return elt

    },
    insertVol: async(vols)=>{
        try{
            const elt  = await Promise.all(
                vols.map(vol =>{
                    return prisma.vol.create({
                        data:{
                            number : vol.number,
                            destination : vol.destination,
                            airline : vol.airline,
                            terminal : vol.terminal,
                            heurelocale : vol.heurelocale,
                            model : vol.model,
                            aeroid: vol.aeroid,
                        }
                    })
                })
            )
            return elt
        }catch(e){
            return Promise.reject(e)
        }
        
    },
    majVol: async()=>{
        
    },
    findProposalFlightsStartDate: async (icao, date) =>{
        try{
            let elt = (await prisma.vol.findMany({
                where:{aeroid: icao}
            }))

            console.log(elt)
            if(elt.length==0 || elt.filter(vol => vol.heurelocale.startsWith(date)).length==0){
                await UpdateVolBD(icao, date)

                elt = (await prisma.vol.findMany({
                    where:{aeroid: icao}
                }))

            }
            console.log(elt)
            
            return aeroBDDao.renduVol(elt, date)

        }catch(e){
            console.log(e)
            return Promise.reject(e)
        }
    },
    findFlightsStartDate : async (icao, date, arrivee) =>{
        try{

            await aeroBDDao.majVol()

            let elt = (await prisma.vol.findMany({
                where:{aeroid: icao,
                    destination: arrivee
                },
            }))

            if(elt.length==0 || elt.filter(vol => vol.heurelocale.startsWith(date)).length==0 ){
                await UpdateVolBDArrivee(icao, date, arrivee)

                elt = (await prisma.vol.findMany({
                    where:{aeroid: icao,
                        destination: arrivee
                    },
                }))
            }

            return await aeroBDDao.renduVol(elt, date)
            
            
        }catch(e){
            return Promise.reject(e)
        }
    },
    renduAirport: async(donnee)=>{
        try{
    
            const airport = donnee.map(aero => aero.vols.length!=0 ?
                new Airport({
                    id: aero.id,
                    nom: aero.nom,
                    ville_nom: aero.ville_nom,
                    vols: aero.vols.map( vol =>
                        new Vol({
                            number : vol.number,
                            destination : vol.destination,
                            airline : vol.airline,
                            terminal : vol.terminal,
                            heurelocale : vol.heurelocale,
                            model : vol.model,
                            id: vol.id,
                            aeroid: vol.aeroid,
                        })
                    ) 
                })
                :
                new Airport({
                    id: aero.id,
                    nom: aero.nom,
                    ville_nom: aero.ville_nom,
                    vols: aero.vols
                })
                )
            return airport
        }catch(e){
            return Promise.reject(e)
        }
        
    },
    renduVol: async(donnee, date)=>{
        try{
            const vols = donnee.map(vol => 
                new Vol({
                    number : vol.number,
                    destination : vol.destination,
                    airline : vol.airline,
                    terminal : vol.terminal,
                    heurelocale : vol.heurelocale,
                    model : vol.model,
                    id: vol.id,
                    aeroid: vol.aeroid,
                })
                )
            //
            return vols.filter(vol => vol.heurelocale.startsWith(date))
        }catch(e){
            return Promise.reject(e)
        }

    },
    
}








