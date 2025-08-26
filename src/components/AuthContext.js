import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// 本地儲存鍵名
const STORAGE_KEYS = {
  USERS: 'redemption_app_users',
  CURRENT_USER: 'redemption_app_current_user',
  TOKEN: 'redemption_app_token'
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // 加載所有用戶數據
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
        let parsed = [];
        if (storedUsers) {
          parsed = JSON.parse(storedUsers);
        }
        // 如果沒有管理員帳號，種子一個預設管理員
        const hasAdmin = parsed.some(u => u.role === 'admin');
        if (!hasAdmin) {
          const adminUser = {
            user_id: 1,
            phone_number: '00000000',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            points_balance: 0,
            language: 'zh',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          parsed = [adminUser, ...parsed];
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsed));
        }
        setUsers(parsed);
      } catch (error) {
        console.error('加載用戶數據失敗:', error);
      }
    };

    const loadCurrentUser = () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('加載當前用戶失敗:', error);
        // 清除無效數據
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
      setLoading(false);
    };

    loadUsers();
    loadCurrentUser();
  }, []);

  // 保存用戶到本地儲存
  const saveUserToStorage = (userData) => {
    try {
      // 檢查手機號是否已存在
      const existingUser = users.find(u => u.phone_number === userData.phone_number);
      if (existingUser) {
        throw new Error('該手機號已註冊');
      }

      // 檢查郵箱是否已存在
      const existingEmail = users.find(u => u.email === userData.email);
      if (existingEmail) {
        throw new Error('該郵箱已註冊');
      }

      const newUser = {
        user_id: Date.now(), // 使用時間戳作為唯一ID
        phone_number: userData.phone_number,
        email: userData.email,
        password: userData.password, // 注意：實際項目中應該加密儲存
        role: userData.role || 'user',
        points_balance: 100, // 新用戶贈送100積分
        language: userData.language || 'zh',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));

      return newUser;
    } catch (error) {
      console.error('保存用戶失敗:', error);
      throw error;
    }
  };

  // 註冊新用戶
  const register = async (userData) => {
    try {
      const newUser = saveUserToStorage(userData);
      
      // 自動登錄新用戶
      const token = 'user_token_' + Date.now();
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      setUser(newUser);

      return { 
        status: 'success', 
        user: newUser, 
        token 
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: error.message 
      };
    }
  };

  // 登錄
  const login = (userData, token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
    setUser(userData);
  };

  // 登出
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  };

  // 更新用戶信息
  const updateUser = (userData) => {
    try {
      const updatedUsers = users.map(u => 
        u.user_id === userData.user_id ? { ...u, ...userData, updated_at: new Date().toISOString() } : u
      );
      
      setUsers(updatedUsers);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('更新用戶失敗:', error);
      throw error;
    }
  };

  // 根據手機號查找用戶
  const findUserByPhone = (phoneNumber) => {
    return users.find(user => user.phone_number === phoneNumber);
  };

  // 根據郵箱查找用戶
  const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
  };

  // 驗證用戶登錄
  const validateLogin = (phoneNumber, password) => {
    const user = findUserByPhone(phoneNumber);
    if (!user) {
      return { status: 'error', message: '用戶不存在' };
    }
    
    if (user.password !== password) {
      return { status: 'error', message: '密碼錯誤' };
    }

    return { status: 'success', user };
  };

  const value = {
    user,
    users,
    login,
    logout,
    register,
    updateUser,
    findUserByPhone,
    findUserByEmail,
    validateLogin,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;