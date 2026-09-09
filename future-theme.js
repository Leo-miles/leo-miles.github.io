(()=>{
  const css=`
:root{--fx-blue:#1677ff;--fx-cyan:#49d7ff;--fx-deep:#06152f;--fx-line:rgba(45,156,255,.22);--fx-glass:rgba(255,255,255,.72);--fx-shadow:0 24px 70px rgba(10,73,150,.16)}
html{scroll-behavior:smooth}
body{background:radial-gradient(circle at 15% 10%,rgba(64,180,255,.18),transparent 28%),radial-gradient(circle at 88% 12%,rgba(74,118,255,.16),transparent 26%),linear-gradient(180deg,#f8fbff 0%,#edf5ff 48%,#f7fbff 100%);position:relative}
body:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.28;background-image:linear-gradient(rgba(31,129,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(31,129,255,.06) 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,rgba(0,0,0,.75),transparent 88%)}
body:after{content:"";position:fixed;left:0;right:0;top:-8vh;height:24vh;pointer-events:none;z-index:1;background:linear-gradient(180deg,transparent,rgba(61,193,255,.06),transparent);animation:fxScan 8s linear infinite}
.app,.login{position:relative;z-index:2}
.sidebar{background:linear-gradient(180deg,rgba(255,255,255,.88),rgba(248,252,255,.76));border-right:1px solid rgba(76,151,255,.18);box-shadow:8px 0 30px rgba(28,108,214,.06);backdrop-filter:blur(22px)}
.sidebrand{position:relative}.sidebrand:after{content:"";position:absolute;left:10px;right:10px;bottom:14px;height:1px;background:linear-gradient(90deg,transparent,rgba(30,136,255,.35),transparent)}
.side-logo{background:linear-gradient(135deg,#0b1730,#1677ff 70%,#4bdcff);box-shadow:0 0 0 1px rgba(90,205,255,.25),0 0 26px rgba(32,132,255,.28)}
.nav button{position:relative;overflow:hidden;transition:transform .25s ease,background .25s ease,color .25s ease,box-shadow .25s ease;padding-left:15px}
.nav button:before{content:"";position:absolute;left:0;top:50%;width:3px;height:0;border-radius:4px;background:linear-gradient(#61d8ff,#1978ff);transform:translateY(-50%);transition:height .28s ease,box-shadow .28s ease}
.nav button.active{background:linear-gradient(90deg,rgba(28,125,255,.13),rgba(63,191,255,.05));color:#075ec7;box-shadow:inset 0 0 24px rgba(51,150,255,.06),0 0 0 1px rgba(32,128,255,.07)}
.nav button.active:before{height:70%;box-shadow:0 0 14px rgba(53,174,255,.75)}
.nav button:hover{transform:translateX(3px);color:#075ec7}
.top{background:rgba(255,255,255,.72);border-bottom:1px solid rgba(63,145,255,.16);box-shadow:0 10px 32px rgba(20,103,214,.05);backdrop-filter:blur(22px)}
.top:after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(60,193,255,.5),rgba(28,121,255,.65),transparent);opacity:.65}
.page{animation:pageIn .6s cubic-bezier(.18,.82,.22,1);transform-origin:50% 8%;position:relative}
.page:before{content:"";position:absolute;left:-8%;right:-8%;top:-16px;height:1px;background:linear-gradient(90deg,transparent,rgba(78,206,255,.7),rgba(38,124,255,.5),transparent);filter:blur(.2px);opacity:.55;animation:pageLine .8s ease both}
.head h2{background:linear-gradient(90deg,#0b1938,#146cff 58%,#27a9ff);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 26px rgba(56,161,255,.12)}
.card,.product,.section,.media-gallery{box-shadow:var(--fx-shadow);border-color:rgba(70,145,255,.14);backdrop-filter:blur(16px)}
.product,.section,.media-gallery{position:relative;overflow:hidden}
.product:before,.section:before,.media-gallery:before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(120deg,transparent 20%,rgba(65,177,255,.08) 48%,transparent 76%);transform:translateX(-110%);transition:transform .7s ease}
.product:hover:before,.section:hover:before,.media-gallery:hover:before{transform:translateX(110%)}
.product:hover{border-color:rgba(44,151,255,.28);box-shadow:0 24px 58px rgba(24,114,221,.15),0 0 0 1px rgba(50,161,255,.06);transform:translateY(-5px) scale(1.008)}
.pimg{background:radial-gradient(circle at 50% 35%,rgba(88,199,255,.13),transparent 38%),linear-gradient(135deg,#eaf4ff,#ffffff);position:relative}
.pimg:after{content:"";position:absolute;inset:9px;border-radius:14px;border:1px solid rgba(45,153,255,.1);box-shadow:inset 0 0 24px rgba(52,160,255,.045)}
.btn,.tiny,.gallery-toggle,.primary{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease;position:relative;overflow:hidden}
.btn:hover,.tiny:hover,.gallery-toggle:hover{transform:translateY(-2px);border-color:rgba(37,136,255,.38);box-shadow:0 10px 28px rgba(24,117,224,.13)}
.btn.dark,.tiny.dark,.primary{background:linear-gradient(135deg,#0a1940,#116cff 55%,#1bc5ff);border-color:transparent;box-shadow:0 10px 28px rgba(28,116,255,.24)}
.btn.dark:hover,.tiny.dark:hover,.primary:hover{box-shadow:0 14px 34px rgba(28,116,255,.32),0 0 24px rgba(60,194,255,.16)}
.btn:after,.tiny:after,.primary:after,.gallery-toggle:after{content:"";position:absolute;top:0;bottom:0;left:-45%;width:28%;transform:skewX(-24deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);transition:left .55s ease;pointer-events:none}
.btn:hover:after,.tiny:hover:after,.primary:hover:after,.gallery-toggle:hover:after{left:125%}
.search input,.field input,.field textarea,.field select{border-color:rgba(75,151,255,.18);box-shadow:0 4px 18px rgba(33,112,217,.035);transition:border-color .2s,box-shadow .2s,transform .2s}
.search input:focus,.field input:focus,.field textarea:focus,.field select:focus{border-color:rgba(35,137,255,.6);box-shadow:0 0 0 4px rgba(43,151,255,.1),0 10px 28px rgba(32,114,219,.08);transform:translateY(-1px)}
.hero{position:relative;background:radial-gradient(circle at 50% 45%,rgba(78,201,255,.14),transparent 32%),linear-gradient(135deg,#eaf4ff,#f8fcff);box-shadow:inset 0 0 70px rgba(36,134,255,.08),0 20px 55px rgba(20,99,210,.1);border:1px solid rgba(70,157,255,.18)}
.hero:before,.image-stack:before{content:"";position:absolute;inset:12px;border:1px solid rgba(61,181,255,.13);border-radius:20px;pointer-events:none;box-shadow:inset 0 0 30px rgba(60,174,255,.04)}
.hero:after{content:"";position:absolute;left:7%;right:7%;bottom:7%;height:28%;background:linear-gradient(180deg,transparent,rgba(67,185,255,.08));filter:blur(18px);pointer-events:none}
.media-gallery{background:rgba(255,255,255,.72)}
.image-stack{background:radial-gradient(circle at 50% 45%,rgba(67,185,255,.13),transparent 38%),linear-gradient(135deg,#edf6ff,#f9fcff);box-shadow:inset 0 0 38px rgba(41,143,255,.06)}
.stack-card{border-color:rgba(64,152,255,.22);box-shadow:0 20px 42px rgba(21,102,202,.15),0 0 0 1px rgba(79,188,255,.08)}
.stack-card:hover{box-shadow:0 26px 55px rgba(20,102,210,.23),0 0 25px rgba(58,187,255,.18);filter:saturate(1.04)}
.stack-badge,.tag{box-shadow:0 7px 20px rgba(12,94,190,.14)}
.saleshero{position:relative;overflow:hidden;background:radial-gradient(circle at 75% 15%,rgba(76,202,255,.28),transparent 24%),radial-gradient(circle at 10% 90%,rgba(51,112,255,.24),transparent 26%),linear-gradient(135deg,#071734,#0a2a61 52%,#0b69be);box-shadow:0 28px 70px rgba(5,58,130,.22)}
.saleshero:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 25%,rgba(105,223,255,.08) 45%,transparent 65%);animation:heroSweep 5.5s ease-in-out infinite}
.saleshero:after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg,transparent,#4bdcff,#2278ff,transparent);box-shadow:0 0 18px rgba(75,220,255,.75)}
.login{background:radial-gradient(circle at 20% 15%,rgba(47,160,255,.2),transparent 28%),radial-gradient(circle at 85% 80%,rgba(92,119,255,.18),transparent 28%),linear-gradient(180deg,#f8fcff,#edf5ff 65%,#f8fbff)}
.login-card{box-shadow:0 35px 90px rgba(21,100,203,.16),0 0 0 1px rgba(78,160,255,.12);position:relative;overflow:hidden}
.login-card:before{content:"";position:absolute;inset:-20%;background:conic-gradient(from 90deg,transparent 0deg,rgba(42,161,255,.08) 55deg,transparent 110deg,transparent 230deg,rgba(80,215,255,.08) 290deg,transparent 330deg);animation:spinFx 12s linear infinite;pointer-events:none}
.login-card>*{position:relative;z-index:2}
.logo{box-shadow:0 0 0 1px rgba(70,176,255,.2),0 0 28px rgba(55,163,255,.22)}
.toast{background:linear-gradient(135deg,#071735,#0d4da8,#1598e7);box-shadow:0 18px 44px rgba(12,80,166,.3),0 0 0 1px rgba(97,210,255,.22);border:1px solid rgba(100,215,255,.2)}
.fx-overlay{position:fixed;inset:0;z-index:100;pointer-events:none;overflow:hidden;opacity:0}
.fx-overlay.active{animation:overlayFlash .75s ease}
.fx-overlay:before{content:"";position:absolute;left:-10%;right:-10%;top:48%;height:2px;background:linear-gradient(90deg,transparent,#5ce9ff 35%,#3a83ff 50%,#5ce9ff 65%,transparent);box-shadow:0 0 20px #4ddcff,0 0 55px rgba(51,155,255,.6);transform:scaleX(.15);opacity:0}
.fx-overlay.active:before{animation:scanBeam .72s cubic-bezier(.2,.8,.2,1)}
.fx-overlay:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,rgba(55,180,255,.16),transparent 28%);opacity:0}
.fx-overlay.active:after{animation:flashGlow .72s ease}
.fx-ripple{position:fixed;width:16px;height:16px;border:1px solid rgba(68,215,255,.85);border-radius:50%;pointer-events:none;z-index:120;box-shadow:0 0 12px rgba(53,185,255,.8),inset 0 0 8px rgba(66,216,255,.55);transform:translate(-50%,-50%) scale(.2);animation:rippleFx .65s cubic-bezier(.18,.8,.24,1) forwards}
@keyframes pageIn{0%{opacity:0;transform:translateY(18px) scale(.985);filter:blur(8px)}60%{opacity:1;transform:translateY(-3px) scale(1);filter:blur(0)}100%{transform:translateY(0)}}
@keyframes pageLine{0%{transform:scaleX(.1);opacity:0}100%{transform:scaleX(1);opacity:.55}}
@keyframes overlayFlash{0%{opacity:0}12%{opacity:1}55%{opacity:.75}100%{opacity:0}}
@keyframes scanBeam{0%{transform:translateY(35vh) scaleX(.08);opacity:0}18%{opacity:1}100%{transform:translateY(-42vh) scaleX(1);opacity:0}}
@keyframes flashGlow{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
@keyframes rippleFx{0%{opacity:1;transform:translate(-50%,-50%) scale(.2)}100%{opacity:0;transform:translate(-50%,-50%) scale(8)}}
@keyframes fxScan{0%{transform:translateY(-35vh);opacity:0}15%{opacity:.35}50%{opacity:.12}100%{transform:translateY(120vh);opacity:0}}
@keyframes heroSweep{0%,100%{transform:translateX(-55%)}50%{transform:translateX(55%)}}
@keyframes spinFx{to{transform:rotate(360deg)}}
@media(max-width:620px){body:before{background-size:22px 22px;opacity:.22}.page{animation-duration:.5s}.hero{box-shadow:inset 0 0 48px rgba(36,134,255,.08),0 14px 32px rgba(20,99,210,.08)}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.fx-overlay,.fx-ripple{display:none!important}}
`;
  const style=document.createElement('style');style.id='future-theme-style';style.textContent=css;document.head.appendChild(style);
  const ready=()=>{
    const app=document.getElementById('app');
    const overlay=document.createElement('div');overlay.className='fx-overlay';document.body.appendChild(overlay);
    let lastHtml='';
    const playTransition=()=>{overlay.classList.remove('active');void overlay.offsetWidth;overlay.classList.add('active')};
    const observe=()=>{if(!app)return;const obs=new MutationObserver(()=>{const html=app.innerHTML;if(html===lastHtml)return;lastHtml=html;const page=app.querySelector('.page');if(page){page.classList.remove('fx-page-enter');void page.offsetWidth;page.classList.add('fx-page-enter');playTransition()}});obs.observe(app,{childList:true,subtree:true});};
    observe();
    document.addEventListener('click',e=>{const b=e.target.closest('button,.btn,.tiny,.chip,.more,.gallery-toggle,.product,.nav button');if(!b)return;const r=b.getBoundingClientRect();const ring=document.createElement('span');ring.className='fx-ripple';ring.style.left=(e.clientX||r.left+r.width/2)+'px';ring.style.top=(e.clientY||r.top+r.height/2)+'px';document.body.appendChild(ring);setTimeout(()=>ring.remove(),700);if(b.matches('.nav button,.more,.btn.dark,.tiny.dark,.chip,.gallery-toggle'))playTransition()},true);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){overlay.classList.remove('active')}});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
