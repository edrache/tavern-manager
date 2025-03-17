# Tavern Manager

Aplikacja webowa do zarządzania karczmą w systemach RPG. Pozwala na tworzenie i zarządzanie elementami karczmy, śledzenie kosztów i dochodów oraz filtrowanie elementów po tagach.

## Funkcjonalności

- Edycja opisu karczmy z obsługą składni Markdown
- Dodawanie, edycja i usuwanie elementów karczmy
- Zarządzanie kosztami i dochodami dla każdego elementu
- System tagów z możliwością filtrowania
- Automatyczne obliczanie bilansu i podatków
- Responsywny układ bento box
- Eksport i import danych w formacie JSON
- Automatyczne zapisywanie w localStorage

## Technologie

- HTML5
- CSS3
- JavaScript (Vanilla)
- Marked.js (do obsługi Markdown)
- Font Awesome (dla ikon)

## Instalacja

1. Sklonuj repozytorium
2. Otwórz plik `index.html` w przeglądarce

## Użytkowanie

### Opis karczmy
- Kliknij przycisk edycji aby modyfikować opis
- Używaj składni Markdown do formatowania tekstu
- Wybierz rozmiar boxa dla opisu (szerokość x wysokość)

### Elementy karczmy
- Dodawaj nowe elementy używając przycisku "+"
- Każdy element może mieć:
  - Nazwę
  - Opis (z obsługą Markdown)
  - Tagi
  - Koszty
  - Dochody
  - Własny rozmiar boxa

### Tagi i filtrowanie
- Dodawaj tagi do elementów
- Używaj przycisku filtrowania do wyświetlania elementów z wybranymi tagami
- Wybieraj z istniejących tagów lub twórz nowe

### Dane
- Wszystkie zmiany są automatycznie zapisywane w przeglądarce
- Możliwość eksportu i importu danych w formacie JSON

## Licencja

MIT