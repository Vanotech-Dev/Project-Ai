import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layouts/AuthLayout'
import MaterialIcon from '../components/ui/MaterialIcon'
import { authClient } from '../lib/authClient'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: remember
    })

    if (error) {
      setIsLoading(false)
      setErrorMsg("Email atau password yang Anda masukkan salah.")
      return
    }

    // Gunakan full reload agar sesi cookie terbaca dengan benar oleh ProtectedRoute
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
              Akses treasury premium Anda dengan keamanan tingkat tinggi.
            </p>
          </div>
        </div>

        {/* ===== Login Form Card ===== */}
        <section className="w-full bg-surface-container/30 backdrop-blur-xl border border-outline-variant/15 p-8 md:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in-up-delay-1">

          {/* Card Header */}
          <header className="mb-10 text-center lg:text-left">
            <h3 className="font-headline text-3xl font-bold text-on-surface">
              Selamat Datang Kembali
            </h3>
            <p className="font-body text-on-surface-variant mt-2">
              Silakan masukkan detail akun Anda.
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

            {/* Email Input */}
            <div className="space-y-2">
              <label
                className="block font-body text-sm font-medium text-on-surface-variant ml-1"
                htmlFor="email"
              >
                Email
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
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label
                  className="block font-body text-sm font-medium text-on-surface-variant"
                  htmlFor="password"
                >
                  Kata Sandi
                </label>
                <Link
                  className="text-xs font-label text-primary hover:underline transition-all cursor-pointer"
                  to="/forgot-password"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MaterialIcon
                    icon="lock"
                    className="text-outline transition-colors group-focus-within:text-primary"
                  />
                </div>

                <input
                  className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-0 rounded-xl font-body text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container transition-all"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  <MaterialIcon icon={showPassword ? 'visibility_off' : 'visibility'} />
                </button>
              </div>
              <p className="text-[10px] font-label text-outline/60 mt-1 ml-1">
                Minimal 6 karakter diperlukan.
              </p>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-3 ml-1">
              <div className="relative flex items-center">
                <input
                  className="w-5 h-5 rounded border-outline-variant bg-surface-container-low text-primary focus:ring-primary focus:ring-offset-surface ring-offset-2"
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
              </div>
              <label
                className="font-body text-sm text-on-surface-variant cursor-pointer select-none"
                htmlFor="remember"
              >
                Ingat Saya
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="group relative w-full flex justify-center items-center py-4 px-6 bg-gradient-to-r from-primary to-primary-container rounded-xl font-headline font-bold text-on-primary shadow-[0_10px_20px_rgba(78,222,163,0.2)] hover:shadow-[0_15px_30px_rgba(78,222,163,0.3)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                id="login-submit"
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
                    <span className="tracking-wide">Masuk Sekarang</span>
                    <MaterialIcon
                      icon="arrow_forward"
                      className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <footer className="text-center pt-10 border-t border-outline-variant/10 mt-10">
            <p className="font-body text-on-surface-variant">
              Belum memiliki akun?{' '}
              <Link
                to="/register"
                className="font-headline font-bold text-primary hover:text-primary-fixed-dim transition-colors ml-1 underline decoration-primary/30 underline-offset-4"
              >
                Daftar Gratis
              </Link>
            </p>
          </footer>
        </section>

      </div>
    </AuthLayout>
  )
}
