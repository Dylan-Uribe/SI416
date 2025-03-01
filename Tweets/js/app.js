document.addEventListener('DOMContentLoaded', function() {

    let tweets = [];

    const inputTweet = document.querySelector('#tweet');
    const form = document.querySelector('#formulario');
    const listTweets = document.querySelector('#lista-tweets');

    // Cargar tweets desde el Local Storage
    loadTweetsFromLocalStorage();

    form.addEventListener('submit', addTweet);
    listTweets.addEventListener('click', deleteTweet);

    function addTweet(e) {
        e.preventDefault();

        const tweet = inputTweet.value;

        if (tweet === '') {
            showError('A tweet cannot be empty');
            return;
        }

        const tweetObj = {
            id: Date.now(),
            tweet
        };

        tweets = [...tweets, tweetObj];

        renderTweets();

        saveTweetsToLocalStorage();

        inputTweet.value = '';
    }

    function deleteTweet(e) {
        e.preventDefault();

        if (e.target.classList.contains('borrar-tweet')) {
            const tweetId = parseInt(e.target.parentElement.dataset.id);
            tweets = tweets.filter(tweet => tweet.id !== tweetId);
            renderTweets();

            saveTweetsToLocalStorage();
        }
    }

    function showError(error) {
        const message = document.createElement('p');
        message.textContent = error;
        message.classList.add('error');

        const content = document.querySelector('#contenido');
        content.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    function renderTweets() {
        clearTweets();

        tweets.forEach(tweet => {
            const btnDelete = document.createElement('a');
            btnDelete.classList.add('borrar-tweet');
            btnDelete.textContent = 'X';

            const li = document.createElement('li');
            li.textContent = tweet.tweet;
            li.dataset.id = tweet.id;

            li.appendChild(btnDelete);
            listTweets.appendChild(li);
        });
    }

    function clearTweets() {
        while (listTweets.firstChild) {
            listTweets.removeChild(listTweets.firstChild);
        }
    }

    function saveTweetsToLocalStorage() {
        localStorage.setItem('tweets', JSON.stringify(tweets));
    }

    function loadTweetsFromLocalStorage() {
        const tweetsFromStorage = localStorage.getItem('tweets');
        if (tweetsFromStorage) {
            tweets = JSON.parse(tweetsFromStorage);
            renderTweets();
        }
    }
});