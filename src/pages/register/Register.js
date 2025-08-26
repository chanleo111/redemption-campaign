import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Tabs, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

const Register = ({ t }) => {
  const [loading, setLoading] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sms');
  const { register, findUserByPhone, findUserByEmail } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // 發送短信驗證碼（模擬）
  const sendSMSVerification = async () => {
    const phoneNumber = form.getFieldValue('phone_number');
    if (!phoneNumber || !/^\d{8}$/.test(phoneNumber)) {
      message.error('請輸入正確的手機號碼（8位數字）');
      return;
    }
  
    // 檢查手機號是否已註冊
    const existingUser = findUserByPhone(phoneNumber);
    if (existingUser) {
      message.error('該手機號已註冊');
      return;
    }

    setSmsLoading(true);
    try {
      // 模擬發送驗證碼
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`驗證碼已發送到: ${phoneNumber} (模擬驗證碼: 123456)`);
    } catch (error) {
      message.error('發送驗證碼失敗');
    } finally {
      setSmsLoading(false);
    }
  };

  // 發送郵件驗證碼（模擬）
  const sendEmailVerification = async () => {
    const email = form.getFieldValue('email');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error('請輸入正確的郵箱地址');
      return;
    }

    // 檢查郵箱是否已註冊
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      message.error('該郵箱已註冊');
      return;
    }

    setEmailLoading(true);
    try {
      // 模擬發送驗證碼
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`驗證碼已發送到: ${email} (模擬驗證碼: ABCDEF)`);
    } catch (error) {
      message.error('發送驗證碼失敗');
    } finally {
      setEmailLoading(false);
    }
  };

  // 驗證碼驗證（模擬）
  const validateVerificationCode = (code, method) => {
    const validCodes = {
      sms: '123456',
      email: 'ABCDEF'
    };
    return code === validCodes[method];
  };

  // 註冊提交
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 驗證驗證碼
      const verificationCode = activeTab === 'sms' ? values.sms_code : values.email_code;
      if (!validateVerificationCode(verificationCode, activeTab)) {
        throw new Error('驗證碼錯誤');
      }

      // 準備註冊數據
      const registerData = {
        phone_number: values.phone_number,
        email: values.email,
        password: values.password,
        language: 'zh'
      };

      // 調用註冊功能
      const result = await register(registerData);
      
      if (result.status === 'success') {
        message.success('註冊成功！獲得100積分獎勵');
        navigate('/');
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      console.error('註冊錯誤:', error);
      message.error(error.message || '註冊失敗');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'sms',
      label: '短信驗證',
      children: (
        <Form.Item
          name="sms_code"
          rules={[{ required: true, message: '請輸入短信驗證碼' }]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="短信驗證碼"
            addonAfter={
              <Button 
                type="link" 
                loading={smsLoading}
                onClick={sendSMSVerification}
              >
                發送驗證碼
              </Button>
            }
          />
        </Form.Item>
      ),
    },
    {
      key: 'email',
      label: '郵箱驗證',
      children: (
        <Form.Item
          name="email_code"
          rules={[{ required: true, message: '請輸入郵箱驗證碼' }]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="郵箱驗證碼"
            addonAfter={
              <Button 
                type="link" 
                loading={emailLoading}
                onClick={sendEmailVerification}
              >
                發送驗證碼
              </Button>
            }
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        title="用戶註冊" 
        style={{ width: 400, maxWidth: '90vw' }}
        styles={{ header: { textAlign: 'center', fontSize: '24px', fontWeight: 'bold' } }}
      >
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="phone_number"
            label="手機號碼"
            rules={[
              { required: true, message: '請輸入手機號碼' },
              { pattern: /^\d{8}$/, message: '手機號碼必須是8位數字' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="請輸入8位手機號碼"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="郵箱地址"
            rules={[
              { required: true, message: '請輸入郵箱地址' },
              { type: 'email', message: '請輸入有效的郵箱地址' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="請輸入郵箱地址"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密碼"
            rules={[
              { required: true, message: '請輸入密碼' },
              { min: 6, message: '密碼長度至少6位' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="請輸入密碼（至少6位）"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label="確認密碼"
            dependencies={['password']}
            rules={[
              { required: true, message: '請確認密碼' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('兩次輸入的密碼不一致'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="請再次輸入密碼"
            />
          </Form.Item>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
          />

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block
              style={{ height: '40px', marginTop: '16px' }}
            >
              註冊
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login">已有賬號？立即登錄</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;