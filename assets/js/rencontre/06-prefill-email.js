(function(){function pre(){try{var g=localStorage.getItem('nlj_gmail'),e=document.getElementById('suEmail');if(g&&e&&!e.value)e.value=g;}catch(x){}}
pre();window.addEventListener('message',function(ev){if(ev.data&&ev.data.nlj==='scroll'&&ev.data.id==='inscription'){pre();setTimeout(function(){var n=document.getElementById('suName');if(n)n.focus({preventScroll:true});},500);}});})();
