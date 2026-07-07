import { Newspaper, Github, Wrench, FileText, CheckCircle, Zap } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard title="News Today"     value="48"  description="across all sources"  icon={Newspaper}    trend={{ value: 12, label: 'vs yesterday' }} />
      <StatCard title="Repos Trending" value="25"  description="on GitHub"           icon={Github}       trend={{ value: 5,  label: 'vs yesterday' }} />
      <StatCard title="New Tools"      value="12"  description="from Product Hunt"   icon={Wrench}       trend={{ value: 8,  label: 'vs yesterday' }} />
      <StatCard title="Papers"         value="7"   description="new today"           icon={FileText}     trend={{ value: 3,  label: 'vs yesterday' }} />
      <StatCard title="Sources Active" value="15"  description="of 15 configured"    icon={CheckCircle}  iconColor="text-emerald-500" />
      <StatCard title="Report Status"  value="Ready" description="generated 5:30am" icon={Zap}          iconColor="text-amber-500" />
    </div>
  )
}
