'user strict'

import { villeBDDao } from "../dao/villeBDDao.mjs"

export const villeController = {
    findByName: async(name) =>{
        try{
            return await villeBDDao.findByName(name)
        }catch(e){
            //console.log("controller")
            console.log(e)
            return Promise.reject({message: "error"})
        }
    }
}



