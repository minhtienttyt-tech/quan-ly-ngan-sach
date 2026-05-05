// Version 6.0 - Robust Cloud Edition

// ===== DATA =====
const fmt=n=>n==null||n===''?'':Number(n).toLocaleString('vi-VN');
const fmtM=n=>n==null||n===''?'':Number(n).toLocaleString('vi-VN');
function calcKpDuocSD(r){return(+r.dtCapNam||0)+(+r.tonNamTruoc||0)+(+r.kpCapNam||0)-(+r.giamDT||0)+(+r.tangDT||0)-(+r.giuLai10||0);}
function calcConLai(r){return calcKpDuocSD(r)-(+r.daDung||0);}
function getStatus(r){
  const total=calcKpDuocSD(r);
  const used=+r.daDung||0;
  if(total===0&&used===0)return'zero';
  if(used>total)return'danger';
  if(total>0&&used/total>=0.8)return'warning';
  return'good';
}
function updateFormSuggestions() {
  const mucs = new Set();
  const tieumucs = new Set();
  const noidungs = new Set();

  items.forEach(item => {
    if (!item.isGroupHeader) {
      if (item.muc) mucs.add(item.muc);
      if (item.tieumuc) tieumucs.add(item.tieumuc);
      if (item.noidung) noidungs.add(item.noidung);
    }
  });

  const populate = (id, set) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = Array.from(set).map(val => `<option value="${val}">`).join('');
    }
  };

  populate('mucSuggestions', mucs);
  populate('tieumucSuggestions', tieumucs);
  populate('noidungSuggestions', noidungs);
}

