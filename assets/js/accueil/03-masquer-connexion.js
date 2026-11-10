(function(){
  function hideLogin(){
    var btns = document.querySelectorAll('button, a');
    btns.forEach(function(b){
      var t = (b.textContent||'').trim().toLowerCase();
      if(t==='se connecter' || t==='duggu' || t==='log in' || t.indexOf('se connecter')!==-1){
        var header = b.closest('header');
        if(header){
          b.style.display='none';
          try{ b.remove(); }catch(e){}
        }
      }
    });
  }
  document.addEventListener('DOMContentLoaded', hideLogin);
  setTimeout(hideLogin, 500);
  setTimeout(hideLogin, 1500);
  var obs = new MutationObserver(hideLogin);
  obs.observe(document.documentElement, {childList:true, subtree:true});
})();
