'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

interface Props {
  userEmail: string
  userName: string
  userAvatar: string | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getFavicon(url: string) {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function BookmarkDashboard({ userEmail, userName, userAvatar }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  const { data: bookmarks, error, mutate } = useSWR<Bookmark[]>(
    '/api/bookmarks',
    fetcher,
    { refreshInterval: 3000, revalidateOnFocus: true, revalidateOnReconnect: true }
  )

  const filteredBookmarks = (bookmarks ?? []).filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    if (!title.trim() || !url.trim()) { setAddError('Both title and URL are required.'); return }
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }
    setAdding(true)
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), url: normalizedUrl }),
      })
      if (!res.ok) { const data = await res.json(); setAddError(data.error ?? 'Failed to add.'); return }
      setTitle(''); setUrl(''); mutate()
    } catch { setAddError('Network error. Please try again.')
    } finally { setAdding(false) }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' })
      if (res.ok) mutate()
    } catch { console.error('Delete failed') }
    finally { setDeletingId(null) }
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        body { background: #020817; font-family: 'DM Sans', sans-serif; margin: 0; }
        .aurora-bg { min-height: 100vh; background: #020817; position: relative; overflow-x: hidden; }
        .aurora-bg::before {
          content: ''; position: fixed; top: -40%; left: -20%; width: 80%; height: 80%;
          background: radial-gradient(ellipse, rgba(120,40,200,0.25) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
          animation: drift1 12s ease-in-out infinite alternate;
        }
        .aurora-bg::after {
          content: ''; position: fixed; bottom: -30%; right: -10%; width: 70%; height: 70%;
          background: radial-gradient(ellipse, rgba(0,180,200,0.18) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
          animation: drift2 15s ease-in-out infinite alternate;
        }
        @keyframes drift1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(5%,8%) scale(1.1); } }
        @keyframes drift2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-5%,-6%) scale(1.08); } }
        .aurora-orb {
          position: fixed; top: 30%; right: 15%; width: 400px; height: 400px;
          background: radial-gradient(ellipse, rgba(255,100,150,0.12) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
          animation: drift3 18s ease-in-out infinite alternate;
        }
        @keyframes drift3 { 0% { transform: translate(0,0); } 100% { transform: translate(-8%,10%); } }
        .content { position: relative; z-index: 1; }
        .glass-nav {
          background: rgba(255,255,255,0.04); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; z-index: 50;
        }
        .glass-card {
          background: rgba(255,255,255,0.04); backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 20px;
          transition: border-color 0.3s;
        }
        .glass-card:hover { border-color: rgba(255,255,255,0.14); }
        .gradient-title {
          font-family: 'Syne', sans-serif; font-weight: 800;
          background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #a8edea 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .gradient-btn {
          background: linear-gradient(135deg, #7c3aed, #4f46e5, #0ea5e9);
          background-size: 200% 200%; animation: gradientShift 4s ease infinite;
          border: none; color: white; font-family: 'DM Sans', sans-serif; font-weight: 500;
          cursor: pointer; transition: opacity 0.2s, transform 0.2s;
        }
        .gradient-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .gradient-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        @keyframes gradientShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .glass-input {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: white; font-family: 'DM Sans', sans-serif;
          font-size: 14px; padding: 10px 16px; width: 100%; transition: border-color 0.2s, background 0.2s; outline: none;
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.3); }
        .glass-input:focus { border-color: rgba(139,92,246,0.6); background: rgba(255,255,255,0.08); }
        .bookmark-item {
          padding: 16px 24px; display: flex; align-items: center; gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;
        }
        .bookmark-item:last-child { border-bottom: none; }
        .bookmark-item:hover { background: rgba(255,255,255,0.04); }
        .bookmark-item:hover .bookmark-actions { opacity: 1; }
        .bookmark-actions { opacity: 0; transition: opacity 0.2s; display: flex; gap: 4px; flex-shrink: 0; }
        .action-btn {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 6px; cursor: pointer; transition: background 0.2s, border-color 0.2s;
          color: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;
        }
        .action-btn:hover { background: rgba(139,92,246,0.2); border-color: rgba(139,92,246,0.4); color: #a78bfa; }
        .action-btn.delete:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171; }
        .favicon-wrap {
          width: 36px; height: 36px; background: rgba(255,255,255,0.08); border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;
        }
        .signout-btn {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px; color: rgba(255,255,255,0.6); font-family: 'DM Sans', sans-serif;
          font-size: 13px; padding: 6px 14px; cursor: pointer; transition: all 0.2s;
        }
        .signout-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); color: #f87171; }
        .badge {
          background: linear-gradient(135deg, rgba(139,92,246,0.3), rgba(14,165,233,0.3));
          border: 1px solid rgba(139,92,246,0.3); border-radius: 20px;
          padding: 2px 10px; font-size: 12px; color: #c4b5fd; font-family: 'DM Sans', sans-serif;
        }
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
        .search-input {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: white; font-size: 13px; padding: 8px 12px 8px 36px;
          width: 180px; outline: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .search-input:focus { border-color: rgba(139,92,246,0.5); background: rgba(255,255,255,0.08); width: 220px; }
        .empty-state { padding: 64px 24px; text-align: center; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dot-bounce { width: 8px; height: 8px; background: #a78bfa; border-radius: 50%; display: inline-block; animation: bounce 0.9s ease-in-out infinite; }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      <div className="aurora-bg">
        <div className="aurora-orb" />

        <nav className="glass-nav content">
          <div style={{ maxWidth:'900px', margin:'0 auto', padding:'12px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'34px', height:'34px', background:'linear-gradient(135deg,#7c3aed,#0ea5e9)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 20px rgba(124,58,237,0.4)' }}>
                <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <span className="gradient-title" style={{ fontSize:'18px' }}>Smart Bookmarks</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                {userAvatar ? (
                  <Image src={userAvatar} alt={userName} width={30} height={30} style={{ borderRadius:'50%', border:'2px solid rgba(139,92,246,0.5)' }} />
                ) : (
                  <div style={{ width:'30px', height:'30px', background:'linear-gradient(135deg,#7c3aed,#0ea5e9)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'600', color:'white' }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.7)', maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userName}</span>
              </div>
              <button className="signout-btn" onClick={handleSignOut} disabled={signingOut}>
                {signingOut ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </nav>

        <main className="content" style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px' }}>
          <div style={{ marginBottom:'32px' }}>
            <h1 className="gradient-title" style={{ fontSize:'36px', margin:'0 0 8px 0', lineHeight:1.2 }}>Your Bookmarks</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'14px', margin:0, fontFamily:"'DM Sans',sans-serif" }}>Save, organize, and access your links from anywhere</p>
          </div>

          <div className="glass-card" style={{ padding:'24px', marginBottom:'20px' }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:'15px', color:'rgba(255,255,255,0.8)', margin:'0 0 16px 0', display:'flex', alignItems:'center', gap:'8px' }}>
              <svg width="16" height="16" fill="none" stroke="#a78bfa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add a Bookmark
            </h2>
            <form onSubmit={handleAdd} style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <input className="glass-input" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} style={{ flex:'1', minWidth:'140px' }} />
              <input className="glass-input" type="text" placeholder="URL (e.g. github.com)" value={url} onChange={(e) => setUrl(e.target.value)} maxLength={2000} style={{ flex:'2', minWidth:'200px' }} />
              <button type="submit" disabled={adding} className="gradient-btn" style={{ borderRadius:'12px', padding:'10px 24px', fontSize:'14px', display:'flex', alignItems:'center', gap:'8px', whiteSpace:'nowrap' }}>
                {adding ? <span className="spinner" /> : <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                {adding ? 'Adding...' : 'Add'}
              </button>
            </form>
            {addError && <p style={{ marginTop:'10px', fontSize:'13px', color:'#f87171', display:'flex', alignItems:'center', gap:'6px' }}>{addError}</p>}
          </div>

          <div className="glass-card" style={{ overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:'15px', color:'rgba(255,255,255,0.85)' }}>Saved Links</span>
                <span className="badge">{bookmarks ? bookmarks.length : 0} saved</span>
              </div>
              {bookmarks && bookmarks.length > 0 && (
                <div className="search-wrap">
                  <svg className="search-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input className="search-input" type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              )}
            </div>

            {error ? (
              <div className="empty-state"><p style={{ color:'#f87171', fontSize:'14px' }}>Failed to load bookmarks</p></div>
            ) : !bookmarks ? (
              <div className="empty-state">
                <div style={{ display:'flex', gap:'6px', justifyContent:'center', marginBottom:'10px' }}>
                  {[0,1,2].map((i) => <span key={i} className="dot-bounce" style={{ animationDelay:`${i*0.18}s` }} />)}
                </div>
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'13px' }}>Loading...</p>
              </div>
            ) : filteredBookmarks.length === 0 ? (
              <div className="empty-state">
                <div style={{ width:'56px', height:'56px', margin:'0 auto 16px', background:'rgba(139,92,246,0.1)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(139,92,246,0.2)' }}>
                  <svg width="24" height="24" fill="none" stroke="#a78bfa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                </div>
                <p style={{ color:'rgba(255,255,255,0.6)', fontWeight:500, fontSize:'14px', margin:'0 0 4px' }}>{searchQuery ? 'No results found' : 'No bookmarks yet'}</p>
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:'13px', margin:0 }}>{searchQuery ? 'Try a different search term' : 'Add your first bookmark above!'}</p>
              </div>
            ) : (
              <ul style={{ listStyle:'none', margin:0, padding:0 }}>
                {filteredBookmarks.map((bookmark) => (
                  <li key={bookmark.id} className="bookmark-item">
                    <div className="favicon-wrap">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getFavicon(bookmark.url) ?? ''} alt="" width={18} height={18} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:'0 0 2px', fontWeight:500, fontSize:'14px', color:'rgba(255,255,255,0.9)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontFamily:"'DM Sans',sans-serif" }}>{bookmark.title}</p>
                      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'12px', color:'#818cf8', textDecoration:'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block' }}>{bookmark.url}</a>
                      <p style={{ margin:'3px 0 0', fontSize:'11px', color:'rgba(255,255,255,0.25)', fontFamily:"'DM Sans',sans-serif" }}>{formatDate(bookmark.created_at)}</p>
                    </div>
                    <div className="bookmark-actions">
                      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="action-btn" title="Open link">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                      <button className="action-btn delete" onClick={() => handleDelete(bookmark.id)} disabled={deletingId === bookmark.id} title="Delete">
                        {deletingId === bookmark.id ? <span className="spinner" style={{ width:'12px', height:'12px' }} /> : <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p style={{ textAlign:'center', fontSize:'12px', color:'rgba(255,255,255,0.2)', marginTop:'24px', fontFamily:"'DM Sans',sans-serif" }}>🔒 Your bookmarks are private — protected by Row Level Security</p>
        </main>
      </div>
    </>
  )
}