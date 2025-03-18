// Struktura danych karczmy
let tavernData = {
    description: '',
    lastUpdated: null,
    elements: [],
    taxRate: 0.8,
    descriptionSize: { width: 2, height: 1 },
    selectedTags: [],  // Lista wybranych tagów do filtrowania
    elementsOrder: [],  // Lista indeksów elementów w kolejności wyświetlania
    filters: {
        tags: [],
        positiveBalance: false,
        negativeBalance: false
    },
    colors: {
        background: '#f4f1ea',
        text: '#2c1810',
        primary: '#8b4513',
        secondary: '#495057',
        positiveBalanceStart: '#ffffff',
        positiveBalanceEnd: '#e8f5e9',
        negativeBalanceStart: '#ffffff',
        negativeBalanceEnd: '#ffebee',
        neutralBalanceStart: '#ffffff',
        neutralBalanceEnd: '#f5f5f5'
    },
    pageSettings: {
        baseBoxWidth: 250,
        baseBoxHeight: 100,
        gridGap: 16
    }
};

// Elementy DOM
const descriptionView = document.getElementById('descriptionView');
const descriptionEdit = document.getElementById('descriptionEdit');
const descriptionTextarea = document.getElementById('tavernDescription');
const editButton = document.getElementById('editDescription');
const saveButton = document.getElementById('saveDescription');
const cancelButton = document.getElementById('cancelDescription');
const exportButton = document.getElementById('exportData');
const importButton = document.getElementById('importData');
const addElementButton = document.getElementById('addElement');
const elementsList = document.getElementById('elementsList');
const elementModal = document.getElementById('elementModal');
const elementForm = document.getElementById('elementForm');
const elementTemplate = document.getElementById('elementTemplate');
const taxModal = document.getElementById('taxModal');
const taxForm = document.getElementById('taxForm');
const editTaxButton = document.getElementById('editTax');
const filterButton = document.getElementById('filterButton');
const filterModal = document.getElementById('filterModal');
const availableTagsContainer = document.getElementById('availableTags');
const selectedTagsContainer = document.getElementById('selectedTags');
const elementTagsInput = document.getElementById('elementTags');
const tagSuggestionsContainer = document.getElementById('tagSuggestions');
const availableElementTagsContainer = document.getElementById('availableElementTags');
const colorsModal = document.getElementById('colorsModal');
const colorsForm = document.getElementById('colorsForm');
const editColorsButton = document.getElementById('editColors');

// Obsługa modalu ustawień strony
const pageSettingsModal = document.getElementById('pageSettingsModal');
const pageSettingsForm = document.getElementById('pageSettingsForm');
const pageSettingsButton = document.getElementById('pageSettings');

// Funkcja aktualizująca widok Markdown
function updateMarkdownView() {
    descriptionView.innerHTML = marked.parse(tavernData.description);
    // Ustawienie rozmiaru boxa z opisem
    const descriptionBox = document.querySelector('.description-box');
    descriptionBox.style.gridColumn = `span ${tavernData.descriptionSize.width}`;
    descriptionBox.style.gridRow = `span ${tavernData.descriptionSize.height}`;
}

// Funkcja przełączająca tryb edycji
function toggleEditMode(isEditing) {
    descriptionView.style.display = isEditing ? 'none' : 'block';
    descriptionEdit.style.display = isEditing ? 'block' : 'none';
    editButton.style.display = isEditing ? 'none' : 'block';
}

// Funkcja zapisująca dane do localStorage
function saveToLocalStorage() {
    localStorage.setItem('tavernData', JSON.stringify(tavernData));
}

