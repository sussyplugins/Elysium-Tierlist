const tierlists = ['OVERALL', 'CRYSTAL', 'NETHPOT', 'SWORD', 'MACE', 'SMP', 'AXE', 'UHC', 'SPEAR', 'POT', 'DIAMONDSMP'];
const buttonsContainer = document.getElementById('buttons');
const leaderboardContainer = document.getElementById('leaderboard');
tierlists.forEach(tier => {
    const button = document.createElement('button');
    button.className = 'button';
    if (tier.toLowerCase() === 'overall') {  
        button.className += ' active';
    }
    const img = document.createElement('img');
    img.src = `images/${tier.toLowerCase()}.svg`;
    img.alt = tier;
    img.style.width = '32px';
    img.style.height = '32px';
    button.appendChild(img);
    button.appendChild(document.createTextNode(tier));
    if (tier === 'OVERALL') {
        button.onclick = () => window.location.href = 'index.html';
    } else {
        button.onclick = () => window.location.href = `${tier.toLowerCase()}.html`;
    }
    buttonsContainer.appendChild(button);
});
async function loadTierData() {
    const textData = {};
    try {
        for (const tier of tierlists) {
            try {
                const response = await fetch(`tiers/${tier.toLowerCase()}.txt`);
                if (!response.ok) {
                    console.error(`Failed to load tiers/${tier.toLowerCase()}.txt`);
                    continue;
                }
                const text = await response.text();
                console.log(`Loaded ${tier} data:`, text);
                const rankings = parseTierData(text, tier.toLowerCase());
                Object.assign(textData, rankings);
            } catch (error) {
                console.error(`Error loading ${tier} data:`, error);
            }
        }
        return textData;
    } catch (error) {
        console.error('Error loading tier data:', error);
        leaderboardContainer.innerHTML = '<h2>Error loading tier data</h2>';
        return {};
    }
}
function parseTierData(fileContent, gameType) {
    const lines = fileContent.trim().split('\n').map(line => line.trim()).filter(line => line);
    const rankings = {};
    let currentTier = '';
    lines.forEach(line => {
        if (line.startsWith('[') && line.endsWith(']')) {
            return;
        }
        if (line.startsWith('LT') || line.startsWith('HT')) {
            currentTier = `${gameType}-${line}`;
            rankings[currentTier] = [];
        } 
        else if (currentTier && line) {
            rankings[currentTier].push(line);
        }
    });
    return rankings;
}
function calculatePoints(tier) {
    const tierLevel = tier.split('-')[1]; 
    const pointsMap = {
        'LT5': 1,
        'HT5': 2,
        'LT4': 3,
        'HT4': 4,
        'LT3': 5,
        'HT3': 6,
        'LT2': 7,
        'HT2': 8,
        'LT1': 9,
        'HT1': 10
    };
    return pointsMap[tierLevel] || 0;
}
function aggregatePlayerData(rankings) {
    const playerData = {};
    for (const [tier, players] of Object.entries(rankings)) {
        const [gameType, tierLevel] = tier.split('-');
        players.forEach(player => {
            if (!playerData[player]) {
                playerData[player] = { totalPoints: 0, tiers: [] };
            }
            const points = calculatePoints(tier);
            playerData[player].totalPoints += points;
            playerData[player].tiers.push({ 
                gameType: gameType,
                tier: tierLevel, 
                points 
            });
        });
    }
    return playerData;
}
function displayLeaderboard(playerData) {
    leaderboardContainer.innerHTML = '<h2>OVERALL</h2>';
    const players = Object.entries(playerData)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10);
    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        if (index < 3) {
            playerDiv.classList.add('top-player');
            if (index === 0) playerDiv.classList.add('gold');
            else if (index === 1) playerDiv.classList.add('silver');
            else if (index === 2) playerDiv.classList.add('bronze');
        }
        const rankSpan = document.createElement('span');
        rankSpan.className = 'player-rank';
        rankSpan.textContent = `#${index + 1}`;
        const playerInfo = document.createElement('div');
        playerInfo.className = 'player-info';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name';
        nameSpan.textContent = player.name;
        const pointsSpan = document.createElement('span');
        pointsSpan.className = 'player-points';
        pointsSpan.textContent = `${player.totalPoints} points`;
        playerInfo.appendChild(nameSpan);
        playerInfo.appendChild(pointsSpan);
        playerDiv.appendChild(rankSpan);
        playerDiv.appendChild(playerInfo);
        const tiersByGame = player.tiers.reduce((acc, tier) => {
            if (!acc[tier.gameType]) {
                acc[tier.gameType] = [];
            }
            acc[tier.gameType].push(tier);
            return acc;
        }, {});
        Object.entries(tiersByGame).forEach(([gameType, tiers]) => {
            const gameDiv = document.createElement('div');
            gameDiv.className = 'game-info';
            const gameImg = document.createElement('img');
            gameImg.src = `images/${gameType}.svg`;
            gameImg.alt = gameType;
            gameImg.className = 'game-icon';
            gameDiv.appendChild(gameImg);
            tiers.forEach(tier => {
                const tierText = document.createElement('span');
                tierText.className = 'tier-text';
                tierText.textContent = `${tier.tier}`;
                gameDiv.appendChild(tierText);
            });  
            playerDiv.appendChild(gameDiv);
        });
        leaderboardContainer.appendChild(playerDiv);
    });
}
async function init() {
    const rankings = await loadTierData();
    console.log('All rankings:', rankings);
    const playerData = aggregatePlayerData(rankings);
    console.log('Final player data:', playerData);
    displayLeaderboard(playerData);
}
init();
const gameImg = document.createElement('img');
gameImg.src = `images/${gameType}.png`;
gameImg.alt = gameType;
gameImg.className = 'game-icon';
gameImg.style.width = '16px';
gameImg.style.height = '16px';
gameImg.style.marginRight = '5px';
gameImg.style.objectFit = 'contain';
gameDiv.appendChild(gameImg);
tierlists.forEach(tier => {
    const button = document.createElement('button');
    button.className = 'button';
    button.innerText = tier;
    if (tier === 'OVERALL') {
        button.onclick = () => window.location.href = 'index.html';
    } else {
        button.onclick = () => window.location.href = `${tier.toLowerCase()}.html`;
    }
    buttonsContainer.appendChild(button);
});
