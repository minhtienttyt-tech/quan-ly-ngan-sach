

// --- INLINE SCRIPTS FROM INDEX.HTML ---
// EMERGENCY FALLBACK LOGIN LOGIC
    window.checkAuth = function() {
      try {
        const role = localStorage.getItem('budget_user_role');
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        if (!loginScreen || !mainApp) return;
        if (role) {
          loginScreen.style.display = 'none';
          mainApp.style.display = 'block';
          document.body.classList.toggle('role-user', role !== 'admin');
          const roleText = document.getElementById('currentUserRole');
          if (roleText) roleText.textContent = role === 'admin' ? 'Quản trị viên' : 'Thành viên';
          return true;
        }
        loginScreen.style.display = 'flex';
        mainApp.style.display = 'none';
        return false;
      } catch(e) { console.error(e); }
    };
    window.handleLogin = async function() {
      const u = document.getElementById('login-username').value.trim().toLowerCase();
      const p = document.getElementById('login-password').value.trim();
      const btn = document.getElementById('main-budget-login-btn');
      const err = document.getElementById('login-error');
      if (btn) { btn.disabled = true; btn.innerText = 'Đang xử lý...'; }
      await new Promise(r => setTimeout(r, 500));

      // Đọc credentials từ localStorage (được cài trong màn hình Setup)
      const adminUser = (localStorage.getItem('cred_admin_user') || 'admin').toLowerCase();
      const adminPass = localStorage.getItem('cred_admin_pass') || 'Minhtien@1986';
      const normalUser = (localStorage.getItem('cred_user_user') || 'user').toLowerCase();
      const normalPass = localStorage.getItem('cred_user_pass') || 'user';

      let matchedRole = null;
      if (u === adminUser && p === adminPass) matchedRole = 'admin';
      else if (u === normalUser && p === normalPass) matchedRole = 'user';

      if (matchedRole) {
        localStorage.setItem('budget_user_role', matchedRole);
        if (err) err.style.display = 'none';
        window.checkAuth();
        if (window.budgetNavigate) window.budgetNavigate('dashboard');
        if (window.toast) window.toast('Đăng nhập thành công', 'success');
        else alert('Đăng nhập thành công!');
      } else {
        if (err) err.style.display = 'block';
        if (btn) { btn.disabled = false; btn.innerText = 'Đăng Nhập'; }
      }
    };
    // Auto-check on load
    document.addEventListener('DOMContentLoaded', () => {
      window.checkAuth();
      const p = document.getElementById('login-password');
      if(p) p.addEventListener('keypress', e => { if(e.key==='Enter') window.handleLogin(); });
    });

// Core Navigation
    window.budgetNavigate = function(page, filter) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const pg = document.getElementById('page-' + page);
      if (pg) pg.classList.add('active');
      
      const navId = page === 'budget' ? `nav-budget-${filter||'all'}` : `nav-${page}`;
      const nav = document.getElementById(navId);
      if (nav) nav.classList.add('active');
      
      if (page === 'dashboard' && window.renderDashboard) window.renderDashboard();
      if (page === 'budget' && window.renderTable) window.renderTable();
    };

    // Orientation Checker (JS)
    function checkOrientation() {
      const overlay = document.getElementById('orientation-warning');
      if (!overlay) return;
      
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobileOrTablet = window.innerWidth <= 1200;
      
      if (isMobileOrTablet && isPortrait) {
        overlay.style.display = 'flex';
      } else {
        overlay.style.display = 'none';
      }
    }
    
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('load', checkOrientation);
// --------------------------------------

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
let currentYear=new Date().getFullYear();
function getStorageKey(){return 'budget_items_'+currentYear;}
let items=[];
let currentPage=1;const PAGE_SIZE=50;
let filterText='',filterGroup='',filterStatus='';
let editingId=null;
let currentNavFilter='all';
let syncMode = localStorage.getItem('budget_sync_mode') || 'sheet'; // 'local' | 'supabase' | 'sheet' | 'both'
let googleSheetUrl = (localStorage.getItem('budget_sheet_url') || 'https://script.google.com/macros/s/AKfycbxBTxMzJwXLsGInfWhblYFFZ9WtCgDTQKb9g8S66v1K1pSO39WkWMzQGf_NVNqR5faJ/exec').trim();
if (googleSheetUrl.startsWith('/')) {
  googleSheetUrl = googleSheetUrl.substring(1);
}
if (googleSheetUrl && !googleSheetUrl.startsWith('http://') && !googleSheetUrl.startsWith('https://')) {
  googleSheetUrl = 'https://' + googleSheetUrl;
}

let autoSyncTimeSeconds = localStorage.getItem('budget_auto_sync') || '30';
let autoSyncIntervalId = null;
let lastSaveTime = 0;

// ===== UNIT SETUP & BANNER =====

/**
 * Đọc thông tin đơn vị từ localStorage và cập nhật tất cả các phần tử hiển thị động
 */
function renderUnitBanner() {
  const unitName   = localStorage.getItem('unit_name')    || 'Bệnh viện đa khoa Than Uyên';
  const dept       = localStorage.getItem('unit_dept')    || 'Phòng KH-TC-ĐD';
  const contact    = localStorage.getItem('unit_contact') || 'Phạm Minh Tiến';
  const phone      = localStorage.getItem('unit_phone')   || '0975198657';

  // --- Login hero banner ---
  const heroName  = document.getElementById('login-hero-name');
  const heroDept  = document.getElementById('login-hero-dept');
  const heroUnit  = document.getElementById('login-hero-unit');
  const heroPhone = document.getElementById('login-hero-phone');
  if (heroName)  heroName.textContent  = contact;
  if (heroDept)  heroDept.textContent  = dept;
  if (heroUnit)  heroUnit.textContent  = unitName;
  if (heroPhone) {
    heroPhone.textContent = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    heroPhone.href = 'tel:' + phone;
  }

  // --- Sidebar contact card ---
  const sbName  = document.getElementById('sidebar-contact-name');
  const sbDept  = document.getElementById('sidebar-contact-dept');
  const sbPhone = document.getElementById('sidebar-contact-phone');
  if (sbName)  sbName.textContent  = contact;
  if (sbDept)  sbDept.textContent  = dept + ' · ' + unitName;
  if (sbPhone) sbPhone.textContent = '📞 ' + phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
}

/**
 * Hiển thị màn hình setup và điền sẵn thông tin hiện tại
 */
window.openSetupScreen = function() {
  const setupScreen = document.getElementById('setup-screen');
  if (!setupScreen) return;

  // Điền sẵn giá trị hiện tại
  const fields = {
    'setup-unit-name':    localStorage.getItem('unit_name')    || '',
    'setup-department':   localStorage.getItem('unit_dept')    || '',
    'setup-contact-name': localStorage.getItem('unit_contact') || '',
    'setup-phone':        localStorage.getItem('unit_phone')   || '',
    'setup-sheet-url':    localStorage.getItem('budget_sheet_url') || googleSheetUrl || '',
    'setup-admin-user':   localStorage.getItem('cred_admin_user') || 'admin',
    'setup-admin-pass':   localStorage.getItem('cred_admin_pass') || '',
    'setup-user-user':    localStorage.getItem('cred_user_user')  || 'user',
    'setup-user-pass':    localStorage.getItem('cred_user_pass')  || ''
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  });

  setupScreen.style.display = 'flex';
};

/**
 * Lưu thông tin đơn vị từ màn hình setup vào localStorage
 */
window.saveSetupInfo = function() {
  const unitName   = (document.getElementById('setup-unit-name')?.value    || '').trim();
  const dept       = (document.getElementById('setup-department')?.value   || '').trim();
  const contact    = (document.getElementById('setup-contact-name')?.value || '').trim();
  const phone      = (document.getElementById('setup-phone')?.value        || '').trim();
  const sheetUrl   = (document.getElementById('setup-sheet-url')?.value    || '').trim();
  const adminUser  = (document.getElementById('setup-admin-user')?.value   || '').trim();
  const adminPass  = (document.getElementById('setup-admin-pass')?.value   || '').trim();
  const userUser   = (document.getElementById('setup-user-user')?.value    || '').trim();
  const userPass   = (document.getElementById('setup-user-pass')?.value    || '').trim();

  if (!unitName) {
    const el = document.getElementById('setup-unit-name');
    if (el) { el.style.borderColor = '#ef4444'; el.focus(); }
    alert('Vui lòng nhập tên đơn vị / bệnh viện!');
    return;
  }
  if (adminUser && !adminPass) {
    const el = document.getElementById('setup-admin-pass');
    if (el) { el.style.borderColor = '#ef4444'; el.focus(); }
    alert('Vui lòng nhập mật khẩu cho tài khoản Admin!');
    return;
  }

  // Lưu thông tin đơn vị
  if (unitName) localStorage.setItem('unit_name',    unitName);
  if (dept)     localStorage.setItem('unit_dept',    dept);
  if (contact)  localStorage.setItem('unit_contact', contact);
  if (phone)    localStorage.setItem('unit_phone',   phone);

  // Lưu tài khoản / mật khẩu
  if (adminUser) localStorage.setItem('cred_admin_user', adminUser.toLowerCase());
  if (adminPass) localStorage.setItem('cred_admin_pass', adminPass);
  if (userUser)  localStorage.setItem('cred_user_user',  userUser.toLowerCase());
  if (userPass)  localStorage.setItem('cred_user_pass',  userPass);

  // Lưu URL Sheet
  if (sheetUrl) {
    localStorage.setItem('budget_sheet_url', sheetUrl);
    googleSheetUrl = sheetUrl;
    setupAutoSync();
  }

  // Đánh dấu đã thiết lập
  localStorage.setItem('unit_setup_done', '1');

  // Ẩn màn hình setup
  const setupScreen = document.getElementById('setup-screen');
  if (setupScreen) setupScreen.style.display = 'none';

  // Cập nhật lại toàn bộ banner
  renderUnitBanner();

  // Thông báo thành công
  const btn = document.getElementById('setup-save-btn');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✅ Đã lưu!';
    btn.style.background = 'linear-gradient(135deg,#059669,#047857)';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2000);
  }
};

