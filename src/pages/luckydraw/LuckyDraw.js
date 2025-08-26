import React, { useEffect, useState } from 'react';
import { 
  Button, 
  Card, 
  message, 
  Spin, 
  Modal, 
  Row, 
  Col,
  Typography 
} from 'antd';
import { 
  GiftOutlined, 
  FireOutlined, 
  TrophyOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useAuth } from '../../components/AuthContext';

const { Title, Text } = Typography;

const LuckyDraw = ({ t }) => {
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [prize, setPrize] = useState(null);
  const [alreadyDrawnToday, setAlreadyDrawnToday] = useState(false);
  const { user, updateUser } = useAuth();

  // 獎品配置
  const prizes = [
    { id: 1, name: '10積分', points: 10, probability: 40, color: '#ff4d4f' },
    { id: 2, name: '20積分', points: 20, probability: 30, color: '#ff7a45' },
    { id: 3, name: '50積分', points: 50, probability: 15, color: '#ffa940' },
    { id: 4, name: '100積分', points: 100, probability: 10, color: '#ffc53d' },
    { id: 5, name: '200積分', points: 200, probability: 5, color: '#bae637' }
  ];

  const getTodayKey = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (!user?.user_id) return;
    const key = `lucky_draw_${user.user_id}_${getTodayKey()}`;
    const hasDrawn = localStorage.getItem(key) === '1';
    setAlreadyDrawnToday(hasDrawn);
  }, [user?.user_id]);

  const markDrawnToday = () => {
    if (!user?.user_id) return;
    const key = `lucky_draw_${user.user_id}_${getTodayKey()}`;
    localStorage.setItem(key, '1');
    setAlreadyDrawnToday(true);
  };

  const handleDraw = async () => {
    if (alreadyDrawnToday) {
      message.warning('今天已抽過獎，請明天再來');
      return;
    }
    setSpinning(true);
    
    // 模擬網絡請求延遲
    setTimeout(() => {
      // 模擬抽獎邏輯
      const random = Math.random() * 100;
      let accumulated = 0;
      let selectedPrize = prizes[0];
      
      for (const p of prizes) {
        accumulated += p.probability;
        if (random <= accumulated) {
          selectedPrize = p;
          break;
        }
      }
      
      setPrize(selectedPrize);
      setShowResult(true);
      setSpinning(false);
      
      // 更新用戶積分
      const newPoints = user.points_balance + selectedPrize.points;
      updateUser({ ...user, points_balance: newPoints });
      
      message.success(`恭喜獲得 ${selectedPrize.points} 積分！`);
      markDrawnToday();
      
    }, 2000);
  };

  const closeResult = () => {
    setShowResult(false);
    setPrize(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>
          <GiftOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          每日幸運抽獎
        </Title>
        <Text type="secondary">
          每天一次機會，試試手氣贏取積分！
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* 抽獎主區域 */}
        <Col xs={24} lg={16}>
          <Card style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ marginBottom: 32 }}>
              <FireOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
            </div>
            
            <Spin spinning={spinning}>
              <Button 
                type="primary" 
                size="large"
                icon={<GiftOutlined />}
                onClick={handleDraw}
                disabled={spinning || alreadyDrawnToday}
                style={{
                  height: 60,
                  fontSize: 18,
                  padding: '0 40px'
                }}
              >
                {spinning ? '抽獎中...' : alreadyDrawnToday ? '今天已抽過' : '開始抽獎'}
              </Button>
            </Spin>

            <div style={{ marginTop: 24 }}>
              <Text type="secondary">
                今日剩余機會: {alreadyDrawnToday ? 0 : 1}次
              </Text>
            </div>
          </Card>
        </Col>

        {/* 獎品信息 */}
        <Col xs={24} lg={8}>
          <Card title="獎品列表" style={{ height: '100%' }}>
            {prizes.map(prize => (
              <div key={prize.id} style={{ 
                marginBottom: 12, 
                padding: 8, 
                borderLeft: `4px solid ${prize.color}`,
                background: '#fafafa'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>{prize.name}</Text>
                  <Text type="secondary">{prize.probability}%</Text>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* 當前積分顯示 */}
      <Card style={{ marginTop: 24, textAlign: 'center' }}>
        <Title level={4}>
          <TrophyOutlined style={{ marginRight: 8 }} />
          當前積分: {user?.points_balance || 0}
        </Title>
      </Card>

      {/* 抽獎結果彈窗 */}
      <Modal
        title="抽獎結果"
        open={showResult}
        onCancel={closeResult}
        footer={[
          <Button key="close" onClick={closeResult}>
            關閉
          </Button>,
          <Button 
            key="share" 
            type="primary"
            onClick={() => message.info('分享功能開發中...')}
          >
            分享結果
          </Button>
        ]}
      >
        {prize && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ 
              fontSize: 48, 
              color: prize.color,
              marginBottom: 16
            }}>
              🎉
            </div>
            <Title level={3} style={{ color: prize.color }}>
              恭喜您！
            </Title>
            <Text style={{ fontSize: 18 }}>
              獲得了 <strong>{prize.points}</strong> 積分！
            </Text>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                當前總積分: {user.points_balance}
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LuckyDraw;