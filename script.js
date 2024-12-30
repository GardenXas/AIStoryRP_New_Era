const mainMenu = document.getElementById('main-menu');
const scenarioMenu = document.getElementById('scenario-menu');
const characterEditor = document.getElementById('character-editor');
const gameContainer = document.getElementById('game-container');
const startGameButton = document.getElementById('start-game-button');
const loadGameButton = document.getElementById('load-game-button');
const startAdventureButton = document.getElementById('start-adventure-button');
const gameText = document.getElementById('game-text');
const commandInput = document.getElementById('command-input');
const submitButton = document.getElementById('submit-button');
const characterInfoButton = document.getElementById('character-info-button');
const inventoryButton = document.getElementById('inventory-button');
const mapButton = document.getElementById('map-button');
const charactersButton = document.getElementById('characters-button');
const saveGameButton = document.getElementById('save-game-button');
const apiKeyInput = document.getElementById('api-key-input');
const continueButton = document.getElementById('continue-button');

const characterNameInput = document.getElementById('character-name');
const characterRaceInput = document.getElementById('character-race');
const characterDescriptionInput = document.getElementById('character-description');
const perkList = document.getElementById('perk-list');
const addPerkButton = document.getElementById('add-perk-button');
const perkModal = document.getElementById('perk-modal');
const closeButtons = document.querySelectorAll('.close-button');
const addPerkModalButton = document.getElementById('add-perk-modal-button');
const perkNameInput = document.getElementById('perk-name');
const perkDescriptionInput = document.getElementById('perk-description');

const characterInfoModal = document.getElementById('character-info-modal');
const characterInfoName = document.getElementById('character-info-name');
const characterInfoRace = document.getElementById('character-info-race');
const characterInfoDescription = document.getElementById('character-info-description');
const characterInfoLevel = document.getElementById('character-info-level');
const characterInfoExperience = document.getElementById('character-info-experience');
const characterInfoStrength = document.getElementById('character-info-strength');
const characterInfoDexterity = document.getElementById('character-info-dexterity');
const characterInfoIntelligence = document.getElementById('character-info-intelligence');
const levelUpButton = document.getElementById('level-up-button');

const inventoryModal = document.getElementById('inventory-modal');
const inventoryList = document.getElementById('inventory-list');

const battleModal = document.getElementById('battle-modal');
const battleTitle = document.getElementById('battle-title');
const battleText = document.getElementById('battle-text');
const battleActions = document.getElementById('battle-actions');

const lootModal = document.getElementById('loot-modal');
const lootList = document.getElementById('loot-list');
const closeLootButton = document.getElementById('close-loot-button');

const battleLogModal = document.getElementById('battle-log-modal');
const battleLogText = document.getElementById('battle-log-text');

const mapModal = document.getElementById('map-modal');
const mapList = document.getElementById('map-list');
let locationTooltip = document.getElementById('location-tooltip');
let locationTooltipImage = document.getElementById('location-tooltip-image');
let locationTooltipText = document.getElementById('location-tooltip-text');

const charactersModal = document.getElementById('characters-modal');
const charactersList = document.getElementById('characters-list');
const characterTooltip = document.getElementById('character-tooltip');
const characterTooltipImage = document.getElementById('character-tooltip-image');
const characterTooltipText = document.getElementById('character-tooltip-text');

const itemTooltip = document.getElementById('item-tooltip');
const tooltipImage = document.getElementById('tooltip-image');
const tooltipText = document.getElementById('tooltip-text');

const createScenarioButton = document.getElementById('create-scenario-button');
const createScenarioModal = document.getElementById('create-scenario-modal');
const saveScenarioButton = document.getElementById('save-scenario-button');
const scenarioList = document.getElementById('scenario-list');
const worldDescriptionInput = document.getElementById('world-description');
const worldHistoryInput = document.getElementById('world-history');
const scenarioDescriptionInput = document.getElementById('scenario-description');
const scenarioHistoryInput = document.getElementById('scenario-history');
const scenarioSettingsInput = document.getElementById('scenario-settings');
const scenarioNameInput = document.getElementById('scenario-name');

let apiKey = '';
let apiUrl = '';
let battleEnemyName = null;
let loadingIndicator = null;
let model = null;
let chatSession = null;
let selectedScenarioId = null;

let character = {
    name: '',
    race: '',
    description: '',
    perks: [],
    level: 1,
    experience: 0,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    inventory: [],
    locations: [],
    maxHealth: 100,
    currentHealth: 100,
    isFighting: false,
    currentEnemy: null,
    history: [],
    chatHistory: [],
    battleLogs: [],
    knownCharacters: []
};

let scenarios = {};

mainMenu.style.display = 'block';
scenarioMenu.style.display = 'none';
characterEditor.style.display = 'none';
gameContainer.style.display = 'none';

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function showLoadingIndicator() {
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.classList.add('loading-indicator');
        const circleContainer = document.createElement('div');
        circleContainer.classList.add('circle-container');
        circleContainer.innerHTML = `
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
            <span class="circle"></span>
        `;
        loadingIndicator.appendChild(circleContainer);
        gameContainer.appendChild(loadingIndicator);
    }
    loadingIndicator.style.display = 'flex';
}

function hideLoadingIndicator() {
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}

// Загрузка сценариев при старте
loadScenarios();

