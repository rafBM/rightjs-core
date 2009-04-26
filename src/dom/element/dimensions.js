/**
 * this module contains the Element's part of functionality 
 * responsible for the dimensions and positions getting/setting
 *
 * Copyright (C) 2008-2009 Nikolay V. Nemshilov aka St. <nemshilov#gma-il>
 */
$ext(Element.Methods, {
  
  width: function() {
    return this.offsetWidth;
  },
  
  height: function() {
    return this.offsetHeight;
  },
  
  top: function() {
    return this.dimensions().top;
  },
  
  left: function() {
    return this.dimensions().left;
  },
  
  size: function() {
    return { x: this.width(), y: this.height() };
  },
  
  position: function() {
    return { x: this.left(), y: this.top() };
  },
  
  scrolls: function() {
    return { x: this.scrollLeft, y: this.scrollTop };
  },
  
  /**
   * returns the element dimensions hash
   *
   * @return Object dimensions (top, left, width, height, scrollLeft, scrollTop)
   */
  dimensions: function() {
    var left = 0, top = 0;
    
    if (this.getBoundingClientRect) {
      var rect = this.getBoundingClientRect(), doc = this.ownerDocument.documentElement;
      left = rect.left + doc.scrollLeft - doc.clientLeft;
      top  = rect.top  + doc.scrollTop  - doc.clientTop;
    } else {
      // Manual version
      var element = this;
      while (element && element.tagName) {
        left += element.offsetLeft;
        top  += element.offsetTop;
        element = element.parentNode;
      }
    }
    
    return {
      top:        top,
      left:       left,
      width:      this.size().x,
      height:     this.size().y,
      scrollLeft: this.scrolls().x,
      scrollTop:  this.scrolls().y
    };
  },
  
  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels
   * @return Element self
   */
  setWidth: function(width_px) {
    this.style.width = width_px + 'px';
    if (this.offsetWidth) this.style.width = (2 * width_px - this.offsetWidth) + 'px';
    return this;
  },
  
  /**
   * sets the width of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer height in pixels
   * @return Element self
   */
  setHeight: function(height_px) {
    this.style.height = height_px + 'px';
    if (this.offsetHeight) this.style.height = (2 * height_px - this.offsetHeight) + 'px';
    return this;
  },
  
  /**
   * sets the size of the element in pixels
   *
   * NOTE: will double assign the size of the element, so it match the exact
   *       size including any possible borders and paddings
   *
   * @param Integer width in pixels or {x: 10, y: 20} like object
   * @param Integer height
   * @return Element self
   */
  setSize: function(width, height) {
    if (isHash(width)) {
      height = width.y;
      width  = width.x;
    }
    
    this.setWidth(width);
    return this.setHeight(height);
  },
  
  /**
   * sets the element position (against the window corner)
   *
   * @param Integer left position in pixels or an object like {x: 10, y: 20}
   * @return Element self
   */
  setPosition: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    // FIXME make it for real
    this.setStyle({
      marginLeft: (left - this.left()) + 'px',
      marginTop: (top - this.top()) + 'px'
    });
    return this;
  },
  
  /**
   * sets the scroll position
   *
   * @param Integer left scroll px or an object like {x: 22, y: 33}
   * @param Integer top scroll px
   * @return Element self
   */
  setScrolls: function(left, top) {
    if (isHash(left)) {
      top  = left.y;
      left = left.x;
    }
    
    this.scrollLeft = left;
    this.scrollTop  = top;
    
    return this;
  }
});