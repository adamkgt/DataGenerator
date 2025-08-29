document.addEventListener('DOMContentLoaded', () => {
  const { faker } = window;
  if (!faker) {
    alert('Faker nie został załadowany');
    return;
  }

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // MOTYW
  $('#themeToggle').addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  });

  // GENEROWANIE DANYCH
  function generateRow() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number('###-###-###')
    };
  }

  function generateData(n = 10) {
    return Array.from({ length: n }, () => generateRow());
  }

  function renderTable(data) {
    const thead = $('#thead');
    const tbody = $('#tbody');
    thead.innerHTML = '<tr><th>Imię i nazwisko</th><th>Email</th><th>Telefon</th></tr>';
    tbody.innerHTML = data.map(r => `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td></tr>`).join('');
  }

  $('#generate').addEventListener('click', () => {
    const data = generateData(10);
    renderTable(data);
  });
});
