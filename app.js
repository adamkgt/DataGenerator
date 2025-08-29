document.addEventListener('DOMContentLoaded', () => {
  // ======= UTIL =======
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const toast = msg => {
    const el = $('#toast');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 1800);
  };

  // ======= Faker 9.x =======
  if (!window.Faker) {
    toast('Faker nie został załadowany!');
    return;
  }
  const fakerInstance = new window.Faker();

  // ======= MOTYW =======
  $('#themeToggle').addEventListener('change', e => {
    document.body.dataset.theme = e.target.checked ? 'light' : 'dark';
  });

  // ======= TRYB BEZPIECZNY =======
  let safeMode = $('#safeToggle').checked;
  $('#safeToggle').addEventListener('change', e => safeMode = e.target.checked);

  // ======= GENEROWANIE DANYCH =======
  function generateRow(cols) {
    const row = {};
    if (cols.name) row.name = fakerInstance.person.fullName();
    if (cols.email) row.email = safeMode
      ? fakerInstance.internet.email({ provider: 'example.com' })
      : fakerInstance.internet.email();
    if (cols.phone) row.phone = safeMode
      ? fakerInstance.phone.number('+48 5## ### ###')
      : fakerInstance.phone.number();
    if (cols.pesel) row.pesel = String(Math.floor(Math.random() * 1e11)).padStart(11, '0');
    return row;
  }

  function generateData(n, cols) {
    return Array.from({ length: n }, () => generateRow(cols));
  }

  // ======= TABELA =======
  let currentData = [];
  let sortKey = null;
  let sortAsc = true;

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
      `<tr>${headers.map(h => r[h]).map(v => `<td>${v}</td>`).join('')}</tr>`
    ).join('');

    $('#rowsCount').textContent = data.length + ' rekordów';

    // Sortowanie po kliknięciu nagłówka
    $$('#thead th').forEach(th => th.addEventListener('click', () => {
      const key = th.dataset.key;
      if (sortKey === key) sortAsc = !sortAsc;
      else { sortKey = key; sortAsc = true; }
      const sorted = [...currentData].sort((a, b) => (a[key] > b[key] ? 1 : -1) * (sortAsc ? 1 : -1));
      renderTable(sorted, cols);
    }));
  }

  // ======= PRZYCISK GENERUJ =======
  $('#generate').addEventListener('click', () => {
    const n = Math.min(50, Math.max(1, parseInt($('#count').value, 10) || 1));
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
});