// Funkcja wczytująca dane z localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('tavernData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            console.log('Wczytane dane:', parsedData);
            
            // Obsługa starszej wersji danych bez informacji o rozmiarze
            const elements = parsedData.elements || [];
            const updatedElements = elements.map(element => {
                if (!element.size) {
                    return {
                        ...element,
                        size: { width: 2, height: 1 }  // Domyślny rozmiar dla starych elementów
                    };
                }
                return element;
            });
            
            tavernData = {
                description: parsedData.description || '',
                lastUpdated: parsedData.lastUpdated || null,
                elements: updatedElements,
                taxRate: parsedData.taxRate || 0.8,
                descriptionSize: parsedData.descriptionSize || { width: 2, height: 1 },
                selectedTags: parsedData.selectedTags || [],
                elementsOrder: parsedData.elementsOrder || [],
                filters: parsedData.filters || {
                    tags: [],
                    positiveBalance: false,
                    negativeBalance: false
                },
                colors: parsedData.colors || {
                    background: '#f4f1ea',
                    text: '#2c1810',
                    primary: '#8b4513',
                    secondary: '#495057',
                    positiveBalanceStart: '#ffffff',
                    positiveBalanceEnd: '#e8f5e9',
                    negativeBalanceStart: '#ffffff',
                    negativeBalanceEnd: '#ffebee',
                    neutralBalanceStart: '#ffffff',
                    neutralBalanceEnd: '#f5f5f5'
                },
                pageSettings: parsedData.pageSettings || {
                    baseBoxWidth: 250,
                    baseBoxHeight: 100,
                    gridGap: 16
                }
            };
            
            // Jeśli nie ma zapisanej kolejności lub jest nieprawidłowa, inicjalizuj domyślną
            if (tavernData.elementsOrder.length !== tavernData.elements.length) {
                tavernData.elementsOrder = Array.from({ length: tavernData.elements.length }, (_, i) => i);
            }
            
            console.log('Ustawiona stawka podatku:', tavernData.taxRate);
            descriptionTextarea.value = tavernData.description;
            document.getElementById('descriptionWidth').value = tavernData.descriptionSize.width;
            document.getElementById('descriptionHeight').value = tavernData.descriptionSize.height;
            updateMarkdownView();
            renderElements();
            calculateTotals();
            updateColors();
            updatePageSettings();
        } catch (error) {
            console.error('Błąd podczas wczytywania danych z localStorage:', error);
            tavernData = {
                description: '',
                lastUpdated: null,
                elements: [],
                taxRate: 0.8,
                descriptionSize: { width: 2, height: 1 },
                selectedTags: [],
                elementsOrder: [],
                filters: {
                    tags: [],
                    positiveBalance: false,
                    negativeBalance: false
                },
                colors: {
                    background: '#f4f1ea',
                    text: '#2c1810',
                    primary: '#8b4513',
                    secondary: '#495057',
                    positiveBalanceStart: '#ffffff',
                    positiveBalanceEnd: '#e8f5e9',
                    negativeBalanceStart: '#ffffff',
                    negativeBalanceEnd: '#ffebee',
                    neutralBalanceStart: '#ffffff',
                    neutralBalanceEnd: '#f5f5f5'
                },
                pageSettings: {
                    baseBoxWidth: 250,
                    baseBoxHeight: 100,
                    gridGap: 16
                }
            };
        }
    }
}