function loadScenarios() {
    const savedScenarios = localStorage.getItem('rpg_scenarios');
    if (savedScenarios) {
        try {
            scenarios = JSON.parse(savedScenarios);
        } catch (e) {
            console.error("Error loading scenarios:", e);
            alert('Не удалось загрузить сценарии из-за ошибки.');
        }
    }
    updateScenarioList();
}

function saveScenarios() {
    try {
        localStorage.setItem('rpg_scenarios', JSON.stringify(scenarios));
    } catch (e) {
        console.error("Error saving scenarios:", e);
        alert('Не удалось сохранить сценарии из-за ошибки.');
    }
}

function updateScenarioList() {
    scenarioList.innerHTML = '';
    // Добавляем стандартный сценарий
    const defaultScenario = {
        id: 'default',
        name: 'Стандартный сценарий',
        worldDescription: 'Стандартный фэнтезийный мир.',
        worldHistory: 'Давным-давно...',
        scenarioDescription: 'Начало вашего приключения.',
        scenarioHistory: 'Вы просыпаетесь...',
        scenarioSettings: 'Нет особых настроек.'
    };
    addScenarioToList(defaultScenario);

    for (const scenarioId in scenarios) {
        addScenarioToList(scenarios[scenarioId]);
    }
}

function addScenarioToList(scenario) {
    const scenarioDiv = document.createElement('div');
    scenarioDiv.classList.add('scenario-item');
    
    // Создаем элемент для названия сценария
    const scenarioName = document.createElement('span');
    scenarioName.classList.add('scenario-name');
    scenarioName.textContent = scenario.name || 'Без названия';
    scenarioDiv.appendChild(scenarioName);

    scenarioDiv.addEventListener('click', () => {
        selectScenario(scenario.id);
    });
    scenarioList.appendChild(scenarioDiv);
}

function selectScenario(scenarioId) {
    selectedScenarioId = scenarioId;
    const scenarioItems = document.querySelectorAll('.scenario-item');
    scenarioItems.forEach(item => {
        item.classList.remove('selected');
        if (item.querySelector('.scenario-name').textContent === (scenarios[scenarioId]?.name || 'Без названия') || scenarioId === 'default') {
            item.classList.add('selected');
        }
    });
    continueButton.style.display = 'block';
}

continueButton.addEventListener('click', () => {
    scenarioMenu.style.display = 'none';
    characterEditor.style.display = 'block';
});

createScenarioButton.addEventListener('click', () => {
    createScenarioModal.style.display = 'block';
});

saveScenarioButton.addEventListener('click', () => {
    const scenarioName = scenarioNameInput.value;
    const worldDescription = worldDescriptionInput.value;
    const worldHistory = worldHistoryInput.value;
    const scenarioDescription = scenarioDescriptionInput.value;
    const scenarioHistory = scenarioHistoryInput.value;
    const scenarioSettings = scenarioSettingsInput.value;

    if (scenarioName && worldDescription && worldHistory && scenarioDescription && scenarioHistory) {
        const scenarioId = Date.now().toString();
        scenarios[scenarioId] = {
            id: scenarioId,
            name: scenarioName,
            worldDescription: worldDescription,
            worldHistory: worldHistory,
            scenarioDescription: scenarioDescription,
            scenarioHistory: scenarioHistory,
            scenarioSettings: scenarioSettings
        };
        saveScenarios();
        updateScenarioList();
        createScenarioModal.style.display = 'none';
        scenarioNameInput.value = '';
        worldDescriptionInput.value = '';
        worldHistoryInput.value = '';
        scenarioDescriptionInput.value = '';
        scenarioHistoryInput.value = '';
        scenarioSettingsInput.value = '';
        alert('Сценарий сохранен!');
    } else {
        alert('Пожалуйста, заполните все поля сценария.');
    }
});

startGameButton.addEventListener('click', async () => {
    apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert('Пожалуйста, введите API ключ.');
        return;
    }
    apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + apiKey;
    mainMenu.style.display = 'none';
    scenarioMenu.style.display = 'block';
});


loadGameButton.addEventListener('click', () => {
    loadGame();
});

startAdventureButton.addEventListener('click', () => {
    character.name = characterNameInput.value;
    character.race = characterRaceInput.value;
    character.description = characterDescriptionInput.value;

    characterEditor.style.display = 'none';
    gameContainer.style.display = 'block';
    startGame();
});

addPerkButton.addEventListener('click', () => {
    perkModal.style.display = 'block';
});

closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.target.closest('.modal').style.display = 'none';
    });
});

addPerkModalButton.addEventListener('click', () => {
    const perkName = perkNameInput.value;
    const perkDescription = perkDescriptionInput.value;

    if (perkName && perkDescription) {
        character.perks.push({ name: perkName, description: perkDescription });
        updatePerkList();
        perkModal.style.display = 'none';
        perkNameInput.value = '';
        perkDescriptionInput.value = '';
    }
});

function updatePerkList() {
    perkList.innerHTML = '';
    character.perks.forEach(perk => {
        const li = document.createElement('li');
        li.textContent = `${perk.name} - ${perk.description}`;
        perkList.appendChild(li);
    });
}

submitButton.addEventListener('click', processCommand);

