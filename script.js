import { fakerPL, fakerEN, fakerDE } from "https://cdn.jsdelivr.net/npm/@faker-js/faker@9.0.0/+esm";

document.addEventListener('DOMContentLoaded', () => {
  // Guard na wypadek problemu z CDN
  if (!fakerEN || !fakerPL || !fakerDE) {
    console.error('Faker (ESM) nie został poprawnie załadowany!');
    return;
  }

  let fx = fakerEN; // aktualnie używany faker (domyślnie EN)
  const $ = sel => document.querySelector(sel);
  const toast = (msg) => {
    const el = $('#toast');
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 1800);
  };

  const themeToggle = $('#themeToggle');
  const safeToggle = $('#safeToggle');
  const applyTheme = () => document.body.setAttribute('data-theme', themeToggle.checked ? 'light' : 'dark');
  themeToggle.addEventListener('change', applyTheme);
  applyTheme();

  const thead = $('#thead'), tbody = $('#tbody'), rowsCount = $('#rowsCount');
  const MAX_FREEMIUM = 50;
  let data = [], sortState = { key: null, dir: 1 };

  const setLocale = (locale) => {
    switch (locale) {
      case 'pl': fx = fakerPL; break;
      case 'de': fx = fakerDE; break;
      default: fx = fakerEN; break;
    }
  };

  const genFullName = () => fx.person.fullName();
  const genEmail = (name) => {
    if (safeToggle.checked) {
      const parts = name.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').split(' ');
      const base = [parts[0]?.[0] || 'u', parts[1] || 'user'].join('.');
      const domains = ['example.com', 'example.org', 'example.net'];
      return `${base.replace(/[^a-z0-9\.]/g, '')}${Math.floor(Math.random() * 90 + 10)}@${domains[Math.floor(Math.random() * domains.length)]}`;
    }
    return fx.internet.email();
  };

  const genPhonePL = () => {
    const block = safeToggle.checked ? Math.floor(Math.random() * 200) + 600 : Math.floor(Math.random() * 900) + 100;
    const rest = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
    return `${block}${rest}`.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const genPeselSafeInvalid = () => {
    const start = new Date(1970, 0, 1).getTime(), end = new Date(2009, 11, 31).getTime();
    const d = new Date(start + Math.random() * (end - start));
    let y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
    let mm = m + (y >= 2000 ? 20 : 0);
    const yy = String(y).slice(-2).padStart(2, '0'), mms = String(mm).padStart(2, '0'), dd = String(day).padStart(2, '0');
    const serial = String(Math.floor(Math.random() * 1000)).padStart(3, '0'), sex = Math.random() < 0.5 ? 0 : 1;
    const base = `${yy}${mms}${dd}${serial}${sex}`;
    const weights = [1,3,7,9,1,3,7,9,1,3];
    const s = base.split('').reduce((acc,d,i) => acc + parseInt(d,10) * weights[i], 0);
    const bad = (10 - (s % 10) + 1) % 10;
    return base + bad;
  };

  const genPeselValid = () => {
    const start = new Date(1970,0,1).getTime(), end = new Date(2009,11,31).getTime();
    const d = new Date(start + Math.random() * (end-start));
    let y=d.getFullYear(), m=d.getMonth()+1, day=d.getDate();
    let mm = m + (y>=2000 ? 20:0);
    const yy = String(y).slice(-2).padStart(2,'0'), mms=String(mm).padStart(2,'0'), dd=String(day).padStart(2,'0');
    const serial=String(Math.floor(Math.random()*1000)).padStart(3,'0'), sex=Math.random()<0.5?0:1;
    const base = `${yy}${mms}${dd}${serial}${sex}`;
    const weights=[1,3,7,9,1,3,7,9,1,3];
    const s = base.split('').reduce((acc,d,i)=>acc+parseInt(d,10)*weights[i],0);
    const control = (10-(s%10))%10;
    return base + control;
  };

  const currentColumns = () => {
    const cols = [];
    if ($('#colName').checked) cols.push({ key:'name', label:'Imię i nazwisko' });
    if ($('#colEmail').checked) cols.push({ key:'email', label:'E-mail' });
    if ($('#colPhone').checked) cols.push({ key:'phone', label:'Telefon' });
    if ($('#colPesel').checked) cols.push({ key:'pesel', label:'PESEL' });
    return cols.length ? cols : [{ key:'name', label:'Imię i nazwisko' }];
  };

  const renderTable = (cols, rows) => {
    thead.innerHTML = '';
    const tr = document.createElement('tr');
    cols.forEach(c => {
      const th = document.createElement('th');
      th.textContent = c.label;
      th.dataset.key = c.key;
      th.addEventListener('click', () => toggleSort(c.key));
      tr.appendChild(th);
    });
    thead.appendChild(tr);

    tbody.innerHTML = '';
    if(!rows.length){
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = cols.length;
      td.className = 'empty';
      td.textContent = 'Brak danych. Wygeneruj rekordy.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    } else {
      rows.forEach(r => {
        const tr = document.createElement('tr');
        cols.forEach(c => {
          const td = document.createElement('td');
          td.textContent = r[c.key] ?? '';
          td.setAttribute('data-label', c.label);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
    rowsCount.textContent = `${rows.length} rekordów`;
  };

  const toggleSort = (key) => {
    if(sortState.key === key) sortState.dir *= -1;
    else sortState = { key:key, dir:1 };
    data.sort((a,b)=>{
      const va = String(a[key] ?? '').toLowerCase();
      const vb = String(b[key] ?? '').toLowerCase();
      return (va<vb ? -1 : va>vb ? 1 : 0) * sortState.dir;
    });
    renderTable(currentColumns(), data);
  };

  $('#generate').addEventListener('click', () => {
    let n = Math.min(parseInt($('#count').value || '0',10), MAX_FREEMIUM);
    $('#count').value = n || 0;
    if(!n){ toast('Podaj liczbę rekordów (1–50).'); return; }
    setLocale($('#locale').value);

    const cols = currentColumns();
    data = [];
    for(let i=0;i<n;i++){
      const name = genFullName();
      const row = {};
      cols.forEach(c => {
        if(c.key === 'name') row.name = name;
        if(c.key === 'email') row.email = genEmail(name);
        if(c.key === 'phone') row.phone = genPhonePL();
        if(c.key === 'pesel') row.pesel = safeToggle.checked ? genPeselSafeInvalid() : genPeselValid();
      });
      data.push(row);
    }
    sortState = { key:null, dir:1 };
    renderTable(cols, data);
    toast(`Wygenerowano ${n} rekordów`);
  });

  $('#copyBtn').addEventListener('click', async () => {
    if(!data.length){ toast('Brak danych do skopiowania.'); return; }
    const cols = currentColumns();
    const header = cols.map(c=>c.label).join('\t');
    const text = [header, ...data.map(r=>cols.map(c=>r[c.key]??'').join('\t'))].join('\n');
    await navigator.clipboard.writeText(text);
    toast('Skopiowano do schowka');
  });

  $('#csvBtn').addEventListener('click', () => {
    if(!data.length){ toast('Brak danych do eksportu.'); return; }
    const cols = currentColumns();
    const header = cols.map(c=>`"${c.label}"`).join(',');
    const lines = data.map(r => cols.map(c=>`${String(r[c.key] ?? '').replace(/"/g,'""')}`).join(','));
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dane_testowe.csv'; a.click();
    URL.revokeObjectURL(url);
  });
});
