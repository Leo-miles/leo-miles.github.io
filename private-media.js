(()=>{
  const BUCKET='product-media';
  const TTL=4*60*60;
  const client=window.supabase.createClient(window.LEOMILES_SUPABASE_URL,window.LEOMILES_SUPABASE_PUBLISHABLE_KEY);
  const cache=new Map();

  function publicPath(value){
    try{
      const u=new URL(value,location.href);
      const marker=`/storage/v1/object/public/${BUCKET}/`;
      const idx=u.pathname.indexOf(marker);
      if(idx<0)return null;
      return decodeURIComponent(u.pathname.slice(idx+marker.length));
    }catch(e){return null}
  }

  async function signed(path){
    if(!path)return null;
    const hit=cache.get(path);
    if(hit&&hit.expires>Date.now())return hit.url;
    const {data,error}=await client.storage.from(BUCKET).createSignedUrl(path,TTL);
    if(error||!data?.signedUrl){console.warn('[LEOMILES] signed media failed',path,error);return null}
    cache.set(path,{url:data.signedUrl,expires:Date.now()+(TTL-60)*1000});
    return data.signedUrl;
  }

  async function replaceMedia(content){
    if(typeof content!=='string'||!content.includes(`/storage/v1/object/public/${BUCKET}/`))return content;
    const re=new RegExp(`https?:\\/\\/[^\\"']+\\/storage\\/v1\\/object\\/public\\/${BUCKET}\\/[^\\"']+`,'g');
    const urls=[...new Set(content.match(re)||[])];
    if(!urls.length)return content;
    const pairs=await Promise.all(urls.map(async u=>[u,await signed(publicPath(u))]));
    let out=content;
    for(const [from,to] of pairs){
      if(to)out=out.split(from).join(to);
      else out=out.split(from).join('');
    }
    return out;
  }

  function patchShell(){
    if(typeof window.shell!=='function'||window.shell.__lmPrivateMedia)return false;
    const original=window.shell;
    const wrapped=function(content){
      if(typeof content!=='string'||!content.includes(`/storage/v1/object/public/${BUCKET}/`))return original(content);
      replaceMedia(content).then(safe=>original(safe)).catch(()=>original(content));
    };
    wrapped.__lmPrivateMedia=true;
    window.shell=wrapped;
    return true;
  }

  async function patchExisting(){
    const nodes=[...document.querySelectorAll('img[src],video[src],source[src]')];
    const jobs=[];
    for(const el of nodes){
      const path=publicPath(el.getAttribute('src')||'');
      if(!path)continue;
      jobs.push((async()=>{
        const url=await signed(path);
        if(url)el.setAttribute('src',url);
      })());
    }
    await Promise.all(jobs);
  }

  function boot(){
    let tries=0;
    const timer=setInterval(async()=>{
      const ok=patchShell();
      if(ok){clearInterval(timer);await patchExisting()}
      else if(++tries>100)clearInterval(timer);
    },100);
  }

  window.LEOMILES_PRIVATE_MEDIA={signed,refresh:patchExisting};
  boot();
})();