characterInfoButton.addEventListener('click', () => {
    characterInfoName.textContent = character.name;
    characterInfoRace.textContent = character.race;
    characterInfoDescription.textContent = character.description;
    characterInfoLevel.textContent = character.level;
    characterInfoExperience.textContent = character.experience;
    characterInfoStrength.textContent = character.strength;
    characterInfoDexterity.textContent = character.dexterity;
    characterInfoIntelligence.textContent = character.intelligence;
    levelUpButton.style.display = character.experience >= character.level * 10 ? 'block' : 'none';
    characterInfoModal.style.display = 'block';
});

levelUpButton.addEventListener('click', () => {
    character.level++;
    character.strength += 2;
    character.dexterity += 2;
    character.intelligence += 2;
    character.experience = 0;
    character.maxHealth += 20;
    character.currentHealth = character.maxHealth;
    levelUpButton.style.display = 'none';
    characterInfoModal.style.display = 'none';
    gameText.innerHTML += `<p class="gm-response">Вы повысили уровень! Ваши характеристики улучшились.</p>`;
});

inventoryButton.addEventListener('click', () => {
    updateInventoryList();
    inventoryModal.style.display = 'block';
});

function updateInventoryList() {
    inventoryList.innerHTML = '';
    character.inventory.forEach((item) => {
        const li = document.createElement('li');
        let itemText = item.name;
        if (item.count > 1) {
            itemText += ` x${item.count}`;
        }
        li.textContent = itemText;
        li.addEventListener('mouseover', (e) => showItemTooltip(e, item));
        li.addEventListener('mouseout', hideItemTooltip);
        inventoryList.appendChild(li);
    });
}

mapButton.addEventListener('click', () => {
    updateMapList();
    mapModal.style.display = 'block';
});

function updateMapList() {
    mapList.innerHTML = '';
    character.locations.forEach((location) => {
        const li = document.createElement('li');
        li.textContent = location.name;
        li.addEventListener('mouseover', (e) => showLocationTooltip(e, location));
        li.addEventListener('mouseout', hideLocationTooltip);
        mapList.appendChild(li);
    });
}

charactersButton.addEventListener('click', () => {
    updateCharactersList();
    charactersModal.style.display = 'block';
});

function updateCharactersList() {
    charactersList.innerHTML = '';
    character.knownCharacters.forEach((char) => {
        const li = document.createElement('li');
        li.textContent = char.name;
        li.addEventListener('mouseover', (e) => showCharacterTooltip(e, char));
        li.addEventListener('mouseout', hideCharacterTooltip);
        charactersList.appendChild(li);
    });
}

