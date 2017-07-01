var expect = chai.expect; // This makes the expect function available to us

    var earth = {
        isRound: true,
        numberFromSun: 3,
        density: 5.51
    };

    describe("Earth", function(){

        it("is round", function(){
            expect(earth.isRound).to.equal(true);
        });

        it("is the third planet from the sun", function(){
            expect(earth.numberFromSun).to.equal(3);
        });

        it("is the densest of all the planets", function(){
            expect(earth.density).to.be.at.least(5.51);
        });
    });