// Funkcja zapisująca dane do pliku JSON
function saveToJSON() {
    const dataStr = JSON.stringify(tavernData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'karczma.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Funkcja wczytująca dane z pliku JSON
function loadFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            tavernData = JSON.parse(e.target.result);
            descriptionTextarea.value = tavernData.description;
            updateMarkdownView();
            renderElements();
            saveToLocalStorage();
        } catch (error) {
            alert('Błąd podczas wczytywania pliku: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Funkcja obliczająca sumy kosztów i dochodów
function calculateTotals() {
    const totalCosts = tavernData.elements.reduce((sum, element) => {
        return sum + element.costs.reduce((costSum, cost) => costSum + (cost.value || 0), 0);
    }, 0);
    
    const totalIncome = tavernData.elements.reduce((sum, element) => {
        return sum + element.income.reduce((incomeSum, income) => incomeSum + (income.value || 0), 0);
    }, 0);
    
    const roundedCosts = Math.ceil(totalCosts / 10);
    const roundedIncome = Math.floor(totalIncome / 10);
    const roundedTax = Math.ceil(roundedIncome * tavernData.taxRate);
    const balance = roundedIncome - roundedCosts - roundedTax;
    
    const costsElement = document.getElementById('totalCosts');
    const incomeElement = document.getElementById('totalIncome');
    const taxElement = document.getElementById('totalTax');
    const balanceElement = document.getElementById('totalBalance');
    
    costsElement.textContent = `-${roundedCosts}`;
    costsElement.title = `Dokładna suma kosztów: ${totalCosts}\nPodzielona przez 10 i zaokrąglona w górę: ${roundedCosts}`;
    
    incomeElement.textContent = roundedIncome;
    incomeElement.title = `Dokładna suma dochodów: ${totalIncome}\nPodzielona przez 10 i zaokrąglona w dół: ${roundedIncome}`;
    
    taxElement.textContent = `-${roundedTax}`;
    taxElement.title = `Podatek (${(tavernData.taxRate * 100).toFixed(0)}% pełnego dochodu): ${roundedTax}`;
    
    balanceElement.textContent = balance;
    balanceElement.title = `Bilans = Dochód - Koszta - Podatek\n${roundedIncome} - ${roundedCosts} - ${roundedTax} = ${balance}`;
}

// Funkcje do zarządzania elementami
function renderElements() {
    elementsList.innerHTML = '';
    
    // Używamy kolejności z elementsOrder, jeśli istnieje
    const elementsToRender = tavernData.elementsOrder.length === tavernData.elements.length
        ? tavernData.elementsOrder.map(index => tavernData.elements[index])
        : tavernData.elements;
    
    elementsToRender.forEach((element, index) => {
        const elementCard = elementTemplate.content.cloneNode(true);
        const card = elementCard.querySelector('.element-card');
        
        // Dodajemy indeks jako data-attribute
        card.dataset.index = tavernData.elementsOrder.length === tavernData.elements.length
            ? tavernData.elementsOrder[index]
            : index;
        
        // Ustawianie koloru elementu
        if (element.color) {
            card.classList.add('custom-color');
            card.style.backgroundColor = element.color;
        } else {
            const balance = calculateElementBalance(element);
            if (balance > 0) {
                card.classList.add('positive-balance');
            } else if (balance < 0) {
                card.classList.add('negative-balance');
            } else {
                card.classList.add('neutral-balance');
            }
        }
        
        elementCard.querySelector('.element-name').textContent = element.name;
        
        // Dodanie tagów do elementu
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'element-tags';
        if (element.tags) {
            element.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'element-tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }
        elementCard.querySelector('.element-card').appendChild(tagsContainer);
        
        // Ustawienie tagów jako data-attribute dla filtrowania
        elementCard.querySelector('.element-card').dataset.tags = element.tags ? element.tags.join(',') : '';
        
        // Renderowanie opisu
        const descriptionDiv = elementCard.querySelector('.element-description');
        if (element.description) {
            descriptionDiv.innerHTML = marked.parse(element.description);
        } else {
            descriptionDiv.style.display = 'none';
        }
        
        // Renderowanie kosztów
        const costsDiv = elementCard.querySelector('.element-costs');
        const costsList = costsDiv.querySelector('.costs-list');
        const hasCosts = element.costs.some(cost => cost.value > 0);
        if (hasCosts) {
            costsDiv.style.display = 'block';
            element.costs.forEach(cost => {
                if (cost.value > 0) {
                    const li = document.createElement('li');
                    li.textContent = `${cost.name}: ${cost.value}`;
                    costsList.appendChild(li);
                }
            });
        }
        
        // Renderowanie dochodów
        const incomeDiv = elementCard.querySelector('.element-income');
        const incomeList = incomeDiv.querySelector('.income-list');
        const hasIncome = element.income.some(income => income.value > 0);
        if (hasIncome) {
            incomeDiv.style.display = 'block';
            element.income.forEach(income => {
                if (income.value > 0) {
                    const li = document.createElement('li');
                    li.textContent = `${income.name}: ${income.value}`;
                    incomeList.appendChild(li);
                }
            });
        }
        
        // Ustawienie rozmiaru boxa
        const elementBox = elementCard.querySelector('.element-card');
        elementBox.style.gridColumn = `span ${element.size.width || 1}`;
        elementBox.style.gridRow = `span ${element.size.height || 1}`;
        
        // Obsługa przycisków edycji i usuwania
        elementCard.querySelector('.edit-button').addEventListener('click', () => editElement(index));
        elementCard.querySelector('.delete-button').addEventListener('click', () => deleteElement(index));
        
        elementsList.appendChild(elementCard);
    });
    
    initDragAndDrop();
    calculateTotals();
    filterElements();
}

function addElement() {
    elementForm.reset();
    delete elementForm.dataset.editIndex;  // Reset indeksu edycji
    document.getElementById('modalTitle').textContent = 'Dodaj Element';
    
    // Renderowanie dostępnych tagów
    renderAvailableElementTags([]);
    
    elementModal.style.display = 'flex';
}

function editElement(index) {
    const element = tavernData.elements[index];
    document.getElementById('modalTitle').textContent = 'Edytuj Element';
    
    // Wypełnienie formularza danymi
    document.getElementById('elementName').value = element.name;
    document.getElementById('elementDescription').value = element.description || '';
    document.getElementById('elementTags').value = element.tags ? element.tags.join(', ') : '';
    document.getElementById('elementWidth').value = element.size?.width || 1;
    document.getElementById('elementHeight').value = element.size?.height || 1;
    document.getElementById('elementColor').value = element.color || '#ffffff';
    
    // Wypełnienie kosztów
    const costsList = document.getElementById('costsList');
    costsList.innerHTML = '';
    element.costs.forEach(cost => {
        addItemInput(costsList, 'cost', cost.name, cost.value);
    });
    
    // Wypełnienie dochodów
    const incomeList = document.getElementById('incomeList');
    incomeList.innerHTML = '';
    element.income.forEach(income => {
        addItemInput(incomeList, 'income', income.name, income.value);
    });
    
    // Renderowanie dostępnych tagów
    renderAvailableElementTags(element.tags || []);
    
    elementModal.style.display = 'flex';
    
    // Zapisz indeks edytowanego elementu
    elementForm.dataset.editIndex = index;
}

function deleteElement(index) {
    if (confirm('Czy na pewno chcesz usunąć ten element?')) {
        // Usuń element z tablicy elements
        tavernData.elements.splice(index, 1);
        
        // Zaktualizuj kolejność
        tavernData.elementsOrder = tavernData.elementsOrder
            .filter(i => i !== index)
            .map(i => i > index ? i - 1 : i);
        
        renderElements();
        saveToLocalStorage();
    }
}

function addItemInput(container, type, name = '', value = '') {
    const div = document.createElement('div');
    div.className = 'item-input';
    div.innerHTML = `
        <input type="text" placeholder="Nazwa ${type === 'cost' ? 'kosztu' : 'dochodu'}" class="${type}-name" value="${name}">
        <input type="number" placeholder="Wartość" class="${type}-value" value="${value}">
        <button type="button" class="remove-item">&times;</button>
    `;
    
    div.querySelector('.remove-item').addEventListener('click', () => div.remove());
    container.appendChild(div);
}

// Obsługa formularza elementu
elementForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const element = {
        name: document.getElementById('elementName').value,
        description: document.getElementById('elementDescription').value,
        tags: document.getElementById('elementTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0),
        size: {
            width: parseInt(document.getElementById('elementWidth').value),
            height: parseInt(document.getElementById('elementHeight').value)
        },
        color: document.getElementById('elementColor').value === '#ffffff' ? null : document.getElementById('elementColor').value,
        costs: Array.from(document.querySelectorAll('.cost-name')).map((input, index) => ({
            name: input.value,
            value: parseInt(document.querySelectorAll('.cost-value')[index].value) || 0
        })),
        income: Array.from(document.querySelectorAll('.income-name')).map((input, index) => ({
            name: input.value,
            value: parseInt(document.querySelectorAll('.income-value')[index].value) || 0
        }))
    };
    
    const editIndex = elementForm.dataset.editIndex;
    if (editIndex !== undefined) {
        tavernData.elements[editIndex] = element;
    } else {
        tavernData.elements.push(element);
        tavernData.elementsOrder.push(tavernData.elements.length - 1);
    }
    
    renderElements();
    saveToLocalStorage();
    elementModal.style.display = 'none';
});

// Obsługa przycisków modalu
document.querySelector('.close-button').addEventListener('click', () => {
    elementModal.style.display = 'none';
    delete elementForm.dataset.editIndex;  // Reset indeksu edycji
});

document.querySelector('.cancel-button').addEventListener('click', () => {
    elementModal.style.display = 'none';
    delete elementForm.dataset.editIndex;  // Reset indeksu edycji
});

// Obsługa dodawania nowych pól w formularzu
document.querySelectorAll('.add-item').forEach(button => {
    button.addEventListener('click', () => {
        const target = document.getElementById(button.dataset.target);
        addItemInput(target, button.dataset.target === 'costsList' ? 'cost' : 'income');
    });
});

// Obsługa przycisków głównych
editButton.addEventListener('click', () => {
    descriptionView.style.display = 'none';
    descriptionEdit.style.display = 'block';
    descriptionTextarea.value = tavernData.description;
    document.getElementById('descriptionWidth').value = tavernData.descriptionSize.width;
    document.getElementById('descriptionHeight').value = tavernData.descriptionSize.height;
});

saveButton.addEventListener('click', () => {
    tavernData.description = descriptionTextarea.value;
    tavernData.descriptionSize = {
        width: parseInt(document.getElementById('descriptionWidth').value),
        height: parseInt(document.getElementById('descriptionHeight').value)
    };
    updateMarkdownView();
    saveToLocalStorage();
    descriptionView.style.display = 'block';
    descriptionEdit.style.display = 'none';
});

cancelButton.addEventListener('click', () => {
    toggleEditMode(false);
});

exportButton.addEventListener('click', () => {
    saveToJSON();
});

// Obsługa importu danych
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json';
fileInput.style.display = 'none';

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        loadFromJSON(e.target.files[0]);
    }
});

