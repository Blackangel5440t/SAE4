import {init} from '../server.mjs';

import chai from 'chai'
import chaiHttp from 'chai-http'

let should = chai.should()

chai.use(chaiHttp)



describe('ville', () => {
    const requester = chai.request('http://127.0.0.1:3000').keepOpen();
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });



    it('Create Ville', async () => {
        const res = await requester.get('/get/Bordeaux');
        assert.equal(res.status, 200);
    });

    it('Get Ville already existing in DB', async ()=>{
        const res = await requester.get('/get/Paris');
        
        assert.equal(res.statusCode, 200)
        assert.equal(res.result.pays, "France")
    });

    it('Get Ville already existing in DB but with different name', async ()=>{
        const res = await requester.get('/get/Moscou');
        
        assert.equal(res.statusCode, 200)
        assert.equal(res.result.pays, "Moscow")
    });


    /*

    it('Requesting the token of the user', async () => {
        const res = await requester.post('/user/auth').set('content-type', 'application/json').send({
            login: "Mathis",
            password: "Michenaud"
        });
        assert.equal(res.status, 200);
        token = res.body.token
    });
        */
    requester.close();
});

describe('airports', () => {
    const requester = chai.request('http://127.0.0.1:3000').keepOpen();
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });



    it('Airport from town', async ()=>{
        const res = await requester.get('/airports/Bordeaux');
        
        assert.equal(res.statusCode, 200)
        assert.equal(res.result[1].id, "LFDI")
        assert.equal(res.result.length, 3)
        
    });
});

describe('proposal', () => {
    const requester = chai.request('http://127.0.0.1:3000').keepOpen();
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });



    it('get Flight proposal from an airport', async ()=>{
        const res = await requester.get('/proposal/LFDI/2023-04-09');
        
        assert.equal(res.statusCode, 200)
        assert.equal(res.result[0].destination, "Madrid")
        assert.equal(res.result.length, 8)
        
    });

    it('Get Flight proposal from an non existing airport', async ()=>{
        const res = await requester.get('/proposal/LKF9/2023-04-09');

        assert.equal(res.statusCode, 400)
    });

    it('Get Flight proposal from an airport with arrival', async ()=>{
        const res = await requester.get('/proposal/LKF9/2023-04-09/Madrid');

        
        assert.equal(res.statusCode, 200)
        assert.equal(res.result.length, 1)
        assert.equal(res.result[0].destination, "Madrid")
    });
});


describe('user', () => {
    const requester = chai.request('http://127.0.0.1:3000').keepOpen();
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });


    it('Create user', async ()=>{

        const res = await requester.post('/user').set('content-type', 'application/json').send({
            login: "login", 
            email:"test.test@gmail.com", 
            password:"password",
            token: "token",
            like: []
        });
        assert.equal(res.status, 201);
        assert.equal(res.result.email, "test.test@gmail.com")
    });



    
    it('Find existing user', async()=>{
        const res = await requester.get('/user/test.test@gmail.com');

        assert.equal(res.status, 200);
        assert.equal(res.result.email, "test.test@gmail.com")
    });


    it('Find non existing user', async()=>{
        const res = await requester.get('/user/pasdanstest.pasdanstest@gmail.com');

    
        assert.equal(res.status,400);
    });

    it('get Likes empty', async()=>{
        const res = await requester.get('/user/likes/test.test@gmail.com');
        
        assert.equal(res.status, 200);
        assert.equal(res.result.length, 0);
    })




})

describe('like', () => {
    const requester = chai.request('http://127.0.0.1:3000').keepOpen();
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });


    it('like', async ()=>{
        const res = await requester.post('/like').set('content-type', 'application/json').send({
            email:"test.test@gmail.com",
            id: 1
        });

        assert.equal(res.status, 201);
        assert.equal(res.result.length, 1);
    });

    it('get Likes non empty', async()=>{
        const res = await requester.get('/user/likes/test.test@gmail.com');

        assert.equal(res.status, 200);
        assert.equal(res.result.length, 1);

    })


})








describe('unlike', () => {
    const requester = chai.request('http://127.0.0.1:3000').keepOpen();
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });


    it('unlike', async ()=>{
        const res = await requester.post('/unlike').set('content-type', 'application/json').send({
            email:"test.test@gmail.com",
            id: 1
        });

        assert.equal(res.status, 201);
        assert.equal(res.result.length, 0);
    });

    it('get Likes non empty', async()=>{
        const res = await requester.get('/user/likes/test.test@gmail.com');

        assert.equal(res.status, 200);
        assert.equal(res.result.length, 1);

    })


})




