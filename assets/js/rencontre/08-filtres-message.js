window.addEventListener('message',function(e){
  var d=e.data;if(!d||d.nlj!=='filters'||e.source!==parent)return;
  function set(id,v){var el=document.getElementById(id);if(el&&v!==undefined&&v!==null)el.value=v;}
  set('filterChurch',d.church);set('filterGender',d.gender);set('filterSearch',d.search);set('ageMin',d.ageMin);set('ageMax',d.ageMax);
  var a=document.getElementById('ageMinVal'),z=document.getElementById('ageMaxVal');
  if(a&&d.ageMin!=null)a.textContent=d.ageMin+' ans';if(z&&d.ageMax!=null)z.textContent=d.ageMax+' ans';
  if(typeof renderProfiles==='function')renderProfiles();
});
