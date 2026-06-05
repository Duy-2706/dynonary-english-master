import Button from '@material-ui/core/Button';
import LoopIcon from '@material-ui/icons/Loop';
import InputCustom from 'components/UI/InputCustom';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { formStyle } from 'components/UI/style';

function VerifyRegister({ email, onVerify, loading }) {
  const classes = makeStyles(formStyle)();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) { setError('Nhập mã xác nhận'); return; }
    if (code.trim().length < 4) { setError('Mã không hợp lệ'); return; }
    setError('');
    onVerify(code.trim());
  };

  return (
    <form className={`${classes.root} flex-col`} onSubmit={handleSubmit} autoComplete="off">
      <div className="flex-col" style={{ textAlign: 'center' }}>
        <h1 className={`${classes.title} t-center`}>Kích hoạt tài khoản</h1>
        <div style={{ fontSize: '3rem', marginBottom: 8 }}>📧</div>
        <p style={{ color: '#555', fontSize: '0.9rem', margin: '0 0 16px' }}>
          Mã kích hoạt đã được gửi đến<br />
          <strong style={{ color: '#018c4c' }}>{email}</strong>
        </p>
        <p style={{ color: '#888', fontSize: '0.82rem', margin: 0 }}>
          Kiểm tra hộp thư đến (hoặc thư rác). Mã có hiệu lực 10 phút.
        </p>
      </div>

      <div className="flex-col">
        <InputCustom
          label="Mã kích hoạt"
          size="small"
          placeholder="Nhập mã 6 chữ số"
          error={Boolean(error)}
          inputProps={{
            value: code,
            onChange: (e) => setCode(e.target.value),
            maxLength: 10,
            autoFocus: true,
            style: { textAlign: 'center', fontSize: '1.4rem', letterSpacing: '0.2em' },
          }}
        />
        {error && <p className="text-error">{error}</p>}
      </div>

      <Button
        className="_btn _btn-primary"
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        endIcon={loading && <LoopIcon className="ani-spin" />}
        size="large">
        Xác nhận kích hoạt
      </Button>
    </form>
  );
}

VerifyRegister.propTypes = {
  email: PropTypes.string.isRequired,
  onVerify: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

VerifyRegister.defaultProps = {
  loading: false,
};

export default VerifyRegister;
