/* Réutilise la bibliothèque Supabase déjà chargée par la page principale (évite de la recharger et de la relire) */
(function(){
  try{if(window.parent&&window.parent!==window&&window.parent.supabase&&window.parent.supabase.createClient){window.supabase=window.parent.supabase;return;}}catch(e){}
  document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.93.0"><\/script>');
})();
