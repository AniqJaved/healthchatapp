const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')

//Get username and room from URL

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});


const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room});

//Message from the server
socket.on('message', message =>{
    console.log(message);
    outputMessage(message);

    //When new message comes it automatically Scroll down to the bottom.
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Grabbing the form contents from the chat.html
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    //Emit this message back to server from where we will be deciding whom this message should be shown
    socket.emit('chatMessage',msg);

    //Clear the input and set it to blinking cursor
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}