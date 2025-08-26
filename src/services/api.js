import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.post('/login', formData);
  },
  
  register: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.post('/register', formData);
  },
  
  sendSMSVerification: (phoneNumber) => {
    const formData = new FormData();
    formData.append('phone_number', phoneNumber);
    return api.post('/verification/sms', formData);
  },
  
  sendEmailVerification: (email) => {
    const formData = new FormData();
    formData.append('email', email);
    return api.post('/verification/email', formData);
  }
};

export const couponAPI = {
  getCoupons: (language = 'en') => 
    api.get(`/coupons?language=${language}`),
  
  redeemCoupon: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.post('/coupons/redeem', formData);
  },

  createCoupon: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.post('/coupons', formData);
  }
};

export const luckyDrawAPI = {
  participate: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.post('/luckydraw', formData);
  }
};

export const userAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
};

export const redemptionAPI = {
  getRedemptions: (userId) => api.get(`/users/${userId}/redemptions`),
  getRedemptionDetail: (redemptionId) => api.get(`/redemptions/${redemptionId}`),
};

export default api;