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



import Lieux from '../model/lieux.mjs'

export const lieuxHTTPDao = {
    //find 5 point of interest in a city 
    findByTown: async (name) =>{
        try{
            const urllieux = LIEUX_BASE_URL+`${name}`+`%20point%20of%20interest&key=${key}`
            let response = agent!=null ? await fetch(urllieux, {agent: agent}) : await fetch(urllieux)
            let data = await response.json()

            

            let lieux = new Array()
            let max = 5

            if (data.results.length<5){
                max = data.results.length
            }


            for (let i = 0 ; i<max; i++){
                let id = data.results[i].place_id
                const urlinfo = DETAILS_BASE_URL+`${id}`+`&key=${key}`
                response = agent!=null ? await fetch(urlinfo, {agent: agent}) : await fetch(urlinfo)
                let data2 = await response.json()

                let desc = " "
                if(typeof data2.result.editorial_summary !== "undefined"){
                    desc = data2.result.editorial_summary.overview
                }
    
                const lieu = new Lieux(
                    {
                        nom: data2.result.name,
                        description: desc,
                        adresse: data2.result.formatted_address,
                        auteur: data2.result.reviews[0].author_name,
                        avis: data2.result.reviews[0].text,
                        rate: data2.result.reviews[0].rating,
                        temps: data2.result.reviews[0].relative_time_description,
                        image: IMAGE_BASE_URL+`${data2.result.photos[0].photo_reference}`+`&key=${key}`,
                        villenom : name
                    }
                )
                
                lieux.push(lieu)
            }
            

            return lieux

        }catch (e){
            return Promise.reject(e)

        }
    }
}
