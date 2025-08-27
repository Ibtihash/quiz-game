import { useEffect, useState } from 'react'


export default function UsernameModal({ open, onSubmit }){
const [name, setName] = useState('')


useEffect(()=>{
if(open){ setName(localStorage.getItem('quiz_username') || '') }
},[open])


if(!open) return null
return (
<div className="fixed inset-0 bg-black/70 grid place-items-center z-50">
<div className="card p-6 w-full max-w-md">
<h3 className="text-xl font-semibold">Enter your username</h3>
<p className="text-sm text-slate-400 mt-1">Scores will appear on the global leaderboard.</p>
<input className="input mt-4" placeholder="e.g. CodeNinja"
value={name} onChange={e=>setName(e.target.value)} />
<div className="mt-4 flex gap-2">
<button className="btn btn-primary flex-1" onClick={()=>{
const v = name.trim().slice(0,24)
if(!v) return
localStorage.setItem('quiz_username', v)
onSubmit(v)
}}>Save & Continue</button>
<button className="btn btn-secondary" onClick={()=>onSubmit(null)}>Skip</button>
</div>
</div>
</div>
)
}