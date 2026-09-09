window.LEOMILES_SUPABASE_URL='https://zzkujghfxbjafvmlkwqz.supabase.co';
window.LEOMILES_SUPABASE_PUBLISHABLE_KEY='sb_publishable_LYoWqn32khuKfipDWW40MQ_ggoW0FGf';

/* LEOMILES visual theme layer: UI only, no product logic or data changes. */
(()=>{
  const css=`
:root{
  --lm-blue:#1677ff;
  --lm-blue-2:#56a8ff;
  --lm-cyan:#5fe0ff;
  --lm-ink:#071426;
  --lm-line:#dcecff;
  --lm-soft:#f5faff;
  --lm-glass:rgba(255,255,255,.78);
}
html,body{background:radial-gradient(circle at 78% 8%,rgba(74,169,255,.16),transparent 26%),radial-gradient(circle at 10% 88%,rgba(117,207,255,.12),transparent 25%),linear-gradient(180deg,#fafdff 0%,#eef6ff 100%)!important;color:var(--lm-ink)!important}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background:linear-gradient(115deg,transparent 0%,rgba(255,255,255,.22) 42%,transparent 56%);animation:lm-scan 9s linear infinite;opacity:.55}
@keyframes lm-scan{0%{transform:translateX(-110%)}100%{transform:translateX(110%)}}
.sidebar{background:rgba(255,255,255,.78)!important;backdrop-filter:blur(22px)!important;border-right:1px solid rgba(110,184,255,.25)!important;box-shadow:10px 0 40px rgba(38,121,214,.07)!important}
.side-logo,.logo{background:linear-gradient(145deg,#06152c,#1677ff 62%,#59d8ff)!important;box-shadow:0 10px 30px rgba(22,119,255,.28),inset 0 0 18px rgba(255,255,255,.2)!important}
.sidebrand{color:#0b2344!important}
.nav button{position:relative;overflow:hidden;transition:transform .22s ease,background .22s ease,color .22s ease,box-shadow .22s ease!important}
.nav button:after{content:"";position:absolute;inset:auto -40% 0 -40%;height:1px;background:linear-gradient(90deg,transparent,var(--lm-cyan),transparent);transform:translateX(-100%);transition:transform .45s ease}
.nav button:hover:after,.nav button.active:after{transform:translateX(0)}
.nav button.active,.nav button:hover{background:linear-gradient(90deg,rgba(28,125,255,.12),rgba(95,224,255,.05))!important;color:#0b4fa8!important;box-shadow:inset 3px 0 0 var(--lm-blue),0 8px 22px rgba(22,119,255,.07)!important}
.top{background:rgba(255,255,255,.73)!important;border-bottom:1px solid rgba(103,178,255,.22)!important;box-shadow:0 8px 30px rgba(31,110,183,.06)!important}
.page{position:relative;z-index:1}
.head h2{background:linear-gradient(90deg,#071426,#1677ff 58%,#35bfe9);-webkit-background-clip:text;background-clip:text;color:transparent!important}
.btn,.tiny,.chip,.gallery-toggle{transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background .22s ease!important;border-color:#d7e9fb!important}
.btn:hover,.tiny:hover,.gallery-toggle:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(22,119,255,.14)!important;border-color:#9bcfff!important}
.btn.dark,.tiny.dark{background:linear-gradient(135deg,#0a1d38,#1677ff 68%,#52d7ff)!important;border-color:transparent!important;box-shadow:0 10px 24px rgba(22,119,255,.2)!important}
.product,.section,.media-gallery,.card{border-color:rgba(115,183,238,.23)!important;box-shadow:0 18px 50px rgba(49,119,177,.08)!important}
.product{position:relative;isolation:isolate;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease!important}
.product:before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(81,170,255,.0),rgba(81,170,255,.35),rgba(95,224,255,.0));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .3s ease;pointer-events:none}
.product:hover{transform:translateY(-6px)!important;box-shadow:0 24px 60px rgba(22,119,255,.13)!important;border-color:rgba(81,170,255,.42)!important}
.product:hover:before{opacity:1}
.pimg{background:radial-gradient(circle at 50% 45%,#ffffff 0%,#eef7ff 62%,#e2f1ff 100%)!important}
.tag{background:linear-gradient(90deg,#ebf7ff,#eefbff)!important;color:#0b74ce!important;box-shadow:inset 0 0 0 1px #cfeaff}
.search input,.field input,.field textarea,.field select{border-color:#d6e8fa!important;background:rgba(255,255,255,.82)!important;transition:box-shadow .22s ease,border-color .22s ease,transform .22s ease!important}
.search input:focus,.field input:focus,.field textarea:focus,.field select:focus{border-color:#62b3ff!important;box-shadow:0 0 0 4px rgba(73,165,255,.12),0 10px 26px rgba(73,165,255,.08)!important;transform:translateY(-1px)}
.hero{position:relative;border:1px solid rgba(91,177,247,.25)!important;background:radial-gradient(circle at 50% 30%,#ffffff 0%,#eff8ff 62%,#e2f2ff 100%)!important;box-shadow:inset 0 0 70px rgba(80,171,248,.08),0 18px 45px rgba(46,125,187,.08)!important}
.hero:after{content:"";position:absolute;inset:12px;border:1px solid rgba(64,167,255,.08);border-radius:20px;pointer-events:none}
.media-gallery{background:rgba(255,255,255,.72)!important;backdrop-filter:blur(16px)!important}
.image-stack,.image-grid-item,.video-grid-item{border-color:rgba(100,178,238,.2)!important;background:linear-gradient(145deg,#fafdff,#edf7ff)!important}
.stack-card{box-shadow:0 16px 38px rgba(26,109,174,.16)!important;border-color:rgba(86,170,240,.24)!important}
.stack-card:hover{filter:saturate(1.04) brightness(1.02);box-shadow:0 20px 45px rgba(22,119,255,.18)!important}
.stack-badge{background:linear-gradient(135deg,#081b34,#1677ff 70%,#43d3ff)!important;box-shadow:0 8px 22px rgba(22,119,255,.24)}
.saleshero{position:relative;overflow:hidden;background:radial-gradient(circle at 85% 15%,rgba(74,190,255,.35),transparent 30%),radial-gradient(circle at 10% 100%,rgba(43,120,255,.26),transparent 40%),linear-gradient(135deg,#061326,#0a3164 58%,#0d8fcc)!important;box-shadow:0 25px 70px rgba(13,104,177,.2)!important}
.saleshero:after{content:"";position:absolute;width:280px;height:280px;border:1px solid rgba(255,255,255,.14);border-radius:50%;right:-60px;top:-90px;box-shadow:0 0 0 24px rgba(255,255,255,.04),0 0 0 48px rgba(255,255,255,.025)}
.toast{background:linear-gradient(135deg,#071426,#1677ff 70%,#39d5ff)!important;box-shadow:0 16px 34px rgba(22,119,255,.28)!important}
.login{background:radial-gradient(circle at 78% 12%,rgba(63,169,255,.3),transparent 30%),radial-gradient(circle at 10% 88%,rgba(95,224,255,.2),transparent 28%),linear-gradient(145deg,#fafdff,#eaf5ff)!important}
.login-card{position:relative;overflow:hidden;border:1px solid rgba(89,179,255,.28)!important;box-shadow:0 30px 90px rgba(28,112,184,.14)!important}
.login-card:before{content:"";position:absolute;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(62,170,255,.22),transparent 68%);top:-95px;right:-70px;pointer-events:none}
.primary{background:linear-gradient(135deg,#071426,#1677ff 68%,#49d7ff)!important;box-shadow:0 12px 28px rgba(22,119,255,.24)!important;transition:transform .22s ease,box-shadow .22s ease!important}
.primary:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(22,119,255,.29)!important}
.route-enter{animation:lm-route .48s cubic-bezier(.2,.8,.2,1)}
@keyframes lm-route{0%{opacity:0;transform:translateY(12px) scale(.992);filter:blur(5px)}55%{opacity:.9;filter:blur(1px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
.nav-ripple{position:absolute;border-radius:50%;background:rgba(72,180,255,.22);transform:scale(0);animation:lm-ripple .55s ease-out;pointer-events:none}
@keyframes lm-ripple{to{transform:scale(4);opacity:0}}
@media(max-width:620px){.top{box-shadow:0 8px 22px rgba(31,110,183,.05)!important}.page{padding-top:24px}}
`;
  const style=document.createElement('style');style.id='leomiles-future-theme';style.textContent=css;document.head.appendChild(style);

  const animateRoute=()=>{
    const main=document.querySelector('.main');
    if(main){main.classList.remove('route-enter');void main.offsetWidth;main.classList.add('route-enter');}
  };

  document.addEventListener('click',e=>{
    const nav=e.target.closest('.nav button');
    if(nav){
      const r=document.createElement('span');r.className='nav-ripple';const rect=nav.getBoundingClientRect();const s=Math.max(rect.width,rect.height);r.style.width=s+'px';r.style.height=s+'px';r.style.left=(e.clientX-rect.left-s/2)+'px';r.style.top=(e.clientY-rect.top-s/2)+'px';nav.appendChild(r);setTimeout(()=>r.remove(),600);setTimeout(animateRoute,30);
    }
    const action=e.target.closest('.btn,.tiny,.gallery-toggle,.chip,.more');
    if(action && !nav){setTimeout(animateRoute,30)}
  },true);

  const observer=new MutationObserver(()=>{const main=document.querySelector('.main');if(main&&!main.dataset.lmObserved){main.dataset.lmObserved='1';requestAnimationFrame(()=>{main.classList.remove('route-enter');void main.offsetWidth;main.classList.add('route-enter');});}});
  observer.observe(document.documentElement,{subtree:true,childList:true});
})();
