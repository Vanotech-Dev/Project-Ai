import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MaterialIcon from '../components/ui/MaterialIcon'
import { authClient } from '../lib/authClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email) {
      setErrorMsg('Silakan masukkan alamat email yang valid.')
      return
    }

    setIsLoading(true)

    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "forget-password"
    })

    setIsLoading(false)

    if (error) {
        setErrorMsg(error.message || "Gagal mengirim request reset sandi.")
        return
    }

    setSuccess(true)
    
    // Tunggu sebentar agar user bisa membaca pesan sukses, lalu arahkan ke Verify page
    setTimeout(() => {
        navigate('/verify', { state: { email } })
    }, 2000)
  }

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-container/10 rounded-full blur-[120px]"></div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-[440px] px-6 py-12 z-10 flex flex-col items-center">
        {/* Centered Card Container */}
        <div className="bg-[#312f5f]/60 backdrop-blur-[20px] rounded-xl p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/15 w-full">
          {/* Icon Representation */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shadow-[0_0_20px_rgba(78,222,163,0.15)]">
              <MaterialIcon icon="lock_reset" className="text-4xl" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center mb-10">
            <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight mb-3">
              Lupa Kata Sandi
            </h1>
            {!success ? (
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Masukkan email Anda untuk menerima kode verifikasi.
              </p>
            ) : (
              <p className="text-on-surface-variant text-sm leading-relaxed text-primary">
                Kami telah mengirimkan instruksi ke <br /><strong>{email}</strong>
              </p>
            )}
          </div>

          {!success ? (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="flex flex-col items-center text-center p-3 bg-error-container/20 border border-error/20 rounded-lg">
                  <MaterialIcon icon="error" className="text-error text-lg mb-1" />
                  <p className="text-sm font-body text-error">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="font-label text-xs uppercase tracking-widest text-on-surface-variant font-medium ml-1">
                  Alamat Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                    <MaterialIcon icon="mail" className="text-xl" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-outline/50 focus:ring-1 focus:ring-secondary/30 transition-all font-body"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-4 rounded-lg shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 uppercase tracking-wider text-sm flex justify-center items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Kirim Kode'
                )}
              </button>
            </form>
          ) : (
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="p-4 bg-primary/10 rounded-full border border-primary/20">
                <MaterialIcon icon="mark_email_read" className="text-primary text-4xl" />
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="mt-10 pt-8 border-t-2 border-surface-container-highest/30 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-primary hover:text-primary-fixed transition-colors font-medium text-sm">
              <MaterialIcon icon="arrow_back" className="text-lg" />
              Kembali ke Masuk
            </Link>
          </div>
        </div>

        {/* Decorative Text Overlay (Visual Anchor) */}
        <div className="mt-12 text-center">
          <p className="font-label text-[10px] text-outline/30 uppercase tracking-[0.4em]">
            Secure Kinetic Protocol v2.4
          </p>
        </div>
      </main>

      {/* Visual Embellishment: Geometric Background Image Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-overlay">
        <img
          alt="Abstract geometric network grid on dark background with subtle cyan highlights and deep shadows"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjpDRRC1BPHTeThCgCZW5ldEw0YVmVbQQAYFOzDCrS1uoDqcgINRxvz9SXmoA-IayBn9YL9BhmdPAkUDkqXzYIKaJr6l38LT4NYU1hnDhKxbM1m5lkS94Se_qXvh83-MvLK79q5i9tQPT9GAaoJMuMcnNPMZMeQNXlkM4_ohIu1fpYS7Afsobdr7tE7bHJoZMF3vFBq06sLGQTlAmJnUwVPFL-W-B5Q4Sy3qPXuxE5SXYwnRNnwM6IWJR4VZANdYfnXyN4cVqJBt4O"
        />
      </div>
    </div>
  )
}