/**
 * Kiểm tra lần đầu — hiển thị setup screen nếu chưa thiết lập
 */
function checkFirstTimeSetup() {
  // Removed forced setup screen on first use per user request.
  // Setup can still be opened manually via "Sửa thông tin đơn vị" button.
  // Luôn render banner với giá trị hiện có
  renderUnitBanner();
}

/**
 * Quản lý giao diện Sáng / Tối
 */
function setupTheme() {
  const currentTheme = localStorage.getItem('budget_theme') || 'dark';
  
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
    
    // Cập nhật icon trên các nút toggle
    const icon = theme === 'light' ? '🌙' : '☀️';
    const btn1 = document.getElementById('themeToggle');
    const btn2 = document.getElementById('themeToggleLogin');
    if (btn1) btn1.textContent = icon;
    if (btn2) btn2.textContent = icon;
  }
  
  applyTheme(currentTheme);
  
  function toggleTheme() {
    const newTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
    localStorage.setItem('budget_theme', newTheme);
    applyTheme(newTheme);
  }
  
  const btn1 = document.getElementById('themeToggle');
  const btn2 = document.getElementById('themeToggleLogin');
  if (btn1) btn1.addEventListener('click', toggleTheme);
  if (btn2) btn2.addEventListener('click', toggleTheme);
}

function updateSyncStatus(status, text = '') {
  const dot = document.getElementById('header-sync-dot');
  const txt = document.getElementById('header-sync-text');
  if (!dot) return;
  
  dot.classList.remove('synced', 'syncing', 'error', 'off', 'synced-pulse');
  
  if (status === 'synced') {
    dot.classList.add('synced');
    if (text) {
      txt.textContent = text;
    } else {
      const now = new Date();
      const timeStr = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
      txt.textContent = 'Đồng bộ lúc ' + timeStr;
    }
  } else if (status === 'synced-pulse') {
    dot.classList.add('synced-pulse');
    setTimeout(() => {
      dot.classList.remove('synced-pulse');
      dot.classList.add('synced');
    }, 1200);
    if (text) {
      txt.textContent = text;
    } else {
      const now = new Date();
      const timeStr = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
      txt.textContent = 'Vừa cập nhật (' + timeStr + ')';
    }
  } else if (status === 'syncing') {
    dot.classList.add('syncing');
    txt.textContent = 'Đang đồng bộ...';
  } else if (status === 'error') {
    dot.classList.add('error');
    txt.textContent = text || 'Lỗi kết nối';
  } else {
    dot.classList.add('off');
    txt.textContent = 'Tắt tự động đồng bộ';
  }
}

async function autoSyncFromGoogleSheet() {
  if (syncMode !== 'sheet' && syncMode !== 'both') {
    updateSyncStatus('off');
    return;
  }
  if (!googleSheetUrl) {
    updateSyncStatus('error', 'Chưa cấu hình URL');
    return;
  }
  if (document.hidden || editingId !== null) return;
  
  // Tránh đè đè dữ liệu khi người dùng vừa mới lưu cục bộ trong vòng 60 giây qua
  if (Date.now() - lastSaveTime < 60000) {
    console.log('Bỏ qua đồng bộ tự động vì vừa có hoạt động lưu dữ liệu.');
    return;
  }

  updateSyncStatus('syncing');
  try {
    const sheetItems = await loadFromGoogleSheet(currentYear);
    if (sheetItems) {
      const key = getYearKey(currentYear);
      const isChanged = JSON.stringify(sheetItems) !== JSON.stringify(items);
      
      if (isChanged) {
        items = sheetItems;
        localStorage.setItem(key, JSON.stringify(items));
        
        const activePg = document.querySelector('.page.active');
        if (activePg) {
          const pageId = activePg.id.replace('page-', '');
          if (pageId === 'dashboard') renderDashboard();
          if (pageId === 'budget') renderTable();
          if (pageId === 'report') renderReport();
        }
        updateFormSuggestions();
        updateSyncStatus('synced-pulse');
      } else {
        updateSyncStatus('synced');
      }
    }
  } catch (err) {
    console.error('Background Sync Error:', err);
    updateSyncStatus('error', 'Lỗi đồng bộ');
  }
}

function setupAutoSync() {
  if (autoSyncIntervalId) {
    clearInterval(autoSyncIntervalId);
    autoSyncIntervalId = null;
  }
  
  if (syncMode !== 'sheet' && syncMode !== 'both') {
    updateSyncStatus('off');
    return;
  }

  if (autoSyncTimeSeconds === 'off') {
    updateSyncStatus('off');
    return;
  }

  const seconds = parseInt(autoSyncTimeSeconds);
  if (!isNaN(seconds) && seconds > 0) {
    autoSyncIntervalId = setInterval(autoSyncFromGoogleSheet, seconds * 1000);
    const now = new Date();
    const timeStr = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    updateSyncStatus('synced', 'Đồng bộ lúc ' + timeStr);
  }
}

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

// --- LOAD FROM GOOGLE SHEET ---
async function loadFromGoogleSheet(year) {
  if (!googleSheetUrl) return null;
  try {
    const url = `${googleSheetUrl}?action=load&year=${year}&_t=${new Date().getTime()}`;
    const res = await fetch(url, { method: 'GET', redirect: 'follow' });
    const text = await res.text();
    if (text.trim().startsWith('<') || text.includes('<!DOCTYPE html>') || text.includes('google-signin')) {
      throw new Error('Cấu hình Apps Script chưa đúng (nhận được trang HTML). Hãy đảm bảo Apps Script chạy dưới quyền "Tôi" (Me) và truy cập bởi "Bất kỳ ai" (Anyone).');
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error('Không thể phân tích JSON phản hồi: ' + text.substring(0, 150));
    }
    if (data && data.status === 'success') {
      return data.items;
    } else {
      throw new Error(data.message || 'Lỗi từ Google Sheets API');
    }
  } catch (err) {
    console.error('Fetch Google Sheet Error:', err);
    throw err;
  }
}

// --- SAVE TO GOOGLE SHEET ---
async function saveToGoogleSheet(year, itemsList) {
  if (!googleSheetUrl) return false;
  try {
    const cleanItems = JSON.parse(JSON.stringify(itemsList));
    const payload = {
      action: 'save',
      year: String(year),
      items: cleanItems
    };
    const res = await fetch(googleSheetUrl, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    if (text.trim().startsWith('<') || text.includes('<!DOCTYPE html>') || text.includes('google-signin')) {
      throw new Error('Cấu hình Apps Script chưa đúng (nhận được trang HTML). Hãy đảm bảo Apps Script chạy dưới quyền "Tôi" (Me) và truy cập bởi "Bất kỳ ai" (Anyone).');
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error('Không thể phân tích JSON phản hồi: ' + text.substring(0, 150));
    }
    if (data && data.status === 'success') {
      return true;
    } else {
      throw new Error(data.message || 'Lỗi lưu Google Sheet');
    }
  } catch (err) {
    console.error('Save Google Sheet Error:', err);
    throw err;
  }
}

// --- TEST CONNECTION ---
async function testGoogleSheetConnection() {
  const urlInput = document.getElementById('setting-sheet-url');
  const statusEl = document.getElementById('sheet-conn-status');
  if (!urlInput) return;
  let url = urlInput.value.trim();
  if (!url) {
    toast('Vui lòng nhập URL Web App', 'error');
    return;
  }
  if (url.startsWith('/')) {
    url = url.substring(1);
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  urlInput.value = url;
  googleSheetUrl = url;
  localStorage.setItem('budget_sheet_url', url);
  
  statusEl.textContent = 'Đang kiểm tra...';
  statusEl.style.color = 'var(--text-muted)';
  
  try {
    const pingUrl = `${url}?action=ping&_t=${new Date().getTime()}`;
    const res = await fetch(pingUrl, { method: 'GET', redirect: 'follow' });
    const text = await res.text();
    if (text.trim().startsWith('<') || text.includes('<!DOCTYPE html>') || text.includes('google-signin')) {
      throw new Error('Cấu hình Apps Script chưa đúng (nhận được trang HTML). Hãy đảm bảo Apps Script chạy dưới quyền "Tôi" (Me) và truy cập bởi "Bất kỳ ai" (Anyone).');
    }
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      throw new Error('Không thể phân tích JSON phản hồi: ' + text.substring(0, 150));
    }
    if (data && data.status === 'success') {
      statusEl.textContent = 'Kết nối thành công!';
      statusEl.style.color = 'var(--green)';
      toast('Kết nối Google Sheet thành công!', 'success');
      // Save URL if successful
      googleSheetUrl = url;
      localStorage.setItem('budget_sheet_url', googleSheetUrl);
    } else {
      statusEl.textContent = 'Lỗi kết nối';
      statusEl.style.color = 'var(--red)';
      toast(data.message || 'Lỗi kiểm tra kết nối', 'error');
    }
  } catch (err) {
    statusEl.textContent = 'Lỗi kết nối';
    statusEl.style.color = 'var(--red)';
    console.error('Test Sheet Connection Error:', err);
    toast('Không thể kết nối đến Google Sheets: ' + err.message, 'error');
  }
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

  // Tải dữ liệu từ Google Sheets nếu chế độ là 'sheet' hoặc 'both'
  if (syncMode === 'sheet' || syncMode === 'both') {
    if (googleSheetUrl) {
      updateSyncStatus('syncing');
      try {
        const sheetItems = await loadFromGoogleSheet(currentYear);
        if (sheetItems) {
          items = sheetItems;
          localStorage.setItem(key, JSON.stringify(items));
          
          const activePg = document.querySelector('.page.active');
          if (activePg) {
            const pageId = activePg.id.replace('page-', '');
            if (pageId === 'dashboard') renderDashboard();
            if (pageId === 'budget') renderTable();
          }
          updateFormSuggestions();
          console.log('Google Sheets data loaded successfully.');
          updateSyncStatus('synced-pulse');
        }
      } catch (err) {
        console.error('Lỗi khi tải từ Google Sheets:', err);
        updateSyncStatus('error', 'Lỗi kết nối');
        toast('Không thể kết nối Google Sheet, đang dùng dữ liệu cache.', 'error');
      }
    }
  }

  // Tải dữ liệu từ Supabase nếu chế độ là 'supabase' hoặc 'both'
  if (syncMode === 'supabase' || syncMode === 'both') {
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
      }
    } catch (err) { 
      console.error('Cloud Error:', err); 
    }
  }
}


