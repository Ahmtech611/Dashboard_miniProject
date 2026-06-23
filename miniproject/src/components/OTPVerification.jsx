import { useState, useEffect } from 'react'
import '../styles/OTPVerification.css'

export default function OTPVerification({ onSuccess, onCancel, action }) {
  const [otp, setOtp] = useState('')
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [timer, setTimer] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    // Generate OTP when component mounts
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(newOTP)
    console.log('Generated OTP:', newOTP) // For demo purposes
  }, [])

  useEffect(() => {
    let interval
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpSent, timer])

  const handleSendOTP = () => {
    setOtpSent(true)
    setTimer(60)
    setError('')
    alert(`OTP sent! (Demo: ${generatedOTP}) - Check console for OTP`)
  }

  const handleVerifyOTP = () => {
    if (!otp) {
      setError('Please enter the OTP')
      return
    }

    if (otp === generatedOTP) {
      setError('')
      onSuccess()
    } else {
      setError('Invalid OTP. Please try again.')
    }
  }

  const handleResendOTP = () => {
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOTP(newOTP)
    console.log('New OTP:', newOTP)
    setOtp('')
    setOtpSent(true)
    setTimer(60)
    setError('')
    alert(`OTP resent! (Demo: ${newOTP}) - Check console for OTP`)
  }

  return (
    <div className="otp-verification">
      <div className="otp-container">
        <div className="otp-header">
          <h1>🔐 OTP Verification Required</h1>
          <p>
            {action === 'edit' ? 'To edit this form, please verify with OTP' : 'To delete this form, please verify with OTP'}
          </p>
        </div>

        {!otpSent ? (
          <div className="otp-step">
            <p className="info-text">Click the button below to receive OTP</p>
            <button onClick={handleSendOTP} className="btn-primary">
              📧 Send OTP
            </button>
          </div>
        ) : (
          <div className="otp-step">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ''))
                  setError('')
                }}
                className={error ? 'input-error' : ''}
              />
              {error && <p className="error-message">{error}</p>}
            </div>

            <div className="otp-timer">
              {timer > 0 ? (
                <>
                  <p>Resend OTP in <strong>{timer}</strong>s</p>
                </>
              ) : (
                <button onClick={handleResendOTP} className="btn-resend">
                  🔄 Resend OTP
                </button>
              )}
            </div>

            <div className="otp-actions">
              <button onClick={handleVerifyOTP} className="btn-primary">
                ✅ Verify OTP
              </button>
              <button onClick={onCancel} className="btn-secondary">
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        <div className="demo-info">
          <p>💡 <strong>Demo Mode:</strong> Check browser console for the OTP</p>
        </div>
      </div>
    </div>
  )
}
