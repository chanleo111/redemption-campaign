import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

const Login = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const { login, validateLogin } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 驗證用戶登錄
      const result = validateLogin(values.phone_number, values.password);
      
      if (result.status === 'success') {
        const token = 'user_token_' + Date.now();
        login(result.user, token);
        message.success('登錄成功！');
        navigate('/');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(error.message || '登錄失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        title="用戶登錄" 
        style={{ width: 400 }}
        headStyle={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}
      >
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="phone_number"
            rules={[
              { required: true, message: '請輸入手機號碼' },
              { pattern: /^\d{8}$/, message: '手機號碼必須是8位數字' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="請輸入8位手機號碼"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="請輸入密碼"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={{ height: '40px' }}
            >
              登錄
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">還沒有賬號？立即註冊</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;