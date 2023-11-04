var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity",
    "timeout": 10000,
    "transports": ["websocket"]
};

this.socket = io.connect('http://localhost:8000', connectionOptions);



//get dom elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")



//function which will append event info to the contaner
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

//ask new user for her name
const nam = prompt("Enter your name to join");
socket.emit('new-user-joined', nam);

//if a new user joins,receive her name from the server 
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
})

//if server sends a message,receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

//if a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'left')
})

//if the form gets submitted ,send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})