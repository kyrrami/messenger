<script setup lang ="ts">
    import { useAuthStore } from '~/stores/auth'

    const loginInput = ref('')
    const inputPassword = ref('')
    const error = ref()
    const usernameInput = ref('')
    const emailInput = ref('')
    const isLogin = ref(true)
    const authStore = useAuthStore()

    async function onSubmit() {
        try {
            const response = await $fetch<any>('/api/login', {
                method: 'POST',
                body: {
                    login: loginInput.value,
                    password: inputPassword.value
                }
            })
            
            authStore.setAuth(response.token, response.user)
            await navigateTo('/')

        } catch (err: any){
            error.value = err.data?.message || 'Произошла ошибка'
        }
        
    }
    async function onRegister () {
        try{
            const response = await $fetch<any>('/api/register', {
                method: 'POST',
                body: {
                    login : loginInput.value,
                    password : inputPassword.value,
                    username: usernameInput.value,
                    email : emailInput.value
                }
            })
            authStore.setAuth(response.token, response.user)
            navigateTo('/')
        } catch (err : any) {
            error.value =err.data?.message || 'Пользователь с такой почтой или логином уже существует'
        }
        
    }
</script>

<template>
    <div class="auth-container">
        <div class="auth-box">
            <div class="tabs">
                <button 
                    type="button" 
                    :class="{ active: isLogin }" 
                    @click="isLogin = true">
                    Вход
                </button>
                <button 
                    type="button" 
                    :class="{ active: !isLogin }" 
                    @click="isLogin = false">
                    Регистрация
                </button>
            </div>
            <form @submit.prevent="isLogin ? onSubmit() : onRegister()" class="auth-form">
                <div class="input-group">
                    <input v-model="loginInput" type="text" placeholder="Логин" required />
                </div>
                <template v-if="!isLogin">
                    <div class="input-group">
                        <input v-model="usernameInput" type="text" placeholder="Имя (username)" required />
                    </div>
                    <div class="input-group">
                        <input v-model="emailInput" type="email" placeholder="Email" required />
                    </div>
                </template>

                <div class="input-group">
                    <input v-model="inputPassword" type="password" placeholder="Пароль" required />
                </div>

                <button type="submit" class="submit-btn">
                    {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
                </button>
            </form>
            <div class="error-block" v-if="error">
                <p>{{ error }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
}

.auth-box {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}


.tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
}

.tabs button {
    flex: 1;
    background: none;
    border: none;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    color: #666;
    transition: 0.3s;
}

.tabs button.active {
    color: #00dc82; 
    border-bottom: 2px solid #00dc82;
    font-weight: bold;
}


.auth-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    outline: none;
}

.input-group input:focus {
    border-color: #00dc82;
}


.submit-btn {
    padding: 12px;
    background: #00dc82;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
}

.submit-btn:hover {
    background: #00c473;
}


.error-block {
    margin-top: 15px;
    padding: 10px;
    background: #ffe6e6;
    border-radius: 6px;
    text-align: center;
}

.error-block p {
    color: #d32f2f;
    margin: 0;
    font-size: 14px;
}
</style>