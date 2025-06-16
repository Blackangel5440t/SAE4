'use strict'


import Hapi from '@hapi/hapi'
import Joi from 'joi'

import Inert from '@hapi/inert'
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';


import { aeroController } from './controller/aeroController.mjs';

import {userController} from "./controller/userController.mjs"

import {villeController} from "./controller/villeController.mjs"


const joiValidator= Joi.object({
    email: Joi.string().required().description("must an non-empty"),
    id: Joi.number().required().description("must an non-empty")
})

const joiVol = Joi.object({
    number : Joi.string().required().description("must an non-empty"),
    destination : Joi.string().required().description("must an non-empty"),
    airline : Joi.string().required().description("must an non-empty"),
    terminal : Joi.string().required().description("must an non-empty"),
    heurelocale : Joi.string().required().description("must an non-empty"),
    model : Joi.string().required().description("must an non-empty"),
    aeroid : Joi.string().required().description("must an non-empty"),
    id: Joi.number().required().description("number must be unique")
}).description('Vol')


const joiAirport = Joi.object({
    id : Joi.string().required().description('id must be unique'),
    nom : Joi.string().required().description('must an non-empty'),
    ville_nom : Joi.string().required().description('must an non-empty'),
    vols: Joi.array().items(joiVol)//.required().description('must an non-empty')
}).description('Airport')

const joiUser = Joi.object({
    login: Joi.string().required().description("must an non-empty"),
    email: Joi.string().required().description("login must be unique"),
    password: Joi.string().required().description("must an non-empty "),
    token: Joi.string().required().description("must an non-empty "),
    like: Joi.array().items(joiVol)
}).description('User')

const joiLieux = Joi.object({
    nom: Joi.string().required().description('name muste be unique'),
    description: Joi.string().required().description('must an non-empty'),
    adresse: Joi.string().required().description('must an non-empty'),
    auteur: Joi.string().required().description('must an non-empty'),
    avis: Joi.string().required().description('must an non-empty'),
    rate: Joi.number().required().description('must an non-empty'),
    temps: Joi.string().required().description('must an non-empty'),
    image: Joi.string().required().description('must an non-empty'),
    villenom: Joi.string().required().description('must an non-empty'),
}).description('Lieux')

//const joiListeLieux = Joi.array().items(joiLieux).required().description('must an non-empty')

const joiVille = Joi.object({
    nom: Joi.string().required().description('name muste be unique'),
    pays: Joi.string().required().description('must an non-empty'),
    lat: Joi.number().required().description('must an non-empty'),
    lon: Joi.number().required().description('must an non-empty'),
    image: Joi.string().required().description('must an non-empty'),
    lieux: Joi.array().items(joiLieux).required().description('must an non-empty'),
    aeros: Joi.array().items(joiAirport).required().description('must an non-empty'),
}).description('Ville')



//const joiUsers = Joi.array().items(joiUser).description("A collection of User")



const notFound = Joi.object({
message: "not found"
})

const errorMessage = Joi.object({
message: "error"
})

const swaggerOptions = {
info: {
    title: "L'API des utilisateurs",
    version: '1.0.0',
}
};





