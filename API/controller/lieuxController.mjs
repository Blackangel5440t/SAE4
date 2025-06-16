'user strict'

import { LieuxBDDao } from "../dao/lieuxBDDao.mjs"
import { lieuxHTTPDao } from "../dao/lieuxHTTPDao.mjs" 

export const lieuxController = {
    findByTown: async(ville) =>{
        try{
            return await LieuxBDDao.findByTown(ville)
        }catch(e){
            console.log(e)
            return Promise.reject({message: "error"})
        }
    }
}

