var expect = chai.expect;

    describe("gEngine.Fonts", function(){
        it("has loadFont function", function(){
            expect(gEngine.Fonts.loadFont).to.exist;
        });

        it("has unload function", function(){
            expect(gEngine.Fonts.unloadFont).to.exist;
        });

        it("has getCharInfo function", function(){
            expect(gEngine.Fonts.getCharInfo).to.exist;
        });

        it("doesn't make _storeLoadedFont public", function(){
            expect(gEngine.Fonts._storeLoadedFont).to.not.exist;
        });

        describe("gEngine.Fonts.loadFont", function(){
            it("calls asyncLoadRequested ", function(){

            });

        });
    });
