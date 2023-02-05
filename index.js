let todos = [];
const NAME_KEY = 'name';
const TODOS_KEY = 'todos';
const WEATHER_KEY = 'e0fb1f8dac41bd8ebc675e8e48b18725';
const clock = document.querySelector('.clock-area');
const loginForm = document.querySelector('.login-form');
const todoForm = document.querySelector('.todo-form');
const todoList = document.querySelector('.todo-list');

loginForm.addEventListener('submit', handleLoginForm);
todoForm.addEventListener('submit', handleTodoForm);
todoList.addEventListener('click', handleTodoListClick)

getClock();
setInterval(getClock, 1000);
getWeather();
randomBackgroundImage();

function getClock() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const seconds = String(date.getSeconds()).padStart(2, 0);

    clock.innerHTML = `
        ${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초
    `;
}

function handleLoginForm(event) {
    event.preventDefault();
    const input = event.target[0];

    localStorage.setItem('name', input.value);
    input.value = '';

    paintTodo();
}

function handleTodoForm(event) {
    event.preventDefault();

    let newTodos = JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
    const input = event.target[0];
    const todo = {
        id : Date.now(),
        text: input.value
    }

    input.value = '';

    newTodos.push(todo);
    localStorage.setItem(TODOS_KEY, JSON.stringify(newTodos));
    todos = newTodos;

    createHTMLTodoList();
}

function paintTodo() {
    const storageName = localStorage.getItem(NAME_KEY);
    const storageTodos = localStorage.getItem(TODOS_KEY);
    const loginGroup  = document.querySelector('.login-group');
    const todoGroup = document.querySelector('.todo-group');
    const username = document.querySelector('.user-name');

    loginGroup.style.display = 'none';
    todoGroup.style.display = 'block';
    username.innerHTML = `${storageName} `;

    if(storageTodos !== null) {
        createHTMLTodoList();
    }
}

function createHTMLTodoList() {
    todos = JSON.parse(localStorage.getItem(TODOS_KEY));

    let html = todos.map(item => 
        `
            <li class="todo-list-item" id="${item.id}">
                ${item.text}
                <button type="button" class="delete-btn">삭제</button>
            </li>
        `
    ).join('');

    todoList.innerHTML = html;
}

function handleTodoListClick(event) {
    if(event.target.className === 'delete-btn') {
        const id = event.target.parentElement.id;
        let newTodos = todos.filter(item => item.id != id);

        localStorage.setItem(TODOS_KEY, JSON.stringify(newTodos));
        todos = newTodos;
        event.target.remove();
        createHTMLTodoList();
    }
}

function getWeather() {
    console.log('getWeather');

    const onGeoOk = function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;

        fetch(url)
        .then(response => response.json())
        .then(data => {
            const weahterArea = document.querySelector('.weahter-area');
            const name = data.name;
            const weather = data.weather[0].main;
            const temp = data.main.temp;

            weahterArea.innerHTML = `${name} ${temp} ${weather}`

            console.log(name, weather, temp);
        });
    }

    const onGeoError = function() {
        alert("Cant't find you. No watehr for you.")
    }

    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
}

function randomBackgroundImage() {
    const images = ['bg-img-01.jpg', 'bg-img-02.jpg', 'bg-img-03.jpg', 'bg-img-04.jpg'];
    const image = images[Math.floor(Math.random() * images.length)];

    document.querySelector('.wrap').style.backgroundImage = `url(./images/${image})`;
}