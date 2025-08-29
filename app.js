document.addEventListener('DOMContentLoaded', () => {
  const { faker } = window;
  if (!faker) {
    alert('Faker nie załadowany');
    return;
  }

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
  function genFullName() { return faker.person.fullName(); }
  function genEmail(name) {
    if (safeMode) {
      const parts = name.toLowerCase().split(' ');
      return `${parts[0]}.${parts[1] || 'user'}@example.com`;
    }
    return faker.internet.email();
  }
  function genPhonePL() {
    return safeMode
      ? `6${Math.floor(Math.random()*100000000).toString().padStart(8,'0')}`
      : faker.phone.number('### ### ###');
  }
  function genPesel() {
    return safeMode
      ? Math.floor(Math.random()*1e11).toString().padStart(11,'0')
      : Math.floor(Math.random()*1e11).toString().padStart(11,'0');
  }

function generateRow(cols) {
  const row = {};
  if (cols.name) row.name = window.faker.person.firstName() + ' ' + window.faker.person.lastName();
  if (cols.email) row.email = window.faker.internet.email();
  if (cols.phone) row.phone = window.faker.phone.number('###-###-###');
  if (cols.pesel) row.pesel = Math.floor(Math.random()*1e11).toString().padStart(11,'0');
  return row;
}

  function generateData(n, cols) {
    return Array.from({length:n}, () => generateRow(cols));
  }

  // ======= TABELA =======
  let currentData = [];
  let sortKey = null;
  let sortAsc = true;

  function renderTable(data, cols) {
    const thead = $('#thead');
    const tbody = $('#tbody');
    const headers = Object.keys(cols).filter(k=>cols[k]);
    thead.innerHTML = `<tr>${headers.map(h=>`<th data-key="${h}">${h}</th>`).join('')}</tr>`;

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="${headers.length}" class="empty">Brak danych</td></tr>`;
      $('#rowsCount').textContent = '0 rekordów';
      return;
    }

    tbody.innerHTML = data.map(r => `<tr>${headers.map(h=>r[h]).join('')}</tr>`).join('');
    $('#rowsCount').textContent = data.length+' rekordów';

    $$('#thead th').forEach(th=>th.addEventListener('click',()=>{
      const key = th.dataset.key;
      if(sortKey===key) sortAsc=!sortAsc; else {sortKey=key; sortAsc=true;}
      const sorted = [...currentData].sort((a,b)=> (a[key]>b[key]?1:-1)*(sortAsc?1:-1));
      renderTable(sorted, cols);
    }));
  }

  // ======= GENERUJ =======
  $('#generate').addEventListener('click', ()=>{
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
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='dane_testowe.csv'; a.click();
  });
});

