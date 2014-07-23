var te = require('../typedEvents');

describe('Dispatcher basic', function () {
  var disp1;
  var disp2;

  beforeEach(function () {
    disp1 = new te.Dispatcher();
    disp2 = new te.Dispatcher();
  });

  it('adds event listeners', function () {
    var callback = function () { };
    expect(function () {
      disp1.on('test', callback);
    }).not.toThrow();
  });

  xit('can dispatch events', function () {
    var spy = jasmine.createSpy('event-handler');

    disp1.on('test', spy);
    disp1.dispatchEvent('test');

    expect(spy).toHaveBeenCalled();
  });

});
