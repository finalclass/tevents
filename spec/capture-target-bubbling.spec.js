var te = require('../tevents');

describe('Dispatcher basic', function () {

  var root;
  var grandParent;
  var parent;
  var child;

  beforeEach(function () {
    root = new te.Dispatcher();
    root.name = 'root';

    grandParent = new te.Dispatcher();
    grandParent.name = 'grandParent';
    grandParent.parent = root;

    parent = new te.Dispatcher();
    parent.name = 'parent';
    parent.parent = grandParent;

    child = new te.Dispatcher();
    child.name = 'child';
    child.parent = parent;
  });

  it('can attach handler only to capture phase', function () {
    root.on('test', function (event) {
      expect(event.phase).toBe(te.CAPTURE_PHASE);
    }, true);

    child.dispatchEvent('test');
  });

  it('target phase', function () {
    root.on('test', function (event) {
      expect(event.phase).not.toBe(te.TARGET_PHASE);
    });
    child.on('test', function (event) {
      expect(event.phase).toBe(te.TARGET_PHASE);
    });
    child.dispatchEvent('test');
  });

  it('can attache events only to bubbling phase', function () {
    root.on('test', function (event) {
      expect(event.phase).toBe(te.BUBBLING_PHASE);
    });
    var event = new te.Event('test');
    event.bubble = true;
    child.dispatchEvent(event);
  });

  it('order of phsses: capture, target, bubble', function () {
    var captureSpy = jasmine.createSpy();
    var targetSpy = jasmine.createSpy();
    var bubblingSpy = jasmine.createSpy();

    root.on('test', function (event) {
      expect(captureSpy).not.toHaveBeenCalled();
      expect(targetSpy).not.toHaveBeenCalled();
      expect(bubblingSpy).not.toHaveBeenCalled();
      captureSpy();
    }, true);

    child.on('test', function (event) {
      expect(captureSpy).toHaveBeenCalled();
      expect(targetSpy).not.toHaveBeenCalled();
      expect(bubblingSpy).not.toHaveBeenCalled();
      targetSpy();
    });

    root.on('test', function (event) {
      expect(captureSpy).toHaveBeenCalled();
      expect(targetSpy).toHaveBeenCalled();
      expect(bubblingSpy).not.toHaveBeenCalled();
      bubblingSpy();
    }, false);

    var event = new te.Event('test');
    event.bubble = true;

    child.dispatchEvent(event);

    expect(captureSpy.callCount).toBe(1);
    expect(targetSpy.callCount).toBe(1);
    expect(bubblingSpy.callCount).toBe(1);
  });

});