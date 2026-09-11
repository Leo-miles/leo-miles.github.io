(()=>{
  const client=window.supabase.createClient(window.LEOMILES_SUPABASE_URL,window.LEOMILES_SUPABASE_PUBLISHABLE_KEY);
  const state={role:'sales',categories:[],category:'全部',status:'全部',refreshing:false,bound:false};

  const css=`
/* ===== LEOMILES 增强层统一样式 ===== */
.lm-filter-wrap{display:flex;flex-direction:column;gap:10px;margin:0 0 20px}
.lm-filter-line{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.lm-filter-title{font-size:12px;color:#7d8b9a;min-width:42px;font-weight:700}
.lm-filter-btn{border:1px solid #d7e9fb;background:#fff;border-radius:18px;padding:8px 12px;color:#5f7184;font-size:12px;font-weight:700;cursor:pointer;transition:background .14s ease,color .14s ease,border-color .14s ease,box-shadow .14s ease}
.lm-filter-btn:hover{border-color:#9bcfff;box-shadow:0 5px 16px rgba(22,119,255,.07)}
.lm-filter-btn.active{background:#111;color:#fff;border-color:#111;box-shadow:none}
.lm-filter-summary{font-size:12px;color:#8492a0;margin-top:2px}
.lm-filter-summary strong{color:#16365b}
.lm-publish-btn{border:1px solid #d7e9fb;background:#fff;color:#0b66b1;border-radius:9px;padding:8px 10px;font-size:12px;font-weight:700}
.lm-publish-btn.off{color:#8a4d18;border-color:#f1dcc0;background:#fffaf3}
.lm-detail-copy{margin-top:10px}

/* 上传产品页：保留原有字段，只重做视觉层级与辅助交互 */
.upload{max-width:1050px!important;padding-bottom:96px!important}
.upload .head{margin-bottom:16px!important}
.upload .head h2{font-size:34px!important}
.upload .head p{max-width:760px!important;line-height:1.6!important;color:#718196!important}
.upload .section{padding:28px 30px!important;border-radius:22px!important;margin-bottom:18px!important;background:rgba(255,255,255,.97)!important;box-shadow:0 10px 30px rgba(49,119,177,.045)!important}
.upload .section h3{font-size:18px!important;margin:0 0 18px!important;color:#0a2140!important;display:flex;align-items:center;gap:10px}
.upload .section h3:before{content:'';width:4px;height:18px;border-radius:4px;background:linear-gradient(180deg,#1677ff,#58d8ff);display:inline-block}
.upload .two{grid-template-columns:minmax(0,1.35fr) minmax(250px,.65fr)!important;gap:20px!important}
.upload .field{margin:0 0 18px!important}
.upload .field:last-child{margin-bottom:0!important}
.upload .field label{color:#0d2a4d!important;margin-bottom:8px!important;font-size:12px!important}
.upload .field input,.upload .field textarea,.upload .field select{min-height:46px!important;border-radius:12px!important;background:#fbfdff!important}
.upload .field textarea{min-height:128px!important}
.upload .field textarea#specs{min-height:300px!important}
.upload .draft-box{margin:0 0 14px!important;padding:10px 13px!important;border-radius:12px!important;background:#f6fbff!important;border-color:#d8eaf9!important;color:#607286!important;box-shadow:none!important}
.upload .draft-box .btn{padding:8px 11px!important;border-radius:9px!important}
.upload .drop{padding:34px 24px!important;border-radius:16px!important;background:linear-gradient(145deg,#fbfdff,#f3f9ff)!important;border-color:#bcdcf8!important}
.upload .drop strong{font-size:26px!important;color:#1677ff!important}
.upload .drop small{color:#77889b!important;line-height:1.6!important}
.upload .previews{gap:12px!important;margin-top:14px!important}
.upload .preview-wrap{width:118px!important}
.upload .preview{width:118px!important;height:90px!important;border-radius:11px!important;background:#eef6ff!important;border:1px solid #dcecff!important}
.upload .video-meta{background:#f8fbff!important;padding:4px 5px!important;border-radius:6px!important}
.upload .hint{padding:10px 12px!important;background:#f7fbff!important;border-radius:10px!important;border:1px solid #e5f0fb!important}
.upload .actions{position:sticky;bottom:14px;z-index:8;justify-content:flex-end!important;padding:12px 14px!important;margin:10px 0 0!important;border:1px solid #dcecff!important;background:rgba(255,255,255,.95)!important;backdrop-filter:blur(14px)!important;border-radius:16px!important;box-shadow:0 12px 35px rgba(31,110,183,.10)!important}
.upload .actions .btn{min-width:108px!important}
.upload .save-state{margin-right:auto!important;color:#7c8c9c!important}
.upload .lm-upload-guide{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 16px}
.upload .lm-upload-guide-item{display:flex;gap:9px;align-items:flex-start;padding:12px 13px;border:1px solid #e1edf8;border-radius:13px;background:#fafdff}
.upload .lm-upload-guide-item>div:first-child{width:24px;height:24px;border-radius:8px;display:grid;place-items:center;background:#eaf5ff;color:#1677ff;font-size:11px;font-weight:800;flex:none}
.upload .lm-upload-guide-item b{display:block;font-size:12px;color:#17385f;margin-bottom:3px}
.upload .lm-upload-guide-item span{font-size:11px;color:#8292a2;line-height:1.5}
.upload .lm-upload-topnote{margin:0 0 16px;padding:12px 15px;border:1px solid #dcecff;border-radius:14px;background:linear-gradient(90deg,#f5faff,#fbfdff);font-size:12px;color:#61758a}
.upload .lm-upload-topnote strong{color:#0c4f96}
.upload .lm-upload-section-note{font-size:12px;color:#8090a0;line-height:1.6;margin:-8px 0 18px}
@media(max-width:760px){.upload .two{grid-template-columns:1fr!important}.upload .lm-upload-guide{grid-template-columns:1fr}.upload .section{padding:22px 18px!important}.upload .actions{bottom:10px;flex-wrap:wrap}.upload .actions .btn{flex:1;min-width:120px!important}}
`;
  const style=document.createElement('style');style.id='leomiles-enhancements-v2';style.textContent=css;document.head.appendChild(style);

  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const roleLabel=r=>r==='admin'?'超级管理员':r==='selector'?'选品人员':'销售人员';

  async function syncRole(){
    try{const {data}=await client.auth.getUser();if(!data?.user){state.role='sales';return}const {data:p}=await client.from('profiles').select('role').eq('id',data.user.id).single();state.role=p?.role||'sales'}catch(e){state.role='sales'}
  }

  async function loadCategories(){
    const {data,error}=await client.from('product_categories').select('id,name,sort_order,is_active').eq('is_active',true).order('sort_order',{ascending:true}).order('name',{ascending:true});
    state.categories=error?[]:(data||[]);return state.categories;
  }

  async function fillUploadCategory(){
    const el=document.getElementById('category');if(!el)return;
    const cats=await loadCategories();if(!cats.length)return;
    const current=el.value;el.innerHTML=cats.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
    if(current&&cats.some(c=>c.name===current))el.value=current;
  }

  function pageType(){
    if(document.getElementById('uploadForm'))return'upload';
    if(document.querySelector('.detail'))return'detail';
    if(document.querySelector('.saleshero'))return'sales';
    if(document.getElementById('grid'))return'products';
    const h=document.querySelector('.page h2')?.textContent?.trim()||'';
    if(h==='管理中心')return'admin';if(h==='个人中心')return'profile';return'other';
  }

  function syncNav(){
    const type=pageType();document.querySelectorAll('.sidebar .nav button').forEach(b=>b.classList.remove('active'));
    const map={products:'产品库',upload:'上传产品',sales:'销售端',detail:'产品库',profile:'个人中心',admin:'管理中心'};
    const targetText=map[type]||'产品库';
    const btn=[...document.querySelectorAll('.sidebar .nav button')].find(b=>(b.textContent||'').trim().includes(targetText));
    if(btn)btn.classList.add('active');
    const userBox=document.querySelector('.top .user');
    if(userBox&&state.role){
      let label=userBox.querySelector('.lm-role-label');
      if(!label){label=document.createElement('span');label.className='lm-role-label';userBox.insertBefore(label,userBox.firstChild)}
      label.textContent=roleLabel(state.role);
    }
  }

  function productMatches(article){
    if(!article)return false;const text=(article.innerText||'').toLowerCase();
    const category=(article.querySelector('.lm-product-extra div:first-child b')?.textContent||'').trim();
    const status=(article.querySelector('.tag')?.textContent||'').trim();const search=(document.querySelector('.search input')?.value||'').trim().toLowerCase();
    const catOk=state.category==='全部'||category===state.category;
    const statusOk=state.status==='全部'||(state.status==='已发布'&&status.includes('已发布'))||(state.status==='草稿'&&status.includes('草稿'));
    return catOk&&statusOk&&(!search||text.includes(search));
  }

  function applyDomFilters(){
    const grid=document.getElementById('grid');if(!grid)return;const cards=[...grid.querySelectorAll('.product')];let visible=0;
    cards.forEach(a=>{const ok=productMatches(a);a.style.display=ok?'':'none';if(ok)visible++});
    let empty=grid.querySelector('.lm-filter-empty');
    if(!visible&&cards.length){if(!empty){empty=document.createElement('div');empty.className='empty lm-filter-empty';grid.appendChild(empty)}empty.textContent='当前筛选条件下没有产品';empty.style.display='block'}else if(empty)empty.style.display='none';
    const summary=document.getElementById('lmFilterSummary');if(summary)summary.innerHTML=cards.length?`共 <strong>${cards.length}</strong> 个产品 · 当前显示 <strong>${visible}</strong> 个`:'当前筛选条件下没有产品';
  }

  async function refreshProducts(){
    if(state.refreshing)return;const grid=document.getElementById('grid');if(!grid||typeof window.card!=='function')return;state.refreshing=true;
    try{
      let q=client.from('products').select('id,name,sku,category,description,highlights,specs,purchase_price,suggested_price,moq,supplier,internal_notes,status,created_by,updated_by,updated_at,product_media(id,product_id,storage_path,media_type,sort_order)').order('updated_at',{ascending:false});
      if(state.role==='sales')q=q.eq('status','published');if(state.category!=='全部')q=q.eq('category',state.category);if(state.status!=='全部'&&state.role!=='sales')q=q.eq('status',state.status==='已发布'?'published':'draft');
      const {data,error}=await q;if(error){toast(error.message);return}grid.innerHTML=(data||[]).map(p=>window.card(p)).join('');applyDomFilters();
    }finally{state.refreshing=false}
  }

  function buildFilters(){
    const toolbar=document.querySelector('.page .toolbar');if(!toolbar)return;
    toolbar.querySelector('.chips')?.remove();toolbar.parentElement?.querySelector('.lm-filter-wrap')?.remove();
    const wrap=document.createElement('div');wrap.className='lm-filter-wrap';
    const cat=document.createElement('div');cat.className='lm-filter-line';cat.innerHTML='<span class="lm-filter-title">类目</span>';
    ['全部',...state.categories.map(c=>c.name)].forEach(name=>{const b=document.createElement('button');b.type='button';b.className='lm-filter-btn'+(state.category===name?' active':'');b.textContent=name;b.onclick=async()=>{state.category=name;await refreshProducts();buildFilters()};cat.appendChild(b)});wrap.appendChild(cat);
    if(state.role!=='sales'){
      const status=document.createElement('div');status.className='lm-filter-line';status.innerHTML='<span class="lm-filter-title">状态</span>';
      ['全部','已发布','草稿'].forEach(name=>{const b=document.createElement('button');b.type='button';b.className='lm-filter-btn'+(state.status===name?' active':'');b.textContent=name;b.onclick=async()=>{state.status=name;await refreshProducts();buildFilters()};status.appendChild(b)});wrap.appendChild(status);
    }else state.status='已发布';
    const summary=document.createElement('div');summary.className='lm-filter-summary';summary.id='lmFilterSummary';wrap.appendChild(summary);toolbar.insertAdjacentElement('afterend',wrap);applyDomFilters();
  }

  async function enhanceProducts(){if(!document.querySelector('.page .toolbar')||!document.getElementById('grid'))return;await loadCategories();if(state.role==='sales')state.status='已发布';buildFilters()}

  async function togglePublish(id){
    if(!['admin','selector'].includes(state.role))return toast('当前账号没有权限');
    const {data,error}=await client.from('products').select('id,status').eq('id',id).single();if(error||!data)return toast(error?.message||'产品不存在');
    const next=data.status==='published'?'draft':'published';const {error:upErr}=await client.from('products').update({status:next}).eq('id',id);if(upErr)return toast(upErr.message);toast(next==='published'?'产品已发布':'产品已下架');await refreshProducts();await enhanceProducts();
  }
  window.lmTogglePublish=togglePublish;

  async function copyFull(id){
    const {data,error}=await client.from('products').select('name,sku,category,description,highlights,specs,purchase_price,suggested_price,moq,supplier,status').eq('id',id).single();if(error||!data)return toast(error?.message||'读取产品资料失败');
    const lines=['产品名称：'+(data.name||'—'),'产品编号：'+(data.sku||'—'),'产品类目：'+(data.category||'—'),'产品简介：'+(data.description||'—'),'状态：'+(data.status==='published'?'已发布':'草稿'),'建议售价：'+(data.suggested_price??'—'),'MOQ：'+(data.moq??'—')];
    if(state.role!=='sales')lines.push('采购价：'+(data.purchase_price??'—'),'供应商：'+(data.supplier||'—'));
    const hs=(data.highlights||[]).filter(Boolean);if(hs.length)lines.push('核心卖点：\n'+hs.map((x,i)=>`${i+1}. ${x}`).join('\n'));const specs=data.specs&&typeof data.specs==='object'?data.specs:{};const se=Object.entries(specs).filter(([k,v])=>String(k).trim()&&String(v).trim()!=='');if(se.length)lines.push('产品参数：\n'+se.map(([k,v])=>k+'：'+v).join('\n'));
    const text=lines.join('\n');try{await navigator.clipboard.writeText(text);toast('完整产品资料已复制')}catch(e){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('完整产品资料已复制')}
  }
  window.copyFullProductInfo=copyFull;

  function addDetailCopy(){
    const detail=document.querySelector('.detail');if(!detail||detail.querySelector('.lm-detail-copy'))return;const btn=detail.querySelector('.card-actions button[onclick*="copyProductSpecs"]');if(!btn)return;const m=(btn.getAttribute('onclick')||'').match(/'([^']+)'/);const id=m?.[1];if(!id)return;const box=btn.parentElement;if(!box)return;const b=document.createElement('button');b.type='button';b.className='btn lm-detail-copy';b.textContent='复制完整资料';b.onclick=()=>copyFull(id);box.appendChild(b);
  }

  function addPublishToCard(){
    if(typeof window.card!=='function'||window.card.__lmV3)return;const original=window.card;
    const wrapped=function(p){const html=original(p);if(!['admin','selector'].includes(state.role))return html;const action=p.status==='published'?'下架':'发布';const cls=p.status==='published'?'lm-publish-btn off':'lm-publish-btn';return html.replace('<div class="card-actions">','<div class="card-actions"><button type="button" class="'+cls+'" onclick="lmTogglePublish(\''+p.id+'\')">'+action+'</button>')};wrapped.__lmV3=true;window.card=wrapped;
  }

  function polishUpload(){
    const root=document.querySelector('.upload');if(!root)return;
    root.querySelector('.lm-upload-guide')||(()=>{const first=root.querySelector('.section');if(!first)return;const g=document.createElement('div');g.className='lm-upload-guide';g.innerHTML='<div class="lm-upload-guide-item"><div>1</div><div><b>填写基础信息</b><span>名称、编号、类目、产品简介</span></div></div><div class="lm-upload-guide-item"><div>2</div><div><b>完善产品资料</b><span>图片、视频、卖点、参数与商务信息</span></div></div><div class="lm-upload-guide-item"><div>3</div><div><b>保存或发布</b><span>未完成内容会继续保留，发布后销售端即可查看</span></div></div>';first.before(g)})();
    if(!root.querySelector('.lm-upload-topnote')){const guide=root.querySelector('.lm-upload-guide');const n=document.createElement('div');n.className='lm-upload-topnote';n.innerHTML='<strong>上传提示：</strong> 产品资料填写过程中可以直接切换页面，系统会保留未完成内容。';(guide||root.firstElementChild)?.after(n)}
    const p=root.closest('.page')?.querySelector('.head p');if(p)p.textContent='集中录入产品资料、图片与商务信息，完成后可保存草稿或发布。';
    const draft=root.querySelector('.draft-box');if(draft){const node=draft.querySelector('span')||draft.firstChild;if(node&&node.textContent?.includes('检测到'))node.textContent='已恢复上次未完成的产品资料，并继续保留草稿。'}
    const sections=[...root.querySelectorAll('.section')];sections.forEach((s,i)=>{if(i===0&&!s.querySelector('.lm-upload-section-note')){const note=document.createElement('div');note.className='lm-upload-section-note';note.textContent='建议先完成名称、编号、类目，再补充详细内容。';const h=s.querySelector('h3');if(h)h.after(note)}if(i===1&&!s.querySelector('.lm-upload-section-note')){const note=document.createElement('div');note.className='lm-upload-section-note';note.textContent='支持多张产品图片与视频，主图建议优先放最清晰的产品展示图。';const h=s.querySelector('h3');if(h)h.after(note)}});
  }

  function patchSearch(){
    if(typeof window.filterProducts!=='function'||window.filterProducts.__lmV3)return;const original=window.filterProducts;const wrapped=function(q){original(q);setTimeout(applyDomFilters,80)};wrapped.__lmV3=true;window.filterProducts=wrapped;
  }

  async function applyPage(){
    syncNav();addPublishToCard();const t=pageType();
    if(t==='products'){state.category='全部';state.status='全部';await enhanceProducts();syncNav()}
    else if(t==='upload'){await fillUploadCategory();polishUpload();syncNav()}
    else if(t==='detail'){addDetailCopy();syncNav()}
  }

  async function boot(){
    await syncRole();let tries=0;const timer=setInterval(()=>{addPublishToCard();patchSearch();syncNav();polishUpload();if(++tries>80)clearInterval(timer)},120);
    window.enhanceProductFilters=enhanceProducts;document.addEventListener('click',()=>setTimeout(()=>{applyPage().catch(()=>{})},60),true);
    setTimeout(()=>applyPage().catch(()=>{}),250);
  }
  boot();
})();