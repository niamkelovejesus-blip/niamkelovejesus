/* Les pages ne vivent que dans la coque (index.html) : ouverte seule, on renvoie vers elle. */
(function(){try{if(window.top!==window.self)return;var n=document.documentElement.getAttribute("data-nlj-page")||"";location.replace(new URL("../",location.href).href+(n?"#"+n:""));}catch(e){}})();
