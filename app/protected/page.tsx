import { createClient } from '@/lib/supabase/server'
import BookmarkDashboard from '@/components/BookmarkDashboard'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <BookmarkDashboard
      userEmail={user?.email ?? ''}
      userName={user?.user_metadata?.full_name ?? user?.email ?? 'User'}
      userAvatar={user?.user_metadata?.avatar_url ?? null}
    />
  )
}
