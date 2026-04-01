import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import MaterialIcon from '../components/ui/MaterialIcon'
import { authClient } from '../lib/authClient'

/**
 * Evaluates password strength on a 0-4 scale
 */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { label: 'Sangat Lemah', color: 'text-error' },
    { label: 'Lemah', color: 'text-error' },
    { label: 'Sedang', color: 'text-tertiary' },
    { label: 'Kuat', color: 'text-primary' },
    { label: 'Sangat Kuat', color: 'text-primary' },
  ]

  return { score, ...levels[score] }
}

export default function RegisterPage() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (password !== confirmPassword) {
      setErrorMsg('Kata sandi tidak cocok!')
      return
    }
    setIsLoading(true)
    
    const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: fullname
    })
    
    setIsLoading(false)
    
    if (error) {
        setIsLoading(false)
        setErrorMsg(error.message || "Pendaftaran gagal. Silakan coba lagi.")
        return
    }
    
    // Better auth auto-signs in after sign up — full reload agar sesi terbaca
    window.location.href = '/dashboard'
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center space-y-10">

        {/* ===== Branding Header ===== */}
        <div className="flex flex-col items-center space-y-6 text-center animate-fade-in-up">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center animate-glow-pulse">
            <MaterialIcon
              icon="account_balance_wallet"
              className="text-on-primary text-3xl"
              filled
            />
          </div>
          <div className="space-y-2">
            <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
              Kelola Keuanganmu
            </h1>
            <p className="font-body text-on-surface-variant max-w-sm">
              Mulai perjalanan finansial Anda dengan keamanan tingkat tinggi.
            </p>
          </div>
        </div>

        {/* ===== Register Form Card ===== */}
        <section className="w-full bg-surface-container/30 backdrop-blur-xl border border-outline-variant/15 p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in-up-delay-1">

          {/* Card Header */}
          <header className="mb-10 text-center lg:text-left">
            <h3 className="font-headline text-3xl font-bold text-on-surface">
              Buat Akun Baru
            </h3>
            <p className="font-body text-on-surface-variant mt-2">
              Lengkapi data di bawah untuk memulai pengelolaan aset premium.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-3 p-4 bg-error-container/20 border border-error/20 rounded-xl animate-fade-in-up">
                <MaterialIcon icon="error" className="text-error text-xl flex-shrink-0" />
                <p className="text-sm font-body text-error">{errorMsg}</p>
              </div>
            )}

            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label
                className="block font-body text-sm font-medium text-on-surface-variant ml-1"
                htmlFor="fullname"
              >
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MaterialIcon
                    icon="person"
                    className="text-outline transition-colors group-focus-within:text-primary"
                  />
                </div>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-0 rounded-xl font-body text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container transition-all"
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="Masukkan nama sesuai identitas"
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="block font-body text-sm font-medium text-on-surface-variant ml-1"
                htmlFor="register-email"
              >
                Alamat Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MaterialIcon
                    icon="mail"
                    className="text-outline transition-colors group-focus-within:text-primary"
                  />
                </div>
                <input
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-0 rounded-xl font-body text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container transition-all"
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label
                  className="block font-body text-sm font-medium text-on-surface-variant ml-1"
                  htmlFor="register-password"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MaterialIcon
                      icon="lock"
                      className="text-outline transition-colors group-focus-within:text-primary"
                    />
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-0 rounded-xl font-body text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container transition-all"
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-2">
                <label
                  className="block font-body text-sm font-medium text-on-surface-variant ml-1"
                  htmlFor="confirm-password"
                >
                  Konfirmasi
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MaterialIcon
                      icon="verified_user"
                      className="text-outline transition-colors group-focus-within:text-primary"
                    />
                  </div>
                  <input
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-0 rounded-xl font-body text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container transition-all"
                    id="confirm-password"
                    name="confirm_password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            <div className="bg-surface-container-lowest/50 p-4 rounded-xl space-y-3 border border-outline-variant/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-label text-on-surface-variant uppercase tracking-wider">
                  Kekuatan Sandi
                </span>
                {password && (
                  <span className={`text-xs font-bold ${strength.color}`}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 h-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors duration-300 ${
                      i < strength.score
                        ? strength.score <= 1
                          ? 'bg-error'
                          : strength.score === 2
                            ? 'bg-tertiary'
                            : 'bg-primary'
                        : 'bg-surface-container-highest'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-on-surface-variant leading-tight">
                Gunakan minimal 8 karakter dengan kombinasi huruf besar, angka, dan simbol.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="group relative w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-primary to-primary-container rounded-xl font-headline font-bold text-on-primary shadow-[0_10px_20px_rgba(78,222,163,0.2)] hover:shadow-[0_15px_30px_rgba(78,222,163,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                id="register-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="tracking-wide">Memproses...</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-wide">Daftar Sekarang</span>
                    <MaterialIcon
                      icon="arrow_forward"
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-[10px] text-on-surface-variant px-6 mt-6">
              Dengan mendaftar, Anda menyetujui{' '}
              <a className="text-primary hover:underline" href="#">Syarat &amp; Ketentuan</a>
              {' '}serta{' '}
              <a className="text-primary hover:underline" href="#">Kebijakan Privasi</a>
              {' '}kami.
            </p>
          </form>

          {/* Footer */}
          <footer className="text-center pt-10 border-t border-outline-variant/10 mt-10">
            <p className="font-body text-on-surface-variant">
              Sudah memiliki akun?{' '}
              <Link
                to="/login"
                className="font-headline font-bold text-primary hover:text-primary-fixed-dim transition-colors ml-1 underline decoration-primary/30 underline-offset-4"
              >
                Masuk di sini
              </Link>
            </p>
          </footer>
        </section>

      </div>
    </AuthLayout>
  )
}
