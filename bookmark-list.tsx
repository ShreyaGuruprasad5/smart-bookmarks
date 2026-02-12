'use client'

import { useEffect, useState } from 'react'
import { Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useSWR from 'swr'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function BookmarkList({ refreshKey }: { refreshKey: number }) {
  const { data: bookmarks, mutate } = useSWR(
    `/api/bookmarks?refresh=${refreshKey}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 0,
    }
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    try {
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete bookmark')
      }

      mutate()
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      alert('Failed to delete bookmark')
    }
  }

  if (!bookmarks) {
    return <div className="text-center py-8">Loading bookmarks...</div>
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookmarks yet. Add one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {bookmarks.map((bookmark: Bookmark) => (
        <div
          key={bookmark.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline truncate block"
            >
              {bookmark.url}
            </a>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-200 rounded"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(bookmark.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