importButton.addEventListener('click', () => {
    fileInput.click();
});

// Obsługa edycji stawki podatku
editTaxButton.addEventListener('click', () => {
    console.log('Kliknięto edycję podatku');
    const taxRateInput = document.getElementById('taxRate');
    taxRateInput.value = (tavernData.taxRate * 100).toFixed(0);
    taxModal.style.display = 'flex';
});

taxForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Zapisywanie nowej stawki podatku');
    const taxRateInput = document.getElementById('taxRate');
    const newTaxRate = parseInt(taxRateInput.value) / 100;
    
    if (newTaxRate >= 0 && newTaxRate <= 1) {
        tavernData.taxRate = newTaxRate;
        console.log('Nowa stawka podatku:', tavernData.taxRate);
        calculateTotals();
        saveToLocalStorage();
        taxModal.style.display = 'none';
    } else {
        alert('Stawka podatku musi być między 0 a 100 procentami.');
    }
});

// Obsługa zamykania modalu podatku
taxModal.querySelector('.cancel-button').addEventListener('click', () => {
    taxModal.style.display = 'none';
});

// Funkcja do pobierania wszystkich dostępnych tagów
function getAllTags() {
    const tags = new Set();
    tavernData.elements.forEach(element => {
        if (element.tags) {
            element.tags.forEach(tag => tags.add(tag));
        }
    });
    return Array.from(tags);
}

