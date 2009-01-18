/**
 * DOM units handling related util methods
 *
 * Copyright (C) 2008 Nikolay V. Nemshilov aka St. <nemshilov#gma-ilc-om>
 */
 
function $(element) {
  return Element.prepare(isString(element) ? document.getElementById(element) : element);
}