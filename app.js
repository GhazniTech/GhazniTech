const CONFIG = { url: https://dfompmqpkkbyauzkypfh.supabase.co, key: sb_publishable_YCOOcFrgEfSKzZ-ZVlkf2w_C8X1Vwvi };
let sb=null, tasks=[];
const $=id=>document.getElementById(id);
const faDigits=s=>String(s).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
function gregorianToJalali(gy,gm,gd){let gdm=[0,31,59,90,120,151,181,212,243,273,304,334];let gy2=gm>2?gy+1:gy;let days=355666+365*gy+Math.floor((gy2+3)/4)-Math.floor((gy2+99)/100)+Math.floor((gy2+399)/400)+gd+gdm[gm-1];let jy=-1595+33*Math.floor(days/12053);days%=12053;jy+=4*Math.floor(days/1461);days%=1461;if(days>365){jy+=Math.floor((days-1)/365);days=(days-1)%365}let jm=days<186?1+Math.floor(days/31):7+Math.floor((days-186)/30);let jd=1+(days<186?days%31:(days-186)%30);return[jy,jm,jd]}
function jalaliToday(){let d=new Date();let j=gregorianToJalali(d.getFullYear(),d.getMonth()+1,d.getDate());return `${faDigits(j[0])}/${faDigits(String(j[1]).padStart(2,"0"))}/${faDigits(String(j[2]).padStart(2,"0"))}`}
function currentRegistration(){
  const d=new Date();
  const j=gregorianToJalali(d.getFullYear(),d.getMonth()+1,d.getDate());
  let h=d.getHours(), m=d.getMinutes();
  const ap=h>=12?"PM":"AM"; h=h%12||12;
  return {
    jalali_date:`${j[0]}/${String(j[1]).padStart(2,"0")}/${String(j[2]).padStart(2,"0")}`,
    time:`${String(d.getHours()).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`,
    display:`${faDigits(j[0])}/${faDigits(String(j[1]).padStart(2,"0"))}/${faDigits(String(j[2]).padStart(2,"0"))} — ${faDigits(h)}:${faDigits(String(m).padStart(2,"0"))} ${ap}`
  };
}
function time12(t){if(!t)return "";let [h,m]=t.slice(0,5).split(":").map(Number);let ap=h>=12?"PM":"AM";h=h%12||12;return `${faDigits(h)}:${faDigits(String(m).padStart(2,"0"))} ${ap}`}
function registrationDisplay(v){
  const d=new Date(v);
  if(Number.isNaN(d.getTime())) return "";
  const j=gregorianToJalali(d.getFullYear(),d.getMonth()+1,d.getDate());
  let h=d.getHours(),m=d.getMinutes();
  const ap=h>=12?"PM":"AM"; h=h%12||12;
  return `${faDigits(j[0])}/${faDigits(String(j[1]).padStart(2,"0"))}/${faDigits(String(j[2]).padStart(2,"0"))} — ${faDigits(h)}:${faDigits(String(m).padStart(2,"0"))} ${ap}`;
}
function showToast(x){$("toast").textContent=x;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}
function openModal(t=null){$("taskForm").reset();$("taskId").value=t?.id||"";$("modalTitle").textContent=t?"ویرایش کار":"اضافه کردن کار";$("title").value=t?.title||"";$("details").value=t?.details||"";$("reminder").checked=!!t?.reminder;$("formError").textContent="";$("taskDialog").showModal()}
function closeModal(){$("taskDialog").close()}
function render(){let q=$("search").value.trim().toLowerCase(), f=$("filter").value;let list=tasks.filter(t=>(!q||(t.title+" "+(t.details||"")).toLowerCase().includes(q))&&(f==="all"||(f==="done"?t.done:!t.done)));$("totalCount").textContent=faDigits(tasks.length);$("doneCount").textContent=faDigits(tasks.filter(t=>t.done).length);$("pendingCount").textContent=faDigits(tasks.filter(t=>!t.done).length);$("list").innerHTML=list.map(t=>`<article class="task ${t.done?"done":""}"><button class="check-btn" onclick="toggleTask('${t.id}')"></button><div><div class="task-title">${esc(t.title)}</div>${t.details?`<div class="details">${esc(t.details)}</div>`:""}<div class="meta">${t.reminder?`<span class="pill">🔔 یادآوری</span>`:""}${t.registered_at?`<span class="pill">🕒 ثبت: ${registrationDisplay(t.registered_at)}</span>`:""}</div></div><div class="actions"><button onclick="editTask('${t.id}')">✏️</button><button onclick="deleteTask('${t.id}')">🗑️</button></div></article>`).join("");$("empty").classList.toggle("hidden",list.length>0)}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
async function load(){if(!sb)return;let {data,error}=await sb.from("daily_tasks").select("*").order("done",{ascending:true}).order("task_date",{ascending:true}).order("time",{ascending:true});if(error){showToast("خطا در دریافت اطلاعات");console.error(error);return}tasks=data||[];render()}
async function saveTask(e){e.preventDefault();if(!sb){$("formError").textContent="ابتدا تنظیمات Supabase در app.js را وارد کنید.";return}let id=$("taskId").value;let payload={title:$("title").value.trim(),details:$("details").value.trim()||null,reminder:$("reminder").checked}; if(!id){const now=new Date(); payload.registered_at=now.toISOString(); payload.task_date=now.toISOString().slice(0,10);}if(!id){const now=currentRegistration();payload.registered_at=new Date().toISOString();payload.task_date=new Date().toISOString().slice(0,10);}if(!payload.title)return;$("formError").textContent="در حال ذخیره...";let r=id?await sb.from("daily_tasks").update(payload).eq("id",id):await sb.from("daily_tasks").insert(payload);if(r.error){$("formError").textContent=r.error.message;return}closeModal();showToast("ذخیره شد");await load()}
async function toggleTask(id){let t=tasks.find(x=>x.id===id);if(!t)return;let {error}=await sb.from("daily_tasks").update({done:!t.done}).eq("id",id);if(error)return showToast("خطا");await load()}
async function deleteTask(id){if(!confirm("این کار حذف شود؟"))return;let {error}=await sb.from("daily_tasks").delete().eq("id",id);if(error)return showToast("خطا در حذف");showToast("حذف شد");await load()}
function editTask(id){let t=tasks.find(x=>x.id===id);if(t)openModal(t)}
$("today").textContent=jalaliToday();$("addBtn").onclick=()=>openModal();$("closeBtn").onclick=closeModal;$("cancelBtn").onclick=closeModal;$("taskForm").onsubmit=saveTask;$("search").oninput=render;$("filter").onchange=render;
if(CONFIG.SUPABASE_URL.startsWith("http")&&!CONFIG.SUPABASE_KEY.startsWith("YOUR_")){sb=window.supabase.createClient(CONFIG.SUPABASE_URL,CONFIG.SUPABASE_KEY);load()}else{showToast("Supabase هنوز تنظیم نشده است");render()}
