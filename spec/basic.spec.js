var te = require('../tevents');

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

  it('can dispatch events', function () {
    var spy = jasmine.createSpy('event-handler');

    disp1.on('test', spy);
    disp1.dispatchEvent('test');

    expect(spy).toHaveBeenCalled();
  });

  it('can dispatch event given by the string', function () {
    var spy = jasmine.createSpy('event-handler');

    disp1.on('test', spy);
    disp1.dispatchEvent('test');

    expect(spy).toHaveBeenCalled();
  });

  it('can remove listeners', function () {
    var spy = jasmine.createSpy('event-handler');
    disp1.on('test', spy);
    disp1.removeEventListener('test', spy);
    disp1.dispatchEvent('test');
    expect(spy).not.toHaveBeenCalled();
  });

});
