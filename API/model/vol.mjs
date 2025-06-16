'use strict'

//class vol

export default class Vol{
    number 
    destination 
    airline 
    terminal 
    heurelocale 
    model 
    aeroid

    constructor(obj){
        Object.assign(this, obj)
    }
}