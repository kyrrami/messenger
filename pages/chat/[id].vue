<script setup lang="ts">
    import { useAuthStore } from '~/stores/auth'

    const authStore = useAuthStore()
    const route = useRoute()
    const chatId = route.params.id
    const messageText = ref('')
    const message = ref<any[]>([])
    const users = ref<any[]>([]) // Добавили список юзеров для левой колонки
    let intervalId: any = null

    // Загрузка сообщений
    async function loadMessages() {
        try {
            const response = await $fetch<any>('/api/messages', {
                query: { chatId: chatId },
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            message.value = response
        } catch {
            navigateTo('/login')
        }
    }
    
    // Загрузка списка пользователей
    async function loadUsers() {
        try {
            const response = await $fetch<any>('/api/users', {
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            users.value = response.users
        } catch {
            navigateTo('/login')
        }
    }

    // Функция для перехода в другой чат из левого меню
    async function startChat(targetUserId: number) {
        if (targetUserId === authStore.user.id) return; // Нельзя писать самому себе
        try {
            const response = await $fetch<any>('/api/chat', {
                method: 'POST',
                body: { targetUserId },
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            // Перезагружаем страницу с новым ID чата
            navigateTo(`/chat/${response.chatId}`)
        } catch {}
    }
    
    // Отправка сообщения
    async function sendMessage() {
        if (!messageText.value.trim()) return; // Защита от пустых сообщений
        try {
            await $fetch<any>('/api/messages', {
                method: 'POST',
                body: {
                    chatId: Number(chatId), 
                    text: messageText.value
                },
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            messageText.value = ''
            await loadMessages()
        } catch {}
    }

    onMounted(() => {
        loadMessages()
        loadUsers()
        intervalId = setInterval(loadMessages, 2000)
    })
    
    onUnmounted(() => {
        clearInterval(intervalId)
    })
</script>

<template>
    <div class="messenger-layout">
        
        <!-- ЛЕВАЯ КОЛОНКА (Сайдбар) -->
        <aside class="sidebar">
            <!-- Шапка сайдбара -->
            <div class="sidebar-header">
                <button class="back-btn" @click="navigateTo('/')">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    <span>Назад</span>
                </button>
                <div class="my-avatar">{{ authStore.user?.username?.[0]?.toUpperCase() }}</div>
            </div>

            <!-- Список контактов -->
            <div class="user-list">
                <div 
                    v-for="user in users" 
                    :key="user.id" 
                    class="user-item" 
                    @click="startChat(user.id)"
                >
                    <div class="avatar">{{ user.username[0].toUpperCase() }}</div>
                    <div class="user-info">
                        <span class="user-name">{{ user.username }}</span>
                        <span class="user-login">@{{ user.login }}</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- ПРАВАЯ КОЛОНКА (Окно чата) -->
        <main class="chat-area">
            <!-- Шапка чата -->
            <header class="chat-header">
                <h2>Чат</h2>
            </header>

            <!-- Сообщения -->
            <div class="messages-list">
                <div 
                    v-for="msg in message" 
                    :key="msg.id" 
                    class="message-wrapper"
                    :class="{ 'my-message': msg.id_user === authStore.user?.id }"
                >
                    <div class="message-bubble">
                        <!-- Имя отправителя (если это не я) -->
                        <span v-if="msg.id_user !== authStore.user?.id" class="msg-author">
                            {{ msg.username }}
                        </span>
                        <p class="msg-text">{{ msg.message }}</p>
                    </div>
                </div>
            </div>

            <!-- Поле ввода -->
            <div class="input-area">
                <input 
                    v-model="messageText" 
                    type="text" 
                    placeholder="Написать сообщение..." 
                    @keyup.enter="sendMessage"
                />
                <button @click="sendMessage">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </main>

    </div>
</template>

<style scoped>
/* Общий контейнер - Flex для двух колонок */
.messenger-layout {
    display: flex;
    height: 100vh;
    background-color: #f4f4f5;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* ====== ЛЕВАЯ КОЛОНКА ====== */
.sidebar {
    width: 300px;
    background-color: #ffffff;
    border-right: 1px solid #e1e1e1;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
    background-color: #517da2;
    color: white;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 14px;
    padding: 5px;
}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
}

.my-avatar {
    width: 32px;
    height: 32px;
    background: #00dc82;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 14px;
}

.user-list {
    flex: 1;
    overflow-y: auto;
}

.user-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    gap: 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
}

.user-item:hover {
    background-color: #f0f2f5;
}

.avatar {
    width: 42px;
    height: 42px;
    background-color: #e4e4e5;
    color: #707579;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 500;
    font-size: 15px;
    color: #000;
}

.user-login {
    font-size: 13px;
    color: #707579;
}


/* ====== ПРАВАЯ КОЛОНКА ====== */
.chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #e6ebee; /* Фон чата */
}

.chat-header {
    background-color: #ffffff;
    padding: 15px 20px;
    border-bottom: 1px solid #e1e1e1;
}

.chat-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
}

.messages-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Обертка сообщения для выравнивания */
.message-wrapper {
    display: flex;
    justify-content: flex-start;
}

/* Мои сообщения прижимаем вправо */
.message-wrapper.my-message {
    justify-content: flex-end;
}

/* Пузырь сообщения */
.message-bubble {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.my-message .message-bubble {
    background-color: #effdde; /* Светло-зеленый как в тг */
    border-bottom-right-radius: 4px;
}

.msg-author {
    font-size: 12px;
    color: #00dc82;
    font-weight: 600;
    display: block;
    margin-bottom: 4px;
}

.msg-text {
    margin: 0;
    font-size: 15px;
    color: #333;
    word-wrap: break-word;
}

/* Поле ввода */
.input-area {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
    background-color: #ffffff;
    border-top: 1px solid #e1e1e1;
}

.input-area input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 15px;
    outline: none;
}

.input-area input:focus {
    border-color: #00dc82;
}

.input-area button {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #00dc82;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s;
}

.input-area button:hover {
    background-color: #00c473;
}
</style>