async function save(){
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(items));
  updateFormSuggestions();
  
  // Thiết lập thời gian lưu để tạm khóa đồng bộ tự động chạy đè
  lastSaveTime = Date.now();
  
  // 1. Đồng bộ Google Sheets
  if (syncMode === 'sheet' || syncMode === 'both') {
    if (googleSheetUrl) {
      saveToGoogleSheet(currentYear, items)
        .then(success => {
          if (success) {
            console.log('Đã tự động lưu Google Sheet thành công.');
          }
        })
        .catch(err => {
          console.error('Lỗi tự động đồng bộ Google Sheet:', err);
          toast('Lỗi tự động đồng bộ Google Sheet: ' + err.message, 'error');
        });
    }
  }
  
  // 2. Đồng bộ Supabase (giữ nguyên gốc)
  if (syncMode === 'supabase' || syncMode === 'both') {
    if (!budgetSupabaseClient) return;

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
      toast('Lỗi khi đồng bộ dữ liệu lên đám mây (Supabase)', 'error');
    }
  }
}
function nextId(){return items.length?Math.max(...items.map(x=>x.id))+1:1;}

// Init
// Data load is now handled in initApp

// ===== NAV =====
function budgetNavigate(page, filter=''){
  const role = localStorage.getItem('budget_user_role');
  if (role !== 'admin' && (page === 'add' || page === 'import' || page === 'settings')) {
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
    import:['Nhập Dữ Liệu Cũ','Nhập và quản lý dữ liệu ngân sách các năm trước'],
    settings:['Cấu hình bộ nhớ','Thiết lập chế độ lưu trữ và liên kết Google Sheet']
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
  if(page==='settings'){
    const sm = document.getElementById('setting-storage-mode');
    if (sm) sm.value = syncMode;
    const su = document.getElementById('setting-sheet-url');
    if (su) su.value = googleSheetUrl;
    const sas = document.getElementById('setting-auto-sync');
    if (sas) sas.value = autoSyncTimeSeconds;
    const connStatus = document.getElementById('sheet-conn-status');
    if (connStatus) {
      if (googleSheetUrl) {
        connStatus.textContent = 'Sẵn sàng (chưa test)';
        connStatus.style.color = 'var(--text-muted)';
      } else {
        connStatus.textContent = 'Chưa cấu hình';
        connStatus.style.color = 'var(--text-muted)';
      }
    }
  }
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
  // alerts - Chỉ cảnh báo đối với các nội dung lớn (có Mục)
  const alertData = [...overItems, ...warnItems]
    .filter(r => r.muc !== '') 
    .slice(0, 10);
    
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
        
        subAlloc += kpDuoc;
        subUsed += (+r.daDung || 0);
        
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
  // charts - Chỉ hiển thị tiến độ đối với các nội dung lớn (có Mục)
  ['KP THƯỜNG XUYÊN','KP KHÔNG THƯỜNG XUYÊN'].forEach((g,gi)=>{
    const gd=data.filter(r=>r.group===g && r.muc !== '').slice(0, 8);
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
    const noidungUpper = noidung.toUpperCase();
    if (maNguon === '12') computedGroup = 'KP KHÔNG THƯỜNG XUYÊN';
    else if (maNguon === '13') computedGroup = 'KP THƯỜNG XUYÊN';
    else if (noidungUpper.includes('KHÔNG THƯỜNG XUYÊN') || noidungUpper.includes('KTX') || noidung.includes('12')) computedGroup = 'KP KHÔNG THƯỜNG XUYÊN';
    else if (noidungUpper.includes('SỬA CHỮA THƯỜNG XUYÊN') || noidungUpper.includes('SUA CHUA THUONG XUYEN')) computedGroup = 'KP KHÔNG THƯỜNG XUYÊN';
    else if (noidungUpper.includes('THƯỜNG XUYÊN') || noidungUpper.includes('TX') || noidung.includes('13')) computedGroup = 'KP THƯỜNG XUYÊN';

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
  
  // Thiết lập thời gian lưu để tạm khóa đồng bộ tự động chạy đè
  lastSaveTime = Date.now();
  // Save to cloud
  if (budgetSupabaseClient) {
    budgetSupabaseClient.from('budget_data').upsert({ year: String(year), items: existing })
      .then(({error}) => { if(error) console.error(error); });
  }
  // Save to Google Sheet
  if (syncMode === 'sheet' || syncMode === 'both') {
    if (googleSheetUrl) {
      saveToGoogleSheet(year, existing)
        .then(success => {
          if (success) {
            console.log('Đồng bộ Google Sheets thành công sau khi nhập dữ liệu.');
          }
        })
        .catch(err => {
          console.error('Lỗi đồng bộ Google Sheet sau khi nhập dữ liệu:', err);
          toast('Lỗi đồng bộ Google Sheet sau khi nhập dữ liệu!', 'error');
        });
    }
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

    // Kiểm tra thiết lập lần đầu & render banner đơn vị
    checkFirstTimeSetup();
    
    // Thiết lập giao diện Sáng / Tối
    setupTheme();

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
    if (userEl) {
      userEl.addEventListener('keypress', e => { if (e.key === 'Enter' && passEl) passEl.focus(); });
    }

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
            // Also save to Google Sheet for other years
            if (syncMode === 'sheet' || syncMode === 'both') {
              if (googleSheetUrl) {
                saveToGoogleSheet(targetYear, otherItems)
                  .then(success => {
                    if (success) console.log('Đồng bộ Google Sheets thành công cho năm ' + targetYear);
                  })
                  .catch(err => {
                    console.error('Lỗi đồng bộ Google Sheet cho năm ' + targetYear, err);
                    toast('Lỗi đồng bộ Google Sheet cho năm ' + targetYear + ': ' + err.message, 'error');
                  });
              }
            }
            toast('Đã thêm khoản chi vào năm ' + targetYear, 'success');
          }
        }
        resetForm(); budgetNavigate('budget', currentNavFilter);
      });
    }

    // ===== SETTINGS PAGE BINDINGS =====
    const settingStorageMode = document.getElementById('setting-storage-mode');
    if (settingStorageMode) {
      settingStorageMode.addEventListener('change', e => {
        syncMode = e.target.value;
        localStorage.setItem('budget_sync_mode', syncMode);
        setupAutoSync();
        toast('Đã lưu chế độ lưu trữ: ' + syncMode, 'success');
      });
    }

    const settingSheetUrl = document.getElementById('setting-sheet-url');
    if (settingSheetUrl) {
      settingSheetUrl.addEventListener('change', e => {
        let url = e.target.value.trim();
        if (url.startsWith('/')) {
          url = url.substring(1);
        }
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        e.target.value = url;
        googleSheetUrl = url;
        localStorage.setItem('budget_sheet_url', googleSheetUrl);
        setupAutoSync();
      });
    }

    const btnResetSheetUrl = document.getElementById('btn-reset-sheet-url');
    if (btnResetSheetUrl) {
      btnResetSheetUrl.addEventListener('click', () => {
        const defaultUrl = 'https://script.google.com/macros/s/AKfycbxBTxMzJwXLsGInfWhblYFFZ9WtCgDTQKb9g8S66v1K1pSO39WkWMzQGf_NVNqR5faJ/exec';
        const su = document.getElementById('setting-sheet-url');
        if (su) su.value = defaultUrl;
        googleSheetUrl = defaultUrl;
        localStorage.setItem('budget_sheet_url', defaultUrl);
        setupAutoSync();
        toast('Đã khôi phục URL Web App mặc định', 'success');
      });
    }

    const settingAutoSync = document.getElementById('setting-auto-sync');
    if (settingAutoSync) {
      settingAutoSync.addEventListener('change', e => {
        autoSyncTimeSeconds = e.target.value;
        localStorage.setItem('budget_auto_sync', autoSyncTimeSeconds);
        setupAutoSync();
        toast('Đã lưu cấu hình tự động đồng bộ: ' + (autoSyncTimeSeconds === 'off' ? 'Tắt' : autoSyncTimeSeconds + ' giây'), 'success');
      });
    }

    const btnTestSheet = document.getElementById('btn-test-sheet');
    if (btnTestSheet) {
      btnTestSheet.addEventListener('click', testGoogleSheetConnection);
    }

    const btnPullSheet = document.getElementById('btn-pull-sheet');
    const headerBtnPullSheet = document.getElementById('header-btn-pull-sheet');
    const handlePullClick = async () => {
      if (!googleSheetUrl) {
        toast('Vui lòng cấu hình URL Google Sheets trước', 'error');
        return;
      }
      const buttons = [btnPullSheet, headerBtnPullSheet].filter(Boolean);
      buttons.forEach(btn => {
        btn.disabled = true;
        btn.dataset.origText = btn.innerText;
        btn.innerText = '⏳ Đang tải...';
      });
      try {
        const sheetItems = await loadFromGoogleSheet(currentYear);
        if (sheetItems) {
          items = sheetItems;
          const key = getYearKey(currentYear);
          localStorage.setItem(key, JSON.stringify(items));
          renderDashboard();
          renderTable();
          toast('Tải dữ liệu từ Google Sheet thành công!', 'success');
        } else {
          toast('Dữ liệu trống hoặc không hợp lệ', 'warning');
        }
      } catch (err) {
        console.error(err);
        toast('Lỗi khi tải dữ liệu từ Google Sheet: ' + err.message, 'error');
      } finally {
        buttons.forEach(btn => {
          btn.disabled = false;
          btn.innerText = btn.dataset.origText || btn.innerText;
        });
      }
    };
    if (btnPullSheet) btnPullSheet.addEventListener('click', handlePullClick);
    if (headerBtnPullSheet) headerBtnPullSheet.addEventListener('click', handlePullClick);

    const btnPushSheet = document.getElementById('btn-push-sheet');
    const headerBtnPushSheet = document.getElementById('header-btn-push-sheet');
    const handlePushClick = async () => {
      if (!googleSheetUrl) {
        toast('Vui lòng cấu hình URL Google Sheets trước', 'error');
        return;
      }
      customConfirm(`Bạn có chắc chắn muốn gửi toàn bộ dữ liệu năm ${currentYear} lên Google Sheets? Thao tác này sẽ ghi đè dữ liệu trên Sheet.`, async () => {
        const buttons = [btnPushSheet, headerBtnPushSheet].filter(Boolean);
        buttons.forEach(btn => {
          btn.disabled = true;
          btn.dataset.origText = btn.innerText;
          btn.innerText = '⏳ Đang gửi...';
        });
        try {
          const success = await saveToGoogleSheet(currentYear, items);
          if (success) {
            toast('Gửi dữ liệu lên Google Sheet thành công!', 'success');
          } else {
            toast('Gửi dữ liệu lên Google Sheet thất bại', 'error');
          }
        } catch (err) {
          console.error(err);
          toast('Lỗi khi gửi dữ liệu lên Google Sheet: ' + err.message, 'error');
        } finally {
          buttons.forEach(btn => {
            btn.disabled = false;
            btn.innerText = btn.dataset.origText || btn.innerText;
          });
        }
      });
    };
    if (btnPushSheet) btnPushSheet.addEventListener('click', handlePushClick);
    if (headerBtnPushSheet) headerBtnPushSheet.addEventListener('click', handlePushClick);

    // Initialize Auto Sync at startup
    setupAutoSync();

  } catch (globalErr) {
    console.error('LỖI KHỞI TẠO NGHIÊM TRỌNG:', globalErr);
  }
}

