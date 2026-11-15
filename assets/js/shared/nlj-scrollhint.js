/* Menus qui défilent de côté (téléphone) : fondu sur le bord quand il reste du contenu caché,
   et centrage automatique de l'élément actif. Fonctionne en gauche→droite et droite→gauche (arabe, ourdou). */
(function(){
var SEL='.nav-links,.chips,.mobile-nav';
function upd(el){
  try{
    var max=el.scrollWidth-el.clientWidth;
    if(max<=4){el.classList.remove('sh-on');return;}
    var rtl=getComputedStyle(el).direction==='rtl',pos=Math.abs(el.scrollLeft);
    var a=pos>3?28:0,b=pos<max-3?28:0;
    el.classList.add('sh-on');
    el.style.setProperty('--sh-dir',rtl?'to left':'to right');
    el.style.setProperty('--sh-a',a+'px');el.style.setProperty('--sh-b',b+'px');
  }catch(e){}
}
function center(el){
  try{
    var a=el.querySelector('.active,[data-sh-cur]');if(!a||el.scrollWidth-el.clientWidth<=4)return;
    var r=a.getBoundingClientRect(),c=el.getBoundingClientRect();
    el.scrollLeft+=(r.left+r.width/2)-(c.left+c.width/2);
  }catch(e){}
}
function init(el){
  if(el.__sh)return;el.__sh=1;
  el.addEventListener('scroll',function(){upd(el);},{passive:true});
  if(window.MutationObserver){
    var t=null;
    new MutationObserver(function(m){
      var cls=m.some(function(x){return x.type==='attributes';});
      clearTimeout(t);t=setTimeout(function(){upd(el);if(cls)center(el);},60);
    }).observe(el,{attributes:true,attributeFilter:['class'],subtree:true,childList:true});
  }
  if(window.ResizeObserver)new ResizeObserver(function(){upd(el);}).observe(el);
  upd(el);center(el);
}
function scan(){document.querySelectorAll(SEL).forEach(init);}
function go(){scan();setTimeout(scan,600);setTimeout(function(){scan();document.querySelectorAll(SEL).forEach(function(e){upd(e);center(e);});},1800);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
window.addEventListener('resize',function(){document.querySelectorAll(SEL).forEach(upd);});
window.addEventListener('load',function(){document.querySelectorAll(SEL).forEach(function(e){upd(e);center(e);});});
})();
