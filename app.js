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

// ======= GENEROWANIE DANYCH =======
let currentData = [];

function getFaker(locale) {
  if (!window.faker) { toast('Faker nie został załadowany'); return null; }
  const { faker } = window;
  faker.locale = locale || 'pl';
  return faker;
}

function generateRow(cols, locale) {
  const faker = getFaker(locale);
  if (!faker) return {};

  const row = {};
  if (cols.name) row.name = faker.person.fullName();
  if (cols.email) row.email = safeMode
      ? faker.helpers.slugify(faker.person.firstName() + '.' + faker.person.lastName()) + '@example.com'
      : faker.internet.email();
  if (cols.phone) row.phone = safeMode
      ? '+48 600 123 456'
      : faker.phone.number('+48 ### ### ###');
  if (cols.pesel) row.pesel = safeMode
      ? '80010112345'
      : String(Math.floor(Math.random()*1e11)).padStart(11,'0');
  return row;
}

function generateData(n, cols, locale) {
  return Array.from({length:n},()=>generateRow(cols, locale));
}

// ======= TABELA =======
function renderTable(data, cols){
  const thead = $('#thead');
  const tbody = $('#tbody');
  const headers = Object.keys(cols).filter(k=>cols[k]);

  thead.innerHTML = `<tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr>`;

  if(!data.length){
    tbody.innerHTML = `<tr><td colspan="${headers.length}" class="empty">Brak danych</td></tr>`;
    $('#rowsCount').textContent='0 rekordów';
    return;
  }

  tbody.innerHTML = data.map(r=>`<tr>${headers.map(h=>`<td>${r[h]}</td>`).join('')}</tr>`).join('');
  $('#rowsCount').textContent = `${data.length} rekordów`;
}

// ======= GENERUJ =======
$('#generate').addEventListener('click', ()=>{
  const n = Math.min(50, Math.max(1, parseInt($('#count').value,10)||1));
  const locale = $('#locale').value;
  const cols = {
    name: $('#colName').checked,
    email: $('#colEmail').checked,
    phone: $('#colPhone').checked,
    pesel: $('#colPesel').checked
  };
  currentData = generateData(n, cols, locale);
  renderTable(currentData, cols);
  toast(`Wygenerowano ${n} rekordów`);
});

// ======= KOPIUJ =======
$('#copyBtn').addEventListener('click', ()=>{
  if(!currentData.length){ toast('Brak danych do skopiowania'); return; }
  const headers = Object.keys(currentData[0]);
  const text = [headers.join('\t'), ...currentData.map(r=>headers.map(h=>r[h]).join('\t'))].join('\n');
  navigator.clipboard.writeText(text).then(()=>toast('Skopiowano do schowka'));
});

// ======= CSV =======
$('#csvBtn').addEventListener('click', ()=>{
  if(!currentData.length){ toast('Brak danych do eksportu'); return; }
  const headers = Object.keys(currentData[0]);
  const csv = [headers.map(h=>`"${h}"`).join(','), ...currentData.map(r=>headers.map(h=>`"${r[h]}"`).join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download='dane_testowe.csv';
  a.click();
});
