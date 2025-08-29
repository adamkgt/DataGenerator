// ======= UTIL =======
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const toast = msg => {
  const el = $('#toast');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display='none', 1800);
};

// ======= MOTYW =======
$('#themeToggle').addEventListener('change', e => {
  document.body.dataset.theme = e.target.checked ? 'light' : 'dark';
});

// ======= SAFE MODE =======
let safeMode = $('#safeToggle').checked;
$('#safeToggle').addEventListener('change', e => safeMode = e.target.checked);

// ======= FAKER =======
const { faker } = window;
if (!faker) { toast('Faker nie załadowany'); throw new Error('Faker nie załadowany'); }

// ======= GENERATORY =======
function genFullName() {
  return faker.person.fullName();
}

function genEmail(fullName) {
  if (safeMode) {
    const parts = fullName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9\.]/g, '');
    const domain = ['example.com','example.org','example.net'][Math.floor(Math.random()*3)];
    return `${parts}${Math.floor(Math.random()*90+10)}@${domain}`;
  } else return faker.internet.email();
}

function genPhone() {
  if (safeMode) {
    const prefix = 600 + Math.floor(Math.random()*200);
    const rest = String(Math.floor(Math.random()*1_000_000)).padStart(6,'0');
    return `${prefix} ${rest.slice(0,3)} ${rest.slice(3)}`;
  } else return faker.phone.number('+48 5## ### ###');
}

function genPesel() {
  const start = new Date(1970,0,1).getTime();
  const end = new Date(2009,11,31).getTime();
  const d = new Date(start + Math.random()*(end-start));
  const year = d.getFullYear();
  const month = d.getMonth()+1;
  const day = d.getDate();
  const m = month + (year>=2000?20:0);
  const yy = String(year).slice(-2).padStart(2,'0');
  const mm = String(m).padStart(2,'0');
  const dd = String(day).padStart(2,'0');
  const serial = String(Math.floor(Math.random()*1000)).padStart(3,'0');
  const sex = Math.random()<0.5?0:1;
  const base = `${yy}${mm}${dd}${serial}${sex}`;
  if (safeMode) return base + Math.floor(Math.random()*10);
  const weights = [1,3,7,9,1,3,7,9,1,3];
  const s = base.split('').reduce((acc,d,i)=> acc+parseInt(d,10)*weights[i],0);
  const control = (10 - (s % 10)) % 10;
  return base + control;
}

function generateRow(cols) {
  const row = {};
  if (cols.name) row.name = genFullName();
  if (cols.email) row.email = genEmail(row.name);
  if (cols.phone) row.phone = genPhone();
  if (cols.pesel) row.pesel = genPesel();
  return row;
}

function generateData(n, cols) {
  return Array.from({length:n}, ()=>generateRow(cols));
}

// ======= TABELA =======
let currentData = [];
let sortKey = null;
let sortAsc = true;

function renderTable(data, cols) {
  const thead = $('#thead');
  const tbody = $('#tbody');
  const headers = Object.keys(cols).filter(k=>cols[k]);

  // Nagłówek
  thead.innerHTML = `<tr>${headers.map(h=>`<th data-key="${h}">${h}</th>`).join('')}</tr>`;

  // Body
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="${headers.length}" class="empty">Brak danych</td></tr>`;
    $('#rowsCount').textContent = '0 rekordów';
    return;
  }

  tbody.innerHTML = data.map(r=>`<tr>${headers.map(h=>`<td>${r[h]}</td>`).join('')}</tr>`).join('');
  $('#rowsCount').textContent = data.length + ' rekordów';

  // Sortowanie po kliknięciu nagłówka
  $$('#thead th').forEach(th => th.addEventListener('click', () => {
    const key = th.dataset.key;
    if (sortKey===key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = true; }
    const sorted = [...currentData].sort((a,b)=>(a[key]>b[key]?1:-1)*(sortAsc?1:-1));
    renderTable(sorted, cols);
  }));
}

// ======= GENERUJ =======
$('#generate').addEventListener('click', () => {
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

// ======= KOPIUJ =======
$('#copyBtn').addEventListener('click', () => {
  if (!currentData.length) { toast('Brak danych do skopiowania'); return; }
  const headers = Object.keys(currentData[0]);
  const text = [headers.join('\t'), ...currentData.map(r=>headers.map(h=>r[h]).join('\t'))].join('\n');
  navigator.clipboard.writeText(text).then(()=>toast('Skopiowano do schowka'));
});

// ======= CSV =======
$('#csvBtn').addEventListener('click', () => {
  if (!currentData.length) { toast('Brak danych do eksportu'); return; }
  const headers = Object.keys(currentData[0]);
  const csv = [headers.map(h=>`"${h}"`).join(','), ...currentData.map(r=>headers.map(h=>`"${r[h]}"`).join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download='dane_testowe.csv';
  a.click();
});
