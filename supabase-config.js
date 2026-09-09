window.LEOMILES_SUPABASE_URL='https://zzkujghfxbjafvmlkwqz.supabase.co';
window.LEOMILES_SUPABASE_PUBLISHABLE_KEY='sb_publishable_LYoWqn32khuKfipDWW40MQ_ggoW0FGf';

/* LEOMILES visual theme: CSS only. No observers, global event hooks, or continuous JS animation. */
(()=>{
  const css=`
:root{
  --lm-blue:#1677ff;
  --lm-cyan:#5fe0ff;
  --lm-ink:#071426;
}
html,body{
  background:linear-gradient(180deg,#fafdff 0%,#eef6ff 100%)!important;
  color:var(--lm-ink)!important;
}
.login{
  background:radial-gradient(circle at 78% 12%,rgba(63,169,255,.22),transparent 30%),
             radial-gradient(circle at 10% 88%,rgba(95,224,255,.16),transparent 28%),
             linear-gradient(145deg,#fafdff,#eaf5ff)!important;
}
.sidebar{
  background:rgba(255,255,255,.94)!important;
  border-right:1px solid rgba(110,184,255,.25)!important;
  box-shadow:8px 0 28px rgba(38,121,214,.05)!important;
}
.side-logo,.logo{
  background:linear-gradient(145deg,#06152c,#1677ff 62%,#59d8ff)!important;
  box-shadow:0 8px 22px rgba(22,119,255,.2)!important;
}
.sidebrand{color:#0b2344!important}
.nav button{transition:background .14s ease,color .14s ease!important}
.nav button.active,.nav button:hover{
  background:linear-gradient(90deg,rgba(28,125,255,.10),rgba(95,224,255,.04))!important;
  color:#0b4fa8!important;
  box-shadow:inset 3px 0 0 var(--lm-blue)!important;
}
.top{
  background:rgba(255,255,255,.94)!important;
  border-bottom:1px solid rgba(103,178,255,.20)!important;
  box-shadow:0 6px 20px rgba(31,110,183,.04)!important;
}
.head h2{
  background:linear-gradient(90deg,#071426,#1677ff 58%,#35bfe9);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent!important;
}
.btn,.tiny,.chip,.gallery-toggle{
  transition:background .14s ease,border-color .14s ease,box-shadow .14s ease!important;
  border-color:#d7e9fb!important;
}
.btn:hover,.tiny:hover,.gallery-toggle:hover{
  box-shadow:0 6px 18px rgba(22,119,255,.08)!important;
  border-color:#9bcfff!important;
}
.btn.dark,.tiny.dark,.primary{
  background:linear-gradient(135deg,#0a1d38,#1677ff 68%,#52d7ff)!important;
  border-color:transparent!important;
}
.product,.section,.media-gallery,.card{
  border-color:rgba(115,183,238,.23)!important;
  box-shadow:0 12px 34px rgba(49,119,177,.055)!important;
}
.product{transition:transform .16s ease,box-shadow .16s ease,border-color .16s ease!important}
.product:hover{
  transform:translateY(-2px)!important;
  box-shadow:0 16px 38px rgba(22,119,255,.09)!important;
  border-color:rgba(81,170,255,.30)!important;
}
.pimg{
  background:radial-gradient(circle at 50% 45%,#ffffff 0%,#eef7ff 62%,#e2f1ff 100%)!important;
}
.tag{
  background:#edf7ff!important;
  color:#0b74ce!important;
  box-shadow:inset 0 0 0 1px #cfeaff;
}
.search input,.field input,.field textarea,.field select{
  border-color:#d6e8fa!important;
  background:rgba(255,255,255,.92)!important;
  transition:box-shadow .14s ease,border-color .14s ease!important;
}
.search input:focus,.field input:focus,.field textarea:focus,.field select:focus{
  border-color:#62b3ff!important;
  box-shadow:0 0 0 3px rgba(73,165,255,.10)!important;
}
.hero{
  border:1px solid rgba(91,177,247,.22)!important;
  background:radial-gradient(circle at 50% 30%,#ffffff 0%,#eff8ff 62%,#e2f2ff 100%)!important;
  box-shadow:inset 0 0 40px rgba(80,171,248,.05),0 12px 32px rgba(46,125,187,.05)!important;
}
.hero:after{display:none!important}
.media-gallery{background:rgba(255,255,255,.94)!important}
.image-stack,.image-grid-item,.video-grid-item{
  border-color:rgba(100,178,238,.18)!important;
  background:linear-gradient(145deg,#fafdff,#edf7ff)!important;
}
.stack-card{box-shadow:0 10px 28px rgba(26,109,174,.10)!important}
.stack-card:hover{box-shadow:0 14px 32px rgba(22,119,255,.12)!important}
.stack-badge{background:linear-gradient(135deg,#081b34,#1677ff 70%,#43d3ff)!important}
.saleshero{
  background:linear-gradient(135deg,#061326,#0a3164 58%,#0d8fcc)!important;
  box-shadow:0 18px 46px rgba(13,104,177,.12)!important;
}
.saleshero:after{display:none!important}
.toast{background:linear-gradient(135deg,#071426,#1677ff 70%,#39d5ff)!important}
.login-card{
  border:1px solid rgba(89,179,255,.24)!important;
  box-shadow:0 22px 60px rgba(28,112,184,.10)!important;
}
.login-card:before{display:none!important}
.primary{box-shadow:0 8px 20px rgba(22,119,255,.16)!important}
.primary:hover{box-shadow:0 10px 24px rgba(22,119,255,.20)!important}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
}
`;
  const style=document.createElement('style');
  style.id='leomiles-light-theme';
  style.textContent=css;
  document.head.appendChild(style);
})();