// Funkcja do renderowania dostępnych tagów w formularzu edycji elementu
function renderAvailableElementTags(currentTags = []) {
    const allTags = getAllTags();
    availableElementTagsContainer.innerHTML = '';
    
    allTags.forEach(tag => {
        const isSelected = currentTags.includes(tag);
        const tagElement = document.createElement('div');
        tagElement.className = `tag ${isSelected ? 'selected' : ''}`;
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => {
            const currentTagsArray = elementTagsInput.value
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);
            
            if (isSelected) {
                // Usuń tag
                const newTags = currentTagsArray.filter(t => t !== tag);
                elementTagsInput.value = newTags.join(', ');
            } else {
                // Dodaj tag
                currentTagsArray.push(tag);
                elementTagsInput.value = currentTagsArray.join(', ');
            }
            
            // Odśwież wyświetlanie tagów
            renderAvailableElementTags(elementTagsInput.value.split(',').map(t => t.trim()).filter(t => t.length > 0));
        });
        
        availableElementTagsContainer.appendChild(tagElement);
    });
}

// Funkcja do filtrowania elementów
function filterElements() {
    const elements = document.querySelectorAll('.element-card');
    elements.forEach(element => {
        const elementTags = element.dataset.tags ? element.dataset.tags.split(',') : [];
        const elementIndex = parseInt(element.dataset.index);
        const elementData = tavernData.elements[elementIndex];
        
        // Sprawdzanie bilansu elementu
        const balance = calculateElementBalance(elementData);
        const matchesBalanceFilter = (
            (!tavernData.filters.positiveBalance && !tavernData.filters.negativeBalance) || // żaden filtr bilansu nie jest wybrany
            (tavernData.filters.positiveBalance && balance > 0) || // filtr dodatniego bilansu i element ma dodatni bilans
            (tavernData.filters.negativeBalance && balance < 0)    // filtr ujemnego bilansu i element ma ujemny bilans
        );
        
        // Sprawdzanie tagów
        const matchesTagFilter = tavernData.filters.tags.length === 0 || 
                               tavernData.filters.tags.some(tag => elementTags.includes(tag));
        
        // Element jest widoczny tylko jeśli spełnia oba warunki filtrowania
        element.style.display = (matchesBalanceFilter && matchesTagFilter) ? 'block' : 'none';
    });
}

