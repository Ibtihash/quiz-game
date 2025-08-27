export default function ProgressBar({ value=0 }){
return (
<div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
<div className="h-full bg-brand-600 transition-all" style={{ width: `${value}%` }} />
</div>
)
}