/* CONNEXION PERSISTANTE : la session est mémorisée dans le navigateur (localStorage).
   La personne qui s'est connectée sans se déconnecter n'a PAS à se reconnecter quand elle revient :
   elle reste connectée jusqu'à ce qu'elle clique sur « Déconnexion ». */
var NLJ_MEM={};
var NLJ_STORE=(function(){
  try{var t='__nlj_t';window.localStorage.setItem(t,'1');window.localStorage.removeItem(t);return window.localStorage;}
  catch(e){return {getItem:function(k){return Object.prototype.hasOwnProperty.call(NLJ_MEM,k)?NLJ_MEM[k]:null;},setItem:function(k,v){NLJ_MEM[k]=String(v);},removeItem:function(k){delete NLJ_MEM[k];}};}
})();
try{window.supabaseClient=supabase.createClient("https://qxxhbfoqlreiqyshbpqp.supabase.co","sb_publishable_OK9ncVWB2Ih8xZ5fzqEQWg_mSV6vCoe",{auth:{persistSession:true,storage:NLJ_STORE,autoRefreshToken:true,detectSessionInUrl:true}});}catch(e){}
