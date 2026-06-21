import React, { useCallback, useEffect, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import paymentApi from 'apis/paymentApi';

const POLL_INTERVAL = 3000; // 3 giây
const EXPIRE_MINUTES = 30;

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      color: copied ? '#4caf50' : '#1976d2', fontSize: '0.85rem',
      fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 6px',
    }}>
      <FileCopyIcon style={{ fontSize: 14 }} />
      {copied ? 'Đã chép!' : label || 'Chép'}
    </button>
  );
}

function CountdownTimer({ totalSeconds }) {
  const [secs, setSecs] = useState(totalSeconds);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return (
    <span style={{ color: secs < 120 ? '#e53935' : '#888', fontWeight: 700 }}>
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </span>
  );
}

function PaymentModal({ open, onClose, courseId, courseTitle, amount, onSuccess }) {
  const [status, setStatus] = useState('init');
  const [payData, setPayData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const pollRef = useRef(null);

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  const startPolling = useCallback((orderCode) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      try {
        const res = await paymentApi.checkStatus(orderCode);
        const s = res.data?.status;
        if (s === 'PAID') {
          stopPolling();
          setStatus('paid');
          onSuccess?.(); // cập nhật isEnrolled trong CourseDetail ngay lập tức
        } else if (s === 'CANCELLED') { stopPolling(); setStatus('cancelled'); }
        else if (s === 'EXPIRED') { stopPolling(); setStatus('expired'); }
      } catch { /* ignore */ }
    }, POLL_INTERVAL);
  }, [onSuccess]);

  useEffect(() => {
    if (!open) { stopPolling(); return; }

    (async () => {
      setStatus('loading'); setErrorMsg(''); setPayData(null);
      try {
        const res = await paymentApi.createOrder(courseId);
        if (res.status === 200) {
          const data = res.data;
        //   setPayData(data);
          orderCodeRef.current = data.orderCode;
          setStatus('qr');
          startPolling(data.orderCode);
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Không thể tạo đơn thanh toán.';
        setErrorMsg(msg);
        setStatus('error');
      }
    })();

    return () => stopPolling();
  }, [open, courseId, startPolling]);

  const handleClose = () => {
    stopPolling();
    onClose();
  };

  // Đóng modal — trạng thái đã được cập nhật qua onSuccess() trước đó
  const handleGoToCourse = () => {
    stopPolling();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div style={{
        background: 'linear-gradient(135deg, #1565c0 0%, #0288d1 100%)',
        color: '#fff', padding: '20px 24px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Thanh toán khóa học</h2>
          <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '0.9rem' }}>{courseTitle}</p>
        </div>
        <button onClick={handleClose} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%',
          width: 36, height: 36, cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CloseIcon style={{ fontSize: 20 }} />
        </button>
      </div>

      <DialogContent style={{ padding: '24px', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* Loading */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <CircularProgress style={{ color: '#1976d2' }} />
            <p style={{ marginTop: 16, color: '#555' }}>Đang tạo mã QR thanh toán...</p>
          </div>
        )}

        {/* QR Code */}
        {status === 'qr' && payData && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            {/* Số tiền */}
            <div style={{
              background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
              borderRadius: 12, padding: '12px 20px', marginBottom: 20,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#555', fontWeight: 600 }}>Số tiền cần thanh toán:</span>
              <span style={{ color: '#1565c0', fontSize: '1.4rem', fontWeight: 800 }}>
                {formatVND(payData.amount)}
              </span>
            </div>

            {/* QR Image */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <img
                src={payData.qrImageUrl}
                alt="QR VietQR"
                style={{ width: 240, height: 240, borderRadius: 12, border: '3px solid #1976d2', display: 'block' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div style={{
                position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                background: '#1976d2', color: '#fff', borderRadius: 20, padding: '3px 12px',
                fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
                Quét bằng app ngân hàng
              </div>
            </div>

            {/* Thông tin chuyển khoản */}
            <div style={{
              background: '#f8f9fa', borderRadius: 12, padding: '16px',
              textAlign: 'left', marginTop: 20, fontSize: '0.9rem',
            }}>
              <p style={{ fontWeight: 700, color: '#333', margin: '0 0 10px' }}>Thông tin chuyển khoản:</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: '#666' }}>Ngân hàng:</span>
                <span style={{ fontWeight: 600, color: '#333' }}>PayOS (VietQR)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>Số tài khoản:</span>
                <span style={{ fontWeight: 700, color: '#1565c0' }}>
                  {payData.bank?.accountNumber}
                  <CopyButton text={payData.bank?.accountNumber} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ color: '#666' }}>Chủ tài khoản:</span>
                <span style={{ fontWeight: 600, color: '#333' }}>{payData.bank?.accountName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                <span style={{ color: '#666' }}>Nội dung:</span>
                <span style={{ fontWeight: 700, color: '#1565c0' }}>
                  {payData.description}
                  <CopyButton text={payData.description} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: '#666' }}>Số tiền:</span>
                <span style={{ fontWeight: 700, color: '#e53935' }}>{formatVND(payData.amount)}</span>
              </div>
            </div>

            {/* Đếm ngược + trạng thái */}
            <div style={{
              marginTop: 16, padding: '10px 16px', background: '#fff3e0',
              borderRadius: 10, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', fontSize: '0.88rem',
            }}>
              <span style={{ color: '#e65100' }}>⏳ QR hết hạn sau:</span>
              <CountdownTimer totalSeconds={EXPIRE_MINUTES * 60} />
            </div>

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: '0.85rem' }}>
              <CircularProgress size={14} style={{ color: '#1976d2' }} />
              Đang chờ xác nhận thanh toán...
            </div>
          </div>
        )}

        {/* Thành công */}
        {status === 'paid' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircleIcon style={{ fontSize: 80, color: '#4caf50', marginBottom: 16 }} />
            <h2 style={{ color: '#2e7d32', margin: '0 0 8px' }}>Thanh toán thành công!</h2>
            <p style={{ color: '#555', marginBottom: 24 }}>
              Bạn đã thanh toán thành công cho khóa học <strong>{courseTitle}</strong>.
              Bắt đầu học ngay thôi!
            </p>
            <Button
              variant="contained"
              style={{ background: 'linear-gradient(135deg, #4caf50, #2e7d32)', color: '#fff', borderRadius: 30, padding: '12px 32px', fontWeight: 700, fontSize: '1rem' }}
              onClick={handleGoToCourse}>
              Vào khóa học ngay →
            </Button>
          </div>
        )}

        {/* Đã hủy */}
        {status === 'cancelled' && (
          <div style={{ textAlign: 'center' }}>
            <CancelIcon style={{ fontSize: 64, color: '#e53935', marginBottom: 12 }} />
            <h3 style={{ color: '#c62828' }}>Đơn thanh toán đã bị hủy</h3>
            <p style={{ color: '#555' }}>Bạn có thể thử lại bằng cách đóng và mở lại cửa sổ thanh toán.</p>
            <Button variant="outlined" onClick={handleClose} style={{ marginTop: 12 }}>Đóng</Button>
          </div>
        )}

        {/* Hết hạn */}
        {status === 'expired' && (
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: 56 }}>⏰</span>
            <h3 style={{ color: '#f57c00' }}>QR đã hết hạn</h3>
            <p style={{ color: '#555' }}>Mã QR chỉ có hiệu lực 30 phút. Vui lòng tạo đơn mới.</p>
            <Button variant="outlined" onClick={handleClose} style={{ marginTop: 12 }}>Đóng</Button>
          </div>
        )}

        {/* Lỗi */}
        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <CancelIcon style={{ fontSize: 64, color: '#e53935', marginBottom: 12 }} />
            <h3 style={{ color: '#c62828' }}>Có lỗi xảy ra</h3>
            <p style={{ color: '#555' }}>{errorMsg}</p>
            <Button variant="outlined" onClick={handleClose} style={{ marginTop: 12 }}>Đóng</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PaymentModal;
