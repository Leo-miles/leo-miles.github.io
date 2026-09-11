(()=>{
  const css=`
/* 上传产品页升级：只调整视觉与辅助交互，不改变原字段与业务逻辑 */
.upload{max-width:1050px!important;padding-bottom:90px}
.upload .section{padding:28px 30px!important;border-radius:22px!important;margin-bottom:18px!important;background:rgba(255,255,255,.96)!important;box-shadow:0 10px 30px rgba(49,119,177,.045)!important}
.upload .section h3{font-size:18px!important;margin:0 0 18px!important;color:#0a2140!important;display:flex;align-items:center;gap:10px}
.upload .section h3:before{content:'';width:4px;height:18px;border-radius:4px;background:linear-gradient(180deg,#1677ff,#58d8ff);display:inline-block}
.upload .two{grid-template-columns:minmax(0,1.35fr) minmax(250px,.65fr)!important;gap:20px!important}
.upload .field{margin:0 0 18px!important}
.upload .field:last-child{margin-bottom:0!important}
.upload .field label{color:#0d2a4d!important;margin-bottom:8px!important;font-size:12px!important}
.upload .field input,.upload .field textarea,.upload .field select{min-height:46px!important;border-radius:12px!important;background:#fbfdff!important}
.upload .field textarea{min-height:128px!important}
.upload .field textarea#specs{min-height:300px!important}
.upload .draft-box{margin:0 0 14px!important;padding:11px 14px!important;border-radius:12px!important;background:#f8fbff!important;border-color:#dcecff!important;color:#607083!important}
.upload .draft-box .btn{padding:8px 11px!important;border-radius:9px!important}
.upload .drop{padding:34px 24px!important;border-radius:16px!important;background:linear-gradient(145deg,#fbfdff,#f3f9ff)!important;border-color:#bcdcf8!important}
.upload .drop strong{font-size:26px!important;color:#1677ff!important}
.upload .drop small{color:#77889b!important;line-height:1.6!important}
.upload .previews{gap:12px!important;margin-top:14px!important}
.upload .preview-wrap{width:118px!important}
.upload .preview{width:118px!important;height:90px!important;border-radius:11px!important;background:#eef6ff!important;border:1px solid #dcecff!important}
.upload .video-meta{background:#f8fbff!important;padding:4px 5px!important;border-radius:6px!important}
.upload .hint{padding:10px 12px!important;background:#f7fbff!important;border-radius:10px!important;border:1px solid #e5f0fb!important}
.upload .actions{position:sticky;bottom:16px;z-index:8;justify-content:flex-end!important;padding:12px 14px!important;margin:10px 0 0!important;border:1px solid #dcecff!important;background:rgba(255,255,255,.94)!important;backdrop-filter:blur(14px)!important;border-radius:16px!important;box-shadow:0 12px 35px rgba(31,110,183,.10)!important}
.upload .actions .btn{min-width:108px!important}
.upload .save-state{margin-right:auto!important;color:#7c8c9c!important}
.upload .lm-upload-guide{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 18px}
.upload .lm-upload-guide-item{display:flex;gap:9px;align-items:flex-start;padding:12px;border:1px solid #e1edf8;border-radius:13px;background:#fafdff}
.upload .lm-upload-guide-item b{display:block;font-size:12px;color:#17385f;margin-bottom:3px}
.upload .lm-upload-guide-item span{font-size:11px;color:#8292a2;line-height:1.5}
.upload .lm-upload-topnote{margin:0 0 16px;padding:12px 15px;border:1px solid #dcecff;border-radius:14px;background:linear-gradient(90deg,#f5faff,#fbfdff);font-size:12px;color:#61758a}
.upload .lm-upload-topnote strong{color:#0c4f96}
@media(max-width:760px){.upload .two{grid-template-columns:1fr!important}.upload .lm-upload-guide{grid-template-columns:1fr}.upload .section{padding:22px 18px!important}.upload .actions{bottom:10px;flex-wrap:wrap}.upload .actions .btn{flex:1;min-width:120px!important}}
`;
  const style=document.createElement('style');style.id='leomiles-upload-ui-enhancements';style.textContent=css;document.head.appendChild(style);

  function pageIsUpload(){return !!document.getElementById('uploadForm') || document.querySelector('.upload')?.querySelector('#category')}
  function addGuide(){
    const root=document.querySelector('.upload');if(!root||root.querySelector('.lm-upload-guide'))return;
    const first=root.querySelector('.section');if(!first)return;
    const guide=document.createElement('div');guide.className='lm-upload-guide';
    guide.innerHTML=`<div class="lm-upload-guide-item"><div>①</div><div><b>先填基础信息</b><span>名称、编号、类目和产品简介</span></div></div><div class="lm-upload-guide-item"><div>②</div><div><b>再补充产品资料</b><span>图片、视频、卖点和详细参数</span></div></div><div class="lm-upload-guide-item"><div>③</div><div><b>最后保存或发布</b><span>草稿会自动保留，已发布产品进入销售端</span></div></div>`;
    first.before(guide);
    const note=document.createElement('div');note.className='lm-upload-topnote';note.innerHTML='<strong>上传提示：</strong> 产品资料填写过程中可以直接切换页面，系统会继续保留未完成内容。';guide.after(note);
  }
  function improveHead(){
    const root=document.querySelector('.upload');if(!root)return;
    const head=root.closest('.page')?.querySelector('.head');if(!head)return;
    const p=head.querySelector('p');if(p)p.textContent='集中录入产品资料、图片与商务信息，完成后可保存草稿或发布。';
  }
  function polishDraft(){
    const draft=document.querySelector('.upload .draft-box');if(!draft)return;
    const text=draft.querySelector('span')||draft.firstElementChild;if(text&&text.textContent.includes('检测到'))text.textContent='检测到上次未完成的产品资料，已自动恢复并保留。';
  }
  function polishUpload(){
    if(!pageIsUpload())return;
    addGuide();improveHead();polishDraft();
  }
  function boot(){
    let n=0;const timer=setInterval(()=>{polishUpload();if(++n>50)clearInterval(timer)},160);
    document.addEventListener('click',()=>setTimeout(polishUpload,80),true);
  }
  boot();
})();