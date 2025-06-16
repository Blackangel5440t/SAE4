'use strict'

import { PrismaClient } from '@prisma/client'

import Ville from '../model/ville.mjs'
import { villeHTTPDao } from './villeHTTPDao.mjs'

import { lieuxController } from '../controller/lieuxController.mjs'
import Lieux from '../model/lieux.mjs'

import Vol from '../model/vol.mjs'
import Airport from '../model/airport.mjs'

let prisma = new PrismaClient()


const updateBD = async (name) => {

    let res = await villeHTTPDao.findByName(name)
    

    await villeBDDao.insert(res)
}

export const villeBDDao = {
    findByName : async(name) =>{
        try{
            // chercher les variantes de noms
            name = await villeHTTPDao.verifName(name)


            const ville =(await prisma.ville.findUnique(
                {where : {nom: name},
                include: {lieux: true,
                    aeros: {include:{vols: true} }}
                    }))
                
  
            if (ville == null){
                console.log("update")
                await updateBD(name)

                const elt =(await prisma.ville.findUnique({
                    where : {nom: name},
                    include: {lieux: true,
                            aeros: {
                                include: {
                                    vols: true
                                }
                            },
                            }
                }))

                return villeBDDao.rendu(elt)
            }else{
            
                
                return villeBDDao.rendu(ville)
            }
        }catch (e){
            console.log(e)
            return Promise.reject(e)
        }
    },
    insert : async (ville) =>{
        try {

            await prisma.ville.create({
                data:{
                    nom : ville.nom,
                    pays : ville.pays,
                    lat : ville.lat,
                    lon: ville.lon,
                    image: ville.image,

                    lieux: {create: []},
                    aeros: {create: []}
                } 
            })

            await lieuxController.findByTown(ville.nom)
            
            return

        } catch (e) {
            
            return Promise.reject(e)
        }
    },
    rendu : async(ville)=>{
        try{
        const _lieux = ville.lieux.map(lieu => 
            new Lieux({
                nom: lieu.nom,
                description: lieu.description,
                adresse:lieu.adresse,
                auteur: lieu.auteur,
                avis: lieu.avis,
                rate: lieu.rate,
                temps: lieu.temps,
                image: lieu.image,
                villenom: lieu.villenom,
            })
        )
        const _aeros = ville.aeros.map(aero => aero.vols.length!=0 ?
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
                        aeroid: vol.aeroid,
                        id: vol.id
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

        let nouv = new Ville({
            nom: ville.nom,
            pays:ville.pays ,
            lat:ville.lat ,
            lon:ville.lon ,
            image: ville.image,
            lieux: _lieux,
            aeros: _aeros
        }) 
        return nouv
        }catch(e){
            return Promise.reject(e)
        }
        
    }


}




