'use strict'

import Lieux from "./lieux.mjs"
import Airport from "./airport.mjs"

// class ville
export default class Ville{
    nom 
    pays 
    lat 
    lon
    image

    lieux
    aeros
    constructor(obj){
        this.nom = obj.nom || ""
        this.pays = obj.pays || ""
        this.lat = obj.lat || ""
        this.lon = obj.lon || ""
        this.image = obj.image || ""

        if (obj.lieux!=null){
            this.lieux= obj.lieux.map(lieu => new Lieux(lieu))
        }else{
            this.lieux=[]
        }
        if (obj.aeros!=null){
            this.aeros= obj.aeros.map(aer => new Airport(aer))
        }else{
            this.aeros=[]
        }
    
    }
}