function statusBadge(r){
  const s=getStatus(r);
  const map={good:['status-good','✅ Bình thường'],warning:['status-warning','⚠️ Cảnh báo'],danger:['status-danger','🔴 Vượt KP'],zero:['status-zero','🔵 Chưa dùng']};
  const [cls,lbl]=map[s];
  return`<span class="status-badge ${cls}">${lbl}</span>`;
}
const DEFAULT_DATA=[
  {id:1,group:'KP THƯỜNG XUYÊN',muc:'I',tieumuc:'',noidung:'KP THƯỜNG XUYÊN',isGroupHeader:true,dtCapNam:22209000000,tonNamTruoc:0,kpCapNam:4889291112,giamDT:0,tangDT:0,daDung:23354912653,hanDate:'31/12/2025'},
  {id:2,group:'KP THƯỜNG XUYÊN',muc:'1',tieumuc:'13',noidung:'KP chi lương, PC lương và CKBG',isGroupHeader:false,dtCapNam:18822000000,tonNamTruoc:0,kpCapNam:4027291112,giamDT:0,tangDT:0,daDung:19416500173,hanDate:'31/12/2025'},
  {id:3,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6001',noidung:'Lương theo ngạch, bậc',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:10155443652,hanDate:'31/12/2025'},
  {id:4,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6049',noidung:'Lương khác',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:0,hanDate:'31/12/2025'},
  {id:5,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6101',noidung:'Phụ cấp chức vụ',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:225062370,hanDate:'31/12/2025'},
  {id:6,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6102',noidung:'Phụ cấp khu vực',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:1452321000,hanDate:'31/12/2025'},
  {id:7,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6112',noidung:'Phụ cấp trách nhiệm theo nghề, theo công việc',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:4440315685,hanDate:'31/12/2025'},
  {id:8,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6113',noidung:'Phụ cấp trực',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:17550000,hanDate:'31/12/2025'},
  {id:9,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6115',noidung:'Phụ cấp thâm niên vượt khung; phụ cấp thâm',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:50562641,hanDate:'31/12/2025'},
  {id:10,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6301',noidung:'Bảo hiểm xã hội',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:2142901166,hanDate:'31/12/2025'},
  {id:11,group:'KP THƯỜNG XUYÊN',muc:'',tieumuc:'6302',noidung:'Bảo hiểm y tế',isGroupHeader:false,dtCapNam:0,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:363728343,hanDate:'31/12/2025'},
  {id:12,group:'KP THƯỜNG XUYÊN',muc:'2',tieumuc:'',noidung:'KP chi thường xuyên theo NĐ73',isGroupHeader:false,dtCapNam:1611000000,tonNamTruoc:0,kpCapNam:260000000,giamDT:0,tangDT:0,daDung:1816412480,hanDate:'31/12/2025'},
  {id:13,group:'KP THƯỜNG XUYÊN',muc:'3',tieumuc:'13',noidung:'KP chi hành chính phục vụ hoạt động thường',isGroupHeader:false,dtCapNam:1596000000,tonNamTruoc:0,kpCapNam:526000000,giamDT:0,tangDT:0,daDung:2122000000,hanDate:'31/12/2025'},
  {id:14,group:'KP THƯỜNG XUYÊN',muc:'4',tieumuc:'',noidung:'KP tiết kiệm 10% chi thường xuyên',isGroupHeader:false,dtCapNam:180000000,tonNamTruoc:0,kpCapNam:56000000,giamDT:0,tangDT:0,daDung:236000000,hanDate:'31/12/2025'},
  {id:15,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'II',tieumuc:'',noidung:'KP KHÔNG THƯỜNG XUYÊN',isGroupHeader:true,dtCapNam:2728000000,tonNamTruoc:180000000,kpCapNam:6951027000,giamDT:0,tangDT:0,daDung:9223673180,hanDate:'31/12/2025'},
  {id:16,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'1',tieumuc:'7012',noidung:'Quan trắc môi trường',isGroupHeader:false,dtCapNam:250000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:129038000,hanDate:'31/12/2025'},
  {id:17,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'2',tieumuc:'7757',noidung:'Bảo hiểm cháy nổ',isGroupHeader:false,dtCapNam:28000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:27800000,hanDate:'31/12/2025'},
  {id:18,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'28',tieumuc:'',noidung:'Thay thế bình tranh biểm áp',isGroupHeader:false,dtCapNam:24000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:21131335,hanDate:'31/12/2025'},
  {id:19,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'7',tieumuc:'',noidung:'Bảo dưỡng, bổ sung thiết bị PCCC',isGroupHeader:false,dtCapNam:93000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:92730000,hanDate:'31/12/2025'},
  {id:20,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'8',tieumuc:'6503',noidung:'Đầu xử lý rác thải Y tế',isGroupHeader:false,dtCapNam:100000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:100000000,hanDate:'31/12/2025'},
  {id:21,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'11',tieumuc:'6503',noidung:'Điện chạy máy nổ + máy phát điện',isGroupHeader:false,dtCapNam:54350000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:6063000,hanDate:'31/12/2025'},
  {id:22,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'13',tieumuc:'',noidung:'Ngoại kiểm chất lượng xét nghiệm',isGroupHeader:false,dtCapNam:60000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:60000000,hanDate:'31/12/2025'},
  {id:23,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'15',tieumuc:'',noidung:'Thuế vi sinh công nghiệp',isGroupHeader:false,dtCapNam:532000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:495000000,hanDate:'31/12/2025'},
  {id:24,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'16',tieumuc:'',noidung:'Thuế vận chuyển rác sinh hoạt',isGroupHeader:false,dtCapNam:1393650000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:1344046800,hanDate:'31/12/2025'},
  {id:25,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'18',tieumuc:'',noidung:'Dự án 7: Đèn tín hiệu số',isGroupHeader:false,dtCapNam:275000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:274720000,hanDate:'31/12/2025'},
  {id:26,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'19',tieumuc:'',noidung:'Sửa chữa xe ô tô công thương (02 xe)',isGroupHeader:false,dtCapNam:195000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:194486480,hanDate:'31/12/2025'},
  {id:27,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'22',tieumuc:'',noidung:'Sửa chữa thường xuyên',isGroupHeader:false,dtCapNam:600000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:600000000,hanDate:'31/12/2025'},
  {id:28,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'23',tieumuc:'',noidung:'Sửa chữa khoa ngoại sản, Y học cổ truyền',isGroupHeader:false,dtCapNam:1200000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:1182940000,hanDate:'31/12/2025'},
  {id:29,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'24',tieumuc:'',noidung:'KP mua TBYT (máy đếm tế bào huyết học tự động)',isGroupHeader:false,dtCapNam:1169000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:1157500000,hanDate:'31/12/2025'},
  {id:30,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'25',tieumuc:'',noidung:'KP thực hiện chế độ chi cách do sắp xếp tổ chức bộ máy',isGroupHeader:false,dtCapNam:3312027000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:3307626012,hanDate:'31/12/2025'},
  {id:31,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'26',tieumuc:'',noidung:'KP chi thường xuyên',isGroupHeader:false,dtCapNam:20000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:0,hanDate:'31/12/2025'},
  {id:32,group:'KP KHÔNG THƯỜNG XUYÊN',muc:'27',tieumuc:'',noidung:'KP tiết kiệm 10% thực hiện CCTL',isGroupHeader:false,dtCapNam:110000000,tonNamTruoc:0,kpCapNam:0,giamDT:0,tangDT:0,daDung:110000000,hanDate:'31/12/2025'},
];

// ===== STATE =====
let currentYear=2025;
function getStorageKey(){return 'budget_items_'+currentYear;}
let items=[];
let currentPage=1;const PAGE_SIZE=50;
let filterText='',filterGroup='',filterStatus='';
let editingId=null;
let currentNavFilter='all';

// ===== budgetSupabaseClient CONFIG =====
const SB_URL = 'https://ogejyvuakljsqbdrwyic.supabase.co';
const SB_KEY = 'sb_publishable_LyLDY8I2dJf3o0Mmmg_4JQ__hs_G73t';
let budgetSupabaseClient = null;

try {
  if (window.supabase && SB_URL && SB_KEY) {
    budgetSupabaseClient = window.supabase.createClient(SB_URL, SB_KEY);
    console.log('budgetSupabaseClient client initialized');
  }
} catch (e) {
  console.error('budgetSupabaseClient Init Error:', e);
}

async function loadCurrentYearData(){
  const key = getYearKey(currentYear);
  
  
  // Quick load from local
  const localData = localStorage.getItem(key);
  if (localData) {
    items = JSON.parse(localData);
    
    const activePg = document.querySelector('.page.active');
    if (activePg) {
      const pageId = activePg.id.replace('page-', '');
      if (pageId === 'dashboard') renderDashboard();
      if (pageId === 'budget') renderTable();
    }
    updateFormSuggestions();
  }

  if (!budgetSupabaseClient) return;

  try {
    const { data, error } = await budgetSupabaseClient.from('budget_data').select('items').eq('year', String(currentYear)).maybeSingle();
    if (error) throw error;
    if (data && data.items) {
      items = data.items;
      localStorage.setItem(key, JSON.stringify(items));
      
      
      const activePg = document.querySelector('.page.active');
      if (activePg) {
        const pageId = activePg.id.replace('page-', '');
        if (pageId === 'dashboard') renderDashboard();
        if (pageId === 'budget') renderTable();
      }
      updateFormSuggestions();
    } else {
      
    }
  } catch (err) { 
    console.error('Cloud Error:', err); 
    const errorDetail = err.message || 'Lỗi không xác định';
    
  }
}


async function save(){
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(items));
  updateFormSuggestions();
  
  
  if (!budgetSupabaseClient) {
    
    return;
  }

  try {
    // Clean data to avoid common JSON errors
    const cleanItems = JSON.parse(JSON.stringify(items));
    
    const { error } = await budgetSupabaseClient
      .from('budget_data')
      .upsert({ year: String(currentYear), items: cleanItems }, { onConflict: 'year' });
    
    if (error) {
      console.error('Supabase Error:', error);
      
      throw error;
    }
    
    
    console.log('Sync success for year:', currentYear);
  } catch (err) {
    console.error('budgetSupabaseClient Save error:', err);
    if (window.logDebug) {
      const msg = err.message || err.details || 'Không xác định';
      if (!msg.includes('Lỗi Cloud')) {
        window.logDebug('Lỗi hệ thống: ' + msg, 'error');
      }
    }
    toast('Lỗi khi đồng bộ dữ liệu lên đám mây', 'error');
  }
}
function nextId(){return items.length?Math.max(...items.map(x=>x.id))+1:1;}

// Init
// Data load is now handled in initApp

// ===== NAV =====
function budgetNavigate(page, filter=''){
  const role = localStorage.getItem('budget_user_role');
  if (role !== 'admin' && (page === 'add' || page === 'import')) {
    page = 'dashboard';
    toast('Bạn không có quyền truy cập chức năng này', 'error');
  }

  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  
  const pg=document.getElementById('page-'+page);
  if(pg)pg.classList.add('active');
  
  if (page === 'budget') {
    if(!filter) filter = currentNavFilter || 'all';
    currentNavFilter = filter;
    const nav=document.getElementById('nav-budget-'+filter);
    if(nav)nav.classList.add('active');
  } else {
    const nav=document.getElementById('nav-'+page);
    if(nav)nav.classList.add('active');
  }

  const subTitles = {
    all: ['Dự Toán & Sử Dụng Kinh Phí', 'Bảng chi tiết toàn bộ các khoản chi'],
    ton: ['Tồn Năm Trước Chuyển Sang', 'Danh sách các khoản kinh phí từ năm trước chuyển qua'],
    cap: ['KP Cấp Đầu Năm', 'Danh sách các khoản kinh phí được cấp mới đầu năm'],
    tang: ['Tăng Dự Toán', 'Danh sách các khoản kinh phí được điều chỉnh tăng'],
    giam: ['Giảm Dự Toán', 'Danh sách các khoản kinh phí được điều chỉnh giảm']
  };

  const titles={
    dashboard:['Tổng Quan Ngân Sách','Theo dõi tình hình sử dụng kinh phí ngân sách nhà nước cấp'],
    add:['Thêm Khoản Chi','Nhập thông tin khoản chi mới'],
    report:['Báo Cáo Tổng Hợp','Phân tích và thống kê tình hình sử dụng ngân sách'],
    import:['Nhập Dữ Liệu Cũ','Nhập và quản lý dữ liệu ngân sách các năm trước']
  };

  if (page === 'budget' && subTitles[currentNavFilter]) {
    document.getElementById('page-title').textContent=subTitles[currentNavFilter][0];
    document.getElementById('page-sub').textContent=subTitles[currentNavFilter][1];
  } else if(titles[page]){
    document.getElementById('page-title').textContent=titles[page][0];
    document.getElementById('page-sub').textContent=titles[page][1];
  }

  if(page==='dashboard')renderDashboard();
  if(page==='budget'){
    currentPage = 1;
    renderTable();
  }
  if(page==='report')renderReport();
  if(page==='add'&&!editingId)resetForm();
  if(page==='import')renderYearHistory();
}

// ===== DASHBOARD =====
function renderDashboard(){
  const data=items.filter(x=>!x.isGroupHeader);
  const totalAlloc=data.reduce((s,r)=>s+calcKpDuocSD(r),0);
  const totalUsed=data.reduce((s,r)=>s+(+r.daDung||0),0);
  const totalRemain=totalAlloc-totalUsed;
  const overItems=data.filter(r=>getStatus(r)==='danger');
  const warnItems=data.filter(r=>getStatus(r)==='warning');
  const pct=totalAlloc>0?Math.min(100,totalUsed/totalAlloc*100):0;
  document.getElementById('kpi-total-allocated').textContent=fmt(totalAlloc);
  document.getElementById('kpi-used').textContent=fmt(totalUsed);
  document.getElementById('kpi-used-pct').textContent=pct.toFixed(1)+'% tổng KP';
  document.getElementById('kpi-remaining').textContent=fmt(Math.abs(totalRemain));
  document.getElementById('kpi-remaining-pct').textContent=(totalAlloc>0?(totalRemain/totalAlloc*100).toFixed(1):0)+'% tổng KP';
  document.getElementById('kpi-overrun').textContent=overItems.length+warnItems.length;
  const bar=document.getElementById('overall-progress-bar');
  bar.style.width=pct.toFixed(1)+'%';
  bar.className='progress-bar-fill'+(pct>=100?' danger':pct>=80?' warning':'');
  document.getElementById('overall-pct-label').textContent=pct.toFixed(1)+'%';
  // breakdown
  const groups=['KP THƯỜNG XUYÊN','KP KHÔNG THƯỜNG XUYÊN'];
  const colors=['#3b82f6','#10b981'];
  let bd='';
  groups.forEach((g,i)=>{
    const gd=data.filter(r=>r.group===g);
    const ga=gd.reduce((s,r)=>s+calcKpDuocSD(r),0);
    const gu=gd.reduce((s,r)=>s+(+r.daDung||0),0);
    const gp=ga>0?Math.min(100,gu/ga*100):0;
    bd+=`<div class="breakdown-item">
      <div class="breakdown-header"><span class="breakdown-name">${g}</span><span class="breakdown-pct" style="color:${colors[i]}">${gp.toFixed(1)}%</span></div>
      <div class="breakdown-bar-bg"><div class="breakdown-bar-fill" style="width:${gp.toFixed(1)}%;background:${colors[i]}"></div></div>
      <div class="breakdown-values"><span>Đã dùng: ${fmt(gu)}</span><span>Còn lại: ${fmt(ga-gu)}</span></div>
    </div>`;
  });
  document.getElementById('category-breakdown').innerHTML=bd||'<div class="empty-state"><div class="empty-icon">📂</div><p>Chưa có dữ liệu</p></div>';
  // alerts
  const alertData=[...overItems,...warnItems].slice(0,10);
  let al='';
  alertData.forEach(r=>{
    const s=getStatus(r);const tot=calcKpDuocSD(r);const p=tot>0?r.daDung/tot*100:0;
    al+=`<div class="alert-item"><div class="alert-dot ${s}"></div><div class="alert-name">${r.noidung}</div><span class="alert-pct ${s}">${p.toFixed(0)}%</span></div>`;
  });
  document.getElementById('alert-items').innerHTML=al||'<div class="empty-state"><div class="empty-icon">✅</div><p>Không có khoản vượt mức</p></div>';
}

// ===== TABLE =====
function getFiltered(){
  let res = items.filter(r=>{
    if(filterText&&!r.noidung.toLowerCase().includes(filterText.toLowerCase())&&!r.tieumuc.includes(filterText)&&!r.muc.includes(filterText))return false;
    if(filterGroup&&r.group!==filterGroup)return false;
    if(filterStatus&&!r.isGroupHeader&&getStatus(r)!==filterStatus)return false;
    return true;
  });

  if(currentNavFilter==='ton') res=res.filter(r=>r.isGroupHeader||(+r.tonNamTruoc>0));
  else if(currentNavFilter==='cap') res=res.filter(r=>r.isGroupHeader||(+r.dtCapNam>0||+r.kpCapNam>0));
  else if(currentNavFilter==='tang') res=res.filter(r=>r.isGroupHeader||(+r.tangDT>0));
  else if(currentNavFilter==='giam') res=res.filter(r=>r.isGroupHeader||(+r.giamDT>0));

  return res;
}
function renderTable(){
  const allFiltered = getFiltered();
  const data = allFiltered.filter(r => !r.isGroupHeader);
  const groups = ['KP THƯỜNG XUYÊN', 'KP KHÔNG THƯỜNG XUYÊN'];
  
  let html = '';
  let globalAlloc = 0, globalUsed = 0;

  groups.forEach((g, gIdx) => {
    const groupItems = data.filter(r => r.group === g);
    if (groupItems.length === 0) return;

    // Nhóm Header
    html += `<tr class="row-group-header"><td colspan="14" style="padding-left:12px">${gIdx + 1}. ${g}</td></tr>`;

    let groupAlloc = 0, groupUsed = 0;
    
    // Group by Main Content (Nội dung)
    const contentGroups = {};
    groupItems.forEach(item => {
      if (!contentGroups[item.noidung]) contentGroups[item.noidung] = [];
      contentGroups[item.noidung].push(item);
    });

    Object.keys(contentGroups).forEach(contentName => {
      const subItems = contentGroups[contentName];
      let subAlloc = 0, subUsed = 0;

      // Sort: Allocation rows (dtCapNam > 0) should come first
      subItems.sort((a, b) => (b.dtCapNam || 0) - (a.dtCapNam || 0));

      subItems.forEach(r => {
        const kpDuoc = calcKpDuocSD(r);
        const conLai = calcConLai(r);
        const isDetail = !!(r.muc || r.tieumuc);
        const conLaiCls = isDetail ? '' : (conLai < 0 ? 'negative' : (conLai === 0 ? '' : 'ok'));
        
        html += `<tr class="${r.dtCapNam > 0 ? 'row-parent-content' : ''}">
          <td class="td-muc">${r.muc || ''}</td>
          <td class="td-tieumuc">${r.tieumuc || ''}</td>
          <td class="td-noidung${r.muc || r.tieumuc ? ' indent' : ''}">${r.noidung}</td>
          <td class="td-number col-dtcapnam">${r.dtCapNam ? fmt(r.dtCapNam) : '-'}</td>
          <td class="td-number col-tonnamtruoc">${r.tonNamTruoc ? fmt(r.tonNamTruoc) : '-'}</td>
          <td class="td-number col-kpcapnam">${r.kpCapNam ? fmt(r.kpCapNam) : '-'}</td>
          <td class="td-number col-giamdt">${r.giamDT ? fmt(r.giamDT) : '-'}</td>
          <td class="td-number col-tangdt">${r.tangDT ? fmt(r.tangDT) : '-'}</td>
          <td class="td-number col-giulai10">${r.giuLai10 ? fmt(r.giuLai10) : '-'}</td>
          <td class="td-number highlight col-kpduocsd">${kpDuoc ? fmt(kpDuoc) : '-'}</td>
          <td class="td-number used col-kpdadung">${r.daDung ? fmt(r.daDung) : '-'}</td>
          <td class="td-number remaining ${conLaiCls} col-kpconlai">${isDetail ? '-' : fmt(conLai)}</td>
          <td style="text-align:center">${isDetail ? '-' : statusBadge(r)}</td>
          <td style="text-align:center;font-size:11px;color:var(--text-muted)">${r.hanDate || '-'}</td>
          <td style="text-align:center" class="role-admin-only">
            <button class="btn-edit" onclick="startEdit(${r.id})">✏️</button>
            <button class="btn-del" onclick="deleteItem(${r.id})">🗑</button>
          </td>
        </tr>`;
      });

      // Sub-subtotal for this Content
      if (subItems.length > 1 || (subItems.length === 1 && subItems[0].dtCapNam > 0)) {
        const subRemain = subAlloc - subUsed;
        html += `<tr class="row-content-total">
          <td colspan="3" style="text-align:right;padding-right:12px; font-style: italic; font-size: 12px; color: var(--text-muted)">Tổng: ${contentName.substring(0, 30)}${contentName.length > 30 ? '...' : ''}</td>
          <td class="td-number col-dtcapnam" style="font-size: 11px; color: var(--text-muted)">${fmt(subItems.reduce((s,r)=>s+(+r.dtCapNam||0),0))}</td>
          <td class="td-number col-tonnamtruoc" style="font-size: 11px; color: var(--text-muted)">${fmt(subItems.reduce((s,r)=>s+(+r.tonNamTruoc||0),0))}</td>
          <td class="td-number col-kpcapnam" style="font-size: 11px; color: var(--text-muted)">${fmt(subItems.reduce((s,r)=>s+(+r.kpCapNam||0),0))}</td>
          <td class="td-number col-giamdt" style="font-size: 11px; color: var(--text-muted)">${fmt(subItems.reduce((s,r)=>s+(+r.giamDT||0),0))}</td>
          <td class="td-number col-tangdt" style="font-size: 11px; color: var(--text-muted)">${fmt(subItems.reduce((s,r)=>s+(+r.tangDT||0),0))}</td>
          <td class="td-number col-giulai10" style="font-size: 11px; color: var(--text-muted)">${fmt(subItems.reduce((s,r)=>s+(+r.giuLai10||0),0))}</td>
          <td class="td-number col-kpduocsd" style="font-weight: 600; font-size: 12px">${fmt(subAlloc)}</td>
          <td class="td-number col-kpdadung" style="font-weight: 600; font-size: 12px; color: var(--green)">${fmt(subUsed)}</td>
          <td class="td-number col-kpconlai" style="font-weight: 600; font-size: 12px; color: ${subRemain < 0 ? 'var(--red)' : 'var(--text-primary)'}">${fmt(subRemain)}</td>
          <td colspan="3"></td>
        </tr>`;
      }

      groupAlloc += subAlloc;
      groupUsed += subUsed;
    });

    // Cộng nhóm
    const groupRemain = groupAlloc - groupUsed;
    html += `<tr class="row-subtotal">
      <td colspan="3" style="text-align:right;padding-right:12px; font-weight: 600">Cộng ${g}</td>
      <td class="td-number col-dtcapnam">${fmt(groupItems.reduce((s,r)=>s+(+r.dtCapNam||0),0))}</td>
      <td class="td-number col-tonnamtruoc">${fmt(groupItems.reduce((s,r)=>s+(+r.tonNamTruoc||0),0))}</td>
      <td class="td-number col-kpcapnam">${fmt(groupItems.reduce((s,r)=>s+(+r.kpCapNam||0),0))}</td>
      <td class="td-number col-giamdt">${fmt(groupItems.reduce((s,r)=>s+(+r.giamDT||0),0))}</td>
      <td class="td-number col-tangdt">${fmt(groupItems.reduce((s,r)=>s+(+r.tangDT||0),0))}</td>
      <td class="td-number col-giulai10">${fmt(groupItems.reduce((s,r)=>s+(+r.giuLai10||0),0))}</td>
      <td class="td-number highlight col-kpduocsd">${fmt(groupAlloc)}</td>
      <td class="td-number used col-kpdadung">${fmt(groupUsed)}</td>
      <td class="td-number remaining ${groupRemain < 0 ? 'danger' : 'ok'} col-kpconlai">${fmt(groupRemain)}</td>
      <td colspan="2"></td><td class="role-admin-only"></td>
    </tr>`;

    globalAlloc += groupAlloc;
    globalUsed += groupUsed;
  });

  // Tổng cộng cuối bảng
  const globalRemain = globalAlloc - globalUsed;
  html += `<tr class="row-total">
    <td colspan="3" style="text-align:right;padding-right:12px; font-weight: bold">TỔNG CỘNG (I + II)</td>
    <td class="td-number col-dtcapnam">${fmt(data.reduce((s,r)=>s+(+r.dtCapNam||0),0))}</td>
    <td class="td-number col-tonnamtruoc">${fmt(data.reduce((s,r)=>s+(+r.tonNamTruoc||0),0))}</td>
    <td class="td-number col-kpcapnam">${fmt(data.reduce((s,r)=>s+(+r.kpCapNam||0),0))}</td>
    <td class="td-number col-giamdt">${fmt(data.reduce((s,r)=>s+(+r.giamDT||0),0))}</td>
    <td class="td-number col-tangdt">${fmt(data.reduce((s,r)=>s+(+r.tangDT||0),0))}</td>
    <td class="td-number col-giulai10">${fmt(data.reduce((s,r)=>s+(+r.giuLai10||0),0))}</td>
    <td class="td-number highlight col-kpduocsd">${fmt(globalAlloc)}</td>
    <td class="td-number used col-kpdadung">${fmt(globalUsed)}</td>
    <td class="td-number remaining ${globalRemain < 0 ? 'danger' : 'ok'} col-kpconlai">${fmt(globalRemain)}</td>
    <td colspan="2"></td><td class="role-admin-only"></td>
  </tr>`;

  document.getElementById('budgetTable').className = 'budget-table mode-' + currentNavFilter;
  document.getElementById('budgetTableBody').innerHTML = html;
  document.getElementById('tableSummary').innerHTML = `Hiển thị <strong>${data.length}</strong> khoản chi`;
  document.getElementById('pagination').innerHTML = '';
}
function renderPagination(total){
  const pages=Math.ceil(total/PAGE_SIZE);
  let html='';
  for(let i=1;i<=pages;i++)html+=`<button class="page-btn${i===currentPage?' active':''}" onclick="goPage(${i})">${i}</button>`;
  document.getElementById('pagination').innerHTML=html;
}
function goPage(p){currentPage=p;renderTable();}

// ===== REPORT =====
function renderReport(){
  const data=items.filter(x=>!x.isGroupHeader);
  ['KP THƯỜNG XUYÊN','KP KHÔNG THƯỜNG XUYÊN'].forEach((g,i)=>{
    const gd=data.filter(r=>r.group===g);
    const ga=gd.reduce((s,r)=>s+calcKpDuocSD(r),0);
    const gu=gd.reduce((s,r)=>s+(+r.daDung||0),0);
    const pct=ga>0?gu/ga*100:0;
    const keys=['tx','ktx'];
    document.getElementById(`rpt-${keys[i]}-used`).textContent=fmt(gu);
    document.getElementById(`rpt-${keys[i]}-pct`).textContent=pct.toFixed(1)+'% đã sử dụng';
  });
  const now=new Date();
  const exp=data.filter(r=>{
    if(!r.hanDate)return false;
    const parts=r.hanDate.split('/');
    if(parts.length!==3)return false;
    const d=new Date(+parts[2],+parts[1]-1,+parts[0]);
    const diff=(d-now)/86400000;
    return diff>=0&&diff<=30;
  });
  document.getElementById('rpt-expiring').textContent=exp.length;
  document.getElementById('rpt-over').textContent=data.filter(r=>getStatus(r)==='danger').length;
  // charts
  ['KP THƯỜNG XUYÊN','KP KHÔNG THƯỜNG XUYÊN'].forEach((g,gi)=>{
    const gd=data.filter(r=>r.group===g).slice(0,8);
    const colors=['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#f97316','#ec4899'];
    let html='';
    gd.forEach((r,i)=>{
      const tot=calcKpDuocSD(r);const used=+r.daDung||0;
      const p=tot>0?Math.min(100,used/tot*100):0;
      html+=`<div class="chart-bar-item">
        <div class="chart-label"><span>${r.noidung.substring(0,40)}${r.noidung.length>40?'...':''}</span><span>${p.toFixed(0)}%</span></div>
        <div class="chart-bar-bg"><div class="chart-bar-fill" style="width:${p}%;background:${colors[i%colors.length]}"></div></div>
      </div>`;
    });
    document.getElementById(`chart-${gi===0?'tx':'ktx'}`).innerHTML=html||'<p style="color:var(--text-muted);padding:16px">Chưa có dữ liệu</p>';
  });
  // summary table
  const groups=['KP THƯỜNG XUYÊN','KP KHÔNG THƯỜNG XUYÊN'];
  let tbl=`<table class="report-table"><thead><tr><th>Nhóm mục</th><th class="num">KP Được SD</th><th class="num">Đã Sử Dụng</th><th class="num">Còn Lại</th><th class="num">Tỷ lệ</th><th>Trạng thái</th></tr></thead><tbody>`;
  groups.forEach(g=>{
    const gd=data.filter(r=>r.group===g);
    const ga=gd.reduce((s,r)=>s+calcKpDuocSD(r),0);
    const gu=gd.reduce((s,r)=>s+(+r.daDung||0),0);
    const pct=ga>0?gu/ga*100:0;
    const st=pct>=100?'danger':pct>=80?'warning':'good';
    tbl+=`<tr><td>${g}</td><td class="num">${fmt(ga)}</td><td class="num">${fmt(gu)}</td><td class="num">${fmt(ga-gu)}</td><td class="num">${pct.toFixed(1)}%</td><td><span class="status-badge status-${st}">${pct>=100?'🔴 Vượt KP':pct>=80?'⚠️ Cảnh báo':'✅ Bình thường'}</span></td></tr>`;
  });
  const ta=data.reduce((s,r)=>s+calcKpDuocSD(r),0);
  const tu=data.reduce((s,r)=>s+(+r.daDung||0),0);
  tbl+=`<tr class="row-total"><td><strong>TỔNG CỘNG (I+II)</strong></td><td class="num"><strong>${fmt(ta)}</strong></td><td class="num"><strong>${fmt(tu)}</strong></td><td class="num"><strong>${fmt(ta-tu)}</strong></td><td class="num"><strong>${(ta>0?tu/ta*100:0).toFixed(1)}%</strong></td><td></td></tr>`;
  tbl+=`</tbody></table>`;
  document.getElementById('report-table-container').innerHTML=tbl;
}

// ===== FORM =====
function resetForm(){
  editingId=null;
  document.getElementById('budgetForm').reset();
  document.getElementById('f-editId').value='';
  document.getElementById('f-year').value=currentYear;
  document.getElementById('f-year').disabled=false;
  document.getElementById('form-title').textContent='➕ Thêm Khoản Chi Ngân Sách';
  document.getElementById('submitBtn').textContent='💾 Lưu Khoản Chi';
  updateCalc();
}
function startEdit(id){
  const role = localStorage.getItem('budget_user_role');
  if (role !== 'admin') {
    toast('Bạn không có quyền chỉnh sửa', 'error');
    return;
  }
  const r=items.find(x=>x.id===id);if(!r)return;
  editingId=id;
  document.getElementById('f-editId').value=id;
  document.getElementById('f-year').value=currentYear;
  document.getElementById('f-year').disabled=true;
  document.getElementById('f-group').value=r.group||'';
  document.getElementById('f-muc').value=r.muc||'';
  document.getElementById('f-tieumuc').value=r.tieumuc||'';
  document.getElementById('f-noidung').value=r.noidung||'';
  document.getElementById('f-dtcapnam').value=r.dtCapNam||'';
  document.getElementById('f-tonnuoctruoc').value=r.tonNamTruoc||'';
  document.getElementById('f-kpcapnam').value=r.kpCapNam||'';
  document.getElementById('f-giam').value=r.giamDT||'';
  document.getElementById('f-tang').value=r.tangDT||'';
  document.getElementById('f-giulai10').value=r.giuLai10||'';
  document.getElementById('f-dadung').value=r.daDung||'';
  document.getElementById('f-handate').value=r.hanDate?r.hanDate.split('/').reverse().join('-'):'';
  document.getElementById('f-note').value=r.note||'';
  document.getElementById('form-title').textContent='✏️ Chỉnh Sửa Khoản Chi';
  document.getElementById('submitBtn').textContent='💾 Cập Nhật';
  updateCalc();
  budgetNavigate('add');
}
function customConfirm(msg, onYes) {
  const modal = document.getElementById('confirmModal');
  if(!modal) return;
  document.getElementById('confirmMsg').textContent = msg;
  modal.style.display = 'flex';
  
  const cleanup = () => { modal.style.display = 'none'; };
  
  const yesBtn = document.getElementById('confirmYesBtn');
  const noBtn = document.getElementById('confirmNoBtn');
  
  // Clone to remove old event listeners
  const newYes = yesBtn.cloneNode(true);
  const newNo = noBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYes, yesBtn);
  noBtn.parentNode.replaceChild(newNo, noBtn);
  
  newYes.onclick = () => { cleanup(); onYes(); };
  newNo.onclick = () => { cleanup(); };
}

function deleteItem(id){
  const role = localStorage.getItem('budget_user_role');
  if (role !== 'admin') {
    toast('Bạn không có quyền xóa', 'error');
    return;
  }
  customConfirm('Bạn có chắc chắn muốn xóa khoản chi này?', () => {
    items=items.filter(x=>x.id!==id);
    save();
    renderTable();
    toast('Đã xóa khoản chi','success');
  });
}
function updateCalc(){
  const dt=+document.getElementById('f-dtcapnam').value||0;
  const ton=+document.getElementById('f-tonnuoctruoc').value||0;
  const kp=+document.getElementById('f-kpcapnam').value||0;
  const giam=+document.getElementById('f-giam').value||0;
  const tang=+document.getElementById('f-tang').value||0;
  const giulai=+document.getElementById('f-giulai10').value||0;
  const da=+document.getElementById('f-dadung').value||0;
  const duoc=dt+ton+kp-giam+tang-giulai;
  const con=duoc-da;
  const pct=duoc>0?da/duoc*100:0;
  document.getElementById('calc-kpduocsd').textContent=fmt(duoc)+' đồng';
  document.getElementById('calc-kpconlai').textContent=fmt(con)+' đồng';
  document.getElementById('calc-tyle').textContent=pct.toFixed(1)+'%';
}

// ===== EXPORT =====
async function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

function exportCSV(){
  const data=items.filter(x=>!x.isGroupHeader);
  const headers=['Mục','T.Mục','Nội dung','DT KP Cấp Đầu Năm','Tồn Năm Trước','KP Cấp Đầu Năm','Giảm DT','Tăng DT','Giữ lại 10% CCTL','KP Được SD','KP Đã SD','KP Còn Lại','Trạng thái','Ngày HH'];
  const rows=data.map(r=>[r.muc,r.tieumuc,`"${r.noidung}"`,r.dtCapNam||0,r.tonNamTruoc||0,r.kpCapNam||0,r.giamDT||0,r.tangDT||0,r.giuLai10||0,calcKpDuocSD(r),r.daDung||0,calcConLai(r),getStatus(r),r.hanDate||'']);
  const csvHeader = [
    'SỞ Y TẾ TỈNH LAI CHÂU',
    'BỆNH VIỆN ĐA KHOA THAN UYÊN',
    '',
    'BẢNG THEO DÕI SỬ DỤNG KINH PHÍ NGÂN SÁCH NHÀ NƯỚC',
    `Năm ngân sách: ${currentYear}`,
    `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`,
    ''
  ];
  const csv = '\uFEFF' + csvHeader.join('\n') + '\n' + [headers, ...rows].map(r => r.join(',')).join('\n');
  downloadBlob(new Blob([csv],{type:'text/csv;charset=utf-8'}), `ngan_sach_${currentYear}.csv`);
  toast('Đã xuất file CSV','success');
}

// ===== EXPORT EXCEL =====
function exportXlsx(){
  try{
    // Hierarchical construction for Excel
    const dataOnly = items.filter(x => !x.isGroupHeader);
    const groups = ['KP THƯỜNG XUYÊN', 'KP KHÔNG THƯỜNG XUYÊN'];
    
    const headers=['Mục','T.Mục','Nội dung','DT KP Cấp Đầu Năm','Tồn Năm Trước','KP Cấp Đầu Năm','Giảm DT','Tăng DT','Giữ lại 10% CCTL','KP Được SD','KP Đã SD','KP Còn Lại','Tỷ lệ (%)','Trạng thái','Ngày HH'];
    let rows = [];
    let globalAlloc = 0, globalUsed = 0;

    groups.forEach((g, gIdx) => {
      const groupItems = dataOnly.filter(r => r.group === g);
      if (groupItems.length === 0) return;

      // Group Header Row
      rows.push([`${gIdx + 1}. ${g}`, '', '', '', '', '', '', '', '', '', '', '', '', '']);

      let groupAlloc = 0, groupUsed = 0;
      
      // Group by Main Content (Nội dung)
      const contentGroups = {};
      groupItems.forEach(item => {
        if (!contentGroups[item.noidung]) contentGroups[item.noidung] = [];
        contentGroups[item.noidung].push(item);
      });

      Object.keys(contentGroups).forEach(contentName => {
        const subItems = contentGroups[contentName];
        let subAlloc = 0, subUsed = 0;

        // Sort: Allocation rows first
        subItems.sort((a, b) => (b.dtCapNam || 0) - (a.dtCapNam || 0));

        subItems.forEach(r => {
          const kpDuoc = calcKpDuocSD(r);
          const conLai = calcConLai(r);
          const pct = kpDuoc > 0 ? ((+r.daDung || 0) / kpDuoc * 100) : 0;
          const st = getStatus(r);
          const stTxt = st === 'good' ? 'Bình thường' : st === 'warning' ? 'Cảnh báo' : st === 'danger' ? 'Vượt KP' : 'Chưa dùng';
          
          subAlloc += kpDuoc;
          subUsed += (+r.daDung || 0);

          const isDetail = !!(r.muc || r.tieumuc);
          rows.push([r.muc || '', r.tieumuc || '', r.noidung || '', r.dtCapNam || 0, r.tonNamTruoc || 0, r.kpCapNam || 0, r.giamDT || 0, r.tangDT || 0, r.giuLai10 || 0, kpDuoc, +r.daDung || 0, isDetail ? '' : conLai, isDetail ? '' : Math.round(pct * 10) / 10, isDetail ? '' : stTxt, r.hanDate || '']);
        });

        // Content Subtotal
        if (subItems.length > 1 || (subItems.length === 1 && subItems[0].dtCapNam > 0)) {
          const subRemain = subAlloc - subUsed;
          const subPct = subAlloc > 0 ? (subUsed / subAlloc * 100) : 0;
          rows.push(['', '', `Tổng: ${contentName}`, 
            subItems.reduce((s,r)=>s+(+r.dtCapNam||0),0), 
            subItems.reduce((s,r)=>s+(+r.tonNamTruoc||0),0), 
            subItems.reduce((s,r)=>s+(+r.kpCapNam||0),0), 
            subItems.reduce((s,r)=>s+(+r.giamDT||0),0), 
            subItems.reduce((s,r)=>s+(+r.tangDT||0),0), 
            subItems.reduce((s,r)=>s+(+r.giuLai10||0),0), 
            subAlloc, subUsed, subRemain, Math.round(subPct * 10) / 10, '', '']);
        }
        groupAlloc += subAlloc;
        groupUsed += subUsed;
      });

      // Group Subtotal
      const groupRemain = groupAlloc - groupUsed;
      const groupPct = groupAlloc > 0 ? (groupUsed / groupAlloc * 100) : 0;
      rows.push(['', '', `CỘNG ${g}`, 
        groupItems.reduce((s,r)=>s+(+r.dtCapNam||0),0), 
        groupItems.reduce((s,r)=>s+(+r.tonNamTruoc||0),0), 
        groupItems.reduce((s,r)=>s+(+r.kpCapNam||0),0), 
        groupItems.reduce((s,r)=>s+(+r.giamDT||0),0), 
        groupItems.reduce((s,r)=>s+(+r.tangDT||0),0), 
        groupItems.reduce((s,r)=>s+(+r.giuLai10||0),0), 
        groupAlloc, groupUsed, groupRemain, Math.round(groupPct * 10) / 10, '', '']);
      
      // Add a spacer row
      rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);

      globalAlloc += groupAlloc;
      globalUsed += groupUsed;
    });

    // Grand Total
    const globalRemain = globalAlloc - globalUsed;
    const globalPct = globalAlloc > 0 ? (globalUsed / globalAlloc * 100) : 0;
    rows.push(['', '', 'TỔNG CỘNG (I + II)', 
      dataOnly.reduce((s,r)=>s+(+r.dtCapNam||0),0), 
      dataOnly.reduce((s,r)=>s+(+r.tonNamTruoc||0),0), 
      dataOnly.reduce((s,r)=>s+(+r.kpCapNam||0),0), 
      dataOnly.reduce((s,r)=>s+(+r.giamDT||0),0), 
      dataOnly.reduce((s,r)=>s+(+r.tangDT||0),0), 
      dataOnly.reduce((s,r)=>s+(+r.giuLai10||0),0), 
      globalAlloc, globalUsed, globalRemain, Math.round(globalPct * 10) / 10, '', '']);

    const ta = globalAlloc;
    const tu = globalUsed;
    // Build worksheet with headers
    const agencyHeader = [
      ['SỞ Y TẾ TỈNH LAI CHÂU'],
      ['BỆNH VIỆN ĐA KHOA THAN UYÊN'],
      [''],
      ['BẢNG THEO DÕI SỬ DỤNG KINH PHÍ NGÂN SÁCH NHÀ NƯỚC'],
      ['Năm ngân sách: ' + currentYear],
      ['Ngày xuất: ' + new Date().toLocaleDateString('vi-VN')],
      ['']
    ];
    const wsData = [...agencyHeader, headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    // Column widths
    ws['!cols']=[
      {wch:8},{wch:10},{wch:40},{wch:18},{wch:16},{wch:16},
      {wch:14},{wch:14},{wch:16},{wch:18},{wch:18},{wch:18},{wch:10},{wch:14},{wch:12}
    ];
    // Create workbook
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Ngan Sach '+currentYear);
    // Add summary sheet
    const sumHeaders=['Nhóm Mục','KP Được SD','Đã Sử Dụng','Còn Lại','Tỷ Lệ (%)'];
    const sumRows=groups.map(g=>{
      const gd=dataOnly.filter(r=>r.group===g);
      const ga=gd.reduce((s,r)=>s+calcKpDuocSD(r),0);
      const gu=gd.reduce((s,r)=>s+(+r.daDung||0),0);
      return[g,ga,gu,ga-gu,ga>0?Math.round(gu/ga*1000)/10:0];
    });
    sumRows.push(['TỔNG CỘNG (I+II)',ta,tu,ta-tu,ta>0?Math.round(tu/ta*1000)/10:0]);
    const ws2=XLSX.utils.aoa_to_sheet([sumHeaders,...sumRows]);
    ws2['!cols']=[{wch:28},{wch:20},{wch:20},{wch:20},{wch:12}];
    XLSX.utils.book_append_sheet(wb,ws2,'Tong Hop');
    // Download
    const wbout = XLSX.write(wb, { bookType:'xlsx', type:'array' });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    downloadBlob(blob, `ngan_sach_${currentYear}.xlsx`);
    toast('Đã xuất file Excel thành công','success');
  }catch(err){
    console.error(err);
    toast('Lỗi khi xuất Excel: '+err.message,'error');
  }
}

// ===== EXPORT PDF =====
function exportPDF(){
  try{
    const jsPDFClass=window.jspdf&&window.jspdf.jsPDF?window.jspdf.jsPDF:window.jsPDF;
    if(!jsPDFClass){toast('Thu vien jsPDF chua duoc tai. Vui long kiem tra ket noi mang.','error');return;}
    
    // Position 1: 'l' (landscape), Position 2: 'mm', Position 3: 'a4'
    const doc = new jsPDFClass('l', 'mm', 'a4');
    
    // Setup font
    if (window.TIMES_FONT_B64) {
      try {
        doc.addFileToVFS('times.ttf', window.TIMES_FONT_B64);
        doc.addFont('times.ttf', 'TimesNewRoman', 'normal');
        doc.addFont('times.ttf', 'TimesNewRoman', 'bold');
        doc.setFont('TimesNewRoman');
      } catch(e) { console.warn('Font setup error:', e); }
    }
    const fontName = window.TIMES_FONT_B64 ? 'TimesNewRoman' : 'helvetica';

    // Header logic moved to didDrawPage for consistency on all pages
    // Table data construction with grouping
    const dataOnly=items.filter(x=>!x.isGroupHeader);
    const groups=['KP THƯỜNG XUYÊN','KP KHÔNG THƯỜNG XUYÊN'];
    const headers=[['Mục','T.Mục','Nội Dung','DT KP Cấp','Tồn Năm Trước','KP Cấp ĐN','Giảm DT','Tăng DT','Giữ 10%','KP Được SD','KP Đã SD','KP Còn Lại','Trạng thái']];
    
    let rows=[];
    let globalAlloc = 0, globalUsed = 0;

    groups.forEach((g, gIdx) => {
      const groupItems = dataOnly.filter(r => r.group === g);
      if (groupItems.length === 0) return;

      // Group Header Row
      rows.push({
        type: 'groupHeader',
        data: [`${gIdx + 1}. ${g}`, '', '', '', '', '', '', '', '', '', '', '', '']
      });

      let groupAlloc = 0, groupUsed = 0;
      
      // Group by Main Content (Nội dung)
      const contentGroups = {};
      groupItems.forEach(item => {
        if (!contentGroups[item.noidung]) contentGroups[item.noidung] = [];
        contentGroups[item.noidung].push(item);
      });

      Object.keys(contentGroups).forEach(contentName => {
        const subItems = contentGroups[contentName];
        let subAlloc = 0, subUsed = 0;

        // Sort: Allocation rows first
        subItems.sort((a, b) => (b.dtCapNam || 0) - (a.dtCapNam || 0));

        subItems.forEach(r => {
          const kpDuoc = calcKpDuocSD(r);
          const conLai = calcConLai(r);
          const st = getStatus(r);
          const stTxt = st==='good'?'Bình thường':st==='warning'?'Cảnh báo':st==='danger'?'Vượt KP':'Chưa dùng';
          
          subAlloc += kpDuoc;
          subUsed += (+r.daDung || 0);

          const isDetail = !!(r.muc || r.tieumuc);
          rows.push({
            type: 'item',
            data: [r.muc||'', r.tieumuc||'', r.noidung||'', fmt(r.dtCapNam||0), fmt(r.tonNamTruoc||0), fmt(r.kpCapNam||0), fmt(r.giamDT||0), fmt(r.tangDT||0), fmt(r.giuLai10||0), fmt(kpDuoc), fmt(r.daDung||0), isDetail ? '-' : fmt(conLai), isDetail ? '-' : stTxt]
          });
        });

        // Content Subtotal
        if (subItems.length > 1 || (subItems.length === 1 && subItems[0].dtCapNam > 0)) {
          const subRemain = subAlloc - subUsed;
          rows.push({
            type: 'contentTotal',
            data: [`Tổng: ${contentName}`, '', '', fmt(subItems.reduce((s,r)=>s+(+r.dtCapNam||0),0)), fmt(subItems.reduce((s,r)=>s+(+r.tonNamTruoc||0),0)), fmt(subItems.reduce((s,r)=>s+(+r.kpCapNam||0),0)), fmt(subItems.reduce((s,r)=>s+(+r.giamDT||0),0)), fmt(subItems.reduce((s,r)=>s+(+r.tangDT||0),0)), fmt(subItems.reduce((s,r)=>s+(+r.giuLai10||0),0)), fmt(subAlloc), fmt(subUsed), fmt(subRemain), '']
          });
        }
        groupAlloc += subAlloc;
        groupUsed += subUsed;
      });

      // Group Subtotal
      const groupRemain = groupAlloc - groupUsed;
      rows.push({
        type: 'groupTotal',
        data: [`CỘNG ${g}`, '', '', fmt(groupItems.reduce((s,r)=>s+(+r.dtCapNam||0),0)), fmt(groupItems.reduce((s,r)=>s+(+r.tonNamTruoc||0),0)), fmt(groupItems.reduce((s,r)=>s+(+r.kpCapNam||0),0)), fmt(groupItems.reduce((s,r)=>s+(+r.giamDT||0),0)), fmt(groupItems.reduce((s,r)=>s+(+r.tangDT||0),0)), fmt(groupItems.reduce((s,r)=>s+(+r.giuLai10||0),0)), fmt(groupAlloc), fmt(groupUsed), fmt(groupRemain), '']
      });

      globalAlloc += groupAlloc;
      globalUsed += groupUsed;
      // Spacer row for PDF clarity
      rows.push({
        type: 'spacer',
        data: ['', '', '', '', '', '', '', '', '', '', '', '', '']
      });
    });

    // Grand Total
    const globalRemain = globalAlloc - globalUsed;
    rows.push({
      type: 'grandTotal',
      data: ['TỔNG CỘNG (I + II)', '', '', fmt(dataOnly.reduce((s,r)=>s+(+r.dtCapNam||0),0)), fmt(dataOnly.reduce((s,r)=>s+(+r.tonNamTruoc||0),0)), fmt(dataOnly.reduce((s,r)=>s+(+r.kpCapNam||0),0)), fmt(dataOnly.reduce((s,r)=>s+(+r.giamDT||0),0)), fmt(dataOnly.reduce((s,r)=>s+(+r.tangDT||0),0)), fmt(dataOnly.reduce((s,r)=>s+(+r.giuLai10||0),0)), fmt(globalAlloc), fmt(globalUsed), fmt(globalRemain), '']
    });

    console.log('PDF: Generating rows...', rows.length);

    doc.autoTable({
      head: [['Mục', 'T.Mục', 'Nội Dung', 'DT Cấp', 'Tồn Năm Tr.', 'KP Cấp ĐN', 'Giảm DT', 'Tăng DT', 'Giữ 10%', 'Được SD', 'Đã SD', 'Còn Lại', 'Trạng thái']],
      body: rows.map(r => r.data),
      startY: 50,
      theme: 'grid',
      margin: { left: 7, right: 7, top: 55, bottom: 15 },
      tableWidth: 'auto',
      styles: { fontSize: 6.2, cellPadding: 1.8, overflow: 'linebreak', font: fontName, lineColor: [200, 200, 200], lineWidth: 0.1 },
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontSize: 6.5, fontStyle: 'bold', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 12, halign: 'center' },
        2: { cellWidth: 'auto', minCellWidth: 40 },
        3: { cellWidth: 18, halign: 'right' },
        4: { cellWidth: 18, halign: 'right' },
        5: { cellWidth: 18, halign: 'right' },
        6: { cellWidth: 16, halign: 'right' },
        7: { cellWidth: 16, halign: 'right' },
        8: { cellWidth: 16, halign: 'right' },
        9: { cellWidth: 20, halign: 'right' },
        10: { cellWidth: 20, halign: 'right' },
        11: { cellWidth: 20, halign: 'right' },
        12: { cellWidth: 15, halign: 'center' }
      },
      alternateRowStyles: { fillColor: [248, 250, 255] },
      didDrawPage: function(data) {
        // Full Header on every page
        doc.setFontSize(10);
        doc.setFont(fontName, 'bold');
        doc.text('SỞ Y TẾ TỈNH LAI CHÂU', 40, 15, { align: 'center' });
        doc.text('BỆNH VIỆN ĐA KHOA THAN UYÊN', 40, 20, { align: 'center' });
        doc.setFont(fontName, 'normal');
        doc.setLineWidth(0.3);
        doc.line(20, 22, 60, 22);

        doc.setFontSize(14);
        doc.setFont(fontName, 'bold');
        doc.text('BẢNG THEO DÕI SỬ DỤNG KINH PHÍ NGÂN SÁCH NHÀ NƯỚC', 148, 30, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setFont(fontName, 'normal');
        doc.text('Năm ngân sách: ' + currentYear, 148, 37, { align: 'center' });
        doc.text('Ngày xuất: ' + new Date().toLocaleDateString('vi-VN'), 148, 43, { align: 'center' });
        
        // Page Number Footer
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text('Trang ' + pageCount, 280, 205);
      },
      didParseCell: function(data) {
        const rowIdx = data.row.index;
        const rowData = rows[rowIdx];
        if (!rowData) return;
        const rowType = rowData.type;

        if (rowType === 'groupHeader') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [30, 58, 138];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontSize = 8.5;
          data.cell.colSpan = 13;
          data.cell.styles.halign = 'left';
        }
        if (rowType === 'contentTotal') {
          data.cell.styles.fontStyle = 'bolditalic';
          data.cell.styles.fillColor = [245, 245, 245];
          data.cell.styles.textColor = [50, 50, 50];
          if (data.column.index === 0) {
            data.cell.colSpan = 3;
            data.cell.styles.halign = 'right';
          }
        }
        if (rowType === 'groupTotal') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 235, 245];
          if (data.column.index === 0) {
            data.cell.colSpan = 3;
            data.cell.styles.halign = 'right';
          }
        }
        if (rowType === 'grandTotal') {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [30, 50, 100];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontSize = 8;
          if (data.column.index === 0) {
            data.cell.colSpan = 3;
            data.cell.styles.halign = 'right';
          }
        }

        // Color negative numbers
        if (data.column.index === 11 && data.section === 'body') {
          const val = data.cell.raw || '';
          if (val.toString().startsWith('-')) data.cell.styles.textColor = [200, 0, 0];
        }
        // Status Colors
        if (data.column.index === 12 && data.section === 'body' && rowType === 'item') {
          const v = data.cell.raw;
          if (v === 'Vượt KP') data.cell.styles.textColor = [200, 0, 0];
          else if (v === 'Cảnh báo') data.cell.styles.textColor = [180, 100, 0];
          else if (v === 'Bình thường') data.cell.styles.textColor = [0, 120, 60];
        }
      }
    });
    // Note: didDrawPage already handles page numbering and title
    const pdfBlob = doc.output('blob');
    downloadBlob(pdfBlob, `ngan_sach_${currentYear}.pdf`);
    toast('Da xuat file PDF thanh cong','success');
  }catch(err){
    console.error(err);
    toast('Loi khi xuat PDF: '+err.message,'error');
  }
}

// ===== IMPORT DATA =====
let pendingImportData=[];
function getYearKey(year){return'budget_items_'+year;}
function getAllSavedYears(){
  const years=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key&&key.startsWith('budget_items_')){
      const y=key.replace('budget_items_','');
      if(!isNaN(+y))years.push(+y);
    }
  }
  return years.sort((a,b)=>b-a);
}
function parseCSVText(text){
  const lines=text.trim().split('\n').filter(l=>l.trim());
  if(lines.length<2)return[];
  const parsed=[];
  for(let i=1;i<lines.length;i++){
    const line=lines[i];
    // Handle quoted fields
    const cols=[];
    let cur='',inQuote=false;
    for(let c=0;c<line.length;c++){
      const ch=line[c];
      if(ch==='"'){inQuote=!inQuote;}
      else if((ch===','||ch==='\t')&&!inQuote){cols.push(cur.trim());cur='';}
      else{cur+=ch;}
    }
    cols.push(cur.trim());
    if(cols.length>=3){
      parsed.push({
        muc:cols[0]||'',tieumuc:cols[1]||'',noidung:cols[2]||'',
        dtCapNam:+cols[3]||0,tonNamTruoc:+cols[4]||0,kpCapNam:+cols[5]||0,
        giamDT:+cols[6]||0,tangDT:+cols[7]||0,daDung:+cols[8]||0,
        hanDate:cols[9]||''
      });
    }
  }
  return parsed;
}

