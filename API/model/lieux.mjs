'use strict'

//class lieux
export default class Lieux{
    nom
    description
    adresse
    auteur
    avis
    rate
    temps
    image 
    villenom
    constructor (obj){
        this.nom = obj.nom || ""
        this.description = obj.description || ""
        this.adresse = obj.adresse || ""
        this.auteur = obj.auteur || ""
        this.avis = obj.avis || ""
        this.rate = obj.rate || 0
        this.temps = obj.temps || ""
        this.image = obj.image || ""
        this.villenom = obj.villenom || ""
        //Object.assign(this, obj)
    }
}