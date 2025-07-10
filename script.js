// script.js - Lógica para consumir la API de Pokémon

// URL base de la API de Pokémon
const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Elementos del DOM
const pokemonInput = document.getElementById('pokemonInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const pokemonResult = document.getElementById('pokemonResult');

// Elementos para mostrar información del Pokémon
const pokemonImage = document.getElementById('pokemonImage');
const pokemonName = document.getElementById('pokemonName');
const pokemonId = document.getElementById('pokemonId');
const pokemonHeight = document.getElementById('pokemonHeight');
const pokemonWeight = document.getElementById('pokemonWeight');
const pokemonTypes = document.getElementById('pokemonTypes');
const pokemonAbilities = document.getElementById('pokemonAbilities');
const pokemonStats = document.getElementById('pokemonStats');

// Event Listeners
searchBtn.addEventListener('click', searchPokemon);
pokemonInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPokemon();
    }
});

// Función principal para buscar Pokémon
async function searchPokemon() {
    const pokemonName = pokemonInput.value.trim().toLowerCase();
    
    // Validar que se haya ingresado algo
    if (!pokemonName) {
        showError('Por favor, ingresa el nombre o número de un Pokémon.');
        return;
    }
    
    // Mostrar loading y ocultar otros elementos
    showLoading();
    hideError();
    hideResult();
    
    try {
        // Hacer petición a la API
        const response = await fetch(`${API_BASE_URL}${pokemonName}`);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        // Convertir respuesta a JSON
        const pokemonData = await response.json();
        
        // Mostrar información del Pokémon
        displayPokemon(pokemonData);
        
    } catch (err) {
        console.error('Error al buscar Pokémon:', err);
        showError('No se pudo encontrar el Pokémon. Verifica el nombre e intenta nuevamente.');
    } finally {
        hideLoading();
    }
}

// Función para mostrar la información del Pokémon
function displayPokemon(pokemon) {
    // Información básica
    pokemonName.textContent = pokemon.name;
    pokemonId.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    
    // Imagen (preferir la imagen oficial, si no existe usar la por defecto)
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                     pokemon.sprites.front_default || 
                     '/api/placeholder/200/200';
    pokemonImage.src = imageUrl;
    pokemonImage.alt = pokemon.name;
    
    // Características físicas
    pokemonHeight.textContent = `${(pokemon.height / 10).toFixed(1)} m`;
    pokemonWeight.textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;
    
    // Tipos
    displayTypes(pokemon.types);
    
    // Habilidades
    displayAbilities(pokemon.abilities);
    
    // Estadísticas
    displayStats(pokemon.stats);
    
    // Mostrar resultado
    showResult();
}

// Función para mostrar los tipos del Pokémon
function displayTypes(types) {
    pokemonTypes.innerHTML = '';
    
    types.forEach(typeInfo => {
        const typeElement = document.createElement('span');
        typeElement.className = `type-badge type-${typeInfo.type.name}`;
        typeElement.textContent = translateType(typeInfo.type.name);
        pokemonTypes.appendChild(typeElement);
    });
}

// Función para mostrar las habilidades del Pokémon
function displayAbilities(abilities) {
    pokemonAbilities.innerHTML = '';
    
    abilities.forEach(abilityInfo => {
        const abilityElement = document.createElement('span');
        abilityElement.className = 'ability-badge';
        abilityElement.textContent = translateAbility(abilityInfo.ability.name);
        pokemonAbilities.appendChild(abilityElement);
    });
}

// Función para mostrar las estadísticas del Pokémon
function displayStats(stats) {
    pokemonStats.innerHTML = '';
    
    stats.forEach(statInfo => {
        const statContainer = document.createElement('div');
        statContainer.className = 'mb-2';
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = translateStat(statInfo.stat.name);
        
        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        
        const statFill = document.createElement('div');
        statFill.className = 'stat-fill';
        
        // Calcular porcentaje (máximo típico de estadísticas es 255)
        const percentage = Math.min((statInfo.base_stat / 255) * 100, 100);
        statFill.style.width = `${percentage}%`;
        
        const statText = document.createElement('span');
        statText.className = 'stat-text';
        statText.textContent = statInfo.base_stat;
        
        statFill.appendChild(statText);
        statBar.appendChild(statFill);
        statContainer.appendChild(statLabel);
        statContainer.appendChild(statBar);
        pokemonStats.appendChild(statContainer);
    });
}

// Función para traducir tipos de Pokémon
function translateType(type) {
    const translations = {
        'normal': 'Normal',
        'fire': 'Fuego',
        'water': 'Agua',
        'electric': 'Eléctrico',
        'grass': 'Planta',
        'ice': 'Hielo',
        'fighting': 'Lucha',
        'poison': 'Veneno',
        'ground': 'Tierra',
        'flying': 'Volador',
        'psychic': 'Psíquico',
        'bug': 'Bicho',
        'rock': 'Roca',
        'ghost': 'Fantasma',
        'dragon': 'Dragón',
        'dark': 'Siniestro',
        'steel': 'Acero',
        'fairy': 'Hada'
    };
    return translations[type] || type;
}

// Función para traducir habilidades (ejemplos comunes)
function translateAbility(ability) {
    const translations = {
        'overgrow': 'Espesura',
        'blaze': 'Mar Llamas',
        'torrent': 'Torrente',
        'swarm': 'Enjambre',
        'keen-eye': 'Vista Lince',
        'tangled-feet': 'Pies Enredados',
        'big-pecks': 'Sacapecho',
        'intimidate': 'Intimidación',
        'static': 'Electricidad Estática',
        'lightning-rod': 'Pararrayos'
    };
    return translations[ability] || ability.replace(/-/g, ' ');
}

// Función para traducir estadísticas
function translateStat(stat) {
    const translations = {
        'hp': 'PS (Puntos de Salud)',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'Ataque Especial',
        'special-defense': 'Defensa Especial',
        'speed': 'Velocidad'
    };
    return translations[stat] || stat;
}

// Funciones para mostrar/ocultar elementos
function showLoading() {
    loading.classList.remove('d-none');
}

function hideLoading() {
    loading.classList.add('d-none');
}

function showError(message) {
    error.querySelector('p').textContent = message || 'Verifica que el nombre esté bien escrito o intenta con otro Pokémon.';
    error.classList.remove('d-none');
}

function hideError() {
    error.classList.add('d-none');
}

function showResult() {
    pokemonResult.classList.remove('d-none');
}

function hideResult() {
    pokemonResult.classList.add('d-none');
}

// Función para buscar un Pokémon aleatorio (bonus)
function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1010) + 1; // Hay alrededor de 1010 Pokémon
    pokemonInput.value = randomId;
    searchPokemon();
}

// Agregar función de Pokémon aleatorio al hacer clic en el título (easter egg)
document.querySelector('h1').addEventListener('click', getRandomPokemon);

// Búsqueda automática de Pikachu al cargar la página (demo)
window.addEventListener('load', function() {
    pokemonInput.value = 'pikachu';
    setTimeout(() => {
        searchPokemon();
    }, 500);
});