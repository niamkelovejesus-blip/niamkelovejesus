document.addEventListener('click',function(e){
 var im=e.target.closest('.profile.pc .pc-ph img');
 if(im){var o=document.createElement('div');o.className='lbx';o.innerHTML='<img src="'+String(im.src).split(String.fromCharCode(34)).join('&quot;')+'" alt="">';o.onclick=function(){o.remove();};document.body.appendChild(o);return;}
 if(e.target.closest('#chatPanel [data-nlj="premium"]')&&window.closeChatPanel)window.closeChatPanel();
},true);
