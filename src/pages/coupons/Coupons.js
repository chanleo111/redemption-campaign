import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  message, 
  Modal, 
  QRCode, 
  Tag,
  Spin,
  Empty,
  Form,
  Input,
  DatePicker,
  InputNumber
} from 'antd';
import { 
  ShoppingCartOutlined, 
  EyeOutlined,
  CheckOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { couponAPI } from '../../services/api';
import { useAuth } from '../../components/AuthContext';

const { Meta } = Card;

const Coupons = ({ t }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm();
  const { user, updateUser, isAdmin } = useAuth();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const language = localStorage.getItem('language') || 'en';
      const res = await couponAPI.getCoupons(language);
      const list = res.data?.data || res.data?.coupons || res.data || [];
      setCoupons(Array.isArray(list) ? list : []);
    } catch (error) {
      message.error(error.response?.data?.message || '加載優惠券失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (coupon) => {
    setRedeeming(true);
    try {
      const res = await couponAPI.redeemCoupon({
        user_id: user.user_id,
        coupon_id: coupon.coupon_id,
      });
      const data = res.data?.data || res.data;
      if (!data) throw new Error('兌換失敗');
      setQrData(data);
      setQrModalVisible(true);
      if (typeof data.points_balance === 'number') {
        updateUser({ ...user, points_balance: data.points_balance });
      }
      message.success('兌換成功！');
    } catch (error) {
      message.error(error.response?.data?.message || '兌換失敗');
    } finally {
      setRedeeming(false);
    }
  };

  const canRedeem = (coupon) => {
    return (user?.points_balance ?? 0) >= coupon.points && coupon.status === 'active';
  };

  const getStatusTag = (coupon) => {
    if (coupon.status !== 'active') {
      return <Tag color="red">已結束</Tag>;
    }
    
    const now = new Date();
    const validTo = new Date(coupon.valid_to);
    if (now > validTo) {
      return <Tag color="red">已過期</Tag>;
    }
    
    return <Tag color="green">進行中</Tag>;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>可用優惠券</h2>
        <p style={{ color: '#666' }}>
          當前積分: <strong>{user?.points_balance}</strong> 點
        </p>
        {isAdmin && (
          <Button type="primary" onClick={() => setCreateVisible(true)}>
            新增可兌換優惠券
          </Button>
        )}
      </div>

      {coupons.length === 0 ? (
        <Empty description="暫無可用優惠券" />
      ) : (
        <Row gutter={[16, 16]}>
          {coupons.map(coupon => (
            <Col xs={24} sm={12} lg={8} key={coupon.coupon_id}>
              <Card
                hoverable
                actions={[
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => setSelectedCoupon(coupon)}
                  >
                    詳情
                  </Button>,
                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    loading={redeeming}
                    disabled={!canRedeem(coupon)}
                    onClick={() => handleRedeem(coupon)}
                  >
                    兌換 ({coupon.points} 積分)
                  </Button>
                ]}
              >
                <Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <span>{coupon.name}</span>
                      {getStatusTag(coupon)}
                    </div>
                  }
                  description={
                    <div>
                      <p>{coupon.description}</p>
                      <p>💫 所需積分: {coupon.points}</p>
                      <p>📦 剩余配額: {coupon.quota}</p>
                      <p>⏰ 有效期至: {new Date(coupon.valid_to).toLocaleDateString()}</p>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 優惠券詳情彈窗 */}
      <Modal
        title={selectedCoupon?.name}
        open={!!selectedCoupon}
        onCancel={() => setSelectedCoupon(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedCoupon(null)}>
            關閉
          </Button>,
          <Button
            key="redeem"
            type="primary"
            icon={<ShoppingCartOutlined />}
            loading={redeeming}
            disabled={!selectedCoupon || !canRedeem(selectedCoupon)}
            onClick={() => handleRedeem(selectedCoupon)}
          >
            立即兌換
          </Button>
        ]}
      >
        {selectedCoupon && (
          <div>
            <p><strong>描述:</strong> {selectedCoupon.description}</p>
            <p><strong>所需積分:</strong> {selectedCoupon.points}</p>
            <p><strong>剩余配額:</strong> {selectedCoupon.quota}</p>
            <p><strong>有效期:</strong> {new Date(selectedCoupon.valid_from).toLocaleDateString()} - {new Date(selectedCoupon.valid_to).toLocaleDateString()}</p>
            <p><strong>優惠碼:</strong> <Tag>{selectedCoupon.coupon_code}</Tag></p>
          </div>
        )}
      </Modal>

      {/* QR Code 彈窗 */}
      <Modal
        title="兌換成功"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            關閉
          </Button>
        ]}
      >
        {qrData && (
          <div style={{ textAlign: 'center' }}>
            <QRCode 
              value={qrData.qr_code} 
              size={200}
              iconSize={40}
            />
            <div style={{ marginTop: 16 }}>
              <p><strong>優惠碼:</strong> {qrData.qr_code}</p>
              <p>
                <ClockCircleOutlined /> 
                有效期至: {new Date(qrData.qr_code_expiry_date).toLocaleString()}
              </p>
              <p>扣除積分: {qrData.points_deducted}</p>
              <p>剩余積分: {qrData.points_balance}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* 新增優惠券（僅管理員）*/}
      {isAdmin && (
      <Modal
        title="新增可兌換優惠券"
        open={createVisible}
        onCancel={() => setCreateVisible(false)}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            setCreating(true);
            await couponAPI.createCoupon({
              name: values.name,
              description: values.description,
              points: values.points,
              quota: values.quota,
              valid_from: values.valid[0].toISOString(),
              valid_to: values.valid[1].toISOString(),
              language: localStorage.getItem('language') || 'en'
            });
            message.success('新增成功');
            setCreateVisible(false);
            form.resetFields();
            fetchCoupons();
          } catch (e) {
            if (e?.errorFields) return; // form error
            message.error(e.response?.data?.message || '新增失敗');
          } finally {
            setCreating(false);
          }
        }}
        confirmLoading={creating}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="名稱" rules={[{ required: true, message: '請輸入名稱' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '請輸入描述' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="points" label="所需積分" rules={[{ required: true, message: '請輸入所需積分' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="quota" label="配額" rules={[{ required: true, message: '請輸入配額' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="valid" label="有效期" rules={[{ required: true, message: '請選擇有效期' }]}>
            <DatePicker.RangePicker style={{ width: '100%' }} showTime />
          </Form.Item>
        </Form>
      </Modal>
      )}
    </div>
  );
};

export default Coupons;