// ===== EXCEL IMPORT =====
let currentWorkbook=null;
let currentSheetData=[];
let currentHeaders=[];

const FIELD_PATTERNS={
  muc:[/^stt/i,/^s[oố]\s*tt/i,/^muc/i,/^m$/i,/^stt\s*chi\s*tiet/i],
  tieumuc:[/^ma\s*ndkt/i,/tieu\s*muc/i,/t\.?\s*muc/i,/tmuc/i,/^ma\s*nd/i,/^ma\s*tieu\s*muc/i],
  noidung:[/^ten\s*ndkt/i,/noi\s*dung/i,/ten/i,/dien\s*giai/i,/chi\s*tiet/i,/danh\s*muc/i,/^noidung\s*kinh\s*phi/i],
  dtCapNam:[/^du\s*toan\s*duoc\s*giao/i,/du\s*toan/i,/dt\s*kp/i,/kp\s*cap/i,/k\.?phi\s*cap/i,/^tong\s*du\s*toan/i],
  tonNamTruoc:[/ton/i,/nam\s*truoc/i,/mang\s*sang/i,/^so\s*du\s*dau\s*nam/i],
  kpCapNam:[/^kp\s*cap\s*dau\s*nam/i,/kp\s*moi/i,/^kp\s*cap\s*bo\s*sung/i],
  giamDT:[/giam/i,/^dieu\s*chinh\s*giam/i],
  tangDT:[/tang/i,/^dieu\s*chinh\s*tang/i],
  daDung:[/so\s*du\s*den\s*ky\s*bao\s*cao/i,/da\s*su\s*dung/i,/da\s*dung/i,/da\s*thuc\s*hien/i,/thuc\s*chi/i,/thuc\s*hien/i,/^tong\s*da\s*dung/i,/^da\s*thanh\s*toan/i,/^so\s*da\s*dung/i,/^thanh\s*toan/i],
  hanDate:[/ngay/i,/han/i,/thoi\s*gian/i,/deadline/i,/^ngay\s*het\s*han/i],
  maNguon:[/^ma\s*nguon\s*nsnn/i,/ma\s*nguon/i,/nguon\s*nsnn/i,/nguon/i,/^ma\s*nguon/i,/^ma\s*nguon\s*ns/i,/^nguon\s*chi/i,/^ma\s*ng/i]
};

