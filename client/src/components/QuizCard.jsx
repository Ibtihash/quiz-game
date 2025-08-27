export default function QuizCard({ q, index, total, onAnswer, selected }){
return (
<div className="card p-6">
<div className="flex items-center justify-between gap-4">
<span className="badge">{q.category} • {q.difficulty}</span>
<span className="text-sm text-slate-400">Question {index+1} / {total}</span>
</div>
<h2 className="text-2xl font-semibold mt-3">{q.question}</h2>


<div className="mt-5 grid gap-3">
{q.options.map(opt => (
<button key={opt.label}
onClick={()=>onAnswer(opt.label)}
className={`btn btn-secondary justify-start text-left ${selected===opt.label && 'ring-2 ring-brand-600'}`}>
<span className="badge mr-2">{opt.label}</span>
{opt.text}
</button>
))}
</div>
</div>
)
}