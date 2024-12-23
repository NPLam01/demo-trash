import api from './api';

export const authService = {
    login: async (email, password) => {
        try {
            console.log('Sending login request:', { email }); // Debug log
            const response = await api.post('/user/login', { 
                email, 
                password
            });
            
            console.log('Login response:', response.data); // Debug log
            
            if (response.data.status === 'OK') {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('userId', response.data.data._id);
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.data._id,
                    email: response.data.data.email,
                    name: response.data.data.name
                }));
                return response.data;
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.log('Login error details:', error.response?.data); // Debug log
            throw error;
        }
    },

    register: async (name, email, password, phone) => {
        try {
            console.log('Sending register request:', { email }); // Debug log
            const response = await api.post('/user/register', { 
                name,
                email,
                password,
                confirmPassword: password,
                phone
            });
            return response.data;
        } catch (error) {
            console.log('Register error details:', error.response?.data); // Debug log
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};