function parseNum(v){
  if(v==null||v==='')return 0;
  if(typeof v==='number')return v;
  const s=String(v).replace(/\s/g,'').replace(/\./g,'').replace(/,/g,'.');
  const n=parseFloat(s);
  return isNaN(n)?0:n;
}

function removeVietnameseAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function autoMapColumns(headers){
  const mapping={};
  const used=new Set();
  Object.keys(FIELD_PATTERNS).forEach(field=>{
    const patterns=FIELD_PATTERNS[field];
    for(let i=0;i<headers.length;i++){
      if(used.has(i))continue;
      const original=String(headers[i]||'').trim();
      const h=removeVietnameseAccents(original);
      for(const pat of patterns){
        if(pat.test(h)){mapping[field]=i;used.add(i);return;}
      }
    }
  });
  return mapping;
}

function handleExcelFile(file){
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const data=new Uint8Array(ev.target.result);
      currentWorkbook=XLSX.read(data,{type:'array',cellDates:true,cellNF:true});
      const names=currentWorkbook.SheetNames;
      if(!names.length){toast('File Excel khong co sheet nao','error');return;}
      // Populate sheet selector
      const sel=document.getElementById('sheetSelect');
      sel.innerHTML=names.map((n,i)=>`<option value="${i}">${n}</option>`).join('');
      document.getElementById('sheetSelector').style.display='flex';
      document.getElementById('startRow').value='1';
      // Info
      toast('Da doc file Excel: '+names.length+' sheet','success');
      // Auto-parse first sheet
      parseSelectedSheet();
    }catch(err){
      console.error(err);
      toast('Loi doc file Excel: '+err.message,'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

function parseSelectedSheet(){
  if(!currentWorkbook)return;
  const idx=+document.getElementById('sheetSelect').value;
  const startRow=Math.max(0,(+document.getElementById('startRow').value||1)-1);
  const sheetName=currentWorkbook.SheetNames[idx];
  const ws=currentWorkbook.Sheets[sheetName];
  const raw=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',blankrows:false});
  if(raw.length<=startRow){
    toast('Sheet "'+sheetName+'" khong co du lieu tu dong '+( startRow+1),'error');
    return;
  }
  
  let topHeader = '';
  currentHeaders = raw[startRow].map((h, i) => {
    if (startRow > 0 && raw[startRow - 1][i]) {
      topHeader = String(raw[startRow - 1][i]).trim();
    }
    let h2 = String(h || '').trim();
    if (topHeader && h2 && topHeader !== h2 && !['Nội dung', 'Mục lục NSNN', 'A', 'B', 'C', 'D', 'E'].includes(topHeader)) {
      return topHeader + ' - ' + h2;
    }
    return h2 || topHeader || ('Cot ' + (i + 1));
  });

  currentSheetData=raw.slice(startRow+1).filter(row=>row.some(c=>c!==''&&c!=null));
  // Show column mapping
  showColumnMapping(currentHeaders);
  // Info
  const info=document.createElement('div');
  info.className='excel-info';
  info.innerHTML=`Sheet: <strong>${sheetName}</strong> | So dong: <strong>${currentSheetData.length}</strong> | So cot: <strong>${currentHeaders.length}</strong>`;
  const mapEl=document.getElementById('columnMapping');
  const existing=mapEl.querySelector('.excel-info');
  if(existing)existing.remove();
  mapEl.prepend(info);
}

function showColumnMapping(headers){
  const mapping=autoMapColumns(headers);
  const fields=[
    {key:'maNguon',label:'Mã Nguồn NSNN (12/13)'},
    {key:'muc',label:'Muc'},
    {key:'tieumuc',label:'Tieu muc (Ma NDKT)'},
    {key:'noidung',label:'Noi dung'},
    {key:'dtCapNam',label:'DT KP Cap'},
    {key:'tonNamTruoc',label:'Ton nam truoc'},
    {key:'kpCapNam',label:'KP Cap DN'},
    {key:'giamDT',label:'Giam DT'},
    {key:'tangDT',label:'Tang DT'},
    {key:'daDung',label:'KP Da SD (So du den ky)'},
    {key:'hanDate',label:'Ngay HH'}
  ];
  const opts=headers.map((h,i)=>`<option value="${i}">${h||'Cot '+(i+1)}</option>`);
  const noneOpt='<option value="-1">-- Bo qua --</option>';
  let html='<h4>\uD83D\uDD17 Gan cot du lieu (tu dong nhan dien, co the chinh sua):</h4><div class="mapping-grid">';
  fields.forEach(f=>{
    const sel=mapping[f.key]!=null?mapping[f.key]:-1;
    html+=`<div class="mapping-item"><label>${f.label}</label><select data-field="${f.key}">${noneOpt}${opts}</select></div>`;
    // Pre-select after render
    setTimeout(()=>{
      const el=document.querySelector(`select[data-field="${f.key}"]`);
      if(el)el.value=sel;
    },50);
  });
  html+='</div>';
  html+='<div class="mapping-actions"><button class="btn-primary" id="btnApplyMapping">\u2705 Ap dung va Xem truoc</button></div>';
  const mapEl=document.getElementById('columnMapping');
  mapEl.innerHTML=html;
  mapEl.style.display='block';
  // Event
  setTimeout(()=>{
    document.getElementById('btnApplyMapping').addEventListener('click',applyMapping);
  },100);
}

function applyMapping(){
  const selects=document.querySelectorAll('#columnMapping select[data-field]');
  const map={};
  selects.forEach(s=>{map[s.dataset.field]=+s.value;});
  // Convert data
  const parsed=[];
  currentSheetData.forEach(row=>{
    const get=(key)=>map[key]>=0?row[map[key]]:'';
    const noidung=String(get('noidung')||'').trim();
    if(!noidung)return; // skip empty rows
    const maNguonRaw = String(get('maNguon')||'').trim();
    const maNguon = maNguonRaw.split('.')[0].replace(/^0+/, ''); // Handle 12.0, 012, 0012
    let computedGroup = '';
    
    // Automatic categorization based on KBNN source codes (12 = Non-Frequent, 13 = Frequent)
    if (maNguon === '12') computedGroup = 'KP KHÔNG THƯỜNG XUYÊN';
    else if (maNguon === '13') computedGroup = 'KP THƯỜNG XUYÊN';
    else if (noidung.toUpperCase().includes('KHÔNG THƯỜNG XUYÊN') || noidung.toUpperCase().includes('KTX') || noidung.includes('12')) computedGroup = 'KP KHÔNG THƯỜNG XUYÊN';
    else if (noidung.toUpperCase().includes('THƯỜNG XUYÊN') || noidung.toUpperCase().includes('TX') || noidung.includes('13')) computedGroup = 'KP THƯỜNG XUYÊN';

  parsed.push({
      muc:String(get('muc')||'').trim(),
      tieumuc:String(get('tieumuc')||'').trim(),
      noidung:noidung,
      dtCapNam:parseNum(get('dtCapNam')),
      tonNamTruoc:parseNum(get('tonNamTruoc')),
      kpCapNam:parseNum(get('kpCapNam')),
      giamDT:parseNum(get('giamDT')),
      tangDT:parseNum(get('tangDT')),
      daDung:parseNum(get('daDung')),
      hanDate:formatDateValue(get('hanDate')),
      group: computedGroup || document.getElementById('importGroup').value
    });
  });
  pendingImportData=parsed;
  renderImportPreview(parsed);
  toast('Đã phân tích '+parsed.length+' dòng dữ liệu','success');
}

function formatDateValue(v){
  if(!v)return'';
  if(v instanceof Date){
    const d=v.getDate(),m=v.getMonth()+1,y=v.getFullYear();
    return(d<10?'0':'')+d+'/'+(m<10?'0':'')+m+'/'+y;
  }
  const s=String(v).trim();
  // Already dd/mm/yyyy
  if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s))return s;
  // yyyy-mm-dd
  if(/^\d{4}-\d{2}-\d{2}/.test(s))return s.substring(8,10)+'/'+s.substring(5,7)+'/'+s.substring(0,4);
  return s;
}
function renderImportPreview(data){
  if(!data.length){
    document.getElementById('importPreview').innerHTML='<div class="empty-state"><div class="empty-icon">📭</div><p>Không có dữ liệu để xem trước</p></div>';
    document.getElementById('importConfirm').style.display='none';
    return;
  }
  let html='<div class="table-wrap"><table><thead><tr><th>Nhóm</th><th>Mục</th><th>T.Mục</th><th>Nội Dung</th><th>DT KP Cấp</th><th>KP Đã SD</th><th style="text-align:center">Tự động</th></tr></thead><tbody>';
  data.forEach(r=>{
    const autoBadge = r.group ? '<span class="status-badge status-good" style="font-size:9px">✔ Auto</span>' : '';
    html+=`<tr>
      <td style="font-size:10px;color:var(--text-secondary)">${r.group || '<span style="color:var(--text-muted)">-</span>'}</td>
      <td>${r.muc}</td>
      <td>${r.tieumuc}</td>
      <td>${r.noidung}</td>
      <td style="text-align:right">${fmt(r.dtCapNam + r.tonNamTruoc + r.tangDT - r.giamDT)}</td>
      <td style="text-align:right">${fmt(r.daDung)}</td>
      <td style="text-align:center">${autoBadge}</td>
    </tr>`;
  });
  html+='</tbody></table></div>';
  html+=`<p style="margin-top:12px;color:var(--text-secondary);font-size:12px">Tìm thấy <strong>${data.length}</strong> khoản chi. Vui lòng kiểm tra kỹ trước khi xác nhận.</p>`;
  document.getElementById('importPreview').innerHTML=html;
  document.getElementById('importConfirm').style.display='flex';
}
function confirmImport(){
  const role = localStorage.getItem('budget_user_role');
  if (role !== 'admin') {
    toast('Bạn không có quyền nhập dữ liệu', 'error');
    return;
  }
  if(!pendingImportData.length){toast('Khong co du lieu de nhap','error');return;}
  const year=document.getElementById('importYear').value;
  const group=document.getElementById('importGroup').value;
  const key=getYearKey(year);
  let existing=JSON.parse(localStorage.getItem(key)||'[]');
  const startId=existing.length?Math.max(...existing.map(x=>x.id))+1:1;
  const newItems=pendingImportData.map((r,i)=>({
    id:startId+i,group:r.group||group,muc:r.muc,tieumuc:r.tieumuc,noidung:r.noidung,
    dtCapNam:r.dtCapNam,tonNamTruoc:r.tonNamTruoc,kpCapNam:r.kpCapNam,
    giamDT:r.giamDT,tangDT:r.tangDT,daDung:r.daDung,
    hanDate:r.hanDate||'31/12/'+year,note:'',isGroupHeader:false
  }));
  existing=existing.concat(newItems);
  localStorage.setItem(key,JSON.stringify(existing));
  // Save to cloud
  if (budgetSupabaseClient) {
    budgetSupabaseClient.from('budget_data').upsert({ year: String(year), items: existing })
      .then(({error}) => { if(error) console.error(error); });
  }

  // If importing to current year, reload items
  if(+year===currentYear){
    items=existing;
  }
  pendingImportData=[];
  document.getElementById('importPreview').innerHTML='<div class="empty-state" style="padding:20px"><div class="empty-icon">✅</div><p>Đã nhập thành công '+newItems.length+' khoản chi vào năm '+year+'</p></div>';
  document.getElementById('importConfirm').style.display='none';
  document.getElementById('pasteArea').style.display='none';
  toast('Đã nhập '+newItems.length+' khoản chi vào năm '+year,'success');
  renderYearHistory();
}
function renderYearHistory(){
  const years=getAllSavedYears();
  if(!years.length){
    document.getElementById('yearHistory').innerHTML='<div class="empty-state"><div class="empty-icon">📅</div><p>Chua co du lieu nam nao duoc luu</p></div>';
    return;
  }
  let html='';
  years.forEach(y=>{
    const key=getYearKey(y);
    const data=JSON.parse(localStorage.getItem(key)||'[]');
    const nonH=data.filter(x=>!x.isGroupHeader);
    const total=nonH.reduce((s,r)=>s+calcKpDuocSD(r),0);
    const used=nonH.reduce((s,r)=>s+(+r.daDung||0),0);
    html+=`<div class="year-history-item">
      <div class="year-info">
        <div class="year-badge">${y}</div>
        <div class="year-detail">
          <strong>${nonH.length}</strong> khoan chi | KP Duoc SD: <strong>${fmt(total)}</strong> | Da dung: <strong>${fmt(used)}</strong>
        </div>
      </div>
      <div class="year-actions">
        <button class="btn-edit" onclick="loadYear(${y})" title="Tai du lieu nam nay">📂 Tai</button>
        <button class="btn-edit" onclick="exportYearCSV(${y})" title="Xuat CSV">📥 CSV</button>
        <button class="btn-edit" onclick="exportYearPDF(${y})" title="Xuat PDF">📄 PDF</button>
        <button class="btn-del" onclick="deleteYear(${y})" title="Xoa du lieu nam nay">🗑</button>
      </div>
    </div>`;
  });
  document.getElementById('yearHistory').innerHTML=html;
}
async function loadYear(year){
  currentYear=year;
  document.getElementById('yearSelect').value=year;
  document.getElementById('fiscal-year-display').textContent=year;
  await loadCurrentYearData();
  toast('Đã tải dữ liệu năm '+year+' ('+items.length+' khoản)','success');
  budgetNavigate('dashboard');
}
function exportYearCSV(year){
  const key=getYearKey(year);
  const data=JSON.parse(localStorage.getItem(key)||'[]').filter(x=>!x.isGroupHeader);
  if(!data.length){toast('Khong co du lieu','error');return;}
  const headers=['Muc','T.Muc','Noi dung','DT KP Cap','Ton Nam Truoc','KP Cap DN','Giam DT','Tang DT','KP Da SD','Ngay HH'];
  const rows=data.map(r=>[r.muc,r.tieumuc,'"'+r.noidung+'"',r.dtCapNam||0,r.tonNamTruoc||0,r.kpCapNam||0,r.giamDT||0,r.tangDT||0,r.daDung||0,r.hanDate||'']);
  const csv='\uFEFF'+[headers,...rows].map(r=>r.join(',')).join('\n');
  downloadBlob(new Blob([csv],{type:'text/csv;charset=utf-8'}), `ngan_sach_${year}.csv`);
  toast('Da xuat CSV nam '+year,'success');
}
function exportYearPDF(year){
  const origYear=currentYear;
  const key=getYearKey(year);
  const origItems=items;
  items=JSON.parse(localStorage.getItem(key)||'[]');
  currentYear=year;
  exportPDF();
  items=origItems;
  currentYear=origYear;
}

