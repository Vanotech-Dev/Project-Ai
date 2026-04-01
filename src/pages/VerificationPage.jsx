import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import MaterialIcon from '../components/ui/MaterialIcon'
import { authClient } from '../lib/authClient'

export default function VerificationPage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [rightMsg, setRightMsg] = useState('')

  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  useEffect(() => {
    // Jika halaman ini dibuka langsung tanpa lewat form Lupa Password, lempar balik
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleChange = (index, value) => {
    // Hanya izinkan angka
    if (!/^[0-9]*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus ke input berikutnya jika diisi
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Auto-focus ke prev input jika backspace ditekan pada kotak kosong
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^[0-9]+$/.test(pastedData)) return

    const newCode = [...code]
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }
    setCode(newCode)

    // Focus last filled input
    const focusIndex = Math.min(pastedData.length, 5)
    inputRefs.current[focusIndex].focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const finalCode = code.join('')
    if (finalCode.length < 6) {
      setErrorMsg('Silakan masukkan 6 digit kode keamanan.')
      return
    }

    if (newPassword.length < 8) {
      setErrorMsg('Kata sandi baru minimal harus 8 karakter.')
      return
    }

    setRightMsg('')
    setErrorMsg('')
    setIsLoading(true)

    const { data, error } = await authClient.emailOtp.resetPassword({
      email,
      otp: finalCode,
      password: newPassword
    })

    setIsLoading(false)

    if (error) {
      setErrorMsg(error.message || 'Kode verifikasi salah atau sudah kedaluwarsa.')
      return
    }

    // Sukses, arahkan ke login
    setRightMsg("Kata sandi berhasil diubah! Mengarahkan ke halaman masuk...")

    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  const handleResend = async () => {
    setErrorMsg('')
    setRightMsg('')
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password"
      })
      setRightMsg("Kode OTP baru telah dikirim ke email Anda.")
    } catch (e) {
      setErrorMsg("Gagal mengirim ulang kode OTP.")
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center space-y-10">
        {/* ===== Branding Header ===== */}
        <div className="flex flex-col items-center space-y-6 text-center animate-fade-in-up">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="lock" className="text-primary text-3xl" filled />
            <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">
              The Kinetic Vault
            </h1>
          </div>
        </div>

        {/* ===== Verification Card ===== */}
        <section className="max-w-md w-full bg-surface-container/30 backdrop-blur-xl border border-outline-variant/15 p-10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-center relative z-10 animate-fade-in-up-delay-1">
          {/* Internal Glow Effect */}
          <div className="absolute inset-0 rounded-xl pointer-events-none p-[1px] bg-gradient-to-br from-primary/15 to-primary-container/15 [mask-image:linear-gradient(black,black)] [mask-composite:exclude]" />

          {/* Icon/Identity Branding */}
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(78,222,163,0.2)]">
              <MaterialIcon icon="verified_user" className="text-primary text-3xl" />
            </div>
          </div>

          <h2 className="font-headline text-3xl font-extrabold mb-3 tracking-tight text-on-surface">
            Verifikasi Kode
          </h2>
          <p className="text-on-surface-variant font-body text-sm mb-10 leading-relaxed px-4">
            Kami telah mengirimkan kode 6-digit ke email Anda. Silakan masukkan di bawah ini untuk mengamankan sesi Anda.
          </p>

          <form className="space-y-10" onSubmit={handleSubmit}>
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-error-container/20 border border-error/20 rounded-lg text-left">
                <MaterialIcon icon="error" className="text-error text-lg" />
                <p className="text-sm font-body text-error">{errorMsg}</p>
              </div>
            )}

            {rightMsg && (
              <div className="flex items-center gap-2 p-3 bg-primary/20 border border-primary/20 rounded-lg text-left animate-fade-in-up">
                <MaterialIcon icon="check_circle" className="text-primary text-lg" />
                <p className="text-sm font-body text-primary font-medium">{rightMsg}</p>
              </div>
            )}

            <div className="grid grid-cols-6 gap-3 mb-6" onPaste={handlePaste}>
              {code.map((val, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  placeholder="0"
                  className="w-full aspect-square text-center font-label text-2xl font-bold bg-surface-container-low text-primary rounded-lg border-0 focus:ring-2 focus:ring-secondary/40 focus:bg-surface-container transition-all placeholder:text-primary/20"
                />
              ))}
            </div>

            <div className="space-y-2 text-left mb-8">
              <label className="block font-body text-sm font-medium text-on-surface-variant ml-1">
                Kata Sandi Baru
              </label>
              <div className="relative group focus-within:text-primary transition-colors">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MaterialIcon
                    icon="lock"
                    className="text-outline transition-colors group-focus-within:text-primary"
                  />
                </div>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-0 rounded-xl font-body text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container transition-all"
                  placeholder="Minimal 8 karakter"
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200 uppercase tracking-widest text-sm flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Verifikasi'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t-2 border-surface-container-highest/30">
            <p className="text-on-surface-variant font-body text-sm font-medium">
              Tidak menerima kode?{' '}
              <button
                type="button"
                onClick={handleResend}
                className="text-primary hover:text-primary-fixed ml-1 transition-colors font-semibold active:scale-95"
              >
                Kirim Ulang
              </button>
            </p>
          </div>
        </section>
      </div>
    </AuthLayout>
  )
}
