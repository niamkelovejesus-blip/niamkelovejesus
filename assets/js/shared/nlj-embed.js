/* Lecteur universel de liens (YouTube, Facebook, Instagram, TikTok, Spotify, Deezer, SoundCloud, Vimeo, Dailymotion, vidéos directes).
   window.NLJ_EMBED.clean(texte)  -> adresse https propre (accepte « youtube.com/… » sans https, ou un texte contenant un lien) ou ''
   window.NLJ_EMBED.parse(url)    -> {net, kind, src, thumb, file?} si le lien se lit DANS le site, sinon null
   window.NLJ_EMBED.isLink(url)   -> true si c'est un lien de réseau social / vidéo (lisible ou non) : il ne doit pas aller dans le lecteur audio
   window.NLJ_EMBED.label(url)    -> nom du réseau (« Facebook », « YouTube »…) ou '' */
(function(){
  if(window.NLJ_EMBED&&window.NLJ_EMBED.v>=2)return;

  function clean(raw){
    var s=String(raw==null?'':raw).trim(),m;
    if(!s)return '';
    m=s.match(/https?:\/\/[^\s<>"'«»]+/i);
    if(m)s=m[0];
    else{
      m=s.match(/^((?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:[\/?#]\S*)?)$/i);
      if(!m)return '';
      s='https://'+m[1];
    }
    return s.replace(/[)\]\}.,;!]+$/,'');
  }

  function secs(t){
    if(!t)return 0;
    if(/^\d+$/.test(t))return parseInt(t,10);
    var m=String(t).match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
    return m?(parseInt(m[1]||0,10)*3600+parseInt(m[2]||0,10)*60+parseInt(m[3]||0,10)):0;
  }
  function yt(id,u){
    var t=secs(u.searchParams.get('t')||u.searchParams.get('start'));
    return {net:'YouTube',kind:'v',src:'https://www.youtube-nocookie.com/embed/'+id+(t?'?start='+t:''),thumb:'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg'};
  }
  function ytList(list){return {net:'YouTube',kind:'v',src:'https://www.youtube-nocookie.com/embed/videoseries?list='+encodeURIComponent(list)};}

  var KNOWN=/(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be|facebook\.com|fb\.watch|fb\.com|fb\.me|instagram\.com|tiktok\.com|spotify\.com|spotify\.link|deezer\.com|deezer\.page\.link|soundcloud\.com|vimeo\.com|dailymotion\.com|dai\.ly|twitter\.com|x\.com)$/i;
  var NAMES=[[/youtu|youtube/,'YouTube'],[/facebook|fb\./,'Facebook'],[/instagram/,'Instagram'],[/tiktok/,'TikTok'],[/spotify/,'Spotify'],[/deezer/,'Deezer'],[/soundcloud/,'SoundCloud'],[/vimeo/,'Vimeo'],[/dailymotion|dai\.ly/,'Dailymotion'],[/twitter|^x\.com/,'X']];

  function host(u){return u.hostname.toLowerCase().replace(/^(www|m|mobile|music|open|web|touch|mbasic|business|gaming|play|l|lm)\./,'');}

  function parse(raw){
    var s=clean(raw),u,m;
    if(!s)return null;
    try{u=new URL(s);}catch(e){return null;}
    if(!/^https?:$/.test(u.protocol))return null;
    var h=host(u),p=u.pathname;

    /* liens « sortants » Facebook : l.facebook.com/l.php?u=… */
    if(/^l(m)?\.facebook\.com$/i.test(u.hostname)||(h==='facebook.com'&&p==='/l.php')){
      var inner=u.searchParams.get('u');if(inner)return parse(inner);
    }

    /* ---- YouTube ---- */
    if(h==='youtu.be'){m=p.match(/^\/([\w-]{6,})/);if(m)return yt(m[1],u);}
    if(h==='youtube.com'||h==='youtube-nocookie.com'){
      var list=u.searchParams.get('list'),v=u.searchParams.get('v');
      if(/^\/watch\/?$/.test(p)&&v)return yt(v,u);
      m=p.match(/^\/(shorts|embed|live|v|e)\/([\w-]+)/);
      if(m){if(m[2]==='videoseries'&&list)return ytList(list);return yt(m[2],u);}
      if(p==='/playlist'&&list)return ytList(list);
      if(v)return yt(v,u);
      if(list)return ytList(list);
      return null;
    }

    /* ---- Spotify ---- */
    if(h==='spotify.com'){
      m=p.match(/\/(track|album|playlist|episode|show|artist)\/(\w+)/);
      if(m)return {net:'Spotify',kind:(m[1]==='track'||m[1]==='episode')?'s':'sl',src:'https://open.spotify.com/embed/'+m[1]+'/'+m[2]};
      return null;
    }

    /* ---- Deezer ---- */
    if(h==='deezer.com'){
      m=p.match(/\/(track|album|playlist|episode|show)\/(\d+)/);
      if(m)return {net:'Deezer',kind:m[1]==='track'?'s':'sl',src:'https://widget.deezer.com/widget/auto/'+m[1]+'/'+m[2]};
      return null;
    }

    /* ---- Facebook (toutes les variantes : www, m., web., mbasic., fb.watch, fb.com) ---- */
    if(h==='facebook.com'||h==='fb.watch'||h==='fb.com'){
      var base=h==='fb.watch'?'https://fb.watch':'https://www.facebook.com',full=base+p+u.search,enc=encodeURIComponent(full);
      var vid=h==='fb.watch'||/\/(videos?|watch|reels?|share\/[vr])(\/|$)/.test(p)||/\/video\.php$/.test(p)||(u.searchParams.has('v')&&/\/(watch|video\.php)/.test(p));
      if(vid)return {net:'Facebook',kind:'v',src:'https://www.facebook.com/plugins/video.php?show_text=false&width=560&href='+enc};
      if(/\/(posts|permalink\.php|story\.php|photos?|share\/p|pfbid)|pfbid|fbid=|\/p\//.test(p+u.search))
        return {net:'Facebook',kind:'p',src:'https://www.facebook.com/plugins/post.php?width=500&show_text=true&href='+enc};
      return null;   /* page ou profil : ne se lit pas, on proposera « Ouvrir sur Facebook » */
    }

    /* ---- Instagram ---- */
    if(h==='instagram.com'){m=p.match(/\/(p|reels?|tv)\/([\w-]+)/);if(m)return {net:'Instagram',kind:'p',src:'https://www.instagram.com/'+(m[1]==='reels'?'reel':m[1])+'/'+m[2]+'/embed'};return null;}

    /* ---- TikTok ---- */
    if(h==='tiktok.com'){m=p.match(/\/video\/(\d+)/);if(m)return {net:'TikTok',kind:'p',src:'https://www.tiktok.com/embed/v2/'+m[1]};return null;}

    /* ---- SoundCloud / Vimeo / Dailymotion ---- */
    if(h==='soundcloud.com')return {net:'SoundCloud',kind:'sl',src:'https://w.soundcloud.com/player/?visual=false&url='+encodeURIComponent(u.href)};
    if(h==='vimeo.com'){m=p.match(/\/(\d+)/);if(m)return {net:'Vimeo',kind:'v',src:'https://player.vimeo.com/video/'+m[1]};return null;}
    if(h==='dailymotion.com'||h==='dai.ly'){m=p.match(/\/video\/(\w+)/)||p.match(/^\/(\w+)$/);if(m)return {net:'Dailymotion',kind:'v',src:'https://www.dailymotion.com/embed/video/'+m[1]};return null;}

    /* ---- Vidéo directe (.mp4, .webm…) : lue par le lecteur du navigateur ---- */
    if(/\.(mp4|webm|m4v|mov|ogv)$/i.test(p))return {net:'Vidéo',kind:'v',file:'video',src:u.href};

    return null;
  }

  function label(raw){
    var s=clean(raw),u,h,i;
    if(!s)return '';
    try{u=new URL(s);}catch(e){return '';}
    h=host(u);
    for(i=0;i<NAMES.length;i++)if(NAMES[i][0].test(h))return NAMES[i][1];
    return /\.(mp4|webm|m4v|mov|ogv)$/i.test(u.pathname)?'Vidéo':'';
  }

  function isLink(raw){
    if(parse(raw))return true;
    var s=clean(raw),u;
    if(!s)return false;
    try{u=new URL(s);}catch(e){return false;}
    return KNOWN.test(u.hostname.replace(/^[a-z0-9-]+\./,function(x){return /^(www|m|mobile|music|open|web|touch|mbasic|business|gaming|play|l|lm|vm|vt)\./.test(x)?'':x;}))||KNOWN.test(u.hostname);
  }

  window.NLJ_EMBED={v:2,clean:clean,parse:parse,label:label,isLink:isLink,isEmbed:function(u){return !!parse(u);}};
})();
