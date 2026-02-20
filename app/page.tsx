'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Login error:', error)
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020817; font-family: 'DM Sans', sans-serif; }

        .login-bg {
          min-height: 100vh;
          background: #020817;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        /* Aurora blobs */
        .blob1 {
          position: fixed; top: -20%; left: -10%;
          width: 600px; height: 600px;
          background: radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
          animation: float1 14s ease-in-out infinite alternate;
        }
        .blob2 {
          position: fixed; bottom: -20%; right: -10%;
          width: 500px; height: 500px;
          background: radial-gradient(ellipse, rgba(14,165,233,0.22) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
          animation: float2 17s ease-in-out infinite alternate;
        }
        .blob3 {
          position: fixed; top: 40%; left: 50%;
          width: 400px; height: 400px;
          background: radial-gradient(ellipse, rgba(236,72,153,0.12) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
          animation: float3 20s ease-in-out infinite alternate;
        }
        @keyframes float1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(6%,8%) scale(1.1); } }
        @keyframes float2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-6%,-8%) scale(1.08); } }
        @keyframes float3 { 0% { transform: translate(-50%, -50%) scale(1); } 100% { transform: translate(-45%, -55%) scale(1.15); } }

        /* Grid overlay */
        .grid-overlay {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: 
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        .card {
          position: relative; z-index: 10;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 28px;
          padding: 48px 44px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 0 80px rgba(124,58,237,0.15), 0 0 0 1px rgba(255,255,255,0.05) inset;
          animation: cardIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .icon-wrap {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, #7c3aed, #0ea5e9);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 0 40px rgba(124,58,237,0.5);
          animation: iconPulse 3s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%,100% { box-shadow: 0 0 30px rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 60px rgba(124,58,237,0.7); }
        }

        .welcome-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(14,165,233,0.2));
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 12px;
          color: #c4b5fd;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
        }

        .main-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 38px;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 0%, #e0c3fc 40%, #8ec5fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
        }

        .subtitle {
          font-size: 15px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin-bottom: 36px;
          font-family: 'DM Sans', sans-serif;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 36px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
        }

        .feature-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #0ea5e9);
          flex-shrink: 0;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin-bottom: 28px;
        }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 14px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }

        .google-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(14,165,233,0.15));
          opacity: 0;
          transition: opacity 0.25s;
        }

        .google-btn:hover::before { opacity: 1; }

        .google-btn:hover {
          border-color: rgba(139,92,246,0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(124,58,237,0.2);
        }

        .google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #a78bfa;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .footer-note {
          margin-top: 24px;
          text-align: center;
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
        }

        /* Floating particles */
        .particle {
          position: fixed;
          width: 3px; height: 3px;
          background: rgba(139,92,246,0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          animation: particleFloat linear infinite;
        }
        @keyframes particleFloat {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
      `}</style>

      {/* Background layers */}
      <div className="login-bg">
        <div className="blob1" />
        <div className="blob2" />
        <div className="blob3" />
        <div className="grid-overlay" />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${10 + i * 12}%`,
              animationDuration: `${8 + i * 2}s`,
              animationDelay: `${i * 1.2}s`,
              width: i % 3 === 0 ? '4px' : '2px',
              height: i % 3 === 0 ? '4px' : '2px',
              background: i % 2 === 0 ? 'rgba(139,92,246,0.7)' : 'rgba(14,165,233,0.7)',
            }}
          />
        ))}

        {/* Card */}
        <div className="card">
          <div style={{ textAlign: 'center' }}>
            <div className="icon-wrap">
              <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <span className="welcome-tag">
                <span>✦</span>
                Welcome to Smart Bookmarks
              </span>
            </div>

            <h1 className="main-title">
              Your links,<br />organized.
            </h1>

            <p className="subtitle">
              Save anything, access it anywhere.<br />
              Private by default, yours forever.
            </p>
          </div>

          {/* Feature list */}
          <div className="features">
            {[
              'Save any URL with a custom title',
              'Private bookmarks — only you can see them',
              'Real-time sync across all your tabs',
            ].map((f, i) => (
              <div key={i} className="feature-item">
                <div className="feature-dot" />
                {f}
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Google Sign In */}
          <button
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <p className="footer-note">
            🔒 Your bookmarks are private and secure.<br />
            No spam, no tracking, just your links.
          </p>
        </div>
      </div>
    </>
  )
}