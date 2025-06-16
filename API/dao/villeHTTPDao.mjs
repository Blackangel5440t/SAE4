'use strict'
//acces au .env
import * as dotenv from 'dotenv'
dotenv.config()
const LIEUX_BASE_URL = process.env.LIEUX_BASE_URL
const DETAILS_BASE_URL = process.env.DETAILS_BASE_URL
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL
const key = process.env.LIEUX_KEY
const proxy = process.env.https_proxy


import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';



let agent = null
if (proxy != undefined) {
    agent =  new HttpsProxyAgent(proxy);
}
else {
    //pour pouvoir consulter un site avec un certificat invalide
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}



import Ville from '../model/ville.mjs'

export const villeHTTPDao = {
    verifName: async (name) =>{
        const urlville = LIEUX_BASE_URL+`ville%20${name}`+`&key=${key}`
        let response = agent!=null ? await fetch(urlville, {agent: agent}) : await fetch(urlville)
        let data = await response.json()

        return data.results[0].name
    },
    //ville
    findByName: async (name) =>{
        try{
            
            const urlville = LIEUX_BASE_URL+`ville%20${name}`+`&key=${key}`
            let response = agent!=null ? await fetch(urlville, {agent: agent}) : await fetch(urlville)
            let data = await response.json()
            

            let id = data.results[0].place_id

            const urlinfo = DETAILS_BASE_URL+`${id}`+`&key=${key}`
            response = agent!=null ? await fetch(urlinfo, {agent: agent}) : await fetch(urlinfo)
            data = await response.json()
            
            //let lieuxVille= await lieuxHTTPDao.findByTown(name)

            const ville = new Ville(
                {
                    nom: data.result.name,
                    pays:data.result.address_components[data.result.address_components.length - 1].long_name ,
                    lat:data.result.geometry.location.lat ,
                    lon:data.result.geometry.location.lng ,
                    image: IMAGE_BASE_URL+`${data.result.photos[0].photo_reference}`+`&key=${key}`,
                    //lieux: [],
                }
            )

            return ville

        }catch (e){
            return Promise.reject(e)

        }
    }
}
