# Tavern Manager

Aplikacja webowa do zarządzania karczmą w systemach RPG. Pozwala na tworzenie i zarządzanie elementami karczmy, śledzenie kosztów i dochodów oraz filtrowanie elementów po tagach i bilansie.

## Funkcjonalności

- Edycja opisu karczmy z obsługą składni Markdown
- Dodawanie, edycja i usuwanie elementów karczmy
- Zarządzanie kosztami i dochodami dla każdego elementu
- System tagów z możliwością filtrowania
- Filtrowanie elementów po bilansie (dodatni/ujemny)
- Automatyczne obliczanie bilansu i podatków
- Responsywny układ bento box z możliwością dostosowania rozmiarów
- Eksport i import danych w formacie JSON
- Automatyczne zapisywanie w localStorage
- Dostosowywanie kolorów interfejsu i elementów
- Przeciąganie i upuszczanie elementów do zmiany kolejności
- Automatyczne kolorowanie elementów w zależności od bilansu
- Możliwość ustawienia własnego koloru dla każdego elementu

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
  - Własny kolor lub automatyczne kolorowanie w zależności od bilansu
- Przeciągaj elementy aby zmienić ich kolejność

### Tagi i filtrowanie
- Dodawaj tagi do elementów
- Używaj przycisku filtrowania do wyświetlania elementów z wybranymi tagami
- Filtruj elementy po bilansie (dodatni/ujemny)
- Wybieraj z istniejących tagów lub twórz nowe

### Dostosowywanie wyglądu
- Używaj przycisku kolorów do dostosowania schematu kolorystycznego
- Ustawiaj kolory dla elementów z dodatnim/ujemnym bilansem
- Dostosuj kolory interfejsu (tło, tekst, przyciski)
- Ustawiaj własne kolory dla poszczególnych elementów

### Ustawienia układu
- Dostosuj rozmiar podstawowego elementu (1x1)
- Zmieniaj odstępy między elementami
- Przywracaj domyślne ustawienia układu

### Dane
- Wszystkie zmiany są automatycznie zapisywane w przeglądarce
- Możliwość eksportu i importu danych w formacie JSON

## Licencja

MIT