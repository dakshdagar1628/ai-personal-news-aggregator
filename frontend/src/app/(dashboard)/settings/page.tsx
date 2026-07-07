'use client'
import { useState, useEffect } from 'react'
import { InsightPanel } from '@/components/intelligence/InsightPanel'
import { Settings } from 'lucide-react'

interface AppSettings { theme:'dark'|'light'|'system'; defaultRange:'today'|'week'|'month'; }
const DEFAULTS: AppSettings = { theme:'dark', defaultRange:'today' };

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  useEffect(()=>{ const s = localStorage.getItem('ai_settings'); if(s){try{setSettings(JSON.parse(s));}catch{}} },[]);
  const save = (next: AppSettings) => { setSettings(next); localStorage.setItem('ai_settings', JSON.stringify(next)); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your intelligence platform</p></div>
      <InsightPanel title="Preferences" icon={Settings}>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium block mb-2">Theme</label>
            <div className="flex gap-2">
              {(['dark','light','system'] as const).map(t=>(
                <button key={t} onClick={()=>save({...settings,theme:t})}
                  className={`px-3 py-1.5 text-xs rounded-lg border capitalize transition-colors ${settings.theme===t?'bg-primary text-primary-foreground border-primary':'border-border hover:border-primary/50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Default Timeline Range</label>
            <div className="flex gap-2">
              {(['today','week','month'] as const).map(r=>(
                <button key={r} onClick={()=>save({...settings,defaultRange:r})}
                  className={`px-3 py-1.5 text-xs rounded-lg border capitalize transition-colors ${settings.defaultRange===r?'bg-primary text-primary-foreground border-primary':'border-border hover:border-primary/50'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </InsightPanel>
      <InsightPanel title="Platform Info" icon={Settings}>
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between"><span>Version</span><span className="text-foreground">1.0.0</span></div>
          <div className="flex justify-between"><span>Collectors</span><span className="text-foreground">39</span></div>
          <div className="flex justify-between"><span>Processing Engine</span><span className="text-foreground">Phase 6 — Claude</span></div>
          <div className="flex justify-between"><span>Report Engine</span><span className="text-foreground">Phase 7 — Active</span></div>
        </div>
      </InsightPanel>
    </div>
  )
}
