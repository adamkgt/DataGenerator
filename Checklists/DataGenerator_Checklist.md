# ✅ DataGenerator – Checklist

Przykładowa lista kontrolna dla testów manualnych aplikacji [DataGenerator](https://adamkgt.github.io/DataGenerator/).

---

## 1. Interfejs użytkownika (UI)
- [ ] Strona ładuje się poprawnie w przeglądarce (Chrome, Firefox, Edge, Safari).
- [ ] Widoczne są wszystkie główne elementy (pola wyboru, liczba rekordów, przycisk "Generuj").
- [ ] Aplikacja jest responsywna (poprawne wyświetlanie na desktop/mobile).
- [ ] Elementy są czytelne i mają poprawny kontrast.

---

## 2. Generowanie danych
- [ ] Możliwe jest wygenerowanie danych przy domyślnych ustawieniach.
- [ ] Generowanie działa dla każdej kombinacji pól (np. tylko imię, tylko PESEL, wszystkie pola).
- [ ] Wygenerowana liczba rekordów odpowiada liczbie wpisanej w polu.
- [ ] Limit 50 rekordów działa poprawnie (nie da się wygenerować więcej).
- [ ] Próba wpisania wartości 0, liczby ujemnej lub tekstu w polu liczby jest obsłużona (walidacja).

---

## 3. Dane – poprawność
- [ ] Imiona i nazwiska są zgodne z wybraną lokalizacją (PL, EN, DE).
- [ ] Adresy e-mail mają prawidłowy format (np. user@example.com).
- [ ] Numery telefonów mają odpowiednią długość i format.
- [ ] PESEL ma 11 cyfr i jest poprawnie sformatowany.

---

## 4. Eksport / Kopiowanie
- [ ] Przycisk **Kopiuj** kopiuje wszystkie dane do schowka.
- [ ] Przycisk **Eksport CSV** zapisuje dane w pliku `.csv`.
- [ ] Plik CSV otwiera się poprawnie w Excelu / Google Sheets.
- [ ] Separator pól w CSV jest prawidłowy (np. `,` lub `;`).

---

## 5. Sortowanie tabeli
- [ ] Kliknięcie nagłówka kolumny sortuje dane rosnąco.
- [ ] Ponowne kliknięcie sortuje dane malejąco.
- [ ] Sortowanie działa dla wszystkich kolumn.

---

## 6. Błędy i nietypowe przypadki
- [ ] Wpisanie liczby większej niż 50 pokazuje komunikat lub blokuje akcję.
- [ ] Wpisanie wartości nienumerycznej w polu liczby nie powoduje awarii aplikacji.
- [ ] Generowanie działa poprawnie przy liczbie rekordów = 1.
- [ ] Generowanie działa poprawnie przy liczbie rekordów = 50 (maksymalny limit).
- [ ] Usunięcie wszystkich zaznaczonych pól i próba wygenerowania danych daje odpowiednią reakcję aplikacji.

---

## 7. Dostępność (Accessibility)
- [ ] Elementy interfejsu mają odpowiednie etykiety (ARIA labels).
- [ ] Można korzystać z aplikacji za pomocą klawiatury (Tab/Enter).
- [ ] Kolory i kontrast są zgodne z WCAG (tekst czytelny).

---

✅ **Status testów**: do uzupełnienia po wykonaniu checklisty.
