import { Link } from 'react-router-dom'


export default function Home(){
return (
<div className="grid gap-8">
<section className="text-center">
<h2 className="text-4xl font-bold">Welcome to <span className="text-brand-500">Think & Play</span></h2>
<p className="text-slate-300 mt-2">10 random questions. 1 goal — score as high as you can.</p>
</section>


<div className="grid md:grid-cols-3 gap-6">
{[{title:'Fast',desc:'Blazing-fast SPA with Vite'}, {title:'Fair',desc:'Questions sampled randomly'}, {title:'Global',desc:'Worldwide leaderboard'}].map((f)=> (
<div className="card p-6" key={f.title}>
<h3 className="text-xl font-semibold">{f.title}</h3>
<p className="text-slate-300 mt-1">{f.desc}</p>
</div>
))}
</div>


<div className="flex items-center justify-center gap-3">
<Link to="/quiz" className="btn btn-primary text-lg px-6 py-3">Start Quiz</Link>
<Link to="/leaderboard" className="btn btn-secondary">View Leaderboard</Link>
</div>
</div>
)
}