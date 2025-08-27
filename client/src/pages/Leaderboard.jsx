import { useEffect, useState } from 'react'
import API from '../api'
import LeaderboardTable from '../components/LeaderboardTable'


export default function Leaderboard(){
const [rows, setRows] = useState([])
const [loading, setLoading] = useState(true)


useEffect(()=>{
(async()=>{
try{
const data = await API.getTop(50)
setRows(data)
}catch(e){
alert(e.message)
}finally{
setLoading(false)
}
})()
},[])


return (
<div className="grid gap-6">
<h2 className="text-3xl font-bold">Leaderboard</h2>
{loading ? <p>Loading…</p> : (
rows.length ? <LeaderboardTable rows={rows} /> : <p>No scores yet. Be the first!</p>
)}
</div>
)
}