var should = chai.should();
describe('simple test', function () {
  it('should equal 0 when n === 0', function () {
    window.fibonacci(0).should.equal(0);
  });
});
describe('simple test', function () {
    it('should equal 1 when n === 1', function () {
      window.fibonacci(1).should.equal(1);
    });
  });