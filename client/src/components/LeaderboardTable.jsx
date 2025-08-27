export default function LeaderboardTable({ rows }){
return (
<div className="card overflow-hidden">
<table className="w-full text-left">
<thead className="bg-slate-900/60">
<tr>
<th className="px-4 py-3">#</th>
<th className="px-4 py-3">Player</th>
<th className="px-4 py-3">Score</th>
<th className="px-4 py-3">Total</th>
<th className="px-4 py-3">Accuracy</th>
<th className="px-4 py-3">When</th>
</tr>
</thead>
<tbody>
{rows.map((r, i)=> (
<tr key={r._id} className="border-t border-slate-800/60">
<td className="px-4 py-3 text-slate-400">{i+1}</td>
<td className="px-4 py-3 font-medium">{r.username}</td>
<td className="px-4 py-3">{r.score}</td>
<td className="px-4 py-3">{r.total}</td>
<td className="px-4 py-3">{r.accuracy}%</td>
<td className="px-4 py-3 text-slate-400">{new Date(r.createdAt).toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
</div>
)
}