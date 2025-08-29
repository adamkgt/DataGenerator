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
  toast('Faker nie został załadowany');
  throw new Error('Faker nie załadowany');
}

// ======= GENERATOR =======
let currentData = [];
let sortKey = null;
let sortAsc = true;

// Funkcja tworzy instancję Faker dla wybranego locale
function getFakerInstance(locale) {
  return new window.faker.Faker({ locale: locale || 'pl' });
}

// Generuje jeden wiersz danych
function generateRow(cols, fakerInstance) {
  const row = {};
  if (cols.name) row.name = fakerInstance.person.fullName();
  if (cols.email) {
    row.email = safeMode
      ? fakerInstance.internet.email({ provider: 'example.com' })
      : fakerInstance.internet.email();
  }
  if (cols.phone) {
    row.phone = safeMode
      ? fakerInstance.phone.number('+48 5## ### ###')
      : fakerInstance.phone.number();
  }
  if (cols.pesel) {
    row.pesel = safeMode
      ? String(Math.floor(Math.random() * 1e11)).padStart(11, '0')
      : generatePesel();
  }
  return row;
}

// Generuje poprawny PESEL (tylko w trybie non-safe)
function generatePesel() {
  // data urodzenia 1970-2009
  const start = new Date(1970, 0, 1).getTime();
  const end = new Date(2009, 11, 31).getTime();
  const d = new Date(start + Math.random() * (end - start));
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  let day = d.getDate();
  let m = month + (year >= 2000 ? 20 : 0);
  const yy = String(year).slice(-2).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const serial = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  const sex = Math.random() < 0.5 ? 0 : 1;
  const base = `${yy}${mm}${dd}${serial}${sex}`;
  const weights = [1,3,7,9,1,3,7,9,1,3];
  const s = base.split('').reduce((acc,d,i)=> acc + parseInt(d,10)*weights[i], 0);
  const control = (10 - (s % 10)) % 10;
  return base + control;
}

// Generuje n wierszy danych
function generateData(n, cols, locale) {
  const fakerInstance = getFakerInstance(locale);
  return Array.from({ length: n }, () => generateRow(cols, fakerInstance));
}

// ======= TABELA =======
function renderTable(data, cols) {
  const thead = $('#thead');
  const tbody = $('#tbody');
  const headers = Object.keys(cols).filter(k => cols[k]);

  // Nagłówek
  thead.innerHTML = `<tr>${headers.map(h => `<th data-key="${h}">${h}</th>`).join('')}</tr>`;

  // Body
  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="${headers.length}" class="empty">Brak danych</td></tr>`;
    $('#rowsCount').textContent = '0 rekordów';
    return;
  }

  tbody.innerHTML = data.map(r =>
    `<tr>${headers.map(h => r[h] ?? '').map(v => `<td>${v}</td>`).join('')}</tr>`
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