// Funkcja do renderowania tagów w modalu filtrowania
function renderFilterTags() {
    const allTags = getAllTags();
    availableTagsContainer.innerHTML = '';
    selectedTagsContainer.innerHTML = '';
    
    // Aktualizacja checkboxów bilansu
    document.getElementById('filterPositiveBalance').checked = tavernData.filters.positiveBalance;
    document.getElementById('filterNegativeBalance').checked = tavernData.filters.negativeBalance;
    
    allTags.forEach(tag => {
        const isSelected = tavernData.filters.tags.includes(tag);
        const tagElement = document.createElement('div');
        tagElement.className = `tag ${isSelected ? 'selected' : ''}`;
        tagElement.textContent = tag;
        tagElement.addEventListener('click', () => toggleTagSelection(tag));
        
        if (isSelected) {
            selectedTagsContainer.appendChild(tagElement);
        } else {
            availableTagsContainer.appendChild(tagElement);
        }
    });
}

// Funkcja do przełączania wyboru tagu w filtrach
function toggleTagSelection(tag) {
    const index = tavernData.filters.tags.indexOf(tag);
    if (index === -1) {
        tavernData.filters.tags.push(tag);
    } else {
        tavernData.filters.tags.splice(index, 1);
    }
    renderFilterTags();
}

// Obsługa modalu filtrowania
filterButton.addEventListener('click', () => {
    renderFilterTags();
    filterModal.style.display = 'flex';
});

// Obsługa filtrów bilansu
document.getElementById('filterPositiveBalance').addEventListener('change', (e) => {
    tavernData.filters.positiveBalance = e.target.checked;
});

document.getElementById('filterNegativeBalance').addEventListener('change', (e) => {
    tavernData.filters.negativeBalance = e.target.checked;
});

// Modyfikacja obsługi przycisku "Zastosuj" w modalu filtrowania
filterModal.querySelector('.apply-button').addEventListener('click', () => {
    filterElements();
    saveToLocalStorage();
    filterModal.style.display = 'none';
});

// Funkcja do filtrowania i wyświetlania sugestii tagów
function showTagSuggestions(input) {
    const currentTags = input.value.split(',').map(tag => tag.trim());
    const currentInput = currentTags[currentTags.length - 1].toLowerCase();
    
    if (currentInput.length < 1) {
        tagSuggestionsContainer.style.display = 'none';
        return;
    }
    
    const allTags = getAllTags();
    const suggestions = allTags.filter(tag => 
        tag.toLowerCase().includes(currentInput) && 
        !currentTags.includes(tag)
    );
    
    if (suggestions.length === 0) {
        tagSuggestionsContainer.style.display = 'none';
        return;
    }
    
    tagSuggestionsContainer.innerHTML = '';
    suggestions.forEach(tag => {
        const div = document.createElement('div');
        div.className = 'tag-suggestion';
        div.textContent = tag;
        div.addEventListener('click', () => {
            const tags = currentTags.slice(0, -1);
            tags.push(tag);
            input.value = tags.join(', ');
            tagSuggestionsContainer.style.display = 'none';
            // Wyświetl ponownie sugestie po dodaniu tagu
            showTagSuggestions(input);
        });
        tagSuggestionsContainer.appendChild(div);
    });
    
    tagSuggestionsContainer.style.display = 'block';
}

