// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/template');

/** @class */

SC.TextField = SC.TemplateView.extend(
  /** @scope SC.TextField.prototype */ {

  classNames: ['sc-text-field'],

  /**
    If set to `YES` uses textarea tag instead of input to
    accommodate multi-line strings.

    @type Boolean
    @default NO
  */
  isMultiline: NO,

  // we can't use bindAttr because of a race condition:
  //
  // when `value` is set, the bindAttr observer immediately calls
  // `get` in order to persist it to the DOM, but because we made
  // the `value` property idempotent, when it gets called by
  // bindAttr, it fetches the not-yet-updated value from the DOM
  // and returns it.
  //
  // In short, because we need to be able to catch changes to the
  // DOM made directly, we cannot also rely on bindAttr to update
  // the property: a chicken-and-egg problem.
  template: function(){
    return SC.Handlebars.compile(this.get('isMultiline') ? '<textarea></textarea>' : '<input type="text">');
  }.property('isMultiline').cacheable(),

  $input: function() {
    tagName = this.get('isMultiline') ? 'textarea' : 'input';
    return this.$(tagName);
  },

  didCreateLayer: function() {
    var self = this;

    var input = this.$input();
    input.val(this._value);

    if (SC.browser.msie) {
      SC.Event.add(input, 'focusin', this, this.focusIn);
      SC.Event.add(input, 'focusout', this, this.focusOut);
    } else {
      SC.Event.add(input, 'focus', this, this.focusIn);
      SC.Event.add(input, 'blur', this, this.focusOut);
    }

    input.bind('change', function() {
      self.domValueDidChange(SC.$(this));
    });
  },

  /**
    The problem this property is trying to solve is twofold:

    1. Make it possible to set the value of a text field that has
       not yet been inserted into the DOM
    2. Make sure that `value` properly reflects changes made directly
       to the element's `value` property.

    In order to achieve (2), we need to make the property volatile,
    so that SproutCore will call the getter no matter what if get()
    is called.

    In order to achieve (1), we need to store a local cache of the
    value, so that SproutCore can set the proper value as soon as
    the underlying DOM element is created.
  */
  value: function(key, value) {
    var input = this.$input();

    if (value !== undefined) {
      // We don't want to unnecessarily set the value.
      // Doing that could cause the selection to be lost.
      if (this._value !== value || input.val() !== value) {
        this._value = value;
        input.val(value);
      }
    } else if (input.length) {
      this._value = value = input.val();
    } else {
      value = this._value;
    }

    return value;
  }.property().idempotent(),

  domValueDidChange: function(jquery) {
    this.set('value', jquery.val());
  },

  focusIn: function(event) {
    this.becomeFirstResponder();
    this.tryToPerform('focus', event);
  },

  focusOut: function(event) {
    this.resignFirstResponder();
    this.tryToPerform('blur', event);
  },

  willLoseFirstResponder: function() {
    this.notifyPropertyChange('value');
  },

  keyUp: function(evt) {
    this.domValueDidChange(this.$input());

    if (evt.keyCode === SC.Event.KEY_RETURN) {
      return this.tryToPerform('insertNewline', evt);
    } else if (evt.keyCode === SC.Event.KEY_ESC) {
      return this.tryToPerform('cancel', evt);
    }

    return true;
  }

});

SC.TextFieldSupport = /** @scope SC.TextFieldSupport */{

  /** @private
    Used internally to store value because the layer may not exist
  */
  _value: null,

  /**
    @type String
    @default null
  */
  value: function(key, value) {
    var input = this.$('input');

    if (value !== undefined) {
      // We don't want to unnecessarily set the value.
      // Doing that could cause the selection to be lost.
      if (this._value !== value || input.val() !== value) {
        this._value = value;
        input.val(value);
      }
    } else {
      if (input.length > 0) {
        value = this._value = input.val();
      } else {
        value = this._value;
      }
    }

    return value;
  }.property().idempotent(),

  didCreateLayer: function() {
    var input = this.$('input');

    input.val(this._value);

    if (SC.browser.msie) {
      SC.Event.add(input, 'focusin', this, this.focusIn);
      SC.Event.add(input, 'focusout', this, this.focusOut);
    } else {
      SC.Event.add(input, 'focus', this, this.focusIn);
      SC.Event.add(input, 'blur', this, this.focusOut);
    }
  },

  focusIn: function(event) {
    this.becomeFirstResponder();
    this.tryToPerform('focus', event);
  },

  focusOut: function(event) {
    this.resignFirstResponder();
    this.tryToPerform('blur', event);
  },

  /** @private
    Make sure our input value is synced with any bindings.
    In some cases, such as auto-filling, a value can get
    changed without an event firing. We could do this
    on focusOut, but blur can potentially get called
    after other events.
  */
  willLoseFirstResponder: function() {
    this.notifyPropertyChange('value');
  },

  keyUp: function(event) {
    if (event.keyCode === SC.Event.KEY_RETURN) {
      return this.tryToPerform('insertNewline', event);
    } else if (event.keyCode === SC.Event.KEY_ESC) {
      return this.tryToPerform('cancel', event);
    }
  }
};

