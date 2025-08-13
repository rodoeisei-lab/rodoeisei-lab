document.addEventListener('DOMContentLoaded',()=>{
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();
  const btn=document.querySelector('.menu-btn'); const nav=document.getElementById('nav');
  if(btn&&nav){btn.addEventListener('click',()=>{
    const open=nav.style.display==='block'; nav.style.display=open?'none':'block';
    btn.setAttribute('aria-expanded',(!open).toString());
  });}
});