'use strict'

import { userDao } from "../dao/userDao.mjs"

export const userController = {

    // Find by login the user
    findByEmail: async (email)=>{
        try{
            return await userDao.findByEmail(email)
        }catch(e){
            return Promise.reject({message : "error"})
        }
    },
    // add a new user in database
    add : async (user) =>{
        try{
            return await userDao.add(user)
        }catch(e){
            return Promise.reject({message: "error"})
        }
    },
    likeVol: async(email, id) =>{
        try{
            return await userDao.likeVol(email, id)
        }catch(e){
            return Promise.reject({message: "error"})
        }
    },
    unlikeVol: async(email, id) =>{
        try{
            return await userDao.unlikeVol(email, id)
        }catch(e){
            return Promise.reject({message: "error"})
        }
    },
    getLikes: async (email) =>{
        try{
            return await userDao.getLikes(email)
        }catch(e){
            return Promise.reject({message: "error"})
        }
    }
}