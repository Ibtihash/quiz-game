import { Link, useLocation } from 'react-router-dom'


export default function Header(){
const { pathname } = useLocation()
return (
<header className="border-b border-slate-800/60 bg-slate-950/60 backdrop-blur sticky top-0 z-50">
<div className="container-pro py-4 flex items-center justify-between">
<Link to="/" className="flex items-center gap-3">
<div className="size-9 rounded-2xl bg-brand-600 grid place-items-center font-bold">Q</div>
<div>
<h1 className="text-lg font-semibold leading-tight">QuizMaster</h1>
<p className="text-xs text-slate-400 -mt-0.5">Test your knowledge</p>
</div>
</Link>
<nav className="flex items-center gap-2">
<Link to="/" className={`btn btn-secondary ${pathname==='/' && 'ring-2 ring-brand-600'}`}>Play</Link>
<Link to="/leaderboard" className={`btn btn-primary ${pathname==='/leaderboard' && 'ring-2 ring-brand-600'}`}>Leaderboard</Link>
</nav>
</div>
</header>
)
}