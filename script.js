document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('startBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainInterface = document.getElementById('mainInterface');
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistory = document.getElementById('chatHistory');
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const assistantBtn = document.getElementById('assistantBtn');
    const quickOptions = document.querySelectorAll('.quick-option');

    // Show welcome screen initially
    startBtn.addEventListener('click', function () {
        welcomeScreen.style.display = 'none';
        mainInterface.style.display = 'flex';
        startNewChat();
    });

    // New chat button
    newChatBtn.addEventListener('click', startNewChat);

    // Virtual Assistant button
    assistantBtn.addEventListener('click', function () {
        window.location.href = 'virtual-assistant.html';
    });

    // Quick options click handler
    quickOptions.forEach(option => {
        option.addEventListener('click', function () {
            const text = this.textContent;
            sendMessage(text);
        });
    });

    function startNewChat() {
        chatContainer.innerHTML = '';
        userInput.value = '';
        addMessage('assistant', 'Hello there! I\'m SHIFRA, your career counseling assistant. How can I help you today?');
    }

    function addToChatHistory(title) {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.textContent = title;
        chatHistory.appendChild(chatItem);

        chatItem.addEventListener('click', function () {
            startNewChat();
            addMessage('user', title);
            addMessage('assistant', `This was our previous conversation about "${title}".`);
        });
    }

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return messageDiv;
    }

    // MAIN CHAT HANDLER (Streaming)
    async function sendMessage(forcedMessage = null) {
        const message = forcedMessage || userInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage('user', message);
        userInput.value = '';

        // Create empty assistant bubble for streaming
        const assistantDiv = addMessage('assistant', "");

        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: message })
            });

            // Stream chunks
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                assistantDiv.textContent += decoder.decode(value, { stream: true });
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

        } catch (error) {
            assistantDiv.textContent = 'Error: Unable to connect to the server.';
            console.error('Fetch error:', error);
        }

        addToChatHistory(message.substring(0, 20) + (message.length > 20 ? '...' : ''));
    }

    // Send button and Enter key triggers
    sendBtn.addEventListener('click', () => sendMessage());
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
