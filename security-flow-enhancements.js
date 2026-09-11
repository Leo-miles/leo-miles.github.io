(()=>{
  const client=window.supabase.createClient(window.LEOMILES_SUPABASE_URL,window.LEOMILES_SUPABASE_PUBLISHABLE_KEY);
  const roleLabel=r=>r==='admin'?'超级管理员':r==='selector'?'选品人员':'销售人员';
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  let role='sales',user=null;
  async function sync(){const {data}=await client.auth.getUser();user=data.user||null;if(!user){role='sales';return}const {data:p}=await client.from('profiles').select('role').eq('id',user.id).single();role=p?.role||'sales'}
  const css=`
.lm-safe-banner{padding:12px 15px;border:1px solid #d7e9fb;background:#f7fbff;border-radius:14px;color:#5f7388;font-size:12px;margin-bottom:18px}
.lm-draft-btn{border:1px solid #d4e5f4!important;background:#fff!important;color:#244965!important}
.lm-draft-state{font-size:12px;color:#72869a}
.lm-sales-tools{display:flex;gap:10px;align-items:center;margin-bottom:18px}
.lm-sales-tools .search{flex:1;max-width:520px}
.lm-sales-note{font-size:12px;color:#7d8c9a;margin-left:auto}
.lm-safe-card{border-top:1px solid #edf2f7;margin-top:12px;padding-top:12px;font-size:12px;color:#6c7d8d}
`;
  const st=document.createElement('style');st.id='leomiles-security-flow';st.textContent=css;document.head.appendChild(st);

  function payloadFromForm(){
    const v=id=>document.getElementById(id)?.value??'';
    const highlights=[...document.querySelectorAll('.highlight')].map(x=>x.value.trim()).filter(Boolean);
    const specs={};(v('specs')||'').split(/\n/).map(x=>x.trim()).filter(Boolean).forEach(line=>{const m=line.split(/[:：]/);if(m.length>=2){const k=m.shift().trim();if(k)specs[k]=m.join(':').trim()}});
    return {name:v('pname').trim(),sku:v('sku').trim()||null,category:v('category')||null,description:v('desc').trim()||null,highlights,specs,purchase_price:v('purchase')===''?null:Number(v('purchase')),suggested_price:v('suggested')===''?null:Number(v('suggested')),moq:v('moq')===''?null:Number(v('moq')),supplier:v('supplier').trim()||null,internal_notes:v('notes').trim()||null};
  }
  async function uploadDraftMedia(pid){
    const images=window.pendingImages||[],videos=window.pendingVideos||[];
    let sort=0;
    for(const f of images){const safe=f.name.replace(/[^\w.\-\u4e00-\u9fff]+/g,'_');const path=user.id+'/'+pid+'/draft-'+crypto.randomUUID()+'-'+safe;const up=await client.storage.from('product-media').upload(path,f,{contentType:f.type,upsert:false});if(up.error)throw up.error;const ins=await client.from('product_media').insert({product_id:pid,storage_path:path,media_type:'image',sort_order:sort++});if(ins.error)throw ins.error}
    for(const f of videos){const safe=f.name.replace(/[^\w.\-\u4e00-\u9fff]+/g,'_');const path=user.id+'/'+pid+'/draft-'+crypto.randomUUID()+'-'+safe;const up=await client.storage.from('product-media').upload(path,f,{contentType:f.type,upsert:false});if(up.error)throw up.error;const ins=await client.from('product_media').insert({product_id:pid,storage_path:path,media_type:'video',sort_order:sort++});if(ins.error)throw ins.error}
  }
  async function saveDraft(){
    if(!user||!['admin','selector'].includes(role))return toast('当前账号没有操作权限');
    const btn=document.querySelector('.lm-draft-btn');if(btn)btn.disabled=true;
    try{
      const payload=payloadFromForm();
      if(!payload.name)return toast('请先填写产品名称');
      let p;
      if(window.editingProduct){
        const {data,error}=await client.from('products').update({...payload,status:'draft',updated_by:user.id}).eq('id',window.editingProduct.id).select().single();
        if(error)throw error;p=data;
      }else{
        const {data,error}=await client.rpc('create_product_draft',{
          p_name:payload.name,p_sku:payload.sku,p_category:payload.category,p_description:payload.description,p_highlights:payload.highlights,p_specs:payload.specs,p_purchase_price:payload.purchase_price,p_suggested_price:payload.suggested_price,p_moq:payload.moq,p_supplier:payload.supplier,p_internal_notes:payload.internal_notes
        });
        if(error)throw error;p=data;
      }
      await uploadDraftMedia(p.id);
      try{localStorage.removeItem(window.DRAFT_KEY?.()||'')}catch(e){}
      window.productsCacheAt=0;window.productsCacheRole=null;
      toast('草稿已保存');
      if(window.view!==undefined)window.view='products';
      if(typeof window.go==='function')window.go('products');
    }catch(e){console.error(e);toast(e.message||'保存草稿失败')}finally{if(btn)btn.disabled=false}
  }

  function addDraftButton(){
    if(!['admin','selector'].includes(role))return;
    const actions=document.querySelector('.upload .actions');if(!actions||actions.querySelector('.lm-draft-btn'))return;
    const publish=actions.querySelector('button[type="submit"]');
    const b=document.createElement('button');b.type='button';b.className='btn lm-draft-btn';b.textContent='保存草稿';b.onclick=saveDraft;
    if(publish)actions.insertBefore(b,publish);else actions.appendChild(b);
  }

  async function salesPageSafe(){
    await sync();
    const {data,error}=await client.rpc('get_sales_products');
    if(error)return toast(error.message||'销售端加载失败');
    const list=data||[];
    const shell=window.shell;
    if(typeof shell!=='function')return;
    shell(`<div class="page"><div class="saleshero"><h2>销售端</h2><p>销售端只读取已发布产品资料，不读取采购价、供应商或内部备注。</p></div><div class="lm-safe-banner">当前账号：${esc(roleLabel(role))} · 销售展示数据与选品内部数据已分离</div><div class="lm-sales-tools"><div class="search"><input id="lmSalesSearch" placeholder="搜索产品名称、编号、关键词……"></div><span class="lm-sales-note">共 ${list.length} 个已发布产品</span></div><div id="lmSalesGrid" class="grid">${list.length?list.map(salesCard).join(''):'<div class="empty">暂无已发布产品</div>'}</div></div>`);
    const input=document.getElementById('lmSalesSearch');if(input)input.oninput=()=>{const q=input.value.trim().toLowerCase();document.querySelectorAll('#lmSalesGrid .product').forEach(a=>a.style.display=!q||a.innerText.toLowerCase().includes(q)?'':'none')};
  }
  function mediaUrl(path){return client.storage.from('product-media').getPublicUrl(path).data.publicUrl}
  function salesCard(p){return `<article class="product"><div class="pimg">${p._media?.[0]?`<img loading="lazy" decoding="async" src="${esc(mediaUrl(p._media[0].storage_path))}" alt="产品图片">`:'<div class="mock">LM</div>'}</div><div class="pbody"><span class="tag">● 已发布</span><h3>${esc(p.name)}</h3><p>${esc((p.description||'').slice(0,100))}</p><div class="row"><span class="price">${p.suggested_price==null?'—':'¥'+Number(p.suggested_price).toFixed(2)}</span><button class="more" onclick="lmSafeSalesDetail('${p.id}')">查看详情 →</button></div><div class="card-actions"><button class="tiny dark" onclick="lmSafeSalesDetail('${p.id}')">查看产品资料</button></div></div></article>`}
  async function loadSalesMedia(list){
    for(const p of list){const {data}=await client.rpc('get_sales_product_media',{p_product_id:p.id});p._media=data||[]}
    return list;
  }
  window.lmSafeSalesDetail=async id=>{
    await sync();
    const {data,error}=await client.rpc('get_sales_product',{p_product_id:id});if(error||!data?.[0])return toast(error?.message||'产品不存在');
    const p=data[0];const {data:media}=await client.rpc('get_sales_product_media',{p_product_id:id});p.product_media=media||[];
    const images=p.product_media.filter(x=>x.media_type==='image').sort((a,b)=>a.sort_order-b.sort_order),videos=p.product_media.filter(x=>x.media_type==='video').sort((a,b)=>a.sort_order-b.sort_order);
    const mediaHtml=images.map(m=>`<img src="${esc(mediaUrl(m.storage_path))}" style="width:110px;height:85px;object-fit:contain;border:1px solid #dbe9f5;border-radius:10px;background:#f7fbff">`).join('');
    window.shell(`<div class="page"><div class="head"><div><button class="btn" onclick="lmSafeSalesPage()">← 返回销售端</button></div></div><div class="detail" style="margin-top:22px"><div><div class="hero">${images[0]?`<img src="${esc(mediaUrl(images[0].storage_path))}" alt="产品图片">`:'<div class="mock">LM</div>'}</div><div class="media-gallery"><div class="media-gallery-head"><div><strong>产品图片</strong><span>${images.length} 张</span></div></div><div style="display:flex;gap:10px;flex-wrap:wrap">${mediaHtml||'<span class="muted">暂无图片</span>'}</div>${videos.length?`<div class="video-gallery"><div class="media-gallery-head"><div><strong>产品视频</strong><span>${videos.length} 个</span></div></div><div class="video-grid">${videos.map(m=>`<div class="video-grid-item"><video controls playsinline preload="none" src="${esc(mediaUrl(m.storage_path))}"></video><div>视频</div></div>`).join('')}</div></div>`:''}</div></div><div><span class="tag">● 已发布</span><h1>${esc(p.name)}</h1><p class="muted">${esc(p.description||'')}</p><ul class="bullets">${(p.highlights||[]).map(h=>`<li>${esc(h)}</li>`).join('')}</ul><div class="spec-grid"><div><small>产品编号</small><b>${esc(p.sku||'—')}</b></div><div><small>产品类目</small><b>${esc(p.category||'—')}</b></div><div><small>起订量</small><b>${esc(p.moq??'—')}</b></div><div><small>建议售价</small><b>${p.suggested_price==null?'—':'¥'+Number(p.suggested_price).toFixed(2)}</b></div></div>${Object.keys(p.specs||{}).length?`<div class="section" style="margin-top:18px"><h3>产品参数</h3><div class="spec-grid">${Object.entries(p.specs).map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div></div>`:''}</div></div></div>`)
  };
  window.lmSafeSalesPage= salesPageSafe;

  function patchGo(){
    if(typeof window.go!=='function'||window.go.__lmSecure)return;
    const original=window.go;const wrapped=function(v){if(v==='sales'){window.view='sales';salesPageSafe();return}return original(v)};wrapped.__lmSecure=true;window.go=wrapped;
  }
  function patchUpload(){
    if(typeof window.uploadPage!=='function'||window.uploadPage.__lmSecure)return;
    const original=window.uploadPage;const wrapped=function(...args){const r=original.apply(this,args);setTimeout(()=>{addDraftButton();const root=document.querySelector('.upload');if(root){const st=root.querySelector('#saveState');if(st)st.insertAdjacentHTML('afterend',' <span class="lm-draft-state">草稿与正式发布相互独立</span>')}} ,50);return r};wrapped.__lmSecure=true;window.uploadPage=wrapped;
  }
  function boot(){sync();let n=0;const timer=setInterval(()=>{patchGo();patchUpload();addDraftButton();if(++n>100)clearInterval(timer)},120)}
  boot();
})();