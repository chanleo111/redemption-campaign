import React, { useState, useEffect } from 'react';
import { 
  Table,Card,Tag,Space,Button, 
  Modal,QRCode,DatePicker,
  Select,Spin,message} from 'antd';
import { 
  EyeOutlined, 
  DownloadOutlined, 
  FilterOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Redemptions = ({ t }) => {
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState([]);

  // 模擬兌換記錄數據
  const mockData = [
    {
      key: '1',
      id: 'RED001',
      couponName: '5美元優惠券',
      points: 100,
      redemptionDate: '2024-01-15 14:30:00',
      expiryDate: '2024-01-22 14:30:00',
      status: 'used',
      qrCode: 'QR_CODE_001',
      couponCode: 'DISCOUNT5'
    },
    {
      key: '2',
      id: 'RED002',
      couponName: '免費咖啡券',
      points: 50,
      redemptionDate: '2024-01-10 10:15:00',
      expiryDate: '2024-01-17 10:15:00',
      status: 'expired',
      qrCode: 'QR_CODE_002',
      couponCode: 'FREECOFFEE'
    },
    {
      key: '3',
      id: 'RED003',
      couponName: '85折優惠券',
      points: 200,
      redemptionDate: '2024-01-08 16:45:00',
      expiryDate: '2024-01-15 16:45:00',
      status: 'unused',
      qrCode: 'QR_CODE_003',
      couponCode: '15OFF'
    }
  ];

  useEffect(() => {
    // 模擬加載數據
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusTag = (status) => {
    const statusConfig = {
      used: { color: 'green', text: '已使用' },
      unused: { color: 'blue', text: '未使用' },
      expired: { color: 'red', text: '已過期' }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const filteredData = mockData.filter(record => {
    let statusMatch = true;
    let dateMatch = true;

    if (filterStatus !== 'all') {
      statusMatch = record.status === filterStatus;
    }

    if (dateRange && dateRange.length === 2) {
      const start = dayjs(dateRange[0]).startOf('day');
      const end = dayjs(dateRange[1]).endOf('day');
      const recordDate = dayjs(record.redemptionDate);
      dateMatch = recordDate.isAfter(start) && recordDate.isBefore(end);
    }

    return statusMatch && dateMatch;
  });

  const columns = [
    {
      title: '兌換編號',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '優惠券名稱',
      dataIndex: 'couponName',
      key: 'couponName',
    },
    {
      title: '消耗積分',
      dataIndex: 'points',
      key: 'points',
      render: (points) => `${points} 積分`,
    },
    {
      title: '兌換時間',
      dataIndex: 'redemptionDate',
      key: 'redemptionDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '過期時間',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: getStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setSelectedRecord(record)}
            size="small"
          >
            詳情
          </Button>
          <Button
            type="link"
            icon={<QrcodeOutlined />}
            onClick={() => {
              setSelectedRecord(record);
              setQrModalVisible(true);
            }}
            size="small"
            disabled={record.status !== 'unused'}
          >
            QR碼
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2>兌換記錄</h2>
      </div>

      {/* 篩選器 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>狀態篩選:</span>
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 120 }}
          >
            <Option value="all">全部</Option>
            <Option value="unused">未使用</Option>
            <Option value="used">已使用</Option>
            <Option value="expired">已過期</Option>
          </Select>

          <span>時間範圍:</span>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 250 }}
          />

          <Button
            icon={<FilterOutlined />}
            onClick={() => {
              setFilterStatus('all');
              setDateRange([]);
            }}
          >
            重置篩選
          </Button>
        </Space>
      </Card>

      {/* 數據表格 */}
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `第 ${range[0]}-${range[1]} 條，共 ${total} 條記錄`,
            }}
            scroll={{ x: 800 }}
          />
        </Spin>
      </Card>

      {/* 詳情彈窗 */}
      <Modal
        title="兌換記錄詳情"
        open={!!selectedRecord}
        onCancel={() => setSelectedRecord(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedRecord(null)}>
            關閉
          </Button>
        ]}
      >
        {selectedRecord && (
          <div>
            <p><strong>兌換編號:</strong> {selectedRecord.id}</p>
            <p><strong>優惠券名稱:</strong> {selectedRecord.couponName}</p>
            <p><strong>優惠碼:</strong> <Tag>{selectedRecord.couponCode}</Tag></p>
            <p><strong>消耗積分:</strong> {selectedRecord.points} 積分</p>
            <p><strong>兌換時間:</strong> {dayjs(selectedRecord.redemptionDate).format('YYYY-MM-DD HH:mm:ss')}</p>
            <p><strong>過期時間:</strong> {dayjs(selectedRecord.expiryDate).format('YYYY-MM-DD HH:mm:ss')}</p>
            <p><strong>狀態:</strong> {getStatusTag(selectedRecord.status)}</p>
          </div>
        )}
      </Modal>

      {/* QR碼彈窗 */}
      <Modal
        title="優惠券二維碼"
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrModalVisible(false)}>
            關閉
          </Button>,
          <Button 
            key="download" 
            icon={<DownloadOutlined />}
            onClick={() => message.info('下載功能開發中...')}
          >
            下載QR碼
          </Button>
        ]}
      >
        {selectedRecord && (
          <div style={{ textAlign: 'center' }}>
            <QRCode 
              value={selectedRecord.qrCode} 
              size={200}
              style={{ marginBottom: 16 }}
            />
            <p><strong>優惠碼:</strong> {selectedRecord.couponCode}</p>
            <p><strong>有效期至:</strong> {dayjs(selectedRecord.expiryDate).format('YYYY-MM-DD HH:mm')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Redemptions;