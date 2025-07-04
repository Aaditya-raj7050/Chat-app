const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3') ;
const name = prompt("Enter your name to join");

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left') {
        audio.play() ; 
    }
    
}

socket.emit('new-user-joined', name);

// Jab naye user ko purane users ki list milegi
socket.on('existing-users', users => {
    users.forEach(user => {
        append(`${user} is already in the chat`, 'right');
    });
});

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});
