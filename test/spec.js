describe("Testing timeoutjs", function () {
    it("declaring", function () {
      expect(timeout).to.be.ok();
    });
    it("initilizing", function () {
        var timerID = timeout.newTimer(3, function(){});
        expect(timerID).to.be.ok();
        var length = timeout.getTime();
        expect(length).be.equal(3);
    });
});
