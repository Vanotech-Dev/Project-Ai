/**
 * AuthLayout - Shared layout wrapper for authentication pages (Login, Register)
 * Provides the dark background with ambient glow effects
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center overflow-x-hidden relative">
      {/* Background ambient glow elements */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-background" />
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-secondary-container/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-primary/5 blur-[120px] rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <main className="w-full max-w-xl px-6 py-12 z-10">
        {children}
      </main>
    </div>
  )
}
