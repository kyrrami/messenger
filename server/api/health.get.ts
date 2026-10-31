export default defineEventHandler (async (event) => {
    try {
        const result = await pool.query('SELECT 1')
        
        return{ok: true}
    }
    catch (error: any) {
        return {ok: false, error: error.message}
    }
})