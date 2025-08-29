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

// ======= SPRAWDZENIE FAKER =======
if (!window.faker) {
  toast('Faker nie został załadowany!');
  throw new Error('Faker nie załadowany');
}
const faker = window.faker;

// ======= GENERATORY DANYCH =======
function genFullName() {
  return faker.person.firstName() + ' ' + faker.person.lastName();
}

function genEmail(fullName) {
  if (safeMode) {
    const parts = fullName.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'').split(' ');
    const base = [parts[0]?.[0] || 'u', parts[1] || 'user'].join('.');
    const domains = ['example.com','example.org','example.net'];
    const domain = domains[Math.floor(Math.random()*domains.length)];
    return `${base}${Math.floor(Math.random()*90+10)}@${domain}`;
  }
  return faker.internet.email();
}

function genPhone() {
  if (safeMode) {
    const block = Math.floor(Math.random()*200)+600;
    const rest = String(Math.floor(Math.random()*1_000_000)).padStart(6,'0');
    return `${block} ${rest.slice(0,3)} ${rest.slice(3,6)}`;
  }
  return faker.phone.number('+48 ### ### ###');
}

function genPesel() {
  // Tryb safe: losowy 11-cyfrowy ciąg (nie prawdziwy PESEL)
  if (safeMode) return faker.string.numeric(11);
  // Normalny: też 11 cyfr, dla prostoty generujemy tak samo
  return faker.string.numeric(11);
}

// ======= GENEROWANIE WIERZCHÓW =======
function generateRow(cols) {
  const fullName = genFullName();
  const row = {};
  if (cols.name)  row.name = fullName;
  if (cols.email) row.email = genEmail(fullName);
  if (cols.phone) row.phone = genPhone();
  if (cols.pesel) row.pesel = genPesel();
  return row;
}

function generateData(n, cols) {
  return Array.from({length: n}, () => generateRow(cols));
}

// ======= TABELA =======
let currentData = [];
let sortKey = null;
let sortAsc = true;

function currentColumns() {
  return {
    name: $('#colName').checked,
    email: $('#colEmail').checked,
    phone: $('#colPhone').checked,
    pesel: $('#colPesel').checked
  };
}

function renderTable(data, cols) {
  const thead = $('#thead');
  const tbody = $('#tbody');
  const headers = Object.keys(cols).filter(k => cols[k]);

  // Nagłówek
  thead.innerHTML = `<tr>${headers.map(h => `<th data-key="${h}">${h}</th>`).join('')}</tr>`;

  // Body
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="${headers.length}" class="empty">Brak danych. Wygeneruj rekordy.</td></tr>`;
    $('#rowsCount').textContent = '0 rekordów';
    return;
  }

  tbody.innerHTML = data.map(r =>
    `<tr>${headers.map(h => `<td>${r[h]}</td>`).join('')}</tr>`
  ).join('');

  $('#rowsCount').textContent = data.length + ' rekordów';

  // Sortowanie po kliknięciu nagłówka
  $$('#thead th').forEach(th => th.addEventListener('click', () => {
    const key = th.dataset.key;
    if (sortKey === key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = true; }
    const sorted = [...currentData].sort((a,b) =>
      (a[key] > b[key] ? 1 : -1) * (sortAsc ? 1 : -1)
    );
    renderTable(sorted, cols);
  }));
}

// ======= GENERUJ =======
$('#generate').addEventListener('click', () => {
  const n = Math.min(50, Math.max(1, parseInt($('#count').value,10) || 1));
  const cols = currentColumns();
  currentData = generateData(n, cols);
  renderTable(currentData, cols);
  toast(`Wygenerowano ${n} rekordów`);
});

// ======= KOPIUJ =======
$('#copyBtn').addEventListener('click', () => {
  if (!currentData.length) { toast('Brak danych do skopiowania'); return; }
  const headers = Object.keys(currentData[0]);
  const text = [headers.join('\t'), ...currentData.map(r => headers.map(h => r[h]).join('\t'))].join('\n');
  navigator.clipboard.writeText(text).then(() => toast('Skopiowano do schowka'));
});

// ======= CSV =======
$('#csvBtn').addEventListener('click', () => {
  if (!currentData.length) { toast('Brak danych do eksportu'); return; }
  const headers = Object.keys(currentData[0]);
  const csv = [headers.map(h => `"${h}"`).join(','), ...currentData.map(r => headers.map(h => `"${r[h]}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dane_testowe.csv';
  a.click();
});