function deleteYear(year){
  customConfirm('Xóa toàn bộ dữ liệu năm '+year+'?', () => {
    localStorage.removeItem(getYearKey(year));
    toast('Đã xóa dữ liệu năm '+year,'success');
    renderYearHistory();
  });
}

function downloadTemplate(){
  const headers='Muc,Tieu Muc,Noi Dung,DT KP Cap Dau Nam,Ton Nam Truoc,KP Cap Dau Nam,Giam DT,Tang DT,KP Da SD,Ngay HH';
  const sample='1,6001,Luong theo ngach bac,10000000,0,5000000,0,0,8000000,31/12/2025';
  const csv='\uFEFF'+headers+'\n'+sample;
  downloadBlob(new Blob([csv],{type:'text/csv;charset=utf-8'}), 'mau_nhap_ngan_sach.csv');
  toast('Da tai mau CSV','success');
}

// ===== TOAST =====
function toast(msg,type='info'){
  const tc=document.getElementById('toastContainer');
  if(!tc) return;
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  const icons={success:'✅',error:'❌',info:'ℹ️'};
  el.innerHTML=`<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
  tc.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity 0.3s';setTimeout(()=>el.remove(),300);},3000);
}

// Authentication logic has been moved to index.html for fallback reliability.
async function initApp() {
  
  try {
    console.log('Hệ thống đang khởi tạo...');
    const loginScreen = document.getElementById('login-screen');
    const mainApp = document.getElementById('main-app');
    const loginError = document.getElementById('login-error');
    const btnLogin = document.getElementById('main-budget-login-btn');

    if (!loginScreen || !mainApp || !btnLogin) {
      console.error('Không tìm thấy các thành phần giao diện cần thiết!');
      return;
    }

    
    // Start data load in background
    loadCurrentYearData().then(() => {
      
      if (localStorage.getItem('budget_user_role')) {
        renderDashboard();
        renderTable();
      }
    }).catch(err => {
      
    });

    // ===== EVENT LISTENERS =====
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('budget_user_role');
        const loginUserEl = document.getElementById('login-username');
        const loginPassEl = document.getElementById('login-password');
        if (loginUserEl) loginUserEl.value = '';
        if (loginPassEl) loginPassEl.value = '';
        checkAuth();
      });
    }

    const userEl = document.getElementById('login-username');
    const passEl = document.getElementById('login-password');
    if (passEl) {
      passEl.addEventListener('keypress', e => { if (e.key === 'Enter') handleLogin(); });
    }
    if (userEl) {
      userEl.addEventListener('keypress', e => { if (e.key === 'Enter' && passEl) passEl.focus(); });
    }
    
    if (btnLogin) {
      btnLogin.addEventListener('click', handleLogin);
    }

    checkAuth();

    checkAuth();

    // date
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
      currentDateEl.textContent = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    const fiscalYearDisplay = document.getElementById('fiscal-year-display');
    if (fiscalYearDisplay) fiscalYearDisplay.textContent = currentYear;

    // nav
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const page = el.dataset.page;
        const filter = el.dataset.filter || '';
        budgetNavigate(page, filter);
      });
    });

    // sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    if (menuToggle && sidebar) {
      const closeBtn = document.getElementById('sidebarClose');
      const updateCloseBtnVisibility = () => {
        if (closeBtn) closeBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
      };

      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        updateCloseBtnVisibility();
      });

      document.querySelectorAll('.nav-item').forEach(el => {
        el.addEventListener('click', () => {
          if (window.innerWidth <= 768) sidebar.classList.remove('open');
        });
      });

      document.addEventListener('click', e => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
          if (!sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('open');
          }
        }
      });

      window.addEventListener('resize', updateCloseBtnVisibility);
      updateCloseBtnVisibility();
    }

    // year select
    const yearSelect = document.getElementById('yearSelect');
    if (yearSelect) {
      yearSelect.addEventListener('change', async e => {
        currentYear = +e.target.value;
        const fyd = document.getElementById('fiscal-year-display');
        if (fyd) fyd.textContent = currentYear;
        await loadCurrentYearData();
        toast('Đã chuyển sang năm ' + currentYear, 'info');
        const activePg = document.querySelector('.nav-item.active');
        if (activePg) budgetNavigate(activePg.dataset.page);
      });
    }

    // search & filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        filterText = e.target.value;
        currentPage = 1;
        const pageBudget = document.getElementById('page-budget');
        if (pageBudget && pageBudget.classList.contains('active')) renderTable();
      });
    }
    const filterCategory = document.getElementById('filterCategory');
    if (filterCategory) {
      filterCategory.addEventListener('change', e => { filterGroup = e.target.value; currentPage = 1; renderTable(); });
    }
    const filterStatusEl = document.getElementById('filterStatus');
    if (filterStatusEl) {
      filterStatusEl.addEventListener('change', e => { filterStatus = e.target.value; currentPage = 1; renderTable(); });
    }

    // export
    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', exportCSV);
    const btnExportXlsx = document.getElementById('btnExportXlsx');
    if (btnExportXlsx) btnExportXlsx.addEventListener('click', exportXlsx);
    const btnExportPdf = document.getElementById('btnExportPdf');
    if (btnExportPdf) btnExportPdf.addEventListener('click', exportPDF);

    // Drag & Drop
    const dropZone = document.getElementById('dropZone');
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('drag-over'); });
      });
      ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropZone.classList.remove('drag-over'); });
      });
      dropZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (!files.length) return;
        const file = files[0];
        const name = file.name.toLowerCase();
        if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
          handleExcelFile(file);
        } else if (name.endsWith('.csv')) {
          const reader = new FileReader();
          reader.onload = ev => {
            pendingImportData = parseCSVText(ev.target.result);
            renderImportPreview(pendingImportData);
          };
          reader.readAsText(file, 'UTF-8');
        } else {
          toast('Chỉ hỗ trợ file .xlsx, .xls, .csv', 'error');
        }
      });
    }

    // import Excel file
    const importExcelFile = document.getElementById('importExcelFile');
    if (importExcelFile) {
      importExcelFile.addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return;
        handleExcelFile(file);
        e.target.value = '';
      });
    }
    const btnParseSheet = document.getElementById('btnParseSheet');
    if (btnParseSheet) btnParseSheet.addEventListener('click', parseSelectedSheet);

    // import CSV file
    const importFile = document.getElementById('importFile');
    if (importFile) {
      importFile.addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          pendingImportData = parseCSVText(ev.target.result);
          renderImportPreview(pendingImportData);
        };
        reader.readAsText(file, 'UTF-8');
        e.target.value = '';
      });
    }
    const btnDownloadTemplate = document.getElementById('btnDownloadTemplate');
    if (btnDownloadTemplate) btnDownloadTemplate.addEventListener('click', downloadTemplate);
    const btnPasteData = document.getElementById('btnPasteData');
    if (btnPasteData) {
      btnPasteData.addEventListener('click', () => {
        const pa = document.getElementById('pasteArea');
        if (pa) pa.style.display = pa.style.display === 'none' ? 'block' : 'none';
      });
    }
    const btnParsePaste = document.getElementById('btnParsePaste');
    if (btnParsePaste) {
      btnParsePaste.addEventListener('click', () => {
        const pasteTextarea = document.getElementById('pasteTextarea');
        const text = pasteTextarea ? pasteTextarea.value : '';
        if (!text.trim()) { toast('Vui lòng dán dữ liệu', 'error'); return; }
        const withHeader = 'Muc,Tieu Muc,Noi Dung,DT,Ton,KP,Giam,Tang,DaDung,Han\n' + text;
        pendingImportData = parseCSVText(withHeader);
        renderImportPreview(pendingImportData);
      });
    }
    const btnConfirmImport = document.getElementById('btnConfirmImport');
    if (btnConfirmImport) btnConfirmImport.addEventListener('click', confirmImport);
    const btnCancelImport = document.getElementById('btnCancelImport');
    if (btnCancelImport) {
      btnCancelImport.addEventListener('click', () => {
        pendingImportData = [];
        document.getElementById('importPreview').innerHTML = '';
        document.getElementById('importConfirm').style.display = 'none';
        document.getElementById('columnMapping').style.display = 'none';
        const sheetSelector = document.getElementById('sheetSelector');
        if (sheetSelector) sheetSelector.style.display = 'none';
        currentWorkbook = null;
      });
    }

    // modal close
    const modalClose = document.getElementById('modalClose');
    if (modalClose) modalClose.addEventListener('click', () => document.getElementById('modalOverlay').classList.remove('open'));
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', e => { if (e.target === e.currentTarget) e.target.classList.remove('open'); });
    }

    // form calc
    ['f-dtcapnam', 'f-tonnuoctruoc', 'f-giam', 'f-tang', 'f-dadung'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateCalc);
    });

    // cancel btn
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', () => { resetForm(); budgetNavigate('budget', currentNavFilter); });

    // form submit
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
      budgetForm.addEventListener('submit', e => {
        e.preventDefault();
        const role = localStorage.getItem('budget_user_role');
        if (role !== 'admin') {
          toast('Bạn không có quyền thực hiện thao tác này', 'error');
          return;
        }
        const targetYear = +document.getElementById('f-year').value;
        const hanRaw = document.getElementById('f-handate').value;
        const hanFormatted = hanRaw ? hanRaw.split('-').reverse().join('/') : '';
        const record = {
          group: document.getElementById('f-group').value,
          muc: document.getElementById('f-muc').value,
          tieumuc: document.getElementById('f-tieumuc').value,
          noidung: document.getElementById('f-noidung').value,
          dtCapNam: +document.getElementById('f-dtcapnam').value || 0,
          tonNamTruoc: +document.getElementById('f-tonnuoctruoc').value || 0,
          kpCapNam: +document.getElementById('f-kpcapnam').value || 0,
          giamDT: +document.getElementById('f-giam').value || 0,
          tangDT: +document.getElementById('f-tang').value || 0,
          giuLai10: +document.getElementById('f-giulai10').value || 0,
          daDung: +document.getElementById('f-dadung').value || 0,
          hanDate: hanFormatted,
          note: document.getElementById('f-note').value,
          isGroupHeader: false
        };
        if (editingId) {
          record.id = editingId;
          const idx = items.findIndex(x => x.id === editingId);
          if (idx >= 0) items[idx] = record;
          toast('Đã cập nhật khoản chi', 'success');
          save();
        } else {
          if (targetYear === currentYear) {
            record.id = nextId();
            items.push(record);
            toast('Đã thêm khoản chi mới vào năm ' + currentYear, 'success');
            save();
          } else {
            const key = getYearKey(targetYear);
            const otherItems = JSON.parse(localStorage.getItem(key) || '[]');
            const nextOtherId = otherItems.length ? Math.max(...otherItems.map(x => x.id)) + 1 : 1;
            record.id = nextOtherId;
            otherItems.push(record);
            localStorage.setItem(key, JSON.stringify(otherItems));
            // Also save to cloud for other years
            if (budgetSupabaseClient) {
              budgetSupabaseClient.from('budget_data').upsert({ year: String(targetYear), items: otherItems })
                .then(({error}) => { if(error) console.error(error); });
            }
            toast('Đã thêm khoản chi vào năm ' + targetYear, 'success');
          }
        }
        resetForm(); budgetNavigate('budget', currentNavFilter);
      });
    }

  } catch (globalErr) {
    console.error('LỖI KHỞI TẠO NGHIÊM TRỌNG:', globalErr);
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
