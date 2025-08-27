import { useLocation, Link } from 'react-router-dom'


export default function Results(){
const { state } = useLocation()
const { score=0, total=0 } = state || {}


return (
<div className="grid gap-6 max-w-xl mx-auto text-center">
<div className="card p-8">
<h2 className="text-3xl font-bold">Your Results</h2>
<p className="text-slate-300 mt-2">Great try! Keep practicing and climb the leaderboard.</p>
<div className="mt-6 text-5xl font-extrabold">{score} / {total}</div>
<div className="mt-2 text-slate-400">Accuracy: {total? Math.round((score/total)*100):0}%</div>
<div className="mt-6 flex justify-center gap-3">
<Link to="/quiz" className="btn btn-primary">Play Again</Link>
<Link to="/leaderboard" className="btn btn-secondary">Leaderboard</Link>
</div>
</div>
</div>
)
}