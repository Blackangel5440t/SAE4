'use strict'

import { PrismaClient } from '@prisma/client'

import User from '../model/user.mjs'
import Vol from '../model/vol.mjs'

let prisma = new PrismaClient()

export const userDao = {
    

    //renvoie l'utilisateur ajouté ou une erreur sinon
    findByEmail : async (email) => {
        try {
            const elt = await prisma.user.findUnique({where: {email: email}})
            return elt == null ? null : new User(elt)
        } catch (e) {
            return Promise.reject(e)
        }
    },

    // ajoute un nouveau user 
    add: async (user) => {
        try {
            //await userDao.deleteAll()
            const elt = await prisma.user.create({
                data: {
                    login: user.login,
                    email: user.email,
                    password: user.password,
                    token: user.password,
                    like:{create: []}
                }})
            return new User(elt)
        }
        catch (e) {
            return Promise.reject(e)
        }
    },
    likeVol: async (email, id) =>{
        try{
            const elt = await prisma.user.update({
                where: {email: email},
                data:{
                    like:{
                        connect:{id: id}
                    }
                },
                include:{like: true}
            })
        
        return userDao.renduLikes(elt.like)

        }catch(e){
            return Promise.reject(e)
        }
    },
    unlikeVol: async (email, id) =>{
        try{
            const elt = await prisma.user.update({
                where: {email: email},
                data:{
                    like:{
                        disconnect:{id: id}
                    }
                },
                include:{like: true}
            })
        
        return userDao.renduLikes(elt.like)

        }catch(e){
            return Promise.reject(e)
        }
    },
    getLikes: async (email) =>{
        try{
            const elt = await prisma.user.findUnique({
                where: {email: email},
                include:{like: true}
            })
            if (elt === undefined){
                return []
            }
        
        return userDao.renduLikes(elt.like)

        }catch(e){
            return Promise.reject(e)
        }
    },

    renduLikes: async(donnee) =>{

        const vols = donnee.map(vol =>
            new Vol({
                number : vol.number,
                destination : vol.destination,
                airline : vol.airline,
                terminal : vol.terminal,
                heurelocale : vol.heurelocale,
                model : vol.model,
                aeroid: vol.aeroid,
                id: vol.id,
            })
            )
        return vols
    },

    deleteAll: async() =>{
        try{
            await prisma.user.deleteMany({})
        }catch (e){
            return Promise.reject(e)
        }
    }

}