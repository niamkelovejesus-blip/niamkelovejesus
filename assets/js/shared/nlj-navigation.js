(function(){
  var MAP={'1':'p1','2':'p2','3':'p3'};
  function go(p,id){parent.postMessage({nlj:'go',page:p,id:id||''},'*');}
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');
    if(a){
      var m=(a.getAttribute('href')||'').match(/^([123])(?:ere|eme)_page\.html(?:#(.*))?$/);
      if(m){e.preventDefault();e.stopPropagation();go(MAP[m[1]],m[2]);return;}
    }
  },true);
  window.addEventListener('message',function(e){
    if(e.data&&e.data.nlj==='scroll'){var el=e.data.id&&document.getElementById(e.data.id);if(el)el.scrollIntoView();else window.scrollTo(0,0);}
  });
})();
