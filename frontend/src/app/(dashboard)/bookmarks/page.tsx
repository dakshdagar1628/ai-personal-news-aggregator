'use client'
import { useEffect, useState } from 'react'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { Bookmark, Trash2 } from 'lucide-react'

interface BookmarkItem { id:string; title:string; url:string; type:string; savedAt:string }

export default function BookmarksPage() {
  const [items, setItems] = useState<BookmarkItem[]>([]);
  useEffect(()=>{ const s = localStorage.getItem('ai_bookmarks'); if (s) { try { setItems(JSON.parse(s)); } catch {} } },[]);
  const remove = (id:string) => {
    const next = items.filter(i=>i.id!==id);
    setItems(next); localStorage.setItem('ai_bookmarks', JSON.stringify(next));
  };
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Bookmarks</h1>
        <p className="text-sm text-muted-foreground mt-1">{items.length} saved items</p></div>
      <InsightPanel title="Saved Items" icon={Bookmark}>
        {items.length===0
          ? <p className="text-sm text-muted-foreground text-center py-6">No bookmarks yet. Click the bookmark icon on any card to save it here.</p>
          : <div className="space-y-2">
            {items.map(item=>(
              <div key={item.id} className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
                <div className="flex-1 min-w-0">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors line-clamp-1">{item.title}</a>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.type} · {new Date(item.savedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={()=>remove(item.id)} className="text-muted-foreground hover:text-red-400 transition-colors shrink-0"><Trash2 size={13}/></button>
              </div>
            ))}
          </div>}
      </InsightPanel>
    </div>
  )
}
