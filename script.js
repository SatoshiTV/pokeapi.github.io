document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const pokemonQuery = document.getElementById('pokemon-query');
    const music = document.getElementById('background-music');
    const playMusicButton = document.getElementById('play-music-button');

    // Intentar reproducir la música al cargar la página
    async function playMusic() {
        try {
            await music.play();
        } catch (error) {
            console.log('Error de reproducción automática:', error);
            playMusicButton.style.display = 'block';
        }
    }

    // Intentar reproducir la música inmediatamente
    playMusic();

    // Reproducir la música cuando se haga clic en el botón
    playMusicButton.addEventListener('click', () => {
        music.play().then(() => {
            playMusicButton.style.display = 'none';
        }).catch(error => {
            console.log('Error al intentar reproducir la música:', error);
        });
    });

    searchButton.addEventListener('click', () => {
        const query = pokemonQuery.value.trim().toLowerCase();
        if (query) {
            fetchPokemonWithCallback(query, displayPokemonWithCallback);
        }
    });

    // Uso de callback
    function fetchPokemonWithCallback(query, callback) {
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
        fetch(pokemonUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Pokémon no encontrado');
                }
                return response.json();
            })
            .then(data => {
                callback(null, data);
            })
            .catch(error => {
                callback(error, null);
            });
    }

    // Callback para manejar la respuesta del fetch
    function displayPokemonWithCallback(error, data) {
        if (error) {
            console.error('Error al obtener los datos del Pokémon:', error);
            alert('Pokémon no encontrado. Por favor, verifica el ID o nombre e inténtalo de nuevo.');
        } else {
            displayPokemon(data);
        }
    }

    // Uso de Promesas
    function fetchPokemonWithPromise(query) {
        return new Promise((resolve, reject) => {
            const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
            fetch(pokemonUrl)
                .then(response => {
                    if (!response.ok) {
                        reject('Pokémon no encontrado');
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    // Uso de async/await
    async function fetchPokemon(query) {
        try {
            const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;
            const response = await fetch(pokemonUrl);
            if (!response.ok) {
                throw new Error('Pokémon no encontrado');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    async function handleSearch() {
        const query = pokemonQuery.value.trim().toLowerCase();
        if (query) {
            try {
                const data = await fetchPokemon(query);
                displayPokemon(data);
            } catch (error) {
                console.error('Error al obtener los datos del Pokémon:', error);
                alert('Pokémon no encontrado. Por favor, verifica el ID o nombre e inténtalo de nuevo.');
            }
        }
    }

    function displayPokemon(data) {
        document.getElementById('pokemon-id').textContent = data.id;
        document.getElementById('pokemon-name').textContent = data.name;
        document.getElementById('pokemon-weight').textContent = data.weight;
        document.getElementById('pokemon-height').textContent = data.height;
        
        // Mostrar los tipos
        const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
        document.getElementById('pokemon-types').textContent = types;

        // Mostrar la imagen
        const image = document.getElementById('pokemon-image');
        image.src = data.sprites.front_default;
        image.alt = `Imagen de ${data.name}`;
    }
});