if (document.readyState === 'loading') {
  
} else {
  }

// ===== AUTO SCALE FOR SMALL SCREENS =====
function applyAutoScale() {
  const width = window.innerWidth;
  // Áp dụng cho các màn hình laptop từ 1200px đến 1500px
  if (width >= 1200 && width < 1536) {
    const scale = width / 1536;
    document.body.style.zoom = scale;
  } else {
    document.body.style.zoom = 1;
  }
}

window.addEventListener('resize', applyAutoScale);
window.addEventListener('DOMContentLoaded', applyAutoScale);
applyAutoScale();

// Safe DOM Injection for Zalo Mini App
function injectZaloDOM() {
  if (!document.body) {
    setTimeout(injectZaloDOM, 20);
    return;
  }
  if (document.getElementById('main-app')) {
     if (typeof initApp === 'function') initApp();
     return;
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = `

  <!-- ===== SETUP SCREEN (hiện lần đầu hoặc chưa cấu hình đơn vị) ===== -->
  <div id="setup-screen" style="display:none; height:100vh; width:100vw; position:fixed; top:0; left:0; z-index:9999; background:linear-gradient(135deg,#050d1f 0%,#0f2248 60%,#051525 100%); align-items:center; justify-content:flex-start; flex-direction:column; padding:24px 16px 80px 16px; box-sizing:border-box; overflow-y:auto;">
    <div style="max-width:480px; width:100%; margin:0 auto;">
      <!-- Header -->
      <div style="text-align:center; margin-bottom:28px;">
        <div style="font-size:48px; margin-bottom:8px;">🏥</div>
        <h2 style="color:#f0f9ff; font-size:20px; font-weight:700; margin:0 0 6px;">Thiết lập thông tin đơn vị</h2>
        <p style="color:#64748b; font-size:13px; margin:0;">Chỉ cần thực hiện <strong style="color:#60a5fa;">một lần duy nhất</strong> — hệ thống sẽ ghi nhớ</p>
      </div>
      <!-- Card -->
      <div style="background:rgba(15,23,42,0.85); border:1px solid rgba(99,179,237,0.15); border-radius:16px; padding:28px; backdrop-filter:blur(12px); box-shadow:0 20px 60px rgba(0,0,0,0.6);">
        
        <!-- Unit name -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px;">🏛️ Tên đơn vị / Bệnh viện</label>
          <input id="setup-unit-name" type="text" placeholder="VD: Bệnh viện đa khoa Than Uyên" style="width:100%; padding:11px 14px; background:#0f172a; border:1px solid #1e3a5f; border-radius:8px; color:#f1f5f9; font-size:14px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
        </div>
        
        <!-- Department -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px;">🏢 Phòng / Khoa quản lý</label>
          <input id="setup-department" type="text" placeholder="VD: Phòng KH-TC-ĐD" style="width:100%; padding:11px 14px; background:#0f172a; border:1px solid #1e3a5f; border-radius:8px; color:#f1f5f9; font-size:14px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
        </div>
        
        <!-- Contact person -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px;">👤 Tên người phụ trách</label>
          <input id="setup-contact-name" type="text" placeholder="VD: Nguyễn Văn A" style="width:100%; padding:11px 14px; background:#0f172a; border:1px solid #1e3a5f; border-radius:8px; color:#f1f5f9; font-size:14px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
        </div>
        
        <!-- Phone -->
        <div style="margin-bottom:16px;">
          <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px;">📞 Số điện thoại</label>
          <input id="setup-phone" type="tel" placeholder="VD: 0975198657" style="width:100%; padding:11px 14px; background:#0f172a; border:1px solid #1e3a5f; border-radius:8px; color:#f1f5f9; font-size:14px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
        </div>
        
        <!-- Sheet URL -->
        <div style="margin-bottom:20px;">
          <label style="display:block; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px;">🔗 URL Google Apps Script Web App</label>
          <input id="setup-sheet-url" type="url" placeholder="https://script.google.com/macros/s/..." style="width:100%; padding:11px 14px; background:#0f172a; border:1px solid #1e3a5f; border-radius:8px; color:#f1f5f9; font-size:13px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
          <p style="font-size:11px; color:#475569; margin:6px 0 0;">⚠️ Bỏ trống nếu chưa có — có thể cập nhật sau trong Cấu hình bộ nhớ</p>
        </div>

        <!-- Divider -->
        <div style="display:flex; align-items:center; gap:10px; margin:20px 0 18px;">
          <div style="flex:1; height:1px; background:rgba(99,179,237,0.15);"></div>
          <span style="font-size:11px; color:#475569; white-space:nowrap; font-weight:600; letter-spacing:0.5px;">🔐 CÀI ĐẶT TÀI KHOẢN ĐĂNG NHẬP</span>
          <div style="flex:1; height:1px; background:rgba(99,179,237,0.15);"></div>
        </div>

        <!-- Admin credentials -->
        <div style="background:linear-gradient(135deg,rgba(37,99,235,0.12),rgba(37,99,235,0.05)); border:1px solid rgba(99,179,237,0.25); border-radius:10px; padding:14px; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
            <span style="font-size:16px;">👑</span>
            <div>
              <div style="font-size:12px; font-weight:700; color:#60a5fa; text-transform:uppercase; letter-spacing:0.5px;">Tài khoản Admin</div>
              <div style="font-size:10px; color:#475569; margin-top:1px;">Toàn quyền: xem, thêm, sửa, xóa, đồng bộ, xuất báo cáo, cấu hình</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="display:block; font-size:10px; font-weight:600; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Tên đăng nhập</label>
              <input id="setup-admin-user" type="text" placeholder="admin" autocomplete="off" style="width:100%; padding:9px 12px; background:#0f172a; border:1px solid #1e3a5f; border-radius:7px; color:#f1f5f9; font-size:13px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
            </div>
            <div>
              <label style="display:block; font-size:10px; font-weight:600; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Mật khẩu</label>
              <div style="position:relative;">
                <input id="setup-admin-pass" type="password" placeholder="••••••••" autocomplete="new-password" style="width:100%; padding:9px 32px 9px 12px; background:#0f172a; border:1px solid #1e3a5f; border-radius:7px; color:#f1f5f9; font-size:13px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
                <span onclick="var i=document.getElementById('setup-admin-pass');i.type=i.type==='password'?'text':'password'" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:14px;color:#475569;">👁</span>
              </div>
            </div>
          </div>
        </div>

        <!-- User credentials -->
        <div style="background:linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.04)); border:1px solid rgba(52,211,153,0.2); border-radius:10px; padding:14px; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
            <span style="font-size:16px;">👤</span>
            <div>
              <div style="font-size:12px; font-weight:700; color:#34d399; text-transform:uppercase; letter-spacing:0.5px;">Tài khoản User</div>
              <div style="font-size:10px; color:#475569; margin-top:1px;">Chỉ xem &amp; xuất báo cáo — không thể thêm, sửa, xóa dữ liệu</div>
            </div>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label style="display:block; font-size:10px; font-weight:600; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Tên đăng nhập</label>
              <input id="setup-user-user" type="text" placeholder="user" autocomplete="off" style="width:100%; padding:9px 12px; background:#0f172a; border:1px solid #1e3a5f; border-radius:7px; color:#f1f5f9; font-size:13px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
            </div>
            <div>
              <label style="display:block; font-size:10px; font-weight:600; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Mật khẩu</label>
              <div style="position:relative;">
                <input id="setup-user-pass" type="password" placeholder="••••••••" autocomplete="new-password" style="width:100%; padding:9px 32px 9px 12px; background:#0f172a; border:1px solid #1e3a5f; border-radius:7px; color:#f1f5f9; font-size:13px; box-sizing:border-box; outline:none;" onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#1e3a5f'">
                <span onclick="var i=document.getElementById('setup-user-pass');i.type=i.type==='password'?'text':'password'" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:14px;color:#475569;">👁</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Permission summary -->
        <div style="background:rgba(15,23,42,0.6); border:1px solid #1e293b; border-radius:8px; padding:12px; margin-bottom:20px;">
          <div style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">📋 Bảng phân quyền</div>
          <table style="width:100%; border-collapse:collapse; font-size:11px;">
            <tr style="color:#64748b;">
              <td style="padding:3px 6px; font-weight:600;">Chức năng</td>
              <td style="padding:3px 6px; text-align:center; color:#60a5fa; font-weight:700;">👑 Admin</td>
              <td style="padding:3px 6px; text-align:center; color:#34d399; font-weight:700;">👤 User</td>
            </tr>
            <tr style="border-top:1px solid #1e293b;"><td style="padding:4px 6px; color:#94a3b8;">Xem dữ liệu &amp; Dashboard</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td></tr>
            <tr style="border-top:1px solid #1e293b;"><td style="padding:4px 6px; color:#94a3b8;">Xuất CSV / Excel / PDF</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td></tr>
            <tr style="border-top:1px solid #1e293b;"><td style="padding:4px 6px; color:#94a3b8;">Lấy dữ liệu từ Sheet</td><td style="text-align:center;">✅</td><td style="text-align:center;">✅</td></tr>
            <tr style="border-top:1px solid #1e293b;"><td style="padding:4px 6px; color:#94a3b8;">Thêm / Sửa / Xóa khoản chi</td><td style="text-align:center;">✅</td><td style="text-align:center; color:#ef4444;">❌</td></tr>
            <tr style="border-top:1px solid #1e293b;"><td style="padding:4px 6px; color:#94a3b8;">Đồng bộ lên Sheet</td><td style="text-align:center;">✅</td><td style="text-align:center; color:#ef4444;">❌</td></tr>
            <tr style="border-top:1px solid #1e293b;"><td style="padding:4px 6px; color:#94a3b8;">Cấu hình hệ thống</td><td style="text-align:center;">✅</td><td style="text-align:center; color:#ef4444;">❌</td></tr>
          </table>
        </div>
        
        <!-- Save button -->
        <button id="setup-save-btn" onclick="window.saveSetupInfo()" style="width:100%; padding:14px; background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff; border:none; border-radius:10px; font-size:15px; font-weight:700; cursor:pointer; letter-spacing:0.3px; transition:opacity 0.2s; box-shadow:0 4px 20px rgba(37,99,235,0.4);" onmouseover="this.style.opacity=0.9" onmouseout="this.style.opacity=1">✅ Lưu và bắt đầu sử dụng</button>
        
        <p style="text-align:center; font-size:11px; color:#334155; margin:12px 0 0;">Thông tin được lưu trong trình duyệt của bạn, không gửi lên mạng</p>
      </div>
    </div>
  </div>

  <div id="login-screen" style="height: 100vh; width: 100vw; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #0a0f1e 0%, #0f2248 50%, #0a1628 100%); gap: 0; padding: 16px; box-sizing: border-box; position: relative;">
    <!-- Theme Toggle Login -->
    <button id="themeToggleLogin" style="position:absolute; top:20px; right:20px; background:transparent; border:1px solid rgba(255,255,255,0.2); border-radius:8px; color:#fff; cursor:pointer; font-size:16px; padding:8px 12px; display:flex; align-items:center; justify-content:center; transition:0.2s; backdrop-filter:blur(4px);" title="Chuyển đổi giao diện Sáng/Tối">☀️</button>
    
    <!-- Login Hero Banner (rendered dynamically by JS) -->
    <div id="login-hero-banner" style="display:flex; align-items:center; gap:20px; margin-bottom:24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius:16px; padding:18px 28px; max-width:460px; width:100%; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
      <img id="login-hero-logo" src="hospital-logo.png" alt="Logo đơn vị" style="width:72px; height:72px; border-radius:50%; object-fit:cover; border:2px solid rgba(99,179,237,0.4); box-shadow: 0 0 20px rgba(66,153,225,0.3); flex-shrink:0;">
      <div style="flex:1; min-width:0;">
        <div id="login-hero-name" style="font-size:15px; font-weight:700; color:#f0f9ff; letter-spacing:0.3px;">Phạm Minh Tiến</div>
        <div id="login-hero-dept" style="font-size:12px; color:#60a5fa; font-weight:500; margin-top:2px;">Phòng KH-TC-ĐD</div>
        <div id="login-hero-unit" style="font-size:11px; color:#94a3b8; margin-top:2px;">Bệnh viện đa khoa Than Uyên</div>
        <div style="display:flex; align-items:center; gap:5px; margin-top:6px;">
          <span style="font-size:13px;">📞</span>
          <a id="login-hero-phone" href="tel:0975198657" style="font-size:13px; color:#34d399; font-weight:600; text-decoration:none; letter-spacing:0.5px;">0975 198 657</a>
        </div>
        <button onclick="window.openSetupScreen()" style="margin-top:8px; font-size:10px; color:#475569; background:transparent; border:1px solid #1e3a5f; border-radius:4px; padding:2px 8px; cursor:pointer;">✏️ Sửa thông tin đơn vị</button>
      </div>
    </div>
    <div class="login-card" style="background: rgba(30,41,59,0.9); padding: 32px; border-radius: 12px; border: 1px solid #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; max-width: 400px; text-align: center; backdrop-filter: blur(10px);">
      <div style="font-size: 48px; margin-bottom: 16px;">🏛️</div>
      <h2 style="margin-bottom: 8px; color: #f8fafc;">Đăng Nhập Hệ Thống</h2>
      <p style="color: #94a3b8; margin-bottom: 24px; font-size: 14px;">Quản lý nguồn kinh phí NSNN</p>
      
      <div class="form-group" style="text-align: left; margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 6px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Tài khoản</label>
        <input type="text" id="login-username" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #f8fafc;" placeholder="Nhập tài khoản (admin hoặc user)">
      </div>
      
      <div class="form-group" style="text-align: left; margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 6px; font-size: 12px; font-weight: 600; color: #cbd5e1; text-transform: uppercase;">Mật khẩu</label>
        <input type="password" id="login-password" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #334155; background: #0f172a; color: #f8fafc;" placeholder="Nhập mật khẩu (admin hoặc user)">
      </div>
      
      <button id="main-budget-login-btn" class="btn-primary" style="width: 100%; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 600;" onclick="if(window.handleLogin) window.handleLogin()">Đăng Nhập</button>
      <div id="login-error" style="color: #ef4444; margin-top: 12px; font-size: 13px; display: none;">Tài khoản hoặc mật khẩu không đúng!</div>
      

    </div>
  </div>


  <div id="main-app" style="display:none;">
    <div id="app">
      <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
      <button id="sidebarClose" onclick="document.getElementById('sidebar').classList.remove('open')" style="display:none;position:absolute;top:12px;right:12px;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#f87171;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:13px;font-weight:600;">✕ Đóng</button>
      <div class="sidebar-brand">
        <img src="hospital-logo.png" alt="Logo BV Than Uyên" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1.5px solid rgba(99,179,237,0.35); box-shadow:0 0 10px rgba(66,153,225,0.25); flex-shrink:0;">
        <div class="brand-text">
          <span class="brand-title">Ngân Sách</span>
          <span class="brand-sub">Nhà Nước</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-title">CHỨC NĂNG CHÍNH</div>
        <a href="#" class="nav-item active" data-page="dashboard" id="nav-dashboard">
          <span class="nav-icon">📊</span>
          <span>Tổng quan</span>
        </a>
        
        <div class="nav-section-title">PHÂN HỆ DỰ TOÁN</div>
        <a href="#" class="nav-item" data-page="budget" data-filter="ton" id="nav-budget-ton">
          <span class="nav-icon">⏮️</span>
          <span>Tồn năm trước</span>
        </a>
        <a href="#" class="nav-item" data-page="budget" data-filter="cap" id="nav-budget-cap">
          <span class="nav-icon">📥</span>
          <span>KP cấp đầu năm</span>
        </a>
        <a href="#" class="nav-item" data-page="budget" data-filter="tang" id="nav-budget-tang">
          <span class="nav-icon">📈</span>
          <span>Tăng dự toán</span>
        </a>
        <a href="#" class="nav-item" data-page="budget" data-filter="giam" id="nav-budget-giam">
          <span class="nav-icon">📉</span>
          <span>Giảm dự toán</span>
        </a>
        <a href="#" class="nav-item" data-page="budget" data-filter="all" id="nav-budget-all">
          <span class="nav-icon">📋</span>
          <span>Tất cả khoản chi</span>
        </a>

        <div class="nav-section-title role-admin-only">NGHIỆP VỤ KHÁC</div>
        <a href="#" class="nav-item role-admin-only" data-page="add" id="nav-add">
          <span class="nav-icon">➕</span>
          <span>Thêm khoản chi</span>
        </a>
        <a href="#" class="nav-item role-admin-only" data-page="import" id="nav-import">
          <span class="nav-icon">📂</span>
          <span>Nhập dữ liệu cũ</span>
        </a>
        <a href="#" class="nav-item" data-page="report" id="nav-report">
          <span class="nav-icon">📈</span>
          <span>Báo cáo</span>
        </a>
        <a href="#" class="nav-item role-admin-only" data-page="settings" id="nav-settings">
          <span class="nav-icon">⚙️</span>
          <span>Cấu hình bộ nhớ</span>
        </a>
      </nav>
      <!-- Contact card in sidebar (dynamic) -->
      <div style="margin: 0 10px 12px; padding: 10px 12px; background: linear-gradient(135deg, rgba(37,99,235,0.15), rgba(16,185,129,0.1)); border: 1px solid rgba(99,179,237,0.2); border-radius: 10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <img id="sidebar-contact-logo" src="hospital-logo.png" alt="" style="width:32px; height:32px; border-radius:50%; object-fit:cover; flex-shrink:0; border:1px solid rgba(99,179,237,0.3);">
          <div style="min-width:0; flex:1;">
            <div id="sidebar-contact-name" style="font-size:11px; font-weight:700; color:#e2e8f0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Phạm Minh Tiến</div>
            <div id="sidebar-contact-dept" style="font-size:9px; color:#60a5fa; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Phòng KH-TC-ĐD · BV Than Uyên</div>
            <div id="sidebar-contact-phone" style="font-size:10px; color:#34d399; font-weight:600; margin-top:1px;">📞 0975 198 657</div>
          </div>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="fiscal-year-badge" style="margin-bottom: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 4px;" id="btnLogout">
          <div style="font-weight: 600; color: var(--text-primary);"><span style="font-size: 16px; margin-right: 4px;">👤</span> <span id="currentUserRole">Admin</span></div>
          <div style="font-size: 11px; color: var(--red); text-transform: uppercase;">Đăng xuất</div>
        </div>
        <div class="fiscal-year-badge">Năm ngân sách: <strong id="fiscal-year-display">2025</strong></div>
      </div>
    </aside>

    <!-- Main -->
    <main class="main-content">
      <!-- Header -->
      <header class="top-header">
        <div class="header-left">
          <button class="menu-toggle" id="menuToggle">☰</button>
          <div>
            <h1 class="page-title" id="page-title">Tổng Quan Ngân Sách</h1>
            <p class="page-sub" id="page-sub">Theo dõi tình hình sử dụng kinh phí ngân sách nhà nước cấp</p>
          </div>
        </div>
        <div class="header-right">
          <!-- Theme Toggle -->
          <button id="themeToggle" style="background:transparent; border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-primary); cursor:pointer; font-size:16px; padding:6px 10px; display:flex; align-items:center; justify-content:center; transition:var(--transition);" title="Chuyển đổi giao diện Sáng/Tối">☀️</button>
          
          <div class="year-selector">
            <label>Năm:</label>
            <select id="yearSelect">
              <option value="2024">2024</option>
              <option value="2025" selected>2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <button class="btn-export" id="btnExport">📥 CSV</button>
          <button class="btn-export btn-xlsx" id="btnExportXlsx">📊 Excel</button>
          <button class="btn-export btn-pdf" id="btnExportPdf">📄 PDF</button>
          <div class="sync-status-indicator" id="header-sync-status" style="margin-right: 4px;">
            <span class="sync-status-dot synced" id="header-sync-dot"></span>
            <span id="header-sync-text">Đã đồng bộ</span>
          </div>
          <button class="btn-export btn-sheet" id="header-btn-pull-sheet" style="background: linear-gradient(135deg, var(--blue), #1d4ed8);">🔄 Lấy từ Sheet</button>
          <button class="btn-export btn-sheet role-admin-only" id="header-btn-push-sheet">📤 Đồng bộ Sheet</button>
          <div class="date-display" id="currentDate"></div>
        </div>
      </header>

      <!-- Pages -->
      <div class="page-container">

        <!-- DASHBOARD PAGE -->
        <div class="page active" id="page-dashboard">
          <!-- KPI Cards -->
          <div class="kpi-grid">
            <div class="kpi-card kpi-blue">
              <div class="kpi-icon">💰</div>
              <div class="kpi-content">
                <div class="kpi-label">Tổng KP Được Cấp</div>
                <div class="kpi-value" id="kpi-total-allocated">0</div>
                <div class="kpi-sub" id="kpi-total-allocated-sub">Dự toán đầu năm</div>
              </div>
            </div>
            <div class="kpi-card kpi-green">
              <div class="kpi-icon">✅</div>
              <div class="kpi-content">
                <div class="kpi-label">KP Đã Sử Dụng</div>
                <div class="kpi-value" id="kpi-used">0</div>
                <div class="kpi-sub" id="kpi-used-pct">0% tổng KP</div>
              </div>
            </div>
            <div class="kpi-card kpi-orange">
              <div class="kpi-icon">📌</div>
              <div class="kpi-content">
                <div class="kpi-label">KP Còn Lại</div>
                <div class="kpi-value" id="kpi-remaining">0</div>
                <div class="kpi-sub" id="kpi-remaining-pct">0% tổng KP</div>
              </div>
            </div>
            <div class="kpi-card kpi-red">
              <div class="kpi-icon">⚠️</div>
              <div class="kpi-content">
                <div class="kpi-label">Khoản Vượt / Cảnh Báo</div>
                <div class="kpi-value" id="kpi-overrun">0</div>
                <div class="kpi-sub">Mục cần chú ý</div>
              </div>
            </div>
          </div>

          <!-- Overall progress -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">📉 Tiến Độ Sử Dụng Kinh Phí Tổng Thể</h2>
            </div>
            <div class="overall-progress">
              <div class="progress-labels">
                <span>0%</span>
                <span id="overall-pct-label">0%</span>
                <span>100%</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" id="overall-progress-bar" style="width:0%"></div>
                </div>
              </div>
              <div class="progress-legend">
                <span><span class="dot green"></span>Đã sử dụng</span>
                <span><span class="dot orange"></span>Còn lại</span>
                <span><span class="dot red"></span>Vượt mức</span>
              </div>
            </div>
          </div>

          <!-- Category breakdown -->
          <div class="two-col">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">🗂️ Phân Bổ Theo Nhóm Mục</h2>
              </div>
              <div id="category-breakdown"></div>
            </div>
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">🚨 Các Khoản Sắp Hết / Vượt KP</h2>
              </div>
              <div id="alert-items"></div>
            </div>
          </div>
        </div>

        <!-- BUDGET TABLE PAGE -->
        <div class="page" id="page-budget">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">📋 Bảng Dự Toán & Sử Dụng Kinh Phí</h2>
              <div class="table-controls">
                <button class="btn-primary role-admin-only" onclick="budgetNavigate('add')" style="padding: 8px 16px; font-size: 13px; margin-right: 8px; white-space: nowrap;">➕ Thêm mới</button>
                <button class="btn-secondary role-admin-only" onclick="budgetNavigate('import')" style="padding: 8px 16px; font-size: 13px; margin-right: 12px; white-space: nowrap; background: var(--bg-surface); border-color: var(--border);">📥 Nhập từ file</button>
                <input type="text" placeholder="🔍 Tìm kiếm..." id="searchInput" class="search-input"/>
                <select id="filterCategory" class="filter-select">
                  <option value="">Tất cả nhóm</option>
                  <option value="KP THƯỜNG XUYÊN">KP Thường Xuyên</option>
                  <option value="KP KHÔNG THƯỜNG XUYÊN">KP Không Thường Xuyên</option>
                </select>
                <select id="filterStatus" class="filter-select">
                  <option value="">Tất cả trạng thái</option>
                  <option value="good">Bình thường</option>
                  <option value="warning">Cảnh báo (&gt;80%)</option>
                  <option value="danger">Vượt KP</option>
                  <option value="zero">Chưa sử dụng</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table class="budget-table" id="budgetTable">
                <thead>
                  <tr>
                    <th class="th-muc">Mục</th>
                    <th class="th-tieumuc">T.Mục</th>
                    <th class="th-noidung">Nội Dung</th>
                    <th class="th-number col-dtcapnam">DT KP Cấp Đầu Năm</th>
                    <th class="th-number col-tonnamtruoc">Tồn Năm Trước</th>
                    <th class="th-number col-kpcapnam">KP Cấp Đầu Năm</th>
                    <th class="th-number col-giamdt">Giảm DT</th>
                    <th class="th-number col-tangdt">Tăng DT</th>
                    <th class="th-number col-giulai10">Giữ lại 10% thực hiện CCTL</th>
                    <th class="th-number col-kpduocsd">KP Được SD</th>
                    <th class="th-number col-kpdadung">KP Đã SD</th>
                    <th class="th-number col-kpconlai">KP Còn Lại</th>
                    <th class="th-status">Trạng thái</th>
                    <th class="th-date">Ngày HH</th>
                    <th class="th-action role-admin-only">Thao tác</th>
                  </tr>
                </thead>
                <tbody id="budgetTableBody">
                </tbody>
              </table>
            </div>
            <div class="table-footer">
              <div class="table-summary" id="tableSummary"></div>
              <div class="pagination" id="pagination"></div>
            </div>
          </div>
        </div>

        <!-- ADD / EDIT PAGE -->
        <div class="page" id="page-add">
          <div class="card form-card">
            <div class="card-header">
              <h2 class="card-title" id="form-title">➕ Thêm Khoản Chi Ngân Sách</h2>
            </div>
            <form id="budgetForm" class="budget-form">
              <div class="form-grid">
                <div class="form-group">
                  <label>Năm ngân sách *</label>
                  <select id="f-year" required>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Nhóm mục *</label>
                  <select id="f-group" required>
                    <option value="">-- Chọn nhóm --</option>
                    <option value="KP THƯỜNG XUYÊN">KP Thường Xuyên</option>
                    <option value="KP KHÔNG THƯỜNG XUYÊN">KP Không Thường Xuyên</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Mục</label>
                  <input type="text" id="f-muc" placeholder="VD: 1, 2, 3..." maxlength="10" list="mucSuggestions"/>
                  <datalist id="mucSuggestions"></datalist>
                </div>
                <div class="form-group">
                  <label>Tiểu mục</label>
                  <input type="text" id="f-tieumuc" placeholder="VD: 6001, 6101..." maxlength="10" list="tieumucSuggestions"/>
                  <datalist id="tieumucSuggestions"></datalist>
                </div>
                <div class="form-group full-width">
                  <label>Nội dung *</label>
                  <input type="text" id="f-noidung" placeholder="Tên khoản chi tiêu..." required list="noidungSuggestions"/>
                  <datalist id="noidungSuggestions"></datalist>
                </div>
                <div class="form-group">
                  <label>DT KP Cấp Đầu Năm (triệu đồng)</label>
                  <input type="number" id="f-dtcapnam" placeholder="0" min="0" step="1"/>
                </div>
                <div class="form-group">
                  <label>Tồn Năm Trước Mang Sang</label>
                  <input type="number" id="f-tonnuoctruoc" placeholder="0" min="0" step="1"/>
                </div>
                <div class="form-group">
                  <label>KP Cấp Đầu Năm</label>
                  <input type="number" id="f-kpcapnam" placeholder="0" min="0" step="1"/>
                </div>
                <div class="form-group">
                  <label>Giảm Dự Toán</label>
                  <input type="number" id="f-giam" placeholder="0" min="0" step="1"/>
                </div>
                <div class="form-group">
                  <label>Tăng Dự Toán</label>
                  <input type="number" id="f-tang" placeholder="0" min="0" step="1"/>
                </div>
                <div class="form-group">
                  <label>Giữ lại 10% thực hiện CCTL</label>
                  <input type="number" id="f-giulai10" placeholder="0" min="0" step="1"/>
                </div>
                <div class="form-group">
                  <label>KP Đã Sử Dụng</label>
                  <input type="number" id="f-dadung" placeholder="0" min="0" step="1"/>
                </div>
                <div class="form-group">
                  <label>Ngày Hết Hạn</label>
                  <input type="date" id="f-handate"/>
                </div>
                <div class="form-group">
                  <label>Ghi chú</label>
                  <input type="text" id="f-note" placeholder="Ghi chú thêm..."/>
                </div>
              </div>
              <!-- Auto-calculated -->
              <div class="calc-preview">
                <div class="calc-item">
                  <span>KP Được Sử Dụng =</span>
                  <strong id="calc-kpduocsd">0 đồng</strong>
                </div>
                <div class="calc-item">
                  <span>KP Còn Lại =</span>
                  <strong id="calc-kpconlai">0 đồng</strong>
                </div>
                <div class="calc-item">
                  <span>Tỷ lệ sử dụng =</span>
                  <strong id="calc-tyle">0%</strong>
                </div>
              </div>
              <input type="hidden" id="f-editId"/>
              <div class="form-actions">
                <button type="submit" class="btn-primary" id="submitBtn">💾 Lưu Khoản Chi</button>
                <button type="button" class="btn-secondary" id="cancelBtn">✖ Hủy</button>
              </div>
            </form>
          </div>
        </div>

        <!-- REPORT PAGE -->
        <div class="page" id="page-report">
          <div class="kpi-grid">
            <div class="kpi-card kpi-blue">
              <div class="kpi-icon">📊</div>
              <div class="kpi-content">
                <div class="kpi-label">KP Thường Xuyên - Đã SD</div>
                <div class="kpi-value" id="rpt-tx-used">0</div>
                <div class="kpi-sub" id="rpt-tx-pct">0%</div>
              </div>
            </div>
            <div class="kpi-card kpi-green">
              <div class="kpi-icon">📊</div>
              <div class="kpi-content">
                <div class="kpi-label">KP Không Thường Xuyên - Đã SD</div>
                <div class="kpi-value" id="rpt-ktx-used">0</div>
                <div class="kpi-sub" id="rpt-ktx-pct">0%</div>
              </div>
            </div>
            <div class="kpi-card kpi-orange">
              <div class="kpi-icon">🗓️</div>
              <div class="kpi-content">
                <div class="kpi-label">Số mục sắp hết hạn (30 ngày)</div>
                <div class="kpi-value" id="rpt-expiring">0</div>
                <div class="kpi-sub">khoản</div>
              </div>
            </div>
            <div class="kpi-card kpi-red">
              <div class="kpi-icon">🔴</div>
              <div class="kpi-content">
                <div class="kpi-label">Số mục vượt KP</div>
                <div class="kpi-value" id="rpt-over">0</div>
                <div class="kpi-sub">khoản</div>
              </div>
            </div>
          </div>
          <div class="two-col">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">📊 Biểu đồ KP Thường Xuyên</h2>
              </div>
              <div id="chart-tx" class="chart-container"></div>
            </div>
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">📊 Biểu đồ KP Không Thường Xuyên</h2>
              </div>
              <div id="chart-ktx" class="chart-container"></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">📋 Bảng Tổng Hợp Theo Nhóm</h2>
            </div>
            <div id="report-table-container"></div>
          </div>
        </div>

        <!-- IMPORT PAGE -->
        <div class="page" id="page-import">
          <div class="card form-card">
            <div class="card-header">
              <h2 class="card-title">📂 Nhập Dữ Liệu Từ Năm Trước</h2>
            </div>
            <div class="import-section">
              <!-- Drag & Drop Zone -->
              <div class="dropzone" id="dropZone">
                <div class="dropzone-content">
                  <div class="dropzone-icon">📂</div>
                  <h3>Kéo & thả file vào đây</h3>
                  <p>Hỗ trợ file <strong>.xlsx, .xls, .csv</strong></p>
                  <span class="dropzone-or">— hoặc —</span>
                  <div class="dropzone-buttons">
                    <label class="btn-primary btn-upload btn-excel" for="importExcelFile">📊 Chọn File Excel</label>
                    <input type="file" id="importExcelFile" accept=".xlsx,.xls" style="display:none"/>
                    <label class="btn-secondary btn-upload" for="importFile">📁 Chọn File CSV</label>
                    <input type="file" id="importFile" accept=".csv" style="display:none"/>
                  </div>
                </div>
              </div>
              <div class="import-controls">
                <div class="import-year-row">
                  <label>Năm dữ liệu nhập:</label>
                  <select id="importYear">
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024" selected>2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                  <label>Nhóm mục:</label>
                  <select id="importGroup">
                    <option value="KP THƯỜNG XUYÊN">KP Thường Xuyên</option>
                    <option value="KP KHÔNG THƯỜNG XUYÊN">KP Không Thường Xuyên</option>
                  </select>
                </div>
                <div class="import-actions">
                  <button class="btn-secondary" id="btnDownloadTemplate">📥 Tải Mẫu</button>
                  <button class="btn-secondary" id="btnPasteData">📋 Nhập Trực Tiếp</button>
                </div>
                <!-- Sheet selector for Excel -->
                <div id="sheetSelector" class="sheet-selector" style="display:none">
                  <label>Chọn Sheet:</label>
                  <select id="sheetSelect"></select>
                  <label>Dòng bắt đầu dữ liệu:</label>
                  <input type="number" id="startRow" value="1" min="1" max="100" style="width:60px"/>
                  <button class="btn-primary" id="btnParseSheet" style="padding:8px 16px;font-size:13px">🔍 Đọc Sheet</button>
                </div>
                <!-- Column mapping -->
                <div id="columnMapping" class="column-mapping" style="display:none"></div>
              </div>
              <div id="importPreview" class="import-preview"></div>
              <div id="importConfirm" class="import-confirm" style="display:none">
                <button class="btn-primary" id="btnConfirmImport">✅ Xác Nhận Nhập Dữ Liệu</button>
                <button class="btn-secondary" id="btnCancelImport">✖ Hủy</button>
              </div>
              <!-- Paste modal -->
              <div id="pasteArea" class="paste-area" style="display:none">
                <h4>Dán dữ liệu trực tiếp (mỗi dòng 1 khoản, phân cách bằng dấu phẩy hoặc tab):</h4>
                <textarea id="pasteTextarea" rows="10" placeholder="Mục, Tiểu Mục, Nội Dung, DT KP Cấp Đầu Năm, Tồn Năm Trước, KP Cấp Đầu Năm, Giảm DT, Tăng DT, KP Đã SD, Ngày HH"></textarea>
                <div class="form-actions">
                  <button class="btn-primary" id="btnParsePaste">🔍 Phân Tích Dữ Liệu</button>
                </div>
              </div>
              <!-- History -->
              <div class="card" style="margin-top:20px">
                <div class="card-header">
                  <h2 class="card-title">📅 Dữ Liệu Các Năm Đã Lưu</h2>
                </div>
                <div id="yearHistory"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- SETTINGS PAGE -->
        <div class="page" id="page-settings">
          <div class="card form-card" style="max-width: 800px;">
            <div class="card-header">
              <h2 class="card-title">⚙️ Cấu Hình Đồng Bộ Dữ Liệu</h2>
            </div>
            <div class="budget-form" style="padding: 24px;">
              <!-- Storage Mode -->
              <div class="form-group" style="margin-bottom: 20px;">
                <label>Chế độ lưu trữ chính (Storage Mode)</label>
                <select id="setting-storage-mode" style="width: 100%; margin-top: 6px;">
                  <option value="local">Chỉ lưu cục bộ (LocalStorage)</option>
                  <option value="supabase">Đồng bộ đám mây (Supabase)</option>
                  <option value="sheet">Đồng bộ bảng tính (Google Sheets)</option>
                  <option value="both">Đồng bộ cả Đám mây & Bảng tính (Supabase & Google Sheets)</option>
                </select>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                  Lựa chọn nơi lưu trữ và đồng bộ dữ liệu kinh phí ngân sách của bạn.
                </p>
              </div>

              <!-- Google Apps Script URL -->
              <div class="form-group" style="margin-bottom: 24px;">
                <label>URL Google Apps Script Web App</label>
                <div style="display: flex; gap: 10px; margin-top: 6px; align-items: center;">
                  <input type="text" id="setting-sheet-url" placeholder="https://script.google.com/macros/s/.../exec" style="flex: 1; font-family: monospace; font-size: 12.5px; margin: 0;">
                  <button type="button" class="btn-secondary" id="btn-reset-sheet-url" style="padding: 8px 16px; font-size: 12.5px; white-space: nowrap; margin: 0; border: 1px solid var(--border); background: var(--bg-card); color: var(--text-primary); border-radius: var(--radius-sm); cursor: pointer; transition: all var(--transition);">Khôi phục mặc định</button>
                </div>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                  Đường dẫn URL Web App nhận được sau khi Triển khai (Deploy) Google Apps Script trên Google Sheet.
                </p>
              </div>

              <!-- Auto Sync Interval -->
              <div class="form-group" style="margin-bottom: 24px;">
                <label>Tự động đồng bộ thời gian thực (Auto Sync)</label>
                <select id="setting-auto-sync" style="width: 100%; margin-top: 6px;">
                  <option value="off">Tắt tự động đồng bộ</option>
                  <option value="15">Mỗi 15 giây (Nhanh)</option>
                  <option value="30">Mỗi 30 giây (Mặc định)</option>
                  <option value="60">Mỗi 60 giây</option>
                  <option value="300">Mỗi 5 phút</option>
                </select>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                  Tự động kiểm tra và tải lại dữ liệu mới nhất từ Google Sheets lên màn hình mà không cần làm mới trang.
                </p>
              </div>

              <!-- Connection Status -->
              <div class="calc-preview" style="gap: 20px; align-items: center; margin-bottom: 24px; padding: 12px 18px;">
                <div class="calc-item">
                  <span>Kết nối Google Sheet:</span>
                  <strong id="sheet-conn-status" style="color: var(--text-muted);">Chưa cấu hình</strong>
                </div>
                <button type="button" class="btn-secondary" id="btn-test-sheet" style="padding: 8px 16px; font-size: 13px; font-weight: 600;">⚡ Kiểm tra kết nối</button>
              </div>

              <!-- Manual Sync -->
              <div style="border-top: 1px solid var(--border); padding-top: 20px; margin-bottom: 24px;">
                <h4 style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Đồng bộ thủ công (Manual Sync)</h4>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                  <button type="button" class="btn-primary" id="btn-pull-sheet" style="background: linear-gradient(135deg, var(--blue), #1d4ed8); padding: 10px 20px; font-size: 13px;">📥 Tải dữ liệu từ Sheet</button>
                  <button type="button" class="btn-primary" id="btn-push-sheet" style="background: linear-gradient(135deg, var(--green), #047857); padding: 10px 20px; font-size: 13px;">📤 Gửi dữ liệu lên Sheet</button>
                </div>
                <p style="font-size: 11.5px; color: var(--text-muted); margin-top: 8px;">
                  * Lưu ý: "Tải dữ liệu từ Sheet" sẽ ghi đè lên dữ liệu hiện tại trong Webapp. "Gửi dữ liệu lên Sheet" sẽ ghi đè dữ liệu trên Google Sheet hiện có của năm ngân sách đang chọn.
                </p>
              </div>

              <!-- Guide -->
              <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 18px; font-size: 12.5px; line-height: 1.6;">
                <h4 style="font-weight: 600; margin-bottom: 8px; color: var(--blue-light);">📖 Hướng dẫn cấu hình Google Sheet:</h4>
                <ol style="margin-left: 18px; display: flex; flex-direction: column; gap: 6px; color: var(--text-secondary); padding-left: 0;">
                  <li>Mở bảng tính Google Sheet của bạn.</li>
                  <li>Chọn <strong>Tiện ích mở rộng</strong> (Extensions) &gt; <strong>Apps Script</strong>.</li>
                  <li>Xóa sạch mã mặc định, dán toàn bộ mã Google Apps Script được cung cấp.</li>
                  <li>Nhấn biểu tượng 💾 (Lưu) hoặc nhấn Ctrl+S.</li>
                  <li>Click vào nút <strong>Triển khai</strong> (Deploy) &gt; <strong>Triển khai mới</strong> (New deployment).</li>
                  <li>Chọn biểu tượng bánh răng ở cột trái và chọn <strong>Ứng dụng web</strong> (Web app).</li>
                  <li>Cấu hình: Chạy dưới quyền <strong>Tôi</strong> và Quyền truy cập <strong>Bất kỳ ai</strong> (Anyone).</li>
                  <li>Click <strong>Triển khai</strong>, cấp quyền nếu được yêu cầu, sau đó copy đường dẫn <strong>URL ứng dụng web</strong> và dán vào ô bên trên.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

      </div><!-- end page-container -->
    </main>
  </div>
  </div><!-- end main-app -->

  <!-- Modal Edit -->
  <div class="modal-overlay" id="modalOverlay">
    <div class="modal">
      <div class="modal-header">
        <h3 id="modal-title">Chỉnh sửa khoản chi</h3>
        <button class="modal-close" id="modalClose">✕</button>
      </div>
      <div class="modal-body" id="modal-body"></div>
    </div>
  </div>
  <!-- Modal Confirm -->
  <div class="modal" id="confirmModal" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center">
    <div style="background:var(--card-bg);padding:24px;border-radius:12px;width:320px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.5)">
      <h3 style="margin-top:0;margin-bottom:12px;color:var(--text-color);font-size:18px">⚠️ Xác nhận</h3>
      <p id="confirmMsg" style="margin-bottom:24px;color:var(--text-muted);font-size:14px">Bạn có chắc chắn muốn xóa?</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button id="confirmYesBtn" style="padding:8px 24px;background:var(--danger-color);color:white;border:none;border-radius:6px;cursor:pointer;font-weight:bold">Xóa</button>
        <button id="confirmNoBtn" style="padding:8px 24px;background:var(--bg-color);color:var(--text-color);border:1px solid var(--border-color);border-radius:6px;cursor:pointer;font-weight:bold">Hủy</button>
      </div>
    </div>
  </div>

  <!-- Toast -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- Scripts -->
  
  
  
  
  

  <!-- Orientation Overlay -->
  <div id="orientation-warning" class="orientation-overlay">
    <div class="orientation-content">
      <div class="orientation-icon">🔄</div>
      <h3>Vui lòng quay ngang màn hình</h3>
      <p>Để xem bảng ngân sách rõ ràng và đầy đủ nhất, bạn hãy xoay ngang điện thoại hoặc máy tính bảng của mình.</p>
      <button class="btn-primary" onclick="this.parentElement.parentElement.style.display='none'" style="margin-top:15px; background:rgba(255,255,255,0.1)">Bỏ qua</button>
    </div>
  </div>
  
  
  
`;
  while(temp.firstChild) {
      document.body.appendChild(temp.firstChild);
  }
  
  if (typeof initApp === 'function') initApp();
}
injectZaloDOM();
