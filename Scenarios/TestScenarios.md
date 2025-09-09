# DataGenerator – Scenariusze Testowe

**Cel testu:** Sprawdzenie funkcjonalności aplikacji DataGenerator: generowanie danych, eksport, kopiowanie, sortowanie i dostępność.

**Wymagania wstępne:**  
- Aplikacja DataGenerator działa w przeglądarce.  
- Tester ma dostęp do wszystkich pól i przycisków.

---

## 1️⃣ Testy interfejsu użytkownika (UI)

### SC-UI-01: Strona ładuje się poprawnie
**Kroki:**
1. Otwórz aplikację w Chrome.  
2. Otwórz aplikację w Firefox.  
3. Otwórz aplikację w Edge.  
4. Otwórz aplikację w Safari.  

**Oczekiwany rezultat:** Strona ładuje się bez błędów, widoczne wszystkie elementy.

---

### SC-UI-02: Widoczność głównych elementów
**Kroki:**
1. Sprawdź, czy pola wyboru są widoczne.  
2. Sprawdź, czy pole liczby rekordów jest widoczne.  
3. Sprawdź, czy przycisk „Generuj” jest widoczny.  

**Oczekiwany rezultat:** Wszystkie główne elementy są widoczne i poprawnie rozmieszczone.

---

### SC-UI-03: Responsywność interfejsu
**Kroki:**
1. Otwórz aplikację na desktopie.  
2. Otwórz aplikację na urządzeniu mobilnym lub w trybie responsywnym w przeglądarce.  

**Oczekiwany rezultat:** Strona wyświetla się poprawnie na różnych urządzeniach.

---

## 2️⃣ Testy generowania danych

### SC-GEN-01: Generowanie danych domyślnie
**Kroki:**
1. Otwórz aplikację.  
2. Kliknij „Generuj” bez zmiany żadnych ustawień.  

**Oczekiwany rezultat:** Dane zostają wygenerowane poprawnie.

---

### SC-GEN-02: Generowanie dla wszystkich kombinacji pól
**Kroki:**
1. Zaznacz pole „Imię” i kliknij „Generuj”.  
2. Sprawdź, czy wygenerowano dane tylko z polem Imię.  
3. Zaznacz pole „PESEL” i kliknij „Generuj”.  
4. Sprawdź, czy wygenerowano dane tylko z polem PESEL.  
5. Zaznacz wszystkie pola i kliknij „Generuj”.  
6. Sprawdź, czy wygenerowano dane ze wszystkimi polami.  

**Oczekiwany rezultat:** Dane generują się zgodnie z wybranymi polami.

---

### SC-GEN-03: Limit rekordów
**Kroki:**
1. Wpisz liczbę 51 w polu liczby rekordów.  
2. Kliknij „Generuj”.  

**Oczekiwany rezultat:** Aplikacja blokuje generowanie lub wyświetla komunikat o limicie.

---

### SC-GEN-04: Walidacja pola liczby
**Kroki:**
1. Wpisz 0 w polu liczby rekordów i kliknij „Generuj”.  
2. Wpisz -5 w polu liczby rekordów i kliknij „Generuj”.  
3. Wpisz tekst „abc” w polu liczby rekordów i kliknij „Generuj”.  

**Oczekiwany rezultat:** Aplikacja nie generuje danych i wyświetla komunikat walidacyjny.

---

## 3️⃣ Testy poprawności danych

### SC-DATA-01: Poprawność imion i nazwisk
**Kroki:**
1. Wybierz lokalizację PL i generuj dane.  
2. Wybierz lokalizację EN i generuj dane.  
3. Wybierz lokalizację DE i generuj dane.  

**Oczekiwany rezultat:** Imiona i nazwiska odpowiadają wybranej lokalizacji.

---

### SC-DATA-02: Poprawność e-maili
**Kroki:**
1. Wygeneruj dane zawierające e-maile.  

**Oczekiwany rezultat:** Wszystkie e-maile mają prawidłowy format.

---

### SC-DATA-03: Poprawność numerów telefonów
**Kroki:**
1. Wygeneruj dane zawierające numery telefonów.  

**Oczekiwany rezultat:** Numery mają odpowiednią długość i format.

---

### SC-DATA-04: Poprawność PESEL
**Kroki:**
1. Wygeneruj dane zawierające PESEL.  

**Oczekiwany rezultat:** PESEL ma 11 cyfr.

---

## 4️⃣ Testy eksportu i kopiowania

### SC-EXPORT-01: Kopiowanie danych
**Kroki:**
1. Kliknij „Kopiuj”.  

**Oczekiwany rezultat:** Wszystkie dane zostają skopiowane do schowka.

---

### SC-EXPORT-02: Eksport do CSV
**Kroki:**
1. Kliknij „Eksport CSV”.  
2. Otwórz pobrany plik w Excelu lub Google Sheets.  

**Oczekiwany rezultat:** Plik CSV zawiera wszystkie dane i otwiera się poprawnie.

---

## 5️⃣ Testy sortowania tabeli

### SC-SORT-01: Sortowanie kolumn
**Kroki:**
1. Kliknij nagłówek kolumny.  
2. Kliknij nagłówek kolumny ponownie.  

**Oczekiwany rezultat:** Pierwsze kliknięcie sortuje rosnąco, drugie malejąco.

---

## 6️⃣ Testy nietypowych przypadków

### SC-EDGE-01: Generowanie bez zaznaczonych pól
**Kroki:**
1. Odznacz wszystkie pola.  
2. Kliknij „Generuj”.  

**Oczekiwany rezultat:** Aplikacja pokazuje komunikat lub nie generuje danych.

---

## 7️⃣ Testy dostępności (Accessibility)

### SC-ACCESS-01: Obsługa klawiatury
**Kroki:**
1. Poruszaj się po aplikacji używając tylko klawiszy Tab i Enter.  

**Oczekiwany rezultat:** Wszystkie elementy można obsługiwać klawiaturą.

---

### SC-ACCESS-02: Kontrast i ARIA
**Kroki:**
1. Sprawdź etykiety ARIA wszystkich elementów.  
2. Sprawdź kontrast kolorów tekstu i tła.  

**Oczekiwany rezultat:** Elementy mają poprawne etykiety, kolory są czytelne.
