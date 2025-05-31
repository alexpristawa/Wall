class Message {

    static messageHolder = document.querySelector("#messageHolder");

    static messages = [];

    constructor(msg, displayTime) {
        this.msg = msg;
        this.displayTime = displayTime;
        this.timeLeft = displayTime;
        Message.messages.push(this);
        
        this.element = document.createElement('span');
        this.element.className = 'message';
        this.element.innerHTML = msg;
        Message.messageHolder.appendChild(this.element);
    }

    static updateMessages() {
        for(let i = Message.messages.length-1; i >= 0; i--) {
            Message.messages[i].timeLeft -= deltaTime;
            if(Message.messages[i].timeLeft <= 0) {
                Message.messageHolder.removeChild(Message.messages[i].element);
                Message.messages.splice(i, 1);
            } else if(Message.messages[i].timeLeft < Message.messages[i].displayTime/4) {
                Message.messages[i].element.style.opacity = Message.messages[i].timeLeft / (Message.messages[i].displayTime/4);
            }
        }
    }
}