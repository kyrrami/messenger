<script setup lang="ts">
    import { useAuthStore } from '~/stores/auth'

    const authStore = useAuthStore()
    const users = ref<any[]>([])

    async function loadUsers () {
        try{
            if (!authStore.token) {
                navigateTo('/login') 
                return
            }
            const response = await $fetch<any>('/api/users', {
                headers: {
                    Authorization: `Bearer ${authStore.token}` 
                }
            })
            users.value = response.users
        }catch {
            navigateTo('/login')
        }
    }

    async function startChat (targetUserId: number) {
        try{
            const response = await $fetch<any>('/api/chat', {
                method: 'POST',
                body: {
                    targetUserId: targetUserId
                },
                headers: {
                    Authorization: `Bearer ${authStore.token}` 
                }
            })
            navigateTo(`/chat/${response.chatId}`)
        } catch {
            navigateTo('/login')
        }
    }

    onMounted (() => {
        loadUsers()
    })
</script>

<template>
    <div class="app-container">
        <!-- Шапка профиля -->
        <header class="header">
            <div class="user-profile">
                <div class="avatar">{{ authStore.user?.username?.[0]?.toUpperCase() || 'U' }}</div>
                <div class="user-info">
                    <span class="name">{{ authStore.user?.username }}</span>
                    <span class="status">в сети</span>
                </div>
            </div>
            <button class="logout-btn" @click="authStore.logout()">
                Выйти
            </button>
        </header>

        <!-- Список контактов -->
        <main class="contacts-list">
            <h3 class="section-title">Все контакты</h3>
            
            <div class="contact-item" v-for="user in users" :key="user.id" @click="startChat(user.id)">
                <div class="avatar contact-avatar">{{ user.username[0].toUpperCase() }}</div>
                <div class="contact-info">
                    <span class="contact-name">{{ user.username }}</span>
                    <span class="contact-login">@{{ user.login }}</span>
                </div>
            </div>
            
            <div v-if="users.length === 0" class="empty-state">
                Пока нет других пользователей 😔
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Основной контейнер (фон как в тг) */
.app-container {
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Шапка */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background-color: #517da2; /* Синеватый цвет шапки тг */
    color: white;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #00dc82;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 18px;
    color: white;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.name {
    font-weight: 600;
    font-size: 16px;
}

.status {
    font-size: 12px;
    opacity: 0.8;
}

.logout-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

/* Список контактов */
.contacts-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #f4f4f5;
}

.section-title {
    font-size: 13px;
    color: #707579;
    margin: 10px 10px 20px 10px;
    text-transform: uppercase;
    font-weight: 600;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: white;
    border-radius: 10px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
}

.contact-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.contact-avatar {
    background-color: #e4e4e5; /* Серый аватар как у пустых профилей в тг */
    color: #707579;
}

.contact-info {
    display: flex;
    flex-direction: column;
}

.contact-name {
    font-weight: 500;
    font-size: 16px;
    color: #000;
}

.contact-login {
    font-size: 14px;
    color: #707579;
}

.empty-state {
    text-align: center;
    color: #707579;
    margin-top: 50px;
}
</style>