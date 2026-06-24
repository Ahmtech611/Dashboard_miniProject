import { useState, useEffect } from 'react'
import '../styles/OTPVerification.css'

// ─── Your EmailJS Credentials ─────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_fty9fq9'
const EMAILJS_TEMPLATE_ID = 'template_tm2r2oc'
const EMAILJS_PUBLIC_KEY  = 'iOD-jraZY0hABR6tC'
// ─────────────────────────────────────────────────────────────────────────────

async function sendOTPEmail(toEmail, otpCode) {
  const payload = {
    service_id:  EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id:     EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: toEmail,   // maps to {{to_email}} in EmailJS template
      passcode: otpCode,   // maps to {{passcode}} in EmailJS template
    },
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`EmailJS error ${res.status}: ${text}`)
  }
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default function OTPVerification({ onSuccess, onCancel, action }) {
  const [step, setStep]                 = useState('email')  // 'email' | 'otp'
  const [email, setEmail]               = useState('')
  const [emailError, setEmailError]     = useState('')
  const [otp, setOtp]                   = useState('')
  const [generatedOTP, setGeneratedOTP] = useState('')
  const [timer, setTimer]               = useState(0)
  const [otpError, setOtpError]         = useState('')
  const [sending, setSending]           = useState(false)
  const [sendStatus, setSendStatus]     = useState('')

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const id = setInterval(() => setTimer(t => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    setSending(true)
    setSendStatus('')

    const code = generateOTP()
    setGeneratedOTP(code)

    try {
      await sendOTPEmail(email, code)
      setSendStatus('success')
      setStep('otp')
      setTimer(60)
    } catch (err) {
      console.error(err)
      setSendStatus('error')
    } finally {
      setSending(false)
    }
  }

  const handleResendOTP = async () => {
    setSending(true)
    setSendStatus('')
    const code = generateOTP()
    setGeneratedOTP(code)
    setOtp('')
    setOtpError('')

    try {
      await sendOTPEmail(email, code)
      setSendStatus('success')
      setTimer(60)
    } catch (err) {
      console.error(err)
      setSendStatus('error')
    } finally {
      setSending(false)
    }
  }

  const handleVerifyOTP = () => {
    if (!otp) {
      setOtpError('Please enter the OTP.')
      return
    }
    if (otp === generatedOTP) {
      setOtpError('')
      onSuccess()
    } else {
      setOtpError('Incorrect OTP. Please try again.')
    }
  }

  return (
    <div className="otp-verification">
      <div className="otp-container">

        {/* Header */}
        <div className="otp-header">
          <h1>🔐 OTP Verification</h1>
          <p>
            {action === 'edit'
              ? 'Verify your identity to edit this record.'
              : 'Verify your identity to delete this record.'}
          </p>
        </div>

        {/* Step 1 – Enter email */}
        {step === 'email' && (
          <div className="otp-step">
            <p className="info-text">
              Enter your email address and we'll send a one-time code.
            </p>

            <div className="form-group">
              <label htmlFor="otp-email">Email address</label>
              <input
                type="email"
                id="otp-email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError('') }}
                className={emailError ? 'input-error' : ''}
                disabled={sending}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>

            {sendStatus === 'error' && (
              <p className="error-message">
                ⚠️ Failed to send email. Check your EmailJS Public Key or try again.
              </p>
            )}

            <div className="otp-actions">
              <button
                onClick={handleSendOTP}
                className="btn-primary"
                disabled={sending}
              >
                {sending ? '📤 Sending…' : '📧 Send OTP'}
              </button>
              <button onClick={onCancel} className="btn-secondary">
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 2 – Enter OTP */}
        {step === 'otp' && (
          <div className="otp-step">
            <p className="info-text">
              A 6-digit code was sent to <strong>{email}</strong>.{' '}
              <button
                className="link-btn"
                onClick={() => { setStep('email'); setSendStatus('') }}
              >
                Change email
              </button>
            </p>

            <div className="form-group">
              <label htmlFor="otp-code">Enter OTP</label>
              <input
                type="text"
                id="otp-code"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={e => {
                  setOtp(e.target.value.replace(/\D/g, ''))
                  setOtpError('')
                }}
                className={otpError ? 'input-error' : ''}
              />
              {otpError && <p className="error-message">{otpError}</p>}
            </div>

            <div className="otp-timer">
              {timer > 0 ? (
                <p>Resend available in <strong>{timer}s</strong></p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="btn-resend"
                  disabled={sending}
                >
                  {sending ? '📤 Resending…' : '🔄 Resend OTP'}
                </button>
              )}
            </div>

            {sendStatus === 'error' && (
              <p className="error-message">⚠️ Failed to resend email. Please try again.</p>
            )}

            <div className="otp-actions">
              <button onClick={handleVerifyOTP} className="btn-primary">
                ✅ Verify
              </button>
              <button onClick={onCancel} className="btn-secondary">
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

            
