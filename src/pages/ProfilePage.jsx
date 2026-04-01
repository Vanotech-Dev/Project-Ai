import { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '../components/layouts/DashboardLayout'
import MaterialIcon from '../components/ui/MaterialIcon'
import { authClient } from '../lib/authClient'

export default function ProfilePage() {
  const { data: session } = authClient.useSession()
  const [activeTab, setActiveTab] = useState('personal')
  const [twoFA, setTwoFA] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await axios.get('/api/users/profile')
        setName(res.data.name || '')
        setEmail(res.data.email || '')
        setPhone(res.data.phone || '')
        setBio(res.data.bio || '')
        setTwoFA(!!res.data.twoFAEnabled)
      } catch (e) {
        console.error("Gagal memuat profil", e)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await axios.put('/api/users/profile', { name, phone, bio, twoFAEnabled: twoFA })
      alert("Profil berhasil disimpan!")
    } catch (e) {
      alert("Gagal menyimpan profil.")
      console.error(e)
    }
  }

  const TABS = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'security', label: 'Security' },
  ]

  return (
    <DashboardLayout activePage="profile">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium -mt-4">
        <a href="/settings" className="text-on-surface-variant hover:text-primary transition-colors font-body">Settings</a>
        <MaterialIcon icon="chevron_right" className="text-xs text-outline" />
        <span className="text-primary font-body">Edit Profile</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ===== Left Column: Profile Card ===== */}
        <div className="lg:col-span-4 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-full border-4 border-surface-container overflow-hidden shadow-2xl">
              <img
                alt="Profile avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSI3WjJsR_-AStGcxPG-MCfs5MqfxM3_FWAVPrYd37qu55dyx4VicJ1xdOltKg76wjA1CyvwGSNml6xELD4ArbaR-OXYc5oVjlYHzpClF1ZeKkzsmqjnwcc_A5wy8-c3QoBUfV20Cn-3npycEXgTre3fM0U_U6XxWpaVDstaFCFNigGGRqmNFThCLOlLIYMQFqAw8aXpCO_NPqSIPVyiaYl4yPZ2JMePSXtO_C13f1bgLrqT-YFFzCnR0lpHQxwbmXNnELJP4yIJAk"
              />
            </div>
            <button className="absolute bottom-2 right-2 p-3 bg-primary text-on-primary rounded-full shadow-xl hover:bg-primary-container transition-colors active:scale-90">
              <MaterialIcon icon="edit" />
            </button>
          </div>

          {/* Name & ID */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold font-headline text-on-surface tracking-tight">{name || 'User'}</h2>
            <p className="text-on-surface-variant font-label text-sm mt-1">ID: {session?.user?.id.split('-')[0].toUpperCase() || 'TRSRY-X'}</p>
          </div>

          {/* Account Security Card */}
          <div className="mt-8 w-full bg-surface-container-low rounded-xl p-6 text-left border border-outline-variant/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 font-headline">Account Security</h3>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-on-surface-variant">Two-Factor Auth</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">Active</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-on-surface-variant">Last Login</span>
              <span className="text-sm font-label text-on-surface">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* ===== Right Column: Edit Form ===== */}
        <div className="lg:col-span-8">
          {/* Tab Bar */}
          <div className="flex gap-4 mb-6 border-b border-outline-variant/10">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 text-sm font-body transition-colors ${
                  activeTab === tab.key
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {/* ===== Personal Info Form ===== */}
            {activeTab === 'personal' && (
            <div className="bg-surface-container rounded-xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <form className="space-y-6 relative z-10" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant font-body ml-1">Full Name</label>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-secondary/40 font-body transition-all"
                      placeholder="Enter full name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant font-body ml-1">Email Address</label>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-secondary/40 font-body transition-all"
                      placeholder="Enter email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant font-body ml-1">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg bg-surface-container-high text-on-surface-variant text-sm font-label border-r border-surface-container">
                      +62
                    </span>
                    <input
                      className="w-full bg-surface-container-lowest border-none rounded-r-lg p-4 text-on-surface focus:ring-2 focus:ring-secondary/40 font-label transition-all"
                      placeholder="Phone number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant font-body ml-1">Bio</label>
                  <textarea
                    className="w-full bg-surface-container-lowest border-none rounded-lg p-4 text-on-surface focus:ring-2 focus:ring-secondary/40 font-body transition-all resize-none"
                    placeholder="Tell us about yourself..."
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center gap-4 border-t border-outline-variant/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-[0_8px_20px_-4px_rgba(78,222,163,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(78,222,163,0.6)] active:scale-95 transition-all font-body"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto px-8 py-4 bg-surface-container-highest text-on-surface-variant font-semibold rounded-lg hover:text-on-surface transition-all active:scale-95 font-body"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            )}

            {/* ===== Security Settings ===== */}
            {activeTab === 'security' && (
            <div className="bg-surface-container rounded-xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
              <h3 className="text-xl font-bold text-on-surface font-headline mb-6 flex items-center gap-2">
                <MaterialIcon icon="security" className="text-primary" />
                Security Settings
              </h3>

              <div className="space-y-8 relative z-10">
                {/* 2FA & Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Authentication */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-widest font-headline">Authentication</h4>
                    <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
                      <div className="flex items-center gap-3">
                        <MaterialIcon icon="phonelink_lock" className="text-on-surface-variant" />
                        <span className="text-sm font-body font-medium">Two-Factor Auth</span>
                      </div>
                      {/* Toggle Switch */}
                      <label className="relative inline-block w-11 h-6 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFA}
                          onChange={() => setTwoFA(!twoFA)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface-variant rounded-full peer-checked:bg-primary transition-colors" />
                        <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full transition-transform ${twoFA ? 'translate-x-5' : ''}`} />
                      </label>
                    </div>
                    <p className="text-xs text-on-surface-variant px-1">
                      Extra security for your account by requiring a code from your mobile device.
                    </p>
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-primary uppercase tracking-widest font-headline">Password</h4>
                    <button className="w-full flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/20 hover:border-primary/40 transition-colors group">
                      <div className="flex items-center gap-3">
                        <MaterialIcon icon="lock_reset" className="text-on-surface-variant" />
                        <span className="text-sm font-body font-medium">Update Password</span>
                      </div>
                      <MaterialIcon icon="chevron_right" className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-xs text-on-surface-variant px-1">
                      Last updated 3 months ago. We recommend changing it periodically.
                    </p>
                  </div>
                </div>

                {/* Login Activity */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest font-headline">Recent Login Activity</h4>
                  <div className="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10">
                    <div className="divide-y divide-outline-variant/10">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded text-primary">
                            <MaterialIcon icon="laptop_mac" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">Chrome on MacOS</p>
                            <p className="text-xs text-on-surface-variant">Jakarta, ID • 103.121.23.4 • Current Session</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded">ONLINE</span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-surface-variant rounded text-on-surface-variant">
                            <MaterialIcon icon="phone_iphone" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">iPhone 15 Pro</p>
                            <p className="text-xs text-on-surface-variant">Surabaya, ID • 182.253.4.12 • 2 hours ago</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-error hover:underline transition-all">Sign Out</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="text-sm font-bold text-primary hover:text-primary-container transition-colors flex items-center gap-1">
                      <MaterialIcon icon="logout" className="text-sm" />
                      Sign out of all other sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