const routes = [
    {
        method: '*',
        path: '/{any*}',
        handler: function (request, h){
            return h.response({message: "not found"}).code(404)
        }
    },

    /* ========== USER ========== */

    {
        // Get a user by its email
        method: 'GET',
        path: '/user/{email}',
        options:{
            description: 'Get User',
            notes: 'Returns a user or un an error message',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    email : Joi.string()
                        .required()
                        .description('the email of the user'),
                })
            },
            response: {
                status: {
                    200 : joiUser,
                    404 : notFound
                }
            }

        },
        handler : async(request, h) =>{
            try{ 
                const user = await userController.findByEmail(request.params.email)
                if (user == null)
                     return h.response({message: 'not found'}).code(404)
                else
                     return h.response(user).code(200)
 
            }catch(e){
                return h.response({message: 'not found'}).code(404)
            }
        }
    },
    {
        // add a new user
        method: 'POST',
        path: '/user',
        options: {
            description: 'Add User',
            notes: 'Returns added user',
            tags: ['api'],
            validate: {
                payload: joiUser
                
            },
            response: {
                status: {
                    201 : joiUser,
                    400 : errorMessage
                }
            }

        },
        handler: async (request, h) => {
            try {
                //Le body est accessible via request.payload
                const userToAdd = request.payload
                
                const user = await userController.add(userToAdd)
                
                return h.response(user).code(201)
            } catch (e) {

                return h.response({message: 'error'}).code(400)
            }
        }
    },
    {
        // like a plane
        method: 'POST',
        path: '/like',
        options: {
            description: 'Like a plane',
            notes: 'Returns an array of Vol',
            tags: ['api'],
            validate: {
                
                payload: joiValidator
                
            },
            response: {
                status: {
                    201 : Joi.array().items(joiVol),
                    400 : errorMessage
                }
            }

        },
        handler: async (request, h) => {
            try {
                const validator = request.payload

                const user = await userController.likeVol(validator.email, validator.id)
                
                return h.response(user).code(201)
            } catch (e) {

                return h.response({message: 'error'}).code(400)
            }
        }
    },
    {
        // unlike a plane
        method: 'POST',
        path: '/unlike',
        options: {
            description: 'Unlike a plane',
            notes: 'Returns an array of Vol',
            tags: ['api'],
            validate: {
                
                payload: joiValidator
                
            },
            response: {
                status: {
                    201 : Joi.array().items(joiVol),
                    400 : errorMessage
                }
            }

        },
        handler: async (request, h) => {
            try {
                const validator = request.payload

                const user = await userController.unlikeVol(validator.email, validator.id)
                
                return h.response(user).code(201)
            } catch (e) {

                return h.response({message: 'error'}).code(400)
            }
        }
    },
    {
        // Get planes liked by a user
        method: 'GET',
        path: '/user/likes/{email}',
        options:{
            description: 'Get planes liked by a user',
            notes: 'Returns a user or an error message',
            tags: ['api'],
            validate: {
                params: Joi.object({
                    email : Joi.string()
                        .required()
                        .description('the email of the user'),
                })
            },
            response: {
                status: {
                    200 : Joi.array().items(joiVol),
                    404 : notFound
                }
            }

        },
        handler : async(request, h) =>{
            try{ 
                const user = await userController.getLikes(request.params.email)
                if (user == null)
                     return h.response({message: 'not found'}).code(404)
                else
                     return h.response(user).code(200)
 
            }catch(e){
                return h.response({message: 'not found'}).code(404)
            }
        }
    },

    /* ========== VILLE ========== */

    {
        method: 'GET',
        path: '/ville/{name}',
        options:{
            description: 'find a Town',
            notes: 'return town',
            tags:['api'],
            validate: {
                params: Joi.object({
                    name : Joi.string()
                        .required()
                        .description('the name of the town')
                })
            },
            response:{
                status: {
                    200: joiVille,
                    400: notFound,
                }
            }
        },
        handler: async (request, h) => {
            try {
                const ville = await villeController.findByName(request.params.name)
               if (ville == null)
                    return h.response({message: 'not found'}).code(404)
                else
                    return h.response(ville).code(200)
            } catch (e) {
                return h.response({message: 'not found'}).code(404)
            }
        }
    },

    /* ========== AIRPORTS ========== */

    {
        method: 'GET',
        path: '/airports/{name}',
        options:{
            description: 'find airports of a town in a radius of 50km',
            notes: 'return list of airports',
            tags:['api'],
            validate: {
                params: Joi.object({
                    name : Joi.string()
                        .required()
                        .description('the name of the town')
                })
            },
            response:{
                status: {
                    200: Joi.array().items(joiAirport),
                    400: notFound,
                }
            }
        },
        handler: async (request, h) => {
            try {
                const aero = await aeroController.findAirportsByCity(request.params.name)
                
                if (aero.length==0)
                    return h.response({message: 'not found'}).code(404)
                else
                    return h.response(aero).code(200)
            } catch (e) {
                return h.response({message: 'not found'}).code(404)
            }
        }
    },
    
    /* ========== VOLS ========== */

    {
        method: 'GET',
        path: '/proposal/{icao}/{date}',
        options:{
            description: 'Propose 8 plane in an airport with a date',
            notes: 'return list of plane',
            tags:['api'],
            validate: {
                params: Joi.object({
                    icao : Joi.string()
                        .required()
                        .description('the id of the airport'),
                    date: Joi.string()
                        .required()
                        .description('the date of the plane')
                })
            },
            response:{
                status: {
                    200: Joi.array().items(joiVol),
                    400: notFound,
                }
            }
        },
        handler: async (request, h) => {
            try {
                const vol = await aeroController.findProposalFlightsStartDate(request.params.icao, request.params.date)
                
                if (vol.length==0)
                    return h.response({message: 'not found'}).code(404)
                else
                    return h.response(vol).code(200)
            } catch (e) {
                return h.response({message: 'not found'}).code(404)
            }
        }
    },

    {
        method: 'GET',
        path: '/proposal/{icao}/{date}/{arrivee}',
        options:{
            description: 'Propose 1 or many planes on a airport with a date and an arrival',
            notes: 'return list of plane',
            tags:['api'],
            validate: {
                params: Joi.object({
                    icao : Joi.string()
                        .required()
                        .description('the id of the airport'),
                    date: Joi.string()
                        .required()
                        .description('the date of the plane'),
                    arrivee: Joi.string()
                        .required()
                        .description('the arrival of the plane'),
                })
                
            },
            response:{
                status: {
                    200: Joi.array().items(joiVol),
                    400: notFound,
                }
            }
        },
        handler: async (request, h) => {
            try {
                const vol = await aeroController.findFlightsStartDate(request.params.icao, request.params.date, request.params.arrivee)
                
                if (vol.length==0)
                    return h.response({message: 'not found'}).code(404)
                else
                    return h.response(vol).code(200)
            } catch (e) {
                return h.response({message: 'not found'}).code(404)
            }
        }
    },

]


const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
        cors: true
    }
});

server.route(routes);

export const init = async () => {

    await server.initialize();
    return server;
};

export  const start = async () => {
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
