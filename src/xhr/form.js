/**
 * Here are the Form unit Xhr extensions
 *
 * Copyright (C) 2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
$ext(Form.Methods, {
  /**
   * sends the form via xhr request
   *
   * @params Options xhr request options
   * @return Form this
   */
  send: function(options) {
    this.disable();
    
    options['method'] = options['method'] || this.get('method') || 'post';
    
    new Xhr(this.get('action') || document.location.href, options
      ).onRequest(this.disable.bind(this)
      ).onComplete(this.enable.bind(this)).send(this);
    
    return this;
  },
  
  /**
   * makes the form be remote by default
   *
   * @params Object default options
   * @return Form this
   */
  remotize: function(options) {
    this.onsubmit = function() { this.send(options); return false; };
    this.remote   = true;
    return this;
  },
  
  /**
   * removes the remote call hook
   *
   * NOTE: will nuke onsubmit attribute
   *
   * @return Form this
   */
  unremotize: function() {
    this.onsubmit = function() {};
    this.remote   = false;
    return this;
  }
});

try { // extending the form element prototype
  $ext(HTMLFormElement.prototype, Form.Methods);
} catch(e) {}