// Obsługa wpisywania tagów
elementTagsInput.addEventListener('input', (e) => {
    const currentTags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    renderAvailableElementTags(currentTags);
});

// Zamykanie sugestii po kliknięciu poza nimi
document.addEventListener('click', (e) => {
    if (!e.target.closest('.form-group')) {
        tagSuggestionsContainer.style.display = 'none';
    }
});

// Dodajemy obsługę przeciągania
function initDragAndDrop() {
    const elements = document.querySelectorAll('.element-card');
    
    elements.forEach(element => {
        element.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
            e.dataTransfer.setData('text/plain', e.target.dataset.index);
        });

        element.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            
            // Aktualizacja kolejności po przeciągnięciu
            const newOrder = Array.from(document.querySelectorAll('.element-card')).map(el => 
                parseInt(el.dataset.index)
            );
            tavernData.elementsOrder = newOrder;
            saveToLocalStorage();
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingElement = document.querySelector('.dragging');
            if (draggingElement === element) return;
            
            const box = element.getBoundingClientRect();
            const offset = e.clientY - box.top - (box.height / 2);
            
            if (offset < 0 && element.previousElementSibling !== draggingElement) {
                element.parentNode.insertBefore(draggingElement, element);
            } else if (offset > 0 && element.nextElementSibling !== draggingElement) {
                element.parentNode.insertBefore(draggingElement, element.nextElementSibling);
            }
        });
    });
}

// Inicjalizacja
document.body.appendChild(fileInput);
addElementButton.addEventListener('click', addElement);
loadFromLocalStorage();
updateMarkdownView();

// Funkcja obliczająca bilans dla pojedynczego elementu
function calculateElementBalance(element) {
    const totalCosts = element.costs.reduce((sum, cost) => sum + (cost.value || 0), 0);
    const totalIncome = element.income.reduce((sum, income) => sum + (income.value || 0), 0);
    return totalIncome - totalCosts;
}

// Dodanie obsługi przycisku reset koloru
document.getElementById('resetColor').addEventListener('click', () => {
    document.getElementById('elementColor').value = '#ffffff';
});

// Funkcja do aktualizacji kolorów w CSS
function updateColors() {
    document.documentElement.style.setProperty('--background-color', tavernData.colors.background);
    document.documentElement.style.setProperty('--text-color', tavernData.colors.text);
    document.documentElement.style.setProperty('--primary-color', tavernData.colors.primary);
    document.documentElement.style.setProperty('--secondary-color', tavernData.colors.secondary);
    document.documentElement.style.setProperty('--positive-balance-color-start', tavernData.colors.positiveBalanceStart);
    document.documentElement.style.setProperty('--positive-balance-color-end', tavernData.colors.positiveBalanceEnd);
    document.documentElement.style.setProperty('--negative-balance-color-start', tavernData.colors.negativeBalanceStart);
    document.documentElement.style.setProperty('--negative-balance-color-end', tavernData.colors.negativeBalanceEnd);
    document.documentElement.style.setProperty('--neutral-balance-color-start', tavernData.colors.neutralBalanceStart);
    document.documentElement.style.setProperty('--neutral-balance-color-end', tavernData.colors.neutralBalanceEnd);
}

// Funkcja do resetowania kolorów do domyślnych
function resetColors() {
    tavernData.colors = {
        background: '#f4f1ea',
        text: '#2c1810',
        primary: '#8b4513',
        secondary: '#495057',
        positiveBalanceStart: '#ffffff',
        positiveBalanceEnd: '#e8f5e9',
        negativeBalanceStart: '#ffffff',
        negativeBalanceEnd: '#ffebee',
        neutralBalanceStart: '#ffffff',
        neutralBalanceEnd: '#f5f5f5'
    };
    updateColors();
    saveToLocalStorage();
}

// Obsługa edytora kolorów
editColorsButton.addEventListener('click', () => {
    // Wypełnij formularz aktualnymi kolorami
    document.getElementById('backgroundColor').value = tavernData.colors.background;
    document.getElementById('textColor').value = tavernData.colors.text;
    document.getElementById('primaryColor').value = tavernData.colors.primary;
    document.getElementById('secondaryColor').value = tavernData.colors.secondary;
    document.getElementById('positiveBalanceColorStart').value = tavernData.colors.positiveBalanceStart;
    document.getElementById('positiveBalanceColorEnd').value = tavernData.colors.positiveBalanceEnd;
    document.getElementById('negativeBalanceColorStart').value = tavernData.colors.negativeBalanceStart;
    document.getElementById('negativeBalanceColorEnd').value = tavernData.colors.negativeBalanceEnd;
    document.getElementById('neutralBalanceColorStart').value = tavernData.colors.neutralBalanceStart;
    document.getElementById('neutralBalanceColorEnd').value = tavernData.colors.neutralBalanceEnd;
    
    colorsModal.style.display = 'flex';
});

colorsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Zapisz nowe kolory
    tavernData.colors = {
        background: document.getElementById('backgroundColor').value,
        text: document.getElementById('textColor').value,
        primary: document.getElementById('primaryColor').value,
        secondary: document.getElementById('secondaryColor').value,
        positiveBalanceStart: document.getElementById('positiveBalanceColorStart').value,
        positiveBalanceEnd: document.getElementById('positiveBalanceColorEnd').value,
        negativeBalanceStart: document.getElementById('negativeBalanceColorStart').value,
        negativeBalanceEnd: document.getElementById('negativeBalanceColorEnd').value,
        neutralBalanceStart: document.getElementById('neutralBalanceColorStart').value,
        neutralBalanceEnd: document.getElementById('neutralBalanceColorEnd').value
    };
    
    updateColors();
    saveToLocalStorage();
    colorsModal.style.display = 'none';
});

// Obsługa przycisku resetowania kolorów
colorsModal.querySelector('.reset-colors-button').addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne kolory?')) {
        resetColors();
        colorsModal.style.display = 'none';
    }
});

// Obsługa zamykania modalu kolorów
colorsModal.querySelector('.close-button').addEventListener('click', () => {
    colorsModal.style.display = 'none';
});

colorsModal.querySelector('.cancel-button').addEventListener('click', () => {
    colorsModal.style.display = 'none';
});

// Funkcja do aktualizacji zmiennych CSS
function updatePageSettings() {
    document.documentElement.style.setProperty('--base-box-width', `${tavernData.pageSettings.baseBoxWidth}px`);
    document.documentElement.style.setProperty('--base-box-height', `${tavernData.pageSettings.baseBoxHeight}px`);
    document.documentElement.style.setProperty('--grid-gap', `${tavernData.pageSettings.gridGap}px`);
}

// Funkcja do resetowania ustawień strony
function resetPageSettings() {
    tavernData.pageSettings = {
        baseBoxWidth: 250,
        baseBoxHeight: 100,
        gridGap: 16
    };
    updatePageSettings();
    saveToLocalStorage();
}

// Obsługa przycisku ustawień strony
pageSettingsButton.addEventListener('click', () => {
    // Wypełnij formularz aktualnymi wartościami
    document.getElementById('baseBoxWidth').value = tavernData.pageSettings.baseBoxWidth;
    document.getElementById('baseBoxHeight').value = tavernData.pageSettings.baseBoxHeight;
    document.getElementById('gridGap').value = tavernData.pageSettings.gridGap;
    
    pageSettingsModal.style.display = 'flex';
});

// Obsługa formularza ustawień strony
pageSettingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Zapisz nowe ustawienia
    tavernData.pageSettings = {
        baseBoxWidth: parseInt(document.getElementById('baseBoxWidth').value),
        baseBoxHeight: parseInt(document.getElementById('baseBoxHeight').value),
        gridGap: parseInt(document.getElementById('gridGap').value)
    };
    
    updatePageSettings();
    saveToLocalStorage();
    pageSettingsModal.style.display = 'none';
});

// Obsługa przycisku resetowania ustawień
pageSettingsModal.querySelector('.reset-settings-button').addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia strony?')) {
        resetPageSettings();
        pageSettingsModal.style.display = 'none';
    }
});

// Obsługa zamykania modalu ustawień
pageSettingsModal.querySelector('.close-button').addEventListener('click', () => {
    pageSettingsModal.style.display = 'none';
});

pageSettingsModal.querySelector('.cancel-button').addEventListener('click', () => {
    pageSettingsModal.style.display = 'none';
});

// Wywołaj updatePageSettings przy starcie
updatePageSettings(); 