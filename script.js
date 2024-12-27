const mainMenu = document.getElementById('main-menu');
const characterEditor = document.getElementById('character-editor');
const gameContainer = document.getElementById('game-container');
const startGameButton = document.getElementById('start-game-button');
const startAdventureButton = document.getElementById('start-adventure-button');
const gameText = document.getElementById('game-text');
const commandInput = document.getElementById('command-input');
const submitButton = document.getElementById('submit-button');
const characterInfoButton = document.getElementById('character-info-button');
const inventoryButton = document.getElementById('inventory-button');
const apiKeyInput = document.getElementById('api-key-input');

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


let apiKey = '';
let apiUrl = '';
let battleEnemyName = null;
let loadingIndicator = null;

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
    maxHealth: 100,
    currentHealth: 100,
    isFighting: false,
    currentEnemy: null,
    history: [],
    chatHistory: [],
    battleLogs: []
};

characterEditor.style.display = 'none';

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

startGameButton.addEventListener('click', () => {
    apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert('Пожалуйста, введите API ключ.');
        return;
    }
    apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;
    mainMenu.style.display = 'none';
    characterEditor.style.display = 'block';
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
        li.textContent = item.name;
        inventoryList.appendChild(li);
    });
}


closeLootButton.addEventListener('click', () => {
    lootModal.style.display = 'none';
});

async function startGame() {
    const prompt = `Ты - рассказчик для текстовой ролевой игры. Опиши начало приключения персонажа: имя - ${character.name}, раса - ${character.race}, описание - ${character.description}. Перки персонажа: ${character.perks.map(perk => perk.name).join(', ')}. Начни историю, опиши сцену начала игры в 4-5 предложениях. Используй развернутые предложения и описания. Если у персонажа должны быть начальные предметы, добавь их с помощью команды "add_inventory". Возвращай ответ в JSON формате, используя двойные кавычки для ключей. Пример: {"text": "Вы просыпаетесь в лесу.", "commands": [{"command": "add_inventory", "command_params": {"name": "камень", "count": 1, "description": "небольшой серый камень"}}]}. Если начальных предметов нет, то {"text": "Вы просыпаетесь в лесу.", "commands": []}.`;
    try {
        showLoadingIndicator();
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
        chatHistory: character.chatHistory
    };

    character.history.push(command);

    try {
         showLoadingIndicator();
        const prompt = `Ты - рассказчик для текстовой ролевой игры. Опиши, что происходит дальше после действия персонажа: ${JSON.stringify(playerInfo)}. Опиши ситуацию в 4-5 предложениях. Используй развернутые предложения и описания. Описывай действия персонажа и неигровых персонажей (NPC), но не выполняй действия за персонажа. Учитывай предыдущие действия персонажа и историю чата. Если персонаж достает откуда-либо или берет с собой какой-либо предмет, добавь этот предмет в инвентарь с помощью команды "add_inventory". Если персонаж подбирает предмет, используй команду "add_inventory" и параметры в JSON формате. Если удаляет, используй команду "remove_inventory" и параметры в JSON формате. Если персонаж инициирует битву (например, говорит, что его атакуют) или если ты решаешь, что на него кто-то напал, используй команду "start_battle" и сгенерируй врага в JSON формате. Если бой закончился, используй команду "end_battle". Возвращай ответ в JSON формате, используя двойные кавычки для ключей. Пример: {"text": "Вы подобрали камень.", "commands": [{"command": "add_inventory", "command_params": {"name": "камень", "count": 1, "description": "небольшой серый камень"}}]}. Если нет команды, то {"text": "Ничего не произошло.", "commands": []}.`;
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

    if (Math.random() < 0.3) {
        try {
            showLoadingIndicator();
            const enemyPrompt = `Ты - рассказчик. Сгенерируй врага для персонажа. Возвращай ответ в JSON формате. Пример: {"text": "На вас напал гоблин!", "enemy": {"name": "Гоблин", "health": 30, "damage": 5, "experience": 10}}.`;
            const enemyResponse = await getGeminiResponse(enemyPrompt);
            const enemyJsonResponse = parseGeminiResponse(enemyResponse);
            if (enemyJsonResponse && enemyJsonResponse.enemy) {
                 battleEnemyName = enemyJsonResponse.enemy.name;
                 startBattle();
            } else {
                 gameText.innerHTML += `<p class="gm-response">Рассказчик не вернул корректного врага для случайного боя.</p>`;
            }
        } catch (e) {
            console.error("Ошибка парсинга JSON:", e);
            gameText.innerHTML += `<p class="gm-response">Произошла ошибка при генерации врага для случайного боя.</p>`;
        } finally {
            hideLoadingIndicator();
        }
    }
}

function processGmResponse(jsonResponse, gmResponseElement) {
    if (jsonResponse && jsonResponse.commands) {
        jsonResponse.commands.forEach(commandData => {
            const command = commandData.command;
            const params = commandData.command_params;

            if (command === 'add_inventory') {
                if (params && params.name && typeof params.count === 'number' && params.description) {
                    addInventoryItem(params.name, params.count, params.description);
                } else {
                    gameText.innerHTML += `<p class="gm-response">Ошибка: Некорректные параметры команды add_inventory.</p>`;
                }
            } else if (command === 'remove_inventory') {
                if (params && params.name && typeof params.count === 'number' && params.description) {
                    removeInventoryItem(params.name, params.count, params.description);
                } else {
                    gameText.innerHTML += `<p class="gm-response">Ошибка: Некорректные параметры команды remove_inventory.</p>`;
                }
            } else if (command === 'end_battle') {
                endBattle(gmResponseElement);
            }
        });
    }
}

function addInventoryItem(itemName, itemCount, itemDescription) {
    for (let i = 0; i < itemCount; i++) {
        character.inventory.push({ name: itemName, type: 'item', description: itemDescription });
    }
    gameText.innerHTML += `<p class="gm-response">Добавлен в инвентарь ${itemCount} x ${itemName}.</p>`;
    updateInventoryList();
}

function removeInventoryItem(itemName, itemCount, itemDescription) {
    let removedCount = 0;
    for (let i = character.inventory.length - 1; i >= 0; i--) {
        if (character.inventory[i].name === itemName && removedCount < itemCount) {
            character.inventory.splice(i, 1);
            removedCount++;
        }
    }
    gameText.innerHTML += `<p class="gm-response">Удален из инвентаря ${removedCount} x ${itemName}.</p>`;
    updateInventoryList();
}

async function startBattle(gmResponseElement) {
    closeAllModals(); // Закрываем все модальные окна перед началом боя
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
        chatHistory: character.chatHistory
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
        showLogButton.textContent = 'Вывести лог боя';
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

    let battleLog = '';
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
        chatHistory: character.chatHistory
    };

    character.history.push(command);
    character.chatHistory.push({ type: 'player', text: command });

    try {
        showLoadingIndicator();
        const battlePrompt = `Ты - рассказчик. Опиши, что происходит в бою после действия персонажа: ${JSON.stringify(updatedPlayerInfo)}. Опиши ситуацию в 4-5 предложениях. Используй развернутые предложения и описания. Описывай действия персонажа и врага, но не выполняй действия за персонажа. Рассчитай урон от действия персонажа и врага, и примени его к здоровью персонажей. Если враг побежден, сгенерируй лут в JSON формате, используя команду "add_inventory". Если бой закончен, используй команду "end_battle". Возвращай ответ в JSON формате, используя двойные кавычки для ключей. Пример: {"text": "Вы нанесли удар, гоблин отшатнулся.", "commands": [{"command": "add_inventory", "command_params": {"name": "золото", "count": 10, "description": "немного золота"}}]}.`;
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
                endBattle(battleLog);
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
    if (battleLog) {
        character.battleLogs.push(battleLog);
    }
    if (gmResponseElement) {
        const showLogButton = document.createElement('button');
        showLogButton.textContent = 'Вывести лог боя';
        showLogButton.classList.add('menu-button');
        showLogButton.addEventListener('click', () => {
            showBattleLog(battleLog);
        });
        gmResponseElement.appendChild(showLogButton);
    }
}

function showBattleLog(battleLog) {
     battleLogText.innerHTML = '';
    battleLog.forEach(log => {
        const logItem = document.createElement('p');
        logItem.textContent = log;
        battleLogText.appendChild(logItem);
    });
    battleLogModal.style.display = 'block';
}

function parseGeminiResponse(response) {
    try {
        if (response && response.trim().startsWith('{')) {
            const parsed = JSON.parse(response.replace(/'/g, '"'));
            if (Array.isArray(parsed)) {
                return { commands: parsed };
            } else if (parsed.commands) {
                return parsed;
            }else {
                return parsed;
            }
        } else {
            return { "text": response, "commands": [] };
        }
    } catch (e) {
        console.error("Ошибка парсинга JSON:", e);
         return { "text": "Произошла ошибка при обработке ответа рассказчика.", "commands": [] };
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
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
        }

        const data = await response.json();
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("Некорректный ответ от Gemini API");
        }

    } catch (error) {
        console.error('Ошибка при запросе к Gemini:', error);
         return `{"text": "Произошла ошибка при обработке вашего запроса.", "commands": []}`;
    }
}

function addRepeatButton(gmResponseElement) {
    const repeatButton = document.createElement('button');
    repeatButton.textContent = 'Повторить запрос';
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
            character.chatHistory.pop();
            character.history.pop();
            if(gmResponseElement) {
                gmResponseElement.remove();
            }
            gameText.lastElementChild.remove();
            gameText.lastElementChild.remove();
            commandInput.value = lastCommand;
            await processCommand();
        }
    }
}