function showCharacterTooltip(event, char) {
    characterTooltipText.innerHTML = `<b>Описание:</b> ${char.description}<br><b>Отношение:</b> ${char.relation}`;
    characterTooltipImage.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(char.image_prompt)}?private=true&nologo=true&width=256&height=256`;
    characterTooltip.style.display = 'block';
    characterTooltip.style.left = event.pageX + 10 + 'px';
    characterTooltip.style.top = event.pageY + 10 + 'px';
}

function hideCharacterTooltip() {
    characterTooltip.style.display = 'none';
}


function showLocationTooltip(event, location) {
    locationTooltipText.innerHTML = `<b>Описание:</b> ${location.description}`;
    locationTooltipImage.src = location.image_url;
    locationTooltip.style.display = 'block';
    locationTooltip.style.left = event.pageX + 10 + 'px';
    locationTooltip.style.top = event.pageY + 10 + 'px';
}

function hideLocationTooltip() {
    locationTooltip.style.display = 'none';
}

closeLootButton.addEventListener('click', () => {
    lootModal.style.display = 'none';
});

saveGameButton.addEventListener('click', () => {
    saveGame();
});

function saveGame() {
    const gameState = {
        character: character,
        apiKey: apiKey,
        apiUrl: apiUrl,
        selectedScenarioId: selectedScenarioId
    };
    try {
         localStorage.setItem('rpg_save_state', JSON.stringify(gameState));
         alert('Игра сохранена!');
    } catch (e) {
        console.error("Error saving game:", e);
        alert('Не удалось сохранить игру из-за ошибки.');
    }
}

function loadGame() {
    const savedGame = localStorage.getItem('rpg_save_state');
    if (savedGame) {
        try {
            const gameState = JSON.parse(savedGame);
            character = gameState.character;
            apiKey = gameState.apiKey;
            apiUrl = gameState.apiUrl;
            selectedScenarioId = gameState.selectedScenarioId;
            apiKeyInput.value = apiKey;
            mainMenu.style.display = 'none';
            scenarioMenu.style.display = 'none';
            characterEditor.style.display = 'none';
            gameContainer.style.display = 'block';
            gameText.innerHTML = '';
            character.chatHistory.forEach(message => {
                const messageElement = document.createElement('p');
                messageElement.classList.add(message.type === 'player' ? 'player-command' : 'gm-response');
                messageElement.innerHTML = message.text;
                gameText.appendChild(messageElement);
            });
            gameText.scrollTop = gameText.scrollHeight;
            updatePerkList();
            updateInventoryList();
            updateMapList();
            updateCharactersList();
           alert('Игра загружена!');
        }  catch (e) {
            console.error("Error loading game:", e);
            alert('Не удалось загрузить игру из-за ошибки.');
        }
    } else {
        alert('Нет сохраненных игр.');
    }
}


async function startGame() {
    try {
        showLoadingIndicator();
        let scenario = scenarios[selectedScenarioId] || {
            name: 'Стандартный сценарий',
            worldDescription: 'Стандартный фэнтезийный мир.',
            worldHistory: 'Давным-давно...',
            scenarioDescription: 'Начало вашего приключения.',
            scenarioHistory: 'Вы просыпаетесь...',
            scenarioSettings: 'Нет особых настроек.'
        };
        if (selectedScenarioId === 'default') {
            scenario = {
                name: 'Стандартный сценарий',
                worldDescription: 'Стандартный фэнтезийный мир.',
                worldHistory: 'Давным-давно...',
                scenarioDescription: 'Начало вашего приключения.',
                scenarioHistory: 'Вы просыпаетесь...',
                scenarioSettings: 'Нет особых настроек.'
            };
        }
        const prompt = `Ты - рассказчик для текстовой ролевой игры. Мир: ${scenario.worldDescription}. История мира: ${scenario.worldHistory}. Сценарий: ${scenario.scenarioDescription}. История сценария: ${scenario.scenarioHistory}. Настройки сценария: ${scenario.scenarioSettings}. Персонаж: имя - ${character.name}, раса - ${character.race}, описание - ${character.description}. Перки: ${character.perks.map(perk => perk.name).join(', ')}. Начни историю, опиши сцену начала игры в 4-5 предложениях. Используй развернутые предложения и описания. Если персонаж должен иметь начальные предметы, добавь их с помощью команды "add_inventory". Обязательно добавь начальную локацию на карту командой "add_location". Возвращай ответ в JSON формате, используя двойные кавычки для ключей. Пример: {"text": "Вы просыпаетесь в лесу.", "commands": [{"command": "add_inventory", "command_params": {"name": "камень", "count": 1, "description": "небольшой серый камень", "image_prompt": "a small gray stone"}}, {"command": "add_location", "command_params": {"name": "Темный лес", "description": "Темный лес, полный тайн и опасностей.", "image_prompt": "a dark forest with twisted trees and shadows"}} ]}. Если начальных предметов нет, то {"text": "Вы просыпаетесь в лесу.", "commands": [{"command": "add_location", "command_params": {"name": "Темный лес", "description": "Темный лес, полный тайн и опасностей.", "image_prompt": "a dark forest with twisted trees and shadows"}} ]}.`;
        const response = await getGeminiResponse(prompt);
        const jsonResponse = parseGeminiResponse(response);
        if (jsonResponse && jsonResponse.text) {
            const gmResponseElement = document.createElement('p');
            gmResponseElement.classList.add('gm-response');
            gmResponseElement.innerHTML = jsonResponse.text;
            gameText.appendChild(gmResponseElement);
            gameText.scrollTop = gameText.scrollHeight;
            character.chatHistory.push({ type: 'gm', text: jsonResponse.text });
            processGmResponse(jsonResponse, gmResponseElement);
        } else {
            gameText.innerHTML += `<p class="gm-response">Рассказчик не вернул корректный текст.</p>`;
        }
    } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
        gameText.innerHTML += `<p class="gm-response">Произошла ошибка при обработке ответа рассказчика.</p>`;
    } finally {
        hideLoadingIndicator();
    }
}

async function processCommand() {
    const command = commandInput.value.trim();
    if (!command) return;

    gameText.innerHTML += `<p class="player-command">> ${command}</p>`;
    character.chatHistory.push({ type: 'player', text: command });
    commandInput.value = '';

    const playerInfo = {
        command: command,
        inventory: character.inventory,
        stats: {
            level: character.level,
            experience: character.experience,
            strength: character.strength,
            dexterity: character.dexterity,
            intelligence: character.intelligence,
            currentHealth: character.currentHealth,
            maxHealth: character.maxHealth
        },
        history: character.history,
        chatHistory: character.chatHistory,
        locations: character.locations
    };

    character.history.push(command);

    try {
        showLoadingIndicator();
        let scenario = scenarios[selectedScenarioId] || {
            name: 'Стандартный сценарий',
            worldDescription: 'Стандартный фэнтезийный мир.',
            worldHistory: 'Давным-давно...',
            scenarioDescription: 'Начало вашего приключения.',
            scenarioHistory: 'Вы просыпаетесь...',
            scenarioSettings: 'Нет особых настроек.'
        };
         if (selectedScenarioId === 'default') {
            scenario = {
                name: 'Стандартный сценарий',
                worldDescription: 'Стандартный фэнтезийный мир.',
                worldHistory: 'Давным-давно...',
                scenarioDescription: 'Начало вашего приключения.',
                scenarioHistory: 'Вы просыпаетесь...',
                scenarioSettings: 'Нет особых настроек.'
            };
        }
        const prompt = `Ты - рассказчик для текстовой ролевой игры. Мир: ${scenario.worldDescription}. История мира: ${scenario.worldHistory}. Сценарий: ${scenario.scenarioDescription}. История сценария: ${scenario.scenarioHistory}. Настройки сценария: ${scenario.scenarioSettings}. Опиши, что происходит дальше после действия персонажа: ${JSON.stringify(playerInfo)}. Опиши ситуацию в 4-5 предложениях. Используй развернутые предложения и описания. Описывай действия персонажа и неигровых персонажей (NPC), но не выполняй действия за персонажа. Учитывай предыдущие действия персонажа и историю чата. Если персонаж достает откуда-либо или берет с собой какой-либо предмет, добавь этот предмет в инвентарь командой "add_inventory". Если персонаж подбирает предмет, используй команду "add_inventory" и параметры в JSON формате. Обязательно дай предмету подробное описание, чтобы можно было сгенерировать изображение для него. Добавь image_prompt для генерации изображения. Если удаляет, используй команду "remove_inventory" и параметры в JSON формате. Если персонаж находит новую локацию, добавь ее на карту командой "add_location". Обязательно дай локации подробное описание, чтобы можно было сгенерировать изображение для нее. Добавь image_prompt для генерации изображения. **Если персонаж встречает нового персонажа, который называет свое имя (не общее название типа "пацан", "девушка", а имя на подобие "Руслан", "Иракан", "Илиан" и т.д.), добавь его в список знакомых командой "add_character". Обязательно дай персонажу имя, описание внешности, отношение к персонажу игрока и image_prompt для генерации изображения.** **Если персонаж раскрывает свое настоящее имя, то используй команду "edit_character" и параметры в JSON формате, используя старое имя персонажа в параметре "oldName".** Если персонаж инициирует битву, используй команду "start_battle" и сгенерируй врага в JSON формате. Если бой закончился, используй команду "end_battle". **В конце ответа, добавь информацию для ГМ о доступных командах и их параметрах. Например: "Доступные команды: add_inventory {\"name\": \"имя\", \"count\": количество, \"description\": \"описание\", \"image_prompt\": \"image prompt\"}, add_location {\"name\": \"имя\", \"description\": \"описание\", \"image_prompt\": \"image prompt\"}, add_character {\"name\": \"имя\", \"description\": \"описание\", \"relation\": \"отношение\", \"image_prompt\": \"image prompt\"}, edit_character {\"oldName\": \"старое имя\", \"name\": \"новое имя\", \"description\": \"описание\", \"relation\": \"отношение\", \"image_prompt\": \"image prompt\"}. Если требуется добавить персонажа в список персонажей, то используй команду add_character. Если нужно отредактировать информацию о персонаже, то используй команду edit_character."** Возвращай ответ в JSON формате, используя двойные кавычки для ключей. Пример: {"text": "Вы подобрали камень.", "commands": [{"command": "add_inventory", "command_params": {"name": "камень", "count": 1, "description": "небольшой серый камень", "image_prompt": "a small gray stone"}}]}. Если нет команды, то {"text": "Ничего не произошло.", "commands": []}.`;
        const response = await getGeminiResponse(prompt);
        const jsonResponse = parseGeminiResponse(response);
        if (jsonResponse && jsonResponse.text) {
            const gmResponseElement = document.createElement('p');
            gmResponseElement.classList.add('gm-response');
            gmResponseElement.innerHTML = jsonResponse.text;
            gameText.appendChild(gmResponseElement);
            gameText.scrollTop = gameText.scrollHeight;
            character.chatHistory.push({ type: 'gm', text: jsonResponse.text });
            processGmResponse(jsonResponse, gmResponseElement);
            if (jsonResponse && jsonResponse.commands && jsonResponse.commands.some(cmd => cmd.command === 'start_battle')) {
                const startBattleCommand = jsonResponse.commands.find(cmd => cmd.command === 'start_battle');
                battleEnemyName = startBattleCommand.command_params?.enemy?.name || null;
                startBattle(gmResponseElement);
            }
            addRepeatButton(gmResponseElement);
        } else {
            gameText.innerHTML += `<p class="gm-response">Рассказчик не вернул корректный текст.</p>`;
        }
    } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
        gameText.innerHTML += `<p class="gm-response">Произошла ошибка при обработке ответа рассказчика.</p>`;
    } finally {
        hideLoadingIndicator();
    }
}


function processGmResponse(jsonResponse, gmResponseElement) {
    if (jsonResponse && jsonResponse.commands) {
        jsonResponse.commands.forEach(commandData => {
            const command = commandData.command;
            const params = commandData.command_params;

            if (command === 'add_inventory') {
                if (params && params.name && typeof params.count === 'number' && params.description && params.image_prompt) {
                    addInventoryItem(params.name, params.count, params.description, params.image_prompt);
                } else {
                    gameText.innerHTML += `<p class="gm-response">Ошибка: Некорректные параметры команды add_inventory.</p>`;
                }
            } else if (command === 'remove_inventory') {
                if (params && params.name && typeof params.count === 'number' && params.description) {
                    removeInventoryItem(params.name, params.count, params.description);
                } else {
                    gameText.innerHTML += `<p class="gm-response">Ошибка: Некорректные параметры команды remove_inventory.</p>`;
                }
            } else if (command === 'add_location') {
                if (params && params.name && params.description && params.image_prompt) {
                    addLocation(params.name, params.description, params.image_prompt);
                } else {
                    gameText.innerHTML += `<p class="gm-response">Ошибка: Некорректные параметры команды add_location.</p>`;
                }
            } else if (command === 'add_character') {
                if (params && params.name && params.description && params.relation && params.image_prompt) {
                    if (!isCommonName(params.name)) {
                         addKnownCharacter(params.name, params.description, params.relation, params.image_prompt);
                    } else {
                       gameText.innerHTML += `<p class="gm-response">Персонаж не добавлен в список, так как имя является общим названием.</p>`;
                    }
                } else {
                    gameText.innerHTML += `<p class="gm-response">Ошибка: Некорректные параметры команды add_character.</p>`;
                }
            } else if (command === 'edit_character') {
                if (params && params.oldName && params.name && params.description && params.relation && params.image_prompt) {
                    editKnownCharacter(params.oldName, params.name, params.description, params.relation, params.image_prompt);
                } else {
                    gameText.innerHTML += `<p class="gm-response">Ошибка: Некорректные параметры команды edit_character.</p>`;
                }
            }
            else if (command === 'end_battle') {
                endBattle(gmResponseElement);
            }
        });
    }
}

function isCommonName(name) {
    const commonNames = ["пацан", "девушка", "мальчик", "девочка", "незнакомец", "незнакомка"];
    return commonNames.includes(name.toLowerCase());
}


function addInventoryItem(itemName, itemCount, itemDescription, imagePrompt) {
    let itemAdded = false;
    for (const item of character.inventory) {
        if (item.name === itemName && item.description === itemDescription) {
            item.count += itemCount;
            itemAdded = true;
            break;
        }
    }
    if (!itemAdded) {
        character.inventory.push({ name: itemName, count: itemCount, type: 'item', description: itemDescription, image_prompt: imagePrompt });
    }
    gameText.innerHTML += `<p class="gm-response">Добавлен в инвентарь ${itemCount} x ${itemName}.</p>`;
    updateInventoryList();
}

function removeInventoryItem(itemName, itemCount, itemDescription) {
    for (let i = character.inventory.length - 1; i >= 0; i--) {
        const item = character.inventory[i];
        if (item.name === itemName && item.description === itemDescription) {
            if (item.count > itemCount) {
                item.count -= itemCount;
                gameText.innerHTML += `<p class="gm-response">Удален из инвентаря ${itemCount} x ${itemName}.</p>`;
            } else {
                character.inventory.splice(i, 1);
                gameText.innerHTML += `<p class="gm-response">Удален из инвентаря ${item.count} x ${itemName}.</p>`;
            }
            updateInventoryList();
            return;
        }
    }
    gameText.innerHTML += `<p class="gm-response">Предмет ${itemName} не найден в инвентаре.</p>`;
}

async function addLocation(locationName, locationDescription, imagePrompt) {
    let locationAdded = false;
    for (const location of character.locations) {
        if (location.name === locationName) {
            locationAdded = true;
            break;
        }
    }
    if (!locationAdded) {
        try {
            const imageUrl = await generateImage(imagePrompt);
            character.locations.push({ name: locationName, description: locationDescription, image_url: imageUrl });
            gameText.innerHTML += `<p class="gm-response">Вы открыли новую локацию: ${locationName}.</p>`;
            updateMapList();
        } catch (error) {
            console.error("Ошибка генерации изображения:", error);
            gameText.innerHTML += `<p class="gm-response">Ошибка при генерации изображения для локации ${locationName}.</p>`;
        }
    }
}

function addKnownCharacter(charName, charDescription, charRelation, charImagePrompt) {
    let charAdded = false;
    for (const char of character.knownCharacters) {
        if (char.name === charName) {
            charAdded = true;
            break;
        }
    }
    if (!charAdded) {
        character.knownCharacters.push({ name: charName, description: charDescription, relation: charRelation, image_prompt: charImagePrompt });
        gameText.innerHTML += `<p class="gm-response">Вы познакомились с новым персонажем: ${charName}.</p>`;
        updateCharactersList();
    }
}

function editKnownCharacter(oldCharName, charName, charDescription, charRelation, charImagePrompt) {
    for (const char of character.knownCharacters) {
        if (char.name === oldCharName) {
            char.name = charName;
            char.description = charDescription;
            char.relation = charRelation;
            char.image_prompt = charImagePrompt;
            gameText.innerHTML += `<p class="gm-response">ГМ изменил персонажа: ${oldCharName} на ${charName}.</p>`;
            updateCharactersList();
            return;
        }
    }
    gameText.innerHTML += `<p class="gm-response">Персонаж ${oldCharName} не найден.</p>`;
}

async function startBattle(gmResponseElement) {
    closeAllModals();
    character.isFighting = true;

    const playerInfo = {
        inventory: character.inventory,
        stats: {
            level: character.level,
            experience: character.experience,
            strength: character.strength,
            dexterity: character.dexterity,
            intelligence: character.intelligence,
            currentHealth: character.currentHealth,
            maxHealth: character.maxHealth
        },
        history: character.history,
        chatHistory: character.chatHistory,
        locations: character.locations
    };

    let enemy = null;
    let battleLog = [];

    if (battleEnemyName) {
        character.currentEnemy = { name: battleEnemyName };
        battleTitle.textContent = `Битва с ${battleEnemyName}`;
        battleText.innerHTML = `<p>Из тени выходит ${battleEnemyName}!</p>`;
        battleActions.innerHTML = `
            <input type="text" id="battle-command-input" placeholder="Введите действие...">
            <button class="menu-button" onclick="processBattleCommand(null)">Отправить</button>
        `;
        battleModal.style.display = 'block';
        character.chatHistory.push({ type: 'gm', text: `На вас напал ${battleEnemyName}!` });
        battleEnemyName = null;
        battleLog.push(`Начало битвы с ${character.currentEnemy.name}`);
    } else {
        try {
            showLoadingIndicator();
            const enemyPrompt = `Ты - рассказчик. Сгенерируй врага для персонажа. Возвращай ответ в JSON формате. Пример: {"text": "На вас напал гоблин!", "enemy": {"name": "Гоблин", "health": 30, "damage": 5, "experience": 10}}.`;
            const enemyResponse = await getGeminiResponse(enemyPrompt);
            const enemyJsonResponse = parseGeminiResponse(enemyResponse);
            if (enemyJsonResponse && enemyJsonResponse.enemy) {
                enemy = enemyJsonResponse.enemy;
                character.currentEnemy = enemy;
                battleTitle.textContent = `Битва с ${enemy.name}`;
                battleText.innerHTML = `<p>${enemyJsonResponse.text}</p>`;
                battleActions.innerHTML = `
                    <input type="text" id="battle-command-input" placeholder="Введите действие...">
                    <button class="menu-button" onclick="processBattleCommand(null)">Отправить</button>
                `;
                battleModal.style.display = 'block';
                character.chatHistory.push({ type: 'gm', text: enemyJsonResponse.text });
                battleLog.push(`Начало битвы с ${character.currentEnemy.name}`);
            } else {
                gameText.innerHTML += `<p class="gm-response">Рассказчик не вернул корректного врага.</p>`;
                character.isFighting = false;
            }
        } catch (e) {
            console.error("Ошибка парсинга JSON:", e);
            gameText.innerHTML += `<p class="gm-response">Произошла ошибка при генерации врага.</p>`;
            character.isFighting = false;
        } finally {
            hideLoadingIndicator();
        }
    }
    if (gmResponseElement) {
        const showLogButton = document.createElement('button');
        showLogButton.innerHTML = '<i class="fas fa-list-ul"></i> Вывести лог боя';
        showLogButton.classList.add('menu-button');
        showLogButton.addEventListener('click', () => {
            showBattleLog(battleLog);
        });
        gmResponseElement.appendChild(showLogButton);
    }
}

async function processBattleCommand(playerInfo) {
    if (!character.isFighting) return;

    const battleCommandInput = document.getElementById('battle-command-input');
    const command = battleCommandInput ? battleCommandInput.value.trim() : null;
    if (!command) return;

    battleCommandInput.value = '';

    let battleLog = [];
    const enemy = character.currentEnemy;

    const updatedPlayerInfo = {
        command: command,
        inventory: character.inventory,
        stats: {
            level: character.level,
            experience: character.experience,
            strength: character.strength,
            dexterity: character.dexterity,
            intelligence: character.intelligence,
            currentHealth: character.currentHealth,
            maxHealth: character.maxHealth
        },
        history: character.history,
        chatHistory: character.chatHistory,
        locations: character.locations
    };

    character.history.push(command);
    character.chatHistory.push({ type: 'player', text: command });

    try {
        showLoadingIndicator();
        const battlePrompt = `Ты - рассказчик. Опиши, что происходит в бою после действия персонажа: ${JSON.stringify(updatedPlayerInfo)}. Опиши ситуацию в 4-5 предложениях. Используй развернутые предложения и описания. Описывай действия персонажа и врага, но не выполняй действия за персонажа. Рассчитай урон от действия персонажа и врага, и примени его к здоровью персонажей. Если враг побежден, сгенерируй лут в JSON формате, используя команду "add_inventory". Обязательно дай предмету подробное описание, чтобы можно было сгенерировать изображение для него. Добавь image_prompt для генерации изображения. Если бой закончен, используй команду "end_battle". Возвращай ответ в JSON формате, используя двойные кавычки для ключей. Пример: {"text": "Вы нанесли удар, гоблин отшатнулся.", "commands": [{"command": "add_inventory", "command_params": {"name": "золото", "count": 10, "description": "немного золота", "image_prompt": "a few gold coins"}}]}.`;
        const battleResponse = await getGeminiResponse(battlePrompt);
        const battleJsonResponse = parseGeminiResponse(battleResponse);
        if (battleJsonResponse && battleJsonResponse.text) {
            battleText.innerHTML += `<p class="gm-response">${battleJsonResponse.text}</p>`;
            processGmResponse(battleJsonResponse);
            character.chatHistory.push({ type: 'gm', text: battleJsonResponse.text });
            battleLog.push(`Игрок: ${command}`);
            battleLog.push(`ГМ: ${battleJsonResponse.text}`);

            if (character.currentEnemy && character.currentEnemy.health <= 0) {
                // endBattle(); // Убрано, теперь end_battle вызывается через processGmResponse
            } else if (character.currentHealth <= 0) {
                endBattle(battleLog, gmResponseElement);
                character.currentHealth = character.maxHealth;
            }
        } else {
            battleText.innerHTML += `<p class="gm-response">Рассказчик не вернул корректный текст.</p>`;
        }
    } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
        battleText.innerHTML += `<p class="gm-response">Произошла ошибка при обработке ответа рассказчика.</p>`;
    } finally {
        hideLoadingIndicator();
    }
}

function endBattle(battleLog, gmResponseElement) {
    character.isFighting = false;
    character.currentEnemy = null;
    battleModal.style.display = 'none';
    if (battleLog && Array.isArray(battleLog)) {
        character.battleLogs.push(battleLog);
    }
    if (gmResponseElement) {
        const showLogButton = document.createElement('button');
        showLogButton.innerHTML = '<i class="fas fa-list-ul"></i> Вывести лог боя';
        showLogButton.classList.add('menu-button');
        showLogButton.addEventListener('click', () => {
            showBattleLog(battleLog);
        });
        gmResponseElement.appendChild(showLogButton);
    }
}

function showBattleLog(battleLog) {
    battleLogText.innerHTML = '';
    if (battleLog && Array.isArray(battleLog)) {
        battleLog.forEach(log => {
            const logItem = document.createElement('p');
            logItem.textContent = log;
            battleLogText.appendChild(logItem);
        });
    }
    battleLogModal.style.display = 'block';
}

function parseGeminiResponse(response) {
     let text = response || '';
    let commands = [];

    try {
        text = text.trim();

        // 1. Remove "```json" prefix if present (case-insensitive)
        if (text.toLowerCase().startsWith("```json")) {
            text = text.substring(7);
        }

        // 2. Remove "```" suffix if present
        if (text.endsWith("```")) {
            text = text.slice(0, -3);
        }

        // 3. Remove leading and trailing quotes
        text = text.trim();
        if (text.startsWith('"') && text.endsWith('"')) {
            text = text.slice(1, -1);
        }

        // 4. Remove any leading or trailing whitespace again
        text = text.trim();

        // 5. Replace single quotes with double quotes
        text = text.replace(/'/g, '"');

        // 6. Remove trailing commas before closing brackets or braces
        text = text.replace(/,\s*([}\]])/g, '$1');

        // 7. Attempt to parse the JSON
         let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (e) {
             console.error("Failed to parse JSON:", e, response);
            try {
                // Remove extra commas
                text = text.replace(/,\s*([}\]])/g, '$1');
                // Remove extra newlines
                text = text.replace(/\n/g, '');
                 // Remove trailing commas again
                text = text.replace(/,\s*([}\]])/g, '$1');
                // Remove extra colons
                text = text.replace(/:\s*([}\]])/g, '$1');
                parsed = JSON.parse(text);
            } catch (e2) {
                   console.error("Failed to parse JSON even after fix:", e2, response);
                return { text: response, commands: [] };
           }
        }

         if (Array.isArray(parsed)) {
            commands = parsed;
        } else if (parsed && parsed.commands) {
             commands = parsed.commands;
            text = parsed.text || '';
         } else if (parsed && parsed.text) {
             text = parsed.text;
         }
         return { text: text, commands: commands };

    } catch (e) {
        console.error("Error parsing Gemini response:", e, response);
       return { text: response, commands: [] };
    }
}

async function getGeminiResponse(prompt) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }],
                }],
                 safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_NONE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_NONE"
                    },
                      {
                        category: "HARM_CATEGORY_CIVIC_INTEGRITY",
                        threshold: "BLOCK_NONE"
                    }
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }

        const data = await response.json();
         console.log("Gemini API Response:", data);
        console.log("Gemini API Prompt:", prompt);
           if (data && data.promptFeedback && data.promptFeedback.blockReason) {
            console.error("Gemini API blocked the response:", data);
            return `{"text": "Произошла ошибка при обработке вашего запроса.", "commands": []}`;
        }
        if (
            data &&
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            data.candidates[0].content.parts[0].text
        ) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.error("Некорректный ответ от Gemini API:", data);
             return `{"text": "Произошла ошибка при обработке вашего запроса.", "commands": []}`;
        }

    } catch (error) {
        console.error('Ошибка при запросе к Gemini:', error);
        return `{"text": "Произошла ошибка при обработке вашего запроса.", "commands": []}`;
    }
}


async function generateImage(prompt) {
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?private=true&nologo=true&width=256&height=256`;
    return imageUrl;
}

function addRepeatButton(gmResponseElement) {
    const repeatButton = document.createElement('button');
    repeatButton.innerHTML = '<i class="fas fa-sync-alt"></i> Повторить запрос';
    repeatButton.classList.add('menu-button');
    repeatButton.addEventListener('click', () => {
        repeatLastCommand(gmResponseElement);
    });
    gmResponseElement.appendChild(repeatButton);
}

async function repeatLastCommand(gmResponseElement) {
    if (character.chatHistory.length >= 2) {
        const lastPlayerMessage = character.chatHistory[character.chatHistory.length - 2];
        if (lastPlayerMessage.type === 'player') {
            const lastCommand = lastPlayerMessage.text;
            character.chatHistory.pop();
            character.history.pop();
            if (gmResponseElement) {
                gmResponseElement.remove();
            }
            gameText.lastElementChild.remove();
            commandInput.value = lastCommand;
            await processCommand();
        }
    }
}

function showItemTooltip(event, item) {
    tooltipText.innerHTML = `<b>Описание:</b> ${item.description}`;
    if (item.image_prompt) {
        tooltipImage.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(item.image_prompt)}?private=true&nologo=true&width=256&height=256`;
        tooltipImage.style.display = 'block';
    } else {
        tooltipImage.style.display = 'none';
    }
    itemTooltip.style.display = 'block';
    itemTooltip.style.left = event.pageX + 10 + 'px';
    itemTooltip.style.top = event.pageY + 10 + 'px';
}

function hideItemTooltip() {
    itemTooltip.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    locationTooltip = document.getElementById('location-tooltip');
    locationTooltipImage = document.getElementById('location-tooltip-image');
    locationTooltipText = document.getElementById('location-tooltip-text');
});
// Function to handle window unload (e.g., browser close or refresh)
function handleUnload() {
    // Save game state if the game is active
    if (gameContainer.style.display === 'block') {
         saveGame();
    }
    }
// Add unload listener
window.addEventListener('beforeunload', handleUnload);
