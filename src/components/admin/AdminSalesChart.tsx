'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type DataPoint = { date: string; profit: number }

function formatTick(ore: number | string) {
  return `${(Number(ore) / 100).toFixed(0)} kr`
}

function formatDateStr(date: string) {
  return new Date(date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })
}

export function AdminSalesChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return <p className="text-center text-gray-400 py-12">Ingen data att visa ännu</p>
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tickFormatter={formatDateStr} tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatTick} tick={{ fontSize: 11 }} width={60} />
        <Tooltip
          formatter={(v: unknown) => [`${(Number(v) / 100).toFixed(0)} kr`, 'Vinst']}
          labelFormatter={(label: unknown) => formatDateStr(String(label))}
        />
        <Area
          type="monotone"
          dataKey="profit"
          stroke="#16a34a"
          strokeWidth={2}
          fill="url(#profitGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
