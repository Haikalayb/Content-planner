var KEY="content-planner-v1",STAT=["Ide","Take Video","Editing","Tayang"],S={konten:[],endo:[]},F={p:"Semua",s:"Semua"},editK=null,editE=null;
function iso(n){var d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function seed(){return{konten:[
{id:1,judul:"Tips hemat bulanan",platform:"Reels",status:"Ide",tanggal:iso(12),endoId:null},
{id:2,judul:"Review skincare X",platform:"TikTok",status:"Ide",tanggal:iso(9),endoId:1},
{id:3,judul:"Unboxing gadget",platform:"TikTok",status:"Take Video",tanggal:iso(3),endoId:null},
{id:4,judul:"Vlog ngopi",platform:"Reels",status:"Take Video",tanggal:iso(6),endoId:null},
{id:5,judul:"Review Brand Y",platform:"TikTok",status:"Editing",tanggal:iso(1),endoId:2},
{id:6,judul:"OOTD kampus",platform:"Reels",status:"Editing",tanggal:iso(2),endoId:null},
{id:7,judul:"Haul belanja",platform:"TikTok",status:"Tayang",tanggal:iso(-2),endoId:3}],
endo:[{id:1,brand:"Brand X",nilai:2500000,deadline:iso(9),statusBayar:"Belum dibayar",tanggalBayar:null},
{id:2,brand:"Brand Y",nilai:1800000,deadline:iso(1),statusBayar:"DP",tanggalBayar:null},
{id:3,brand:"Brand Z",nilai:3000000,deadline:iso(-2),statusBayar:"Lunas",tanggalBayar:iso(-1)}]}}
function load(){try{var r=localStorage.getItem(KEY);if(r){S=JSON.parse(r);return}}catch(e){}S=seed()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function rp(n){return "Rp "+Number(n).toLocaleString("id-ID")}
function sisa(t){var a=new Date().setHours(0,0,0,0),b=new Date(t).setHours(0,0,0,0);return Math.ceil((b-a)/864e5)}
function badge(n){var c=n<=2?"b-er":n<=5?"b-wr":"b-ok";var t=n<0?"Terlambat "+(-n)+" hari":n===0?"Hari ini":n+" hari lagi";return '<span class="badge '+c+'">'+t+'</span>'}
function endoOf(id){return S.endo.find(function(e){return e.id===id})}
function nid(a){return a.reduce(function(m,x){return Math.max(m,x.id)},0)+1}
function tgl(t){return new Date(t).toLocaleDateString("id-ID",{day:"numeric",month:"short"})}

function render(){
var lunas=S.endo.filter(function(e){return e.statusBayar==="Lunas"}).reduce(function(a,e){return a+e.nilai},0);
var pend=S.endo.filter(function(e){return e.statusBayar!=="Lunas"}).reduce(function(a,e){return a+e.nilai},0);
var urg=S.konten.filter(function(k){return k.status!=="Tayang"&&sisa(k.tanggal)<=2}).length;
var tay=S.konten.filter(function(k){return k.status==="Tayang"}).length;
document.getElementById("stats").innerHTML=[["Sudah lunas",rp(lunas)],["Belum masuk",rp(pend)],["Konten mendesak",urg],["Sudah tayang",tay]].map(function(s){return '<div class="stat"><span>'+s[0]+'</span><b>'+s[1]+'</b></div>'}).join("");

document.getElementById("filters").innerHTML=["Semua","TikTok","Reels"].map(function(p){return '<button class="pill'+(F.p===p?" on":"")+'" data-p="'+p+'">'+p+'</button>'}).join("")+
'<select id="fs"><option>Semua</option>'+STAT.map(function(s){return '<option'+(F.s===s?" selected":"")+'>'+s+'</option>'}).join("")+'</select>';

var list=S.konten.filter(function(k){return(F.p==="Semua"||k.platform===F.p)&&(F.s==="Semua"||k.status===F.s)}).sort(function(a,b){return a.tanggal<b.tanggal?-1:1});
document.getElementById("board").innerHTML=STAT.map(function(s,i){
var items=list.filter(function(k){return k.status===s});
return '<div class="col"><h3>'+s+'<span class="meta">'+items.length+'</span></h3>'+(items.length?items.map(function(k){
var e=k.endoId?endoOf(k.endoId):null;
return '<div class="card '+(k.platform==="TikTok"?"tt":"ig")+'"><p>'+esc(k.judul)+'</p><div class="meta">'+k.platform+' · '+tgl(k.tanggal)+(e?' · '+esc(e.brand):'')+'</div>'+
(k.status==="Tayang"?'<span class="badge b-n">Sudah tayang</span>':badge(sisa(k.tanggal)))+
'<div class="acts">'+(i>0?'<button class="sm" data-mv="'+k.id+'" data-d="-1" aria-label="Mundur satu tahap">‹</button>':'')+(i<3?'<button class="sm" data-mv="'+k.id+'" data-d="1" aria-label="Maju satu tahap">›</button>':'')+'<button class="sm" data-ek="'+k.id+'">Ubah</button><button class="sm" data-dk="'+k.id+'">Hapus</button></div></div>'}).join(""):'<div class="empty">Belum ada konten di tahap ini.</div>')+'</div>'}).join("");

document.getElementById("endo").innerHTML=S.endo.length?S.endo.map(function(e){
return '<div class="row"><div><b>'+esc(e.brand)+'</b><div class="meta">Deadline '+tgl(e.deadline)+'</div></div><div>'+rp(e.nilai)+'</div><div>'+(e.statusBayar==="Lunas"?'<span class="badge b-ok" style="margin:0">Sudah lunas</span>':badge(sisa(e.deadline)))+'</div>'+
'<div><select data-pay="'+e.id+'">'+["Belum dibayar","DP","Lunas"].map(function(s){return '<option'+(e.statusBayar===s?" selected":"")+'>'+s+'</option>'}).join("")+'</select></div>'+
'<div class="acts" style="margin:0"><button class="sm" data-ee="'+e.id+'">Ubah</button><button class="sm" data-de="'+e.id+'">Hapus</button></div></div>'}).join(""):'<div class="empty">Belum ada endorsement. Tambahkan yang pertama lewat tombol di atas.</div>';

var m={};S.endo.forEach(function(e){if(e.statusBayar==="Lunas"){var k=(e.tanggalBayar||e.deadline).slice(0,7);m[k]=(m[k]||0)+e.nilai}});
var keys=[];for(var i=5;i>=0;i--){var d=new Date();d.setDate(1);d.setMonth(d.getMonth()-i);keys.push(d.toISOString().slice(0,7))}
var mx=Math.max.apply(null,keys.map(function(k){return m[k]||0}).concat([1]));
document.getElementById("bars").innerHTML=keys.map(function(k){var v=m[k]||0;return '<div><i style="height:'+Math.round(v/mx*100)+'px" title="'+rp(v)+'"></i>'+new Date(k+"-01").toLocaleDateString("id-ID",{month:"short"})+'</div>'}).join("");
var bt={};S.endo.forEach(function(e){bt[e.brand]=bt[e.brand]||{l:0,p:0};bt[e.brand][e.statusBayar==="Lunas"?"l":"p"]+=e.nilai});
var bn=Object.keys(bt);
document.getElementById("brands").innerHTML=bn.length?bn.map(function(b){return '<div class="li"><span>'+esc(b)+'</span><span class="meta">Lunas '+rp(bt[b].l)+' · Belum '+rp(bt[b].p)+'</span></div>'}).join(""):'<div class="empty">Belum ada data.</div>';
}

function openK(k){editK=k?k.id:null;var f=document.getElementById("fK");document.getElementById("tK").textContent=k?"Ubah konten":"Konten baru";
document.getElementById("selE").innerHTML='<option value="">Tanpa endorsement</option>'+S.endo.map(function(e){return '<option value="'+e.id+'">'+esc(e.brand)+'</option>'}).join("");
f.judul.value=k?k.judul:"";f.platform.value=k?k.platform:"TikTok";f.status.value=k?k.status:"Ide";f.tanggal.value=k?k.tanggal:iso(7);f.endoId.value=k&&k.endoId?k.endoId:"";document.getElementById("dK").showModal()}
function openE(e){editE=e?e.id:null;var f=document.getElementById("fE");document.getElementById("tE").textContent=e?"Ubah endorsement":"Endorsement baru";
f.brand.value=e?e.brand:"";f.nilai.value=e?e.nilai:"";f.deadline.value=e?e.deadline:iso(7);f.statusBayar.value=e?e.statusBayar:"Belum dibayar";document.getElementById("dE").showModal()}
function setPay(e,s){e.statusBayar=s;e.tanggalBayar=s==="Lunas"?(e.tanggalBayar||iso(0)):null}
function done(){save();render()}

document.getElementById("addK").onclick=function(){openK(null)};
document.getElementById("addE").onclick=function(){openE(null)};
document.querySelectorAll("[data-close]").forEach(function(b){b.onclick=function(){b.closest("dialog").close()}});
document.getElementById("fK").onsubmit=function(){var f=this,o={judul:f.judul.value.trim(),platform:f.platform.value,status:f.status.value,tanggal:f.tanggal.value,endoId:f.endoId.value?+f.endoId.value:null};
if(editK){Object.assign(S.konten.find(function(k){return k.id===editK}),o)}else{o.id=nid(S.konten);S.konten.push(o)}done()};
document.getElementById("fE").onsubmit=function(){var f=this,o={brand:f.brand.value.trim(),nilai:+f.nilai.value,deadline:f.deadline.value};
var e;if(editE){e=S.endo.find(function(x){return x.id===editE});Object.assign(e,o)}else{o.id=nid(S.endo);o.tanggalBayar=null;e=o;S.endo.push(o)}setPay(e,f.statusBayar.value);done()};
document.addEventListener("click",function(ev){var t=ev.target,a;
if(a=t.dataset.p){F.p=a;render()}
else if(a=t.dataset.mv){var k=S.konten.find(function(x){return x.id===+a});k.status=STAT[STAT.indexOf(k.status)+ +t.dataset.d];done()}
else if(a=t.dataset.ek){openK(S.konten.find(function(x){return x.id===+a}))}
else if(a=t.dataset.dk){if(confirm("Hapus konten ini?")){S.konten=S.konten.filter(function(x){return x.id!==+a});done()}}
else if(a=t.dataset.ee){openE(endoOf(+a))}
else if(a=t.dataset.de){if(confirm("Hapus endorsement ini?")){S.endo=S.endo.filter(function(x){return x.id!==+a});S.konten.forEach(function(k){if(k.endoId===+a)k.endoId=null});done()}}});
document.addEventListener("change",function(ev){var t=ev.target;
if(t.id==="fs"){F.s=t.value;render()}
else if(t.dataset.pay){setPay(endoOf(+t.dataset.pay),t.value);done()}});
document.getElementById("reset").onclick=function(){if(confirm("Kembalikan semua data ke contoh awal?")){S=seed();done()}};
load();render();
