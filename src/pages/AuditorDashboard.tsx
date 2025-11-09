/**
 * Auditor Dashboard - Monitor and flag refund transactions
 */

import React, { useState, useEffect } from 'react';
import RefundLogsTable from './components/RefundLogsTable';
import RefundLogDetails from './components/RefundLogDetails';
import { api } from '../services/api';
import './AuditorDashboard.css';

// ใช้ type ที่ขยายเพิ่มเติม
type RefundStatus = 'success' | 'failed' | 'pending' | 'completed' | 'flagged';

interface RefundLog {
  refundId: string;
  userAddress: string;
  txHash: string | null;
  amount: string;
  reason: string;
  status: RefundStatus;
  verifiedAt: string;
  signatureValid: boolean;
  executedBy: string;
  notes: string;
  createdAt: string;
}

export default function AuditorDashboard() {
  const [logs, setLogs] = useState<RefundLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RefundLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<RefundLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserAddress] = useState('0x1234567890abcdef1234567890abcdef12345678');
  const [useRealAPI, setUseRealAPI] = useState(true); // Toggle สำหรับเปลี่ยนระหว่าง API/Mock

  // Fetch all logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  // Update filtered logs when logs or search criteria change
  useEffect(() => {
    applyFilters();
  }, [logs, searchQuery, startDate, endDate]);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useRealAPI) {
        // 🌐 เรียกจาก API จริง
        const response = await api.get('/api/logs');
        setLogs(response.data || response);
      } else {
        // 📦 ใช้ Mock Data (สำหรับ development)
        const mockData: RefundLog[] = [
          {
            refundId: 'REF-2025-001',
            userAddress: '0x1234567890abcdef1234567890abcdef12345678',
            status: 'completed',
            amount: '0.5',
            txHash: '0xabcd1234...',
            reason: 'Contribution refund request',
            verifiedAt: new Date().toISOString(),
            signatureValid: true,
            executedBy: '0xauditor123...',
            notes: 'Verified and approved',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            refundId: 'REF-2025-002',
            userAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
            status: 'pending',
            amount: '1.2',
            txHash: null,
            reason: 'Project cancellation refund',
            verifiedAt: new Date().toISOString(),
            signatureValid: true,
            executedBy: '',
            notes: 'Awaiting final approval',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            refundId: 'REF-2025-003',
            userAddress: '0x9876543210fedcba9876543210fedcba98765432',
            status: 'flagged',
            amount: '2.5',
            txHash: null,
            reason: 'Duplicate request flagged',
            verifiedAt: new Date().toISOString(),
            signatureValid: false,
            executedBy: '',
            notes: 'Under review - possible duplicate',
            createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          },
          {
            refundId: 'REF-2025-004',
            userAddress: '0x5555666677778888999900001111222233334444',
            status: 'completed',
            amount: '0.8',
            txHash: '0xdef4567...',
            reason: 'Early withdrawal',
            verifiedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            signatureValid: true,
            executedBy: '0xauditor456...',
            notes: 'Processed successfully',
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          },
        ];

        // จำลองการหน่วงเวลา
        await new Promise(resolve => setTimeout(resolve, 500));
        setLogs(mockData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching logs:', err);

      // ถ้า API ล้มเหลว ให้ fallback ไปใช้ mock data
      if (useRealAPI) {
        console.warn('API failed, falling back to mock data');
        setUseRealAPI(false);
        fetchLogs(); // เรียกอีกครั้งด้วย mock data
      }
    } finally {
      setLoading(false);
    }
  }; const applyFilters = () => {
    let filtered = [...logs];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.userAddress.toLowerCase().includes(query) ||
          log.refundId.toLowerCase().includes(query) ||
          (log.txHash && log.txHash.toLowerCase().includes(query))
      );
    }

    // Apply date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(log => {
        const logDate = new Date(log.createdAt);
        return logDate >= start && logDate <= end;
      });
    }

    setFilteredLogs(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const handleLogSelect = (log: RefundLog) => {
    setSelectedLog(log);
  };

  const handleFlagLog = async (refundId: string) => {
    const reason = prompt('กรุณาระบุเหตุผลที่ต้องการแจ้ง (Please specify the reason for flagging):');
    if (!reason) return;

    try {
      if (useRealAPI) {
        // 🌐 เรียก API จริง
        await api.post('/api/logs/flag', {
          refundId,
          reason,
          flaggedBy: currentUserAddress,
        });
      } else {
        // 📦 จำลอง flag ใน Mock Data
        await new Promise(resolve => setTimeout(resolve, 300));

        setLogs(prevLogs =>
          prevLogs.map(log =>
            log.refundId === refundId
              ? { ...log, status: 'flagged' as RefundStatus, notes: `Flagged: ${reason}` }
              : log
          )
        );
      }

      alert('✅ แจ้งเตือนสำเร็จ! ทีมตรวจสอบจะดำเนินการต่อไป\n(Flag submitted successfully! The audit team will review it.)');

      // รีเฟรช logs
      fetchLogs();
    } catch (err) {
      alert('❌ แจ้งเตือนล้มเหลว กรุณาลองใหม่\n(Failed to flag log. Please try again.)');
      console.error('Error flagging log:', err);
    }
  }; const handleExportCSV = () => {
    const csvHeaders = [
      'Refund ID',
      'User Address',
      'Status',
      'Amount (BNB)',
      'TxHash',
      'Reason',
      'Verified At',
      'Signature Valid',
      'Executed By',
      'Notes',
    ];

    const csvRows = filteredLogs.map(log => [
      log.refundId,
      log.userAddress,
      log.status,
      log.amount,
      log.txHash || '-',
      log.reason,
      log.verifiedAt,
      log.signatureValid ? 'Yes' : 'No',
      log.executedBy,
      log.notes,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `refund-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="auditor-dashboard">
      <div className="dashboard-header">
        <h1>🔍 MeeChain Auditor Dashboard</h1>
        <p>ตรวจสอบธุรกรรม refund ที่เกิดขึ้นอย่างโปร่งใสและปลอดภัย</p>
      </div>

      <div className="dashboard-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="🔍 Search by Address / TxHash / Refund ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        <div className="date-filter">
          <label>
            📅 Start Date:
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="date-input"
            />
          </label>
          <label>
            📅 End Date:
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="date-input"
            />
          </label>
        </div>

        <button onClick={handleExportCSV} className="export-button" disabled={filteredLogs.length === 0}>
          📄 Export CSV
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}

      <div className="dashboard-content">
        <div className="logs-section">
          <h2>📋 Refund Logs Table</h2>
          <RefundLogsTable
            logs={filteredLogs}
            onLogSelect={handleLogSelect}
            selectedLogId={selectedLog?.refundId}
          />
        </div>

        {selectedLog && (
          <div className="details-section">
            <h2>📄 Selected Log Details</h2>
            <RefundLogDetails log={selectedLog} onFlag={handleFlagLog} />
          </div>
        )}
      </div>
    </div>
  );
}
