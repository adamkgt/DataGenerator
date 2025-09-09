# DataGenerator – Test Cases (Przypadki Testowe)

| ID  | Nazwa testu / Test Name                  | Krok / Steps                                                                 | Oczekiwany rezultat / Expected Result                     | Status |
|-----|-----------------------------------------|----------------------------------------------------------------------------|-----------------------------------------------------------|--------|
| TC01 | Strona ładuje się poprawnie              | 1. Otwórz stronę aplikacji w Chrome, Firefox, Edge, Safari                 | Strona ładuje się bez błędów, widoczne wszystkie elementy |        |
| TC02 | Widoczność głównych elementów            | 1. Sprawdź, czy pola wyboru, liczba rekordów i przycisk "Generuj" są widoczne | Wszystkie główne elementy są widoczne i poprawnie rozmieszczone |        |
| TC03 | Responsywność interfejsu                 | 1. Otwórz stronę na desktop i mobile                                       | Strona wyświetla się poprawnie na różnych urządzeniach   |        |
| TC04 | Generowanie danych domyślnie             | 1. Kliknij "Generuj"                                                       | Dane zostają wygenerowane poprawnie                       |        |
| TC05 | Generowanie dla wszystkich kombinacji pól| 1. Wybierz różne kombinacje pól (np. tylko Imię, tylko PESEL, wszystkie pola)  
2. Kliknij "Generuj" | Dane generują się zgodnie z wybranymi polami            |        |
| TC06 | Limit rekordów                           | 1. Wpisz liczbę >50 w polu rekordów  
2. Kliknij "Generuj"                   | Aplikacja blokuje generowanie lub pokazuje komunikat     |        |
| TC07 | Walidacja pola liczby                     | 1. Wpisz 0, liczbę ujemną lub tekst w polu liczby  
2. Kliknij "Generuj"     | Aplikacja nie generuje danych i wyświetla komunikat      |        |
| TC08 | Poprawność imion i nazwisk               | 1. Wybierz różne lokalizacje (PL, EN, DE)  
2. Generuj dane                  | Imiona i nazwiska odpowiadają wybranej lokalizacji       |        |
| TC09 | Poprawność e-maili                        | 1. Generuj dane zawierające e-maile                                         | Wszystkie e-maile mają prawidłowy format                 |        |
| TC10 | Poprawność numerów telefonów              | 1. Generuj dane z numerami telefonów                                        | Numery mają odpowiednią długość i format                 |        |
| TC11 | Poprawność PESEL                          | 1. Generuj dane z PESEL                                                     | PESEL ma 11 cyfr                                          |        |
| TC12 | Kopiowanie danych                          | 1. Kliknij "Kopiuj"                                                         | Wszystkie dane zostają skopiowane do schowka             |        |
| TC13 | Eksport do CSV                             | 1. Kliknij "Eksport CSV"                                                     | Plik CSV zapisuje wszystkie dane i otwiera się poprawnie |        |
| TC14 | Sortowanie kolumn                          | 1. Kliknij nagłówek kolumny  
2. Kliknij ponownie                              | Pierwsze kliknięcie sortuje rosnąco, drugie malejąco    |        |
| TC15 | Generowanie bez zaznaczonych pól          | 1. Odznacz wszystkie pola  
2. Kliknij "Generuj"                               | Aplikacja pokazuje komunikat lub nie generuje danych    |        |
| TC16 | Dostępność – klawiatura                   | 1. Poruszaj się po aplikacji używając tylko Tab i Enter                     | Wszystkie elementy można obsługiwać klawiaturą           |        |
| TC17 | Dostępność – kontrast i ARIA              | 1. Sprawdź etykiety ARIA i kontrast kolorów                                  | Elementy mają poprawne etykiety, kolory są czytelne     |        |
