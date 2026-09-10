(()=>{
  const client=window.supabase.createClient(window.LEOMILES_SUPABASE_URL,window.LEOMILES_SUPABASE_PUBLISHABLE_KEY);
  const state={role:'sales',categories:[],category:'全部',status:'全部',bound:false,refreshing:false};

  const css=`
.lm-filter-wrap{display:flex;flex-direction:column;gap:10px;margin:0 0 20px}
.lm-filter-line{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.lm-filter-title{font-size:12px;color:#8a96a3;min-width:42px;font-weight:700}
.lm-filter-btn{border:1px solid #d7e9fb;background:#fff;border-radius:18px;padding:8px 12px;color:#607083;font-size:12px;font-weight:700;cursor:pointer;transition:background .14s ease,color .14s ease,border-color .14s ease,box-shadow .14s ease}
.lm-filter-btn:hover{border-color:#9bcfff;box-shadow:0 5px 16px rgba(22,119,255,.07)}
.lm-filter-btn.active{background:#111;color:#fff;border-color:#111}
.lm-filter-summary{font-size:12px;color:#8492a0;margin-top:2px}
.logout button.nav{border:1px solid #e2eaf2!important;background:#fff!important;border-radius:11px!important;color:#647486!important;text-align:center!important;padding:10px 12px!important;transition:background .14s ease,border-color .14s ease,color .14s ease,box-shadow .14s ease!important}
.logout button.nav:hover{background:#f4f8fc!important;border-color:#cfe2f4!important;color:#0b66b1!important;box-shadow:0 6px 18px rgba(22,119,255,.07)!important}
.user{cursor:default}
.user .avatar{background:linear-gradient(145deg,#071a34,#1677ff 70%,#52d7ff)!important;box-shadow:0 5px 14px rgba(22,119,255,.16)!important}
.page .toolbar{align-items:center}
.page .toolbar>.chips{display:none!important}
.lm-publish-btn{border:1px solid #d7e9fb;background:#fff;color:#0b66b1;border-radius:9px;padding:8px 10px;font-size:12px;font-weight:700}
.lm-publish-btn.off{color:#8a4d18;border-color:#f1dcc0;background:#fffaf3}
.lm-detail-copy{margin-top:10px}
@media(max-width:620px){.lm-filter-line{align-items:flex-start}.lm-filter-title{min-width:40px;padding-top:8px}.lm-filter-btn{padding:7px 10px}}
`;
  const style=document.createElement('style');style.id='leomiles-enhancements-v2';style.textContent=css;document.head.appendChild(style);

  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

  async function syncRole(){
    try{
      const {data}=await client.auth.getUser();
      if(!data?.user){state.role='sales';return}
      const {data:p}=await client.from('profiles').select('role').eq('id',data.user.id).single();
      state.role=p?.role||'sales';
    }catch(e){state.role='sales'}
  }

  async function loadCategories(){
    const {data,error}=await client.from('product_categories').select('id,name,sort_order,is_active').eq('is_active',true).order('sort_order',{ascending:true}).order('name',{ascending:true});
    state.categories=error?[]:(data||[]);
    return state.categories;
  }

  async function fillUploadCategory(){
    const el=document.getElementById('category');
    if(!el)return;
    const cats=await loadCategories();
    if(!cats.length)return;
    const current=el.value;
    el.innerHTML=cats.map(c=>`<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('');
    if(current&&cats.some(c=>c.name===current))el.value=current;
  }

  function currentPageType(){
    if(document.getElementById('uploadForm'))return'upload';
    if(document.querySelector('.detail'))return'detail';
    if(document.querySelector('[data-lm-page="admin"]'))return'admin';
    if(document.querySelector('[data-lm-page="profile"]'))return'profile';
    if(document.querySelector('.saleshero'))return'sales';
    if(document.getElementById('grid'))return'products';
    const h=document.querySelector('.page h2')?.textContent?.trim()||'';
    if(h==='管理中心')return'admin';
    if(h==='个人中心')return'profile';
    return'products';
  }

  function syncNavActive(){
    const type=currentPageType();
    document.querySelectorAll('.sidebar .nav button').forEach(b=>b.classList.remove('active'));
    const buttons=[...document.querySelectorAll('.sidebar .nav button')];
    const find=text=>buttons.find(b=>(b.textContent||'').trim().includes(text));
    const map={products:'产品库',upload:'上传产品',sales:'销售端',profile:'个人中心',admin:'管理中心'};
    const target=find(map[type]||'产品库');
    if(target)target.classList.add('active');
  }

  function productFilterMatches(article){
    if(!article)return false;
    const text=(article.innerText||'').toLowerCase();
    const category=(article.querySelector('.lm-product-extra div:first-child b')?.textContent||'').trim();
    const statusText=(article.querySelector('.tag')?.textContent||'').trim();
    const search=(document.querySelector('.search input')?.value||'').trim().toLowerCase();
    const catOk=state.category==='全部'||category===state.category;
    const statusOk=state.status==='全部'||(state.status==='已发布'&&statusText.includes('已发布'))||(state.status==='草稿'&&statusText.includes('草稿'));
    const searchOk=!search||text.includes(search);
    return catOk&&statusOk&&searchOk;
  }

  function applyDomFilters(){
    const grid=document.getElementById('grid');if(!grid)return;
    const articles=[...grid.querySelectorAll('.product')];
    let visible=0;
    articles.forEach(a=>{const ok=productFilterMatches(a);a.style.display=ok?'':'none';if(ok)visible++});
    let empty=grid.querySelector('.lm-filter-empty');
    if(!visible&&articles.length){
      if(!empty){empty=document.createElement('div');empty.className='empty lm-filter-empty';grid.appendChild(empty)}
      empty.textContent='当前筛选条件下没有产品';empty.style.display='block';
    }else if(empty)empty.style.display='none';
    const summary=document.getElementById('lmFilterSummary');
    if(summary)summary.textContent=articles.length?`共 ${articles.length} 个产品 · 当前显示 ${visible} 个`:'当前筛选条件下没有产品';
  }

  async function refreshProductGrid(){
    if(state.refreshing)return;
    const grid=document.getElementById('grid');if(!grid||typeof window.card!=='function')return;
    state.refreshing=true;
    try{
      let q=client.from('products').select('id,name,sku,category,description,highlights,specs,purchase_price,suggested_price,moq,supplier,internal_notes,status,created_by,updated_by,updated_at,product_media(id,product_id,storage_path,media_type,sort_order)').order('updated_at',{ascending:false});
      if(state.role==='sales')q=q.eq('status','published');
      if(state.category!=='全部')q=q.eq('category',state.category);
      if(state.status!=='全部'&&state.role!=='sales')q=q.eq('status',state.status==='已发布'?'published':'draft');
      const {data,error}=await q;
      if(error){toast(error.message);return}
      const list=data||[];
      grid.innerHTML=list.length?list.map(p=>window.card(p)).join(''):'<div class="empty">当前筛选条件下没有产品</div>';
      applyDomFilters();
    }finally{state.refreshing=false}
  }

  function buildFilterUI(){
    const toolbar=document.querySelector('.page .toolbar');
    if(!toolbar)return;
    const old=toolbar.parentElement?.querySelector('.lm-filter-wrap');if(old)old.remove();
    const oldChips=toolbar.querySelector('.chips');if(oldChips)oldChips.remove();
    const wrap=document.createElement('div');wrap.className='lm-filter-wrap';
    const catLine=document.createElement('div');catLine.className='lm-filter-line';
    catLine.innerHTML='<span class="lm-filter-title">类目</span>';
    ['全部',...state.categories.map(c=>c.name)].forEach(name=>{
      const b=document.createElement('button');b.type='button';b.className='lm-filter-btn'+(state.category===name?' active':'');b.textContent=name;
      b.onclick=async()=>{state.category=name;await refreshProductGrid();buildFilterUI()};catLine.appendChild(b);
    });
    wrap.appendChild(catLine);
    if(state.role!=='sales'){
      const statusLine=document.createElement('div');statusLine.className='lm-filter-line';statusLine.innerHTML='<span class="lm-filter-title">状态</span>';
      ['全部','已发布','草稿'].forEach(name=>{
        const b=document.createElement('button');b.type='button';b.className='lm-filter-btn'+(state.status===name?' active':'');b.textContent=name;
        b.onclick=async()=>{state.status=name;await refreshProductGrid();buildFilterUI()};statusLine.appendChild(b);
      });
      wrap.appendChild(statusLine);
    }else state.status='已发布';
    const summary=document.createElement('div');summary.className='lm-filter-summary';summary.id='lmFilterSummary';wrap.appendChild(summary);
    toolbar.insertAdjacentElement('afterend',wrap);
    applyDomFilters();
  }

  async function enhanceProductFilters(){
    if(!document.querySelector('.page .toolbar')||!document.getElementById('grid'))return;
    await loadCategories();
    if(state.role==='sales')state.status='已发布';
    buildFilterUI();
  }

  async function lmTogglePublish(id){
    if(!['admin','selector'].includes(state.role))return toast('当前账号没有权限');
    const {data,error}=await client.from('products').select('id,name,status').eq('id',id).single();
    if(error||!data)return toast(error?.message||'产品不存在');
    const next=data.status==='published'?'draft':'published';
    const {error:upErr}=await client.from('products').update({status:next}).eq('id',id);
    if(upErr)return toast(upErr.message);
    toast(next==='published'?'产品已发布':'产品已下架');
    await refreshProductGrid();
    await enhanceProductFilters();
  }
  window.lmTogglePublish=lmTogglePublish;

  async function copyFullProductInfo(id){
    const {data,error}=await client.from('products').select('name,sku,category,description,highlights,specs,purchase_price,suggested_price,moq,supplier,status').eq('id',id).single();
    if(error||!data)return toast(error?.message||'读取产品资料失败');
    const lines=['产品名称：'+(data.name||'—'),'产品编号：'+(data.sku||'—'),'产品类目：'+(data.category||'—'),'产品简介：'+(data.description||'—'),'状态：'+(data.status==='published'?'已发布':'草稿'),'建议售价：'+(data.suggested_price??'—'),'MOQ：'+(data.moq??'—')];
    if(state.role!=='sales')lines.push('采购价：'+(data.purchase_price??'—'),'供应商：'+(data.supplier||'—'));
    const hs=(data.highlights||[]).filter(Boolean);if(hs.length)lines.push('核心卖点：\n'+hs.map((x,i)=>`${i+1}. ${x}`).join('\n'));
    const specs=data.specs&&typeof data.specs==='object'?data.specs:{};const se=Object.entries(specs).filter(([k,v])=>String(k).trim()&&String(v).trim()!=='');if(se.length)lines.push('产品参数：\n'+se.map(([k,v])=>k+'：'+v).join('\n'));
    const text=lines.join('\n');
    try{await navigator.clipboard.writeText(text);toast('完整产品资料已复制')}catch(e){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('完整产品资料已复制')}
  }
  window.copyFullProductInfo=copyFullProductInfo;

  function addDetailCopyButton(){
    const detail=document.querySelector('.detail');if(!detail||detail.querySelector('.lm-detail-copy'))return;
    const anyButton=detail.querySelector('.card-actions button[onclick*="copyProductSpecs"]');if(!anyButton)return;
    const m=(anyButton.getAttribute('onclick')||'').match(/'([^']+)'/);const pid=m?.[1];if(!pid)return;
    const box=anyButton.parentElement;if(!box)return;
    const b=document.createElement('button');b.className='btn lm-detail-copy';b.type='button';b.textContent='复制完整资料';b.onclick=()=>copyFullProductInfo(pid);box.appendChild(b);
  }

  function patchCard(){
    if(typeof window.card!=='function'||window.card.__lmV2)return;
    const original=window.card;
    const wrapped=function(p){
      const html=original(p);
      if(!['admin','selector'].includes(state.role))return html;
      const action=p.status==='published'?'下架':'发布';
      const klass=p.status==='published'?'lm-publish-btn off':'lm-publish-btn';
      return html.replace('<div class="card-actions">','<div class="card-actions"><button type="button" class="'+klass+'" onclick="lmTogglePublish(\''+p.id+'\')">'+action+'</button>');
    };
    wrapped.__lmV2=true;window.card=wrapped;
  }

  function patchSearch(){
    if(typeof window.filterProducts!=='function'||window.filterProducts.__lmV2)return;
    const original=window.filterProducts;
    const wrapped=function(q){original(q);clearTimeout(window.__lmFilterTimer);window.__lmFilterTimer=setTimeout(applyDomFilters,120)};
    wrapped.__lmV2=true;window.filterProducts=wrapped;
  }

  function patchShell(){
    if(typeof window.shell!=='function'||window.shell.__lmV2)return;
    const original=window.shell;
    const wrapped=function(content){
      original(content);
      setTimeout(async()=>{
        patchCard();
        syncNavActive();
        const type=currentPageType();
        if(type==='products'){
          state.category='全部';
          state.status='全部';
          await refreshProductGrid();
          await enhanceProductFilters();
          syncNavActive();
        }else if(type==='upload'){
          await fillUploadCategory();
          syncNavActive();
        }else if(type==='detail'){
          addDetailCopyButton();
          syncNavActive();
        }else{
          syncNavActive();
        }
      },0);
    };
    wrapped.__lmV2=true;window.shell=wrapped;
  }

  async function boot(){
    await syncRole();
    let tries=0;
    const timer=setInterval(()=>{
      patchShell();patchSearch();patchCard();
      syncNavActive();
      if(!state.bound){
        document.addEventListener('click',e=>{
          const b=e.target.closest('.lm-publish-btn');if(b)e.stopPropagation();
          setTimeout(()=>{syncNavActive();if(document.getElementById('uploadForm'))fillUploadCategory()},80);
        },true);
        state.bound=true;
      }
      if(typeof window.shell==='function'||++tries>100)clearInterval(timer);
    },120);
    window.enhanceProductFilters=enhanceProductFilters;
  }
  boot();
})();
