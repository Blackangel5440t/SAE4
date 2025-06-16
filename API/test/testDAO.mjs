import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiHttp from 'chai-http';


import { LieuxBDDao } from '../dao/lieuxBDDao.mjs';
import {villeBDDao} from '../dao/villeBDDao.mjs'
//import { villeHTTPDao } from '../dao/villeHTTPDao.mjs';
import { aeroBDDao } from '../dao/aeroBDDao.mjs';
import {userDao} from '../dao/userDao.mjs'


import User from '../model/user.mjs'




chai.use(chaiAsPromised);
chai.use(chaiHttp);



describe('Test VilleDAO', ()=>{
    const vDAO = villeBDDao

    it('Getting Town by its name', async ()=>{
        const ville = await vDAO.findByName("Paris")
        assert.isArray(ville.aeros, "Aeros should be an array")
        assert.isArray(ville.lieux, "Lieux should be an array")
    });

    it('Getting Town by its name with at least 1 Lieux', async ()=>{
        const ville = await vDAO.findByName("Paris")
        assert(ville.lieux.length >= 1, "Il doit il y avoir au moins un lieu")
    });

    it('Correct Name', async ()=>{
        const ville = await vDAO.findByName("Moscow")
        const ville2 = await vDAO.findByName("Moscou")
        
        assert.equal(ville2.nom, ville.nom, "On doit trouver le même lieu")
    })

    it('Getting Town by its name with empty list aero', async ()=>{
        const ville = await vDAO.findByName("Moscow")
        assert.equal(ville.aeros.length, 0, "Il ne doit y avoir aucuns aéroports dans Moscow")
    });

})


describe('Test LieuxDAO', ()=>{
    const lDAO = LieuxBDDao

    it('Getting Lieux By Town', async ()=>{
        const lieux = await lDAO.findByTown("Paris")
        assert.isArray(lieux, "Then an array should be returned")
    });

    it('Getting 5 Lieux By Town', async ()=>{
        const lieux = await lDAO.findByTown("Paris")
        assert.equal(lieux.length, 5, "Then 5 Lieux should be returned")
    });

})


describe('Test AeroDAO', ()=>{
    const aDAO = aeroBDDao
    const vDAO = villeBDDao

    it('Getting Airport by town Name', async ()=>{
        const aero = await aDAO.findAirportsByCity("Paris")
        assert.isArray(aero, "Then an array should be returned")
    });

    it('Getting more than 1 Airport by town Name', async ()=>{
        const aero = await aDAO.findAirportsByCity("Paris")
        assert(aero.length > 1, "Should be more than one Airport")
    });

    it('Getting Airport by unknown Town', async ()=>{
        const aero = await aDAO.findAirportsByCity("Bordeaux")
        assert.isArray(aero, "Then an array should be returned")
    });

    it('Getting empty vol from Bordeaux ', async ()=>{
        const aeros = await aDAO.findAirportsByCity("Bordeaux")
        aeros.forEach(aero => {
            assert(aero.vols.length == 0, "Then vols should be an empty array")
        });
    });

    it('Getting Town with the Airport', async ()=>{
        const ville = await vDAO.findByName("Bordeaux")
        assert(ville.aeros.length > 0, "Then aeros should not be an empty array")        
    });

    it('Getting proposal from existing airport ', async ()=>{
        const id = await vDAO.findByName("Bordeaux")[0].id
        const vols = await aDAO.findProposalFlightsStartDate(id, "2023-04-09")
        console.log(vols)
        assert(vols.length == 8, "Then vols should be with 8 vols")
    });

    it('Getting list by proposal from existing airport ', async ()=>{
        const id = "LFDI"
        const vols = await aDAO.findProposalFlightsStartDate(id, "2023-04-09")
        assert.isArray(vols, "Then an array should be returned")
    });

    it('Getting different list by proposal from existing airport with other date ', async ()=>{
        const id = "LFDI"
        const vols1 = await aDAO.findProposalFlightsStartDate(id, "2023-04-09")
        const vols = await aDAO.findProposalFlightsStartDate(id, "2023-04-10")
        assert(vols.number!=vols1.number, "Should be different results")
    });

    it('Getting existing vol ', async ()=>{
        const id = "LFDI" // aeroport Libourne/Artigues-de-Lussac, Libourne-Artigues-de-Lussac
        const vols = await aDAO.findProposalFlightsStartDate(id, "2023-04-09", "Madrid")
        assert(vols.length == 1, "Then a vol should exist")
    });

    it('Getting updated on town called', async ()=>{
        const ville = await vDAO.findByName("Bordeaux")
        assert(ville.aeros[0].vols.length > 0, "Then vols should not be an empty array")        
    });

})

describe('Test user', ()=>{
    const uDao = userDao
    const userTest = new User({
        login: 'login',
        email: 'test.test@gmail.com',
        password: 'password',
        token: 'token',

        like: []
    })

    it('Create new user', async ()=>{
        await uDao.deleteAll()
        const user = await uDao.add(userTest)
        assert(user.email == userTest.email && user != null, "user must be created")
    });


    it('Get user', async ()=>{
        const user = await uDao.findByEmail(userTest.email)
        console.log(user)
        assert(user.email == userTest.email && user != null, "user must be found")
    });

    it('Array in Like vol', async ()=>{
        const user = await uDao.likeVol(userTest.email, 1)
        console.log(user)
        assert.isArray(user, "Then an array should be returned")
    });

    it('Like vol', async ()=>{
        const user = await uDao.likeVol(userTest.email, 2)
        assert(user.length == 2, "Ther should be 2 Vol liked by this user")
    });


    it('Get Array in Liked vol', async ()=>{
        const user = await uDao.getLikes(userTest.email)
        assert.isArray(user, "Then an array should be returned")
    });

    it('Get Liked vol', async ()=>{
        const user = await uDao.getLikes(userTest.email)
        assert(user.length == 2, "Ther should be 2 Vol liked by this user")
    });

    it('Array in UnLike vol', async ()=>{
        const user = await uDao.unlikeVol(userTest.email, 2)
        assert.isArray(user, "Then an array should be returned")

    });

    it('UnLike vol', async ()=>{
        const user = await uDao.unlikeVol(userTest.email, 1)
        assert(user.length==0, "there should be an empty array")
    });
    

})
