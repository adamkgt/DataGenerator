// ======= Poczekaj na Faker =======
function initApp() {
  if (!window.faker) {
    setTimeout(initApp, 50); // sprawdzaj co 50ms
    return;
  }

  const { faker } = window;

  // ======= UTIL =======
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const toast = msg => {
    const el = $('#toast');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 1800);
  };

  // ======= MOTYW =======
  $('#themeToggle').addEventListener('change', e => {
    document.body.dataset.theme = e.target.checked ? 'light' : 'dark';
  });

  // ======= TRYB BEZPIECZNY =======
  let safeMode = true;
  $('#safeToggle').addEventListener('change', e => safeMode = e.target.checked);

  // ======= GENERATORY =======
  function genFullName() {
    return faker.person.fullName();
  }

  function genEmail(fullName) {
    if (safeMode) {
      const parts = fullName.toLowerCase().split(' ');
      const base = [parts[0]?.[0] || 'u', parts[1] || 'user'].join('.');
      const domain = ['example.com','example.org','example.net'][Math.floor(Math.random()*3)];
      return `${base}${Math.floor(Math.random()*90+10)}@${domain}`;
    } else {
      return faker.internet.email();
    }
  }

  function genPhonePL() {
    if (safeMode) {
      const prefix = Math.floor(Math.random()*200)+600;
      const rest = String(Math.floor(Math.random()*1_000_000)).padStart(6,'0');
      return `${prefix}${rest}`.replace(/(\d{3})(\d{3})(\d{3})/,'$1 $2 $3');
    } else {
      return faker.phone.number('+48 ### ### ###');
    }
  }

  function genPeselSafeInvalid() {
    const start = new Date(1970,0,1).getTime();
    const end   = new Date(2009,11,31).getTime();
    const d = new Date(start + Math.random()*(end-start));
    let y = d.getFullYear(), m = d.getMonth()+1, day = d.getDate();
    let mm = m + (y>=2000?20:0);
    const yy = String(y).slice(-2).padStart(2,'0');
    const dd = String(day).padStart(2,'0');
    const serial = String(Math.floor(Math.random()*1000)).padStart(3,'0');
    const sex = Math.random()<0.5?0:1;
    const base = `${yy}${mm}${dd}${serial}${sex}`;
    const weights = [1,3,7,9,1,3,7,9,1,3];
    const s = base.split('').reduce((acc,d,i)=> acc + parseInt(d,10)*weights[i],0);
    const control = (10-(s%10))%10;
    const bad = (control+1)%10;
    return base+bad;
  }

  function genPeselValid() {
    const start = new Date(1970,0,1).getTime();
    const end   = new Date(2009,11,31).getTime();
    const d = new Date(start + Math.random()*(end-start));
    let y = d.getFullYear(), m = d.getMonth()+1, day = d.getDate();
    let mm = m + (y>=2000?20:0);
    const yy = String(y).slice(-2).padStart(2,'0');
    const dd = String(day).padStart(2,'0');
    const serial = String(Math.floor(Math.random()*1000)).padStart(3,'0');
    const sex = Math.random()<0.5?0:1;
    const base = `${yy}${mm}${dd}${serial}${sex}`;
    const weights = [1,3,7,9,1,3,7,9,1,3];
    const s = base.split('').reduce((acc,d,i)=> acc + parseInt(d,10)*weights[i],0);
    const control = (10-(s%10))%10;
    return base+control;
  }

  // ======= GENERUJ DANE =======
  let currentData = [];

  function generateRow(cols) {
    const name = genFullName();
    const row = {};
    if (cols.name) row.name = name;
    if (cols.email) row.email = genEmail(name);
    if (cols.phone) row.phone = genPhonePL();
    if (cols.pesel) row.pesel = safeMode ? genPeselSafeInvalid() : genPeselValid();
    return row;
  }

  function generateData(n, cols) {
    return Array.from({length:n},()=>generateRow(cols));
  }

  // ======= TABELA =======
  function renderTable(data, cols) {
    const thead = $('#thead');
    const tbody = $('#tbody');
    const headers = Object.keys(cols).filter(k=>cols[k]);
    thead.innerHTML = `<tr>${headers.map(h=>`<th data-key="${h}">${h}</th>`).join('')}</tr>`;
    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="${headers.length}" class="empty">Brak danych</td></tr>`;
      $('#rowsCount').textContent='0 rekordów';
      return;
    }
    tbody.innerHTML = data.map(r=>`<tr>${headers.map(h=>`<td>${r[h]}</td>`).join('')}</tr>`).join('');
    $('#rowsCount').textContent = `${data.length} rekordów`;

    // sortowanie po kliknięciu nagłówka
    $$('#thead th').forEach(th=>{
      th.addEventListener('click',()=>{
        const key = th.dataset.key;
        currentData.sort((a,b)=>(a[key]>b[key]?1:-1));
        renderTable(currentData, cols);
      });
    });
  }

  // ======= EVENTY =======
  $('#generate').addEventListener('click',()=>{
    const n = Math.min(50, Math.max(1, parseInt($('#count').value,10)||1));
    const cols = {
      name: $('#colName').checked,
      email: $('#colEmail').checked,
      phone: $('#colPhone').checked,
      pesel: $('#colPesel').checked
    };
    currentData = generateData(n, cols);
    renderTable(currentData, cols);
    toast(`Wygenerowano ${n} rekordów`);
  });

  $('#copyBtn').addEventListener('click',()=>{
    if (!currentData.length) { toast('Brak danych do skopiowania'); return; }
    const headers = Object.keys(currentData[0]);
    const text = [headers.join('\t'), ...currentData.map(r=>headers.map(h=>r[h]).join('\t'))].join('\n');
    navigator.clipboard.writeText(text).then(()=>toast('Skopiowano do schowka'));
  });

  $('#csvBtn').addEventListener('click',()=>{
    if (!currentData.length) { toast('Brak danych do eksportu'); return; }
    const headers = Object.keys(currentData[0]);
    const csv = [headers.map(h=>`"${h}"`).join(','), ...currentData.map(r=>headers.map(h=>`"${r[h]}"`).join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download='dane_testowe.csv';
    a.click();
  });

}

initApp();
