import { defineStore } from 'pinia'


export const useAuthStore = defineStore ('auth', () => {
    const token = ref<string | null>(null)
    const user = ref <any>(null)

    const setAuth = (newToken: string, newUser: any) => {
        token.value =  newToken
        user.value = newUser

        localStorage.setItem('token', newToken)
        localStorage.setItem ('user', JSON.stringify(newUser))
    }

    const logout = () => {
        token.value = null
        user.value = null

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigateTo ('/login')
    }

    const init = () => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        
        if (savedToken) token.value = savedToken
        if (savedUser) user.value = JSON.parse(savedUser)
    }

    return {token, user, setAuth, logout, init}
})