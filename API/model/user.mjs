'use strict'

import Vol from "./vol.mjs"

// class user
export default class User{
    login
    email
    password
    token

    like    
    constructor(obj){
        this.login = obj.login || ""
        this.email = obj.email || ""
        this.password = obj.password || ""
        this.token = obj.token || ""
        
        if(obj.like){
            this.like= obj.like.map(vol => new Vol(vol))
        }else{
            this.like = []
        }

    }
}

