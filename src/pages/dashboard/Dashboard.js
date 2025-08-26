import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, List, Typography } from 'antd';
import { 
  GiftOutlined, 
  ShoppingOutlined, 
  HistoryOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../components/AuthContext';
import { userAPI, redemptionAPI } from '../../services/api';
import { useTranslation } from 'react-i18next';
const { Title, Text } = Typography;

const Dashboard = ({ t }) => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [redemptions, setRedemptions] = useState([]);
  const { t: T } = useTranslation();

  useEffect(() => {
    const load = async () => {
      if (!user?.user_id) return;
      setLoading(true);
      try {
        const [profileRes, redemptionsRes] = await Promise.all([
          userAPI.getProfile(user.user_id),
          redemptionAPI.getRedemptions(user.user_id)
        ]);

        const profileData = profileRes.data?.data || profileRes.data;
        if (profileData) {
          setProfile(profileData);
          if (typeof profileData.points_balance === 'number') {
            updateUser({ ...user, points_balance: profileData.points_balance });
          }
        }

        const redemptionList = redemptionsRes.data?.data || redemptionsRes.data || [];
        setRedemptions(Array.isArray(redemptionList) ? redemptionList : []);
      } catch (e) {
        // fail silent to keep dashboard usable
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  const recentRedemptions = redemptions.slice(0, 5).map(r => ({
    id: r.redemption_id || r.id,
    couponName: r.coupon_name || r.name,
    points: r.points || r.points_deducted,
    date: r.created_at || r.date,
    status: r.status || '已使用'
  }));

  const activities = [];

  return (
    <div>
      <Title level={2}>{T('dashboard.title')}</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={T('dashboard.stats.currentPoints')}
              value={user?.points_balance || 0}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={T('dashboard.stats.availableCoupons')}
              value={2}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={T('dashboard.stats.monthRedemptions')}
              value={3}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
        
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>

          <Card title={T('dashboard.recentActivities')} style={{ marginBottom: 16 }}>
            <List
              size="small"
              dataSource={activities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.action}
                    description={item.date}
                  />
                  <div style={{ color: item.points > 0 ? '#3f8600' : '#cf1322' }}>
                    {item.points > 0 ? '+' : ''}{item.points} 積分
                  </div>
                </List.Item>
              )}
            />
          </Card>
          
        </Col>

        <Col xs={24} lg={12}>
          

          <Card title={T('dashboard.recentRedemptions')}>
            <List
              size="small"
              dataSource={recentRedemptions.slice(0, 3)}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.couponName}
                    description={`${item.points} 積分 • ${item.date}`}
                  />
                  <span style={{ 
                    color: item.status === '已使用' ? '#52c41a' : '#faad14',
                    fontSize: '12px'
                  }}>
                    {item.status}
                  </span>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;