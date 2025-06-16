'use strict'

import {PrismaClient} from '@prisma/client'

import Lieux from '../model/lieux.mjs'
import { lieuxHTTPDao } from './lieuxHTTPDao.mjs'
import { villeHTTPDao } from './villeHTTPDao.mjs'

let prisma = new PrismaClient()

const updateBDLieux = async (name) =>{
    let res = await lieuxHTTPDao.findByTown(name)

    
    await LieuxBDDao.insert(res)
    
}



export const LieuxBDDao={

    findByTown: async(name) => {
        try{
            name = await villeHTTPDao.verifName(name)

            let nouvlieux = (await prisma.lieux.findMany({where : {villenom : name}})) 

            if (nouvlieux.length==0){
                await updateBDLieux(name)


                nouvlieux = (await prisma.lieux.findMany({where : {villenom : name}})) 
    
    
            }
            

            return LieuxBDDao.toList(nouvlieux)
            

        }catch(e){
            console.log(e)
            return Promise.reject(e)
        }
    },

    insert: async(lieux) =>{
        try{
            //console.log(lieux)
            const elt = await Promise.all(
                lieux.map(lieu => {
                    return prisma.lieux.create({
                        data: lieu
                    })
                })
            )

            return elt

        }catch (e){
            console.log("insert LieuxBD")
            console.log(e)
            return Promise.reject(e)
        }
    },

    toList: async(lieux) =>{
        const nouvlieux = []
        lieux.forEach(lieu =>{
            if (lieu!=null){
                nouvlieux.push(new Lieux(lieu))
            }
        })
        return nouvlieux
    }
}


