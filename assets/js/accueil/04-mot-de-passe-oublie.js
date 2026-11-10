(function(){
  function addForgotLink(){
    // Find password inputs in the inscription modal
    var modals = document.querySelectorAll('input[type="password"]');
    modals.forEach(function(pw){
      if(pw.dataset.forgotAdded) return;
      // Only for the Gmail inscription modal (placeholder contains 6 caractères)
      var ph = (pw.placeholder||'').toLowerCase();
      if(!ph.includes('6') && !ph.includes('caract')) return;
      // Avoid adding inside our own p1 login modal
      if(pw.closest('#nlj-login-modal-p1')) return;
      
      pw.dataset.forgotAdded='1';
      var wrapper = document.createElement('div');
      wrapper.className='nlj-forgot-under-pw';
      wrapper.innerHTML='<a href="#" class="nlj-forgot-link">🔑 Mot de passe oublié ?</a><div id="nlj-forgot-error"></div>';
      
      // Insert right after password input
      pw.parentNode.insertBefore(wrapper, pw.nextSibling);
      
      var link = wrapper.querySelector('a');
      link.addEventListener('click', async function(e){
        e.preventDefault();
        // Find email input in same modal
        var form = pw.closest('form') || pw.closest('div');
        var emailInput = document.querySelector('input[type="email"], input[placeholder*="gmail.com"], input[placeholder*="@gmail"]');
        // try to find email in same container
        if(form){
          var ei = form.querySelector('input[type="email"]') || form.querySelector('input[placeholder*="gmail"]');
          if(ei) emailInput = ei;
        }
        var email = emailInput ? (emailInput.value||'').trim().toLowerCase() : '';
        var errDiv = document.getElementById('nlj-forgot-error') || wrapper.querySelector('#nlj-forgot-error');
        
        if(!email){
          if(errDiv){ errDiv.style.display='block'; errDiv.textContent="Veuillez saisir votre e-mail d'abord"; errDiv.style.color='#dc2626'; }
          if(emailInput){ emailInput.style.borderColor='#ef4444'; emailInput.focus(); }
          return;
        }
        link.textContent='Envoi...';
        try{
          var client = window.supabaseClient || (parent && parent.supabaseClient) || null;
          if(!client && typeof supabase!=='undefined'){
            client = (function(){try{return window.parent.supabaseClient}catch(e){}})() || supabase.createClient("https://qxxhbfoqlreiqyshbpqp.supabase.co","sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe");
          }
          if(client){
            var red=null; try{ red=parent.location.origin+parent.location.pathname; }catch(x){}
            var r=await client.auth.resetPasswordForEmail(email, red?{redirectTo:red}:undefined);
            if(r.error){
              if(errDiv){ errDiv.style.display='block'; errDiv.textContent='❌ '+r.error.message; }
              link.textContent='🔑 Mot de passe oublié ?';
            } else {
              if(errDiv){ errDiv.style.display='block'; errDiv.style.background='#f0fdf4'; errDiv.style.borderColor='#bbf7d0'; errDiv.style.color='#16a34a'; errDiv.textContent='📧 E-mail envoyé ! Vérifiez votre boîte'; }
              link.textContent='📧 Email envoyé';
              setTimeout(function(){ link.textContent='🔑 Mot de passe oublié ?'; }, 4000);
            }
          }
        }catch(ex){
          if(errDiv){ errDiv.style.display='block'; errDiv.textContent='❌ Erreur'; }
          link.textContent='🔑 Mot de passe oublié ?';
        }
      });
    });
  }

  // Also intercept login errors to show "Mot de passe incorrect"
  function patchErrorDisplay(){
    // Look for toast or error messages that say Identifiants incorrects
    var observer = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if(node.nodeType===1){
            var txt = (node.textContent||'').toLowerCase();
            if(txt.includes('identifiants incorrects') || txt.includes('invalid') || txt.includes('incorrect')){
              // Find password field and highlight
              var pw = document.querySelector('input[type="password"]');
              if(pw){
                pw.style.borderColor='#ef4444';
                // Add error under it if not exists
                if(!document.getElementById('nlj-forgot-error') || document.getElementById('nlj-forgot-error').style.display==='none'){
                  var err = document.getElementById('nlj-forgot-error');
                  if(err){
                    err.style.display='block';
                    err.innerHTML='❌ Mot de passe incorrect<br><span style="font-weight:400;">Cliquez sur <b>Mot de passe oublié ?</b></span>';
                  }
                }
              }
            }
          }
        });
      });
      observer.observe(document.body, {childList:true, subtree:true});
    });
    try{ patchErrorDisplay(); }catch(e){}
  }

  // Run on load and on every DOM change (React modal appears dynamically)
  function init(){
    addForgotLink();
    var obs = new MutationObserver(function(){ addForgotLink(); });
    obs.observe(document.body, {childList:true, subtree:true});
    setInterval(addForgotLink, 800);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  setTimeout(init, 500);
  setTimeout(init, 1500);
})();
