const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = searchInput.value.trim();
    if (word) {
        fetchWordData(word);
    }
});

async function fetchWordData(word) {
    resultContainer.innerHTML = '<p class="placeholder">Searching...</p>';
    
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();
        displayResult(data[0]);
    } catch (error) {
        resultContainer.innerHTML = `<p class="error">Oops! ${error.message}. Try another word.</p>`;
    }
}

function displayResult(data) {
    const { word, phonetics, meanings } = data;
    const audioSrc = phonetics.find(p => p.audio)?.audio;

    let meaningsHTML = meanings.map(m => `
        <div class="meaning">
            <h3>${m.partOfSpeech}</h3>
            <p><strong>Definition:</strong> ${m.definitions[0].definition}</p>
            ${m.synonyms.length ? `<p><strong>Synonyms:</strong> ${m.synonyms.slice(0, 3).join(', ')}</p>` : ''}
        </div>
    `).join('');

    resultContainer.innerHTML = `
        <div class="word-header">
            <div>
                <h2>${word.toUpperCase()}</h2>
                <p class="phonetic">${data.phonetic || ''}</p>
            </div>
            ${audioSrc ? `<button onclick="new Audio('${audioSrc}').play()">Listen</button>` : ''}
        </div>
        <div class="content">
            ${meaningsHTML}
        </div>
    `;
}

// Inside your displayResult function, update the meaningsHTML part:
let meaningsHTML = meanings.map(m => `
    <div class="meaning ${m.partOfSpeech.toLowerCase()}">
        <h3>${m.partOfSpeech}</h3>
        <p class="definition">${m.definitions[0].definition}</p>
        ${m.synonyms.length ? `<p class="synonyms">🔗 ${m.synonyms.slice(0, 3).map(s => `<span class="synonym-tag">${s}</span>`).join('')}</p>` : ''}
    </div>
`).join('');