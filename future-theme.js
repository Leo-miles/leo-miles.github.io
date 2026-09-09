/* LEOMILES lightweight theme compatibility layer.
   No transition overlay, scan line, ripple, observer, continuous animation,
   or page-switch effect. Existing application behavior is unchanged. */
(()=>{
  const css=`
    .fx-overlay,.fx-ripple{display:none!important}
    .page:before{display:none!important;content:none!important}
    body:after{display:none!important;content:none!important}
  `;
  const style=document.createElement('style');
  style.id='leomiles-no-switch-lines';
  style.textContent=css;
  document.head.appendChild(style);
})();
