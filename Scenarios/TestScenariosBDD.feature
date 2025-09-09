Feature: DataGenerator – funkcjonalność aplikacji

  Background:
    Given aplikacja DataGenerator jest otwarta w przeglądarce

  # 1️⃣ Testy interfejsu użytkownika
  Scenario: Strona ładuje się poprawnie
    Then strona ładuje się bez błędów
    And widoczne są wszystkie elementy UI

  Scenario: Widoczność głównych elementów
    Then pola wyboru są widoczne
    And pole liczby rekordów jest widoczne
    And przycisk "Generuj" jest widoczny

  Scenario: Responsywność interfejsu
    When aplikacja jest otwarta na desktopie
    Then strona wyświetla się poprawnie
    When aplikacja jest otwarta na urządzeniu mobilnym
    Then strona wyświetla się poprawnie

  # 2️⃣ Testy generowania danych
  Scenario: Generowanie danych domyślnie
    When kliknięto przycisk "Generuj" bez zmian w ustawieniach
    Then dane zostają wygenerowane poprawnie

  Scenario: Generowanie dla wszystkich kombinacji pól
    When zaznaczono tylko pole "Imię" i kliknięto "Generuj"
    Then wygenerowano dane tylko z polem "Imię"
    When zaznaczono tylko pole "PESEL" i kliknięto "Generuj"
    Then wygenerowano dane tylko z polem "PESEL"
    When zaznaczono wszystkie pola i kliknięto "Generuj"
    Then wygenerowano dane ze wszystkimi polami

  Scenario: Limit rekordów
    When wpisano wartość 51 w polu liczby rekordów i kliknięto "Generuj"
    Then generowanie danych jest zablokowane lub wyświetla się komunikat o limicie

  Scenario: Walidacja pola liczby rekordów
    When wpisano wartość 0 i kliknięto "Generuj"
    Then generowanie danych jest zablokowane i wyświetla się komunikat walidacyjny
    When wpisano wartość -5 i kliknięto "Generuj"
    Then generowanie danych jest zablokowane i wyświetla się komunikat walidacyjny
    When wpisano tekst "abc" i kliknięto "Generuj"
    Then generowanie danych jest zablokowane i wyświetla się komunikat walidacyjny

  # 3️⃣ Testy poprawności danych
  Scenario: Poprawność imion i nazwisk
    When ustawiono lokalizację na PL i wygenerowano dane
    Then imiona i nazwiska odpowiadają lokalizacji PL
    When ustawiono lokalizację na EN i wygenerowano dane
    Then imiona i nazwiska odpowiadają lokalizacji EN
    When ustawiono lokalizację na DE i wygenerowano dane
    Then imiona i nazwiska odpowiadają lokalizacji DE

  Scenario: Poprawność e-maili
    When wygenerowano dane zawierające e-maile
    Then wszystkie e-maile mają prawidłowy format

  Scenario: Poprawność numerów telefonów
    When wygenerowano dane zawierające numery telefonów
    Then numery mają odpowiednią długość i format

  Scenario: Poprawność PESEL
    When wygenerowano dane zawierające PESEL
    Then PESEL ma 11 cyfr

  # 4️⃣ Testy eksportu i kopiowania
  Scenario: Kopiowanie danych
    When kliknięto przycisk "Kopiuj"
    Then wszystkie dane zostają skopiowane do schowka

  Scenario: Eksport do CSV
    When kliknięto przycisk "Eksport CSV"
    Then plik CSV zawiera wszystkie dane
    And plik otwiera się poprawnie w Excelu lub Google Sheets

  # 5️⃣ Testy sortowania tabeli
  Scenario: Sortowanie kolumn
    When kliknięto nagłówek kolumny
    Then dane w kolumnie sortują się rosnąco
    When kliknięto nagłówek kolumny ponownie
    Then dane w kolumnie sortują się malejąco

  # 6️⃣ Testy nietypowych przypadków
  Scenario: Generowanie bez zaznaczonych pól
    When odznaczono wszystkie pola i kliknięto "Generuj"
    Then aplikacja pokazuje komunikat lub nie generuje danych

  # 7️⃣ Testy dostępności (Accessibility)
  Scenario: Obsługa klawiatury
    When poruszano się po aplikacji tylko przy użyciu klawiszy Tab i Enter
    Then wszystkie elementy są obsługiwalne klawiaturą

  Scenario: Kontrast i etykiety ARIA
    When sprawdzono etykiety ARIA i kontrast kolorów
    Then wszystkie elementy mają poprawne etykiety
    And kolory są czytelne
