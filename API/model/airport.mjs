'use strict'

import Vol from "./vol.mjs"

//class Airport
export default class Airport{
    id
    nom

    ville_nom
    vols
    
    constructor (obj){
        this.id = obj.id || ""
        this.nom = obj.nom || ""
        this.ville_nom = obj.ville_nom || ""

        if (obj.vols!=null){
            this.vols = obj.vols.map(vol => new Vol(vol))
        }else{
            this.vols = []
        }
    }
}