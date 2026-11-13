(function(){
  var gone=false;
  function lang(){try{return(localStorage.getItem('niamke_lang')||'fr').toLowerCase().slice(0,2);}catch(e){return 'fr';}}
  function off(){if(gone)return;gone=true;var e=document.getElementById('splash');if(e)e.classList.add('off');}
  function fromFrame(src){return['p1','p2','p3'].some(function(k){var f=document.getElementById(k);return f&&f.contentWindow===src;});}
  window.addEventListener('message',function(e){
    var d=e.data;if(!d||!fromFrame(e.source))return;
    if(d.nlj==='i18n-ready')off();                       /* page traduite */
    else if(d.nlj==='app-ready'&&lang()==='fr')off();    /* français : rien à traduire */
  });
  setTimeout(off,2500);   /* sécurité : jamais plus de 2,5 s */
})();
