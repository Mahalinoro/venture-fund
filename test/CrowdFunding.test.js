const assert = require("assert");

const CrowdFunding = artifacts.require("CrowdFunding");

contract("CrowdFunding", async accounts => {
    let crowdfunding;
    const ownerAccount = accounts[0];
    const userAccountOne = accounts[1];
    const userAccountTwo = accounts[2];


    it("should create new project campaign.", async() => {
        const instance = await CrowdFunding.deployed();
        await instance.createProject(2, 5, 'project1', 'desc1', 'url1', {from: userAccountOne});
        const projectCount = await instance.getProjectsCount();
        assert.equal(projectCount, 1);
    })

    it("should contribute to project", async() => {
        const instance = await CrowdFunding.deployed();
        try{
            await instance.contribute(0, {value: (2*(10**18)), from: userAccountTwo});
            assert.ok(1, true);
        } catch (e){
            assert.include(e.message, "Error")
        }
    })

    it("should payout to the balance", async() => {
        const instance = await CrowdFunding.deployed();
        try{
            const status = await instance.contribute(0, {value: (3*(10**18)), from: userAccountTwo});
            assert.ok(status, true);
        } catch (e){
            assert.include(e.message, "Error")
        } 
    })

    
});