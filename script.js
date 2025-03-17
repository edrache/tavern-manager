// Struktura danych karczmy
let tavernData = {
    description: '',
    lastUpdated: null,
    elements: [],
    taxRate: 0.8,
    descriptionSize: { width: 2, height: 1 },
    selectedTags: []  // Lista wybranych tagów do filtrowania
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
                selectedTags: parsedData.selectedTags || []
            };
            
            console.log('Ustawiona stawka podatku:', tavernData.taxRate);
            descriptionTextarea.value = tavernData.description;
            document.getElementById('descriptionWidth').value = tavernData.descriptionSize.width;
            document.getElementById('descriptionHeight').value = tavernData.descriptionSize.height;
            updateMarkdownView();
            renderElements();
            calculateTotals();
        } catch (error) {
            console.error('Błąd podczas wczytywania danych z localStorage:', error);
            tavernData = {
                description: '',
                lastUpdated: null,
                elements: [],
                taxRate: 0.8,
                descriptionSize: { width: 2, height: 1 },
                selectedTags: []
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
    tavernData.elements.forEach((element, index) => {
        const elementCard = elementTemplate.content.cloneNode(true);
        
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
        tavernData.elements.splice(index, 1);
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
        const shouldShow = tavernData.selectedTags.length === 0 || 
                          tavernData.selectedTags.some(tag => elementTags.includes(tag));
        element.style.display = shouldShow ? 'block' : 'none';
    });
}

// Funkcja do renderowania tagów w modalu filtrowania
function renderFilterTags() {
    const allTags = getAllTags();
    availableTagsContainer.innerHTML = '';
    selectedTagsContainer.innerHTML = '';
    
    allTags.forEach(tag => {
        const isSelected = tavernData.selectedTags.includes(tag);
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
    const index = tavernData.selectedTags.indexOf(tag);
    if (index === -1) {
        tavernData.selectedTags.push(tag);
    } else {
        tavernData.selectedTags.splice(index, 1);
    }
    renderFilterTags();
}

// Obsługa modalu filtrowania
filterButton.addEventListener('click', () => {
    renderFilterTags();
    filterModal.style.display = 'flex';
});

filterModal.querySelector('.close-button').addEventListener('click', () => {
    filterModal.style.display = 'none';
});

filterModal.querySelector('.cancel-button').addEventListener('click', () => {
    filterModal.style.display = 'none';
});

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

// Inicjalizacja
document.body.appendChild(fileInput);
addElementButton.addEventListener('click', addElement);
loadFromLocalStorage();
updateMarkdownView(); 