# Test Plan – DataGenerator

## 1. Wprowadzenie
Celem dokumentu jest przedstawienie planu testów dla aplikacji **DataGenerator**.  
Aplikacja umożliwia generowanie fikcyjnych danych osobowych, eksport do CSV, kopiowanie do schowka, sortowanie tabeli oraz zapewnia dostępność interfejsu.

---

## 2. Zakres testów
Testy obejmują następujące funkcjonalności:
- Interfejs użytkownika (UI) i responsywność
- Generowanie danych dla różnych kombinacji pól
- Walidację i poprawność wygenerowanych danych (imię, nazwisko, e-mail, telefon, PESEL)
- Eksport danych do CSV i kopiowanie do schowka
- Sortowanie tabeli
- Obsługę nietypowych przypadków
- Testy dostępności (klawiatura, kontrast, ARIA)

Nie obejmuje:
- Integracji z zewnętrznymi systemami
- Testów wydajnościowych i bezpieczeństwa

---

## 3. Cele testów
- Sprawdzenie poprawności wszystkich funkcji aplikacji
- Wykrycie błędów w generowaniu danych, eksportowaniu i sortowaniu
- Zapewnienie zgodności z zasadami dostępności (Accessibility)
- Weryfikacja działania aplikacji w różnych przeglądarkach (Chrome, Firefox, Edge, Safari)
- Zapewnienie, że wszystkie scenariusze użytkownika działają zgodnie z oczekiwaniami

---

## 4. Typy testów
- **Smoke Testing** – podstawowe funkcje: generowanie danych, eksport, kopiowanie
- **Functional Testing** – pełna weryfikacja scenariuszy użytkownika
- **Regression Testing** – ponowne testy po zmianach w aplikacji
- **Exploratory Testing** – testy eksploracyjne nietypowych przypadków
- **UI/UX & Accessibility Testing** – responsywność, kontrast, ARIA, obsługa klawiatury

---

## 5. Harmonogram testów
| Faza | Typ testu | Zakres | Odpowiedzialny |
|------|-----------|--------|----------------|
| Faza 1 | Smoke Testing | Generowanie danych, eksport CSV, kopiowanie | Tester Manualny |
| Faza 2 | Functional Testing | Wszystkie scenariusze SC-UI-01 → SC-ACCESS-02 | Tester Manualny |
| Faza 3 | Regression Testing | Powtórka testów po poprawkach | Tester Manualny |
| Faza 4 | Exploratory Testing | Nietypowe przypadki i edge cases | Tester Manualny |
| Faza 5 | UI/UX & Accessibility | Responsywność, kontrast, ARIA, obsługa klawiatury | Tester Manualny |

---

## 6. Kryteria wejścia
- Aplikacja DataGenerator dostępna w środowisku testowym
- Przeglądarki zainstalowane (Chrome, Firefox, Edge, Safari)
- Dostęp do wszystkich pól i przycisków

---

## 7. Kryteria wyjścia
- Wszystkie scenariusze testowe wykonane i zarejestrowane
- Wszystkie błędy zgłoszone w repozytorium GitHub Issues
- Raport zbiorczy testów przygotowany w formacie Markdown lub PDF

---

## 8. Dokumentacja wyników
- Scenariusze testowe zapisane w `Scenarios/`
- Checklisty w `Checklists/`
- Przypadki testowe w `TestCases/`
- Zgłoszenia błędów w `BugReports/`
- Raporty zbiorcze w `Reports/`

---

## 9. Testowane przeglądarki i środowisko
| Przeglądarka | System operacyjny |
|--------------|-----------------|
| Chrome       | Windows 10 / macOS |
| Firefox      | Windows 10 / macOS |
| Edge         | Windows 10 |
| Safari       | macOS |

---

## 10. Test Strategy – kolejność wykonywania testów
1. **Smoke Testing** – podstawowe funkcje aplikacji
2. **Functional Testing** – pełne scenariusze SC-UI, SC-GEN, SC-DATA, SC-EXPORT, SC-SORT, SC-EDGE, SC-ACCESS
3. **Regression Testing** – powtórka testów po wprowadzeniu zmian
4. **Exploratory Testing** – nietypowe przypadki użytkownika
5. **UI/UX & Accessibility** – kontrast, ARIA, obsługa klawiatury, responsywność
