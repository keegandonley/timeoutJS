describe("Testing Startup", function () {
    it("Declaring", function () {
      expect(timeout).to.be.ok();
    });
    it("Checking timer type", function() {
        var result1 = timeout.isTimer();
        var result2 = timeout.isCount();
        expect(result1).be.equal(false);
        expect(result2).be.equal(false);
    });
});

describe("Testing General", function () {
    it("Initilizing timer", function () {
        var timerID = timeout.newTimer(3, function(){});
        expect(timerID).to.be.ok();
        var length = timeout.getTime();
        expect(length).be.equal(3);
    });
    it("Checking timer type", function() {
        var result1 = timeout.isTimer();
        var result2 = timeout.isCount();
        expect(result1).be.equal(true);
        expect(result2).be.equal(false);
    });
});

// ----- These tests are for the beta features -----
describe("Testing beta features", function() {
    it("Initilizing count", function () {
        var timerID = timeout.count.new(3, function(){});
        var length = timeout.count.length();
        expect(length).be.equal(3);
    });
    it("Checking timer type", function() {
        var result1 = timeout.isCount();
        expect(result1).be.equal(true);
    });
});
