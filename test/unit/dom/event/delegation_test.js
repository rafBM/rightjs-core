/**
 * The basic events delegation module tests
 *
 * Copyright (C) 2010 Nikolay V. Nemshilov
 */
var EventDelegationTest = TestCase.create({
  name: 'EventDelegationTest',
  
  setUp: function() {
    var node1 = this.node1 = {
      method: function() {
        this.args = $A(arguments);
      }
    };
    
    var node2 = this.node2 = {
      method: function() {
        this.args = $A(arguments);
      }
    };
    
    this.base = {
      select: function(rule) {
        return rule == 'node1' ? [node1] : [node2];
      }
    };
  },
  
  testDelegationByFunction: function() {
    var delegation = Event.delegate({
      node1: function() { this.value = 1; },
      node2: function() { this.value = 2; }
    });
    
    this.assertInstanceOf(Function, delegation);
    
    delegation.call(this.base, { target: this.node1 });
    
    this.assertEqual(1, this.node1.value);
    this.assertFalse('value' in this.node2);
    
    delete(this.node1.value);
    
    delegation.call(this.base, { target: this.node2 });
    
    this.assertFalse('value' in this.node1);
    this.assertEqual(2, this.node2.value);
  },
  
  testDelegationByName: function() {
    var delegation = Event.delegate({
      node1: 'method',
      node2: 'method'
    });
    
    delegation.call(this.base, { target: this.node1 });
    
    this.assertEqual([], this.node1.args);
    this.assertFalse('args' in this.node2);
    
    delete(this.node1.args);
    
    delegation.call(this.base, { target: this.node2 });
    
    this.assertFalse('args' in this.node1);
    this.assertEqual([], this.node2.args);
  },
  
  testDelegationByNameWithArgs: function() {
    var delegation = Event.delegate({
      node1: ['method', 'arg1', 'arg2', 'arg3'],
      node2: ['method', 'arg4', 'arg5', 'arg6']
    });
    
    delegation.call(this.base, { target: this.node1 });
    
    this.assertEqual(['arg1', 'arg2', 'arg3'], this.node1.args);
    this.assertFalse('args' in this.node2);
    
    delete(this.node1.args);
    
    delegation.call(this.base, { target: this.node2 });
    
    this.assertFalse('args' in this.node1);
    this.assertEqual(['arg4', 'arg5', 'arg6'], this.node2.args);
  },
  
  testDocumentAttachment: function() {
    var f = function() {}, c = function() {}, args;
    
    this.mock(Event, 'delegate', function() { args = $A(arguments); return f; });
    
    var connections = Event.behave(".some.css.rule", 'click', c);
    
    this.assert($(document).observes('click', f));
    this.assertEqual([{'.some.css.rule': [c]}], args);
    
    this.assertEqual({click: f}, connections);
    
    Event.behave(".some.css.rule", 'mouseover', 'hide');
    
    this.assert($(document).observes('mouseover', f));
    this.assertEqual([{'.some.css.rule': ['hide']}], args);
    
    Event.behave(".some.css.rule", 'mouseout', 'addClass', 'some-class');
    
    this.assert($(document).observes('mouseover', f));
    this.assertEqual([{'.some.css.rule': ['addClass', 'some-class']}], args);
    
    $(document)
      .stopObserving('click', f)
      .stopObserving('mouseout', f)
      .stopObserving('mouseover', f)
    
    this.undoMock(Event, 'delegate');
  },
  
  testDocumentAttachmentWithHash: function() {
    var f = function() {}, c = function() {}, args = [];
    
    this.mock(Event, 'delegate', function() { args.push($A(arguments)); return f; });
    
    Event.behave(".some.css.rule", {
      click: c,
      mouseout: 'hide',
      mouseover: ['addClass', 'some-class']
    });
    
    this.assert($(document).observes('click', f));
    this.assertEqual([{'.some.css.rule': c}], args[0]);
    
    this.assert($(document).observes('mouseout', f));
    this.assertEqual([{'.some.css.rule': 'hide'}], args[1]);
    
    this.assert($(document).observes('mouseover', f));
    this.assertEqual([{'.some.css.rule': ['addClass', 'some-class']}], args[2]);
    
    $(document)
      .stopObserving('click', f)
      .stopObserving('mouseout', f)
      .stopObserving('mouseover', f)
    
    this.undoMock(Event, 'delegate');
  },
  
  testStoppingDelegation: function() {
    var f = function() {}, c = function() {};
    
    this.mock(Event, 'delegate', function() { return f; });
    
    var events = Event.behave(".some.css.rule", {
      click: c,
      mouseout: 'hide',
      mouseover: ['addClass', 'some-class']
    });
    
    this.assert($(document).observes('click',     f));
    this.assert($(document).observes('mouseout',  f));
    this.assert($(document).observes('mouseover', f));
    
    $(document).stopObserving(events);
    
    this.assertFalse($(document).observes('click', f));
    this.assertFalse($(document).observes('mouseout', f));
    this.assertFalse($(document).observes('mouseover', f));
    
    this.undoMock(Event, 'delegate');
  },
  
  testStringOnShortcut: function() {
    var args;
    this.mock(Event, 'behave', function() { args = $A(arguments); });
    
    ".some.css-rule".on('addClass', 'foo');
    
    this.assertEqual(['.some.css-rule', 'addClass', 'foo'], args);
    
    this.undoMock(Event, 'behave');
  },
  
  testStringOnNamedShortcuts: function() {
    var args = null, rule = ".some.css-stuff", dummy = function() {};
    
    // mocking the 'on' method
    var old_method = String.prototype.on;
    String.prototype.on = function() { args = $A(arguments); };
    
    $w('click rightclick contextmenu mousedown mouseup mouseover mouseout mousemove keypress keydown keyup' +
      ' disable enable focus blur change submit reset focus'
    ).each(function(name) {
      this.assert(rule['on'+ name.capitalize()], "checking shortcut presence '"+ 'on'+ name.capitalize() + "'");
      rule['on'+ name.capitalize()](dummy);
      this.assertEqual([name, dummy], args, "checking shortcut for '"+ name + "'");
    }, this);
    
    String.prototype.on = old_method;
  }
  
});