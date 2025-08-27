const API = {
async getQuestions(params = {}){
const q = new URLSearchParams(params).toString();
const res = await fetch(`/api/questions?${q}`)
if(!res.ok) throw new Error('Failed to load questions')
return res.json()
},
async postScore(payload){
const res = await fetch('/api/scores', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
if(!res.ok) throw new Error('Failed to submit score')
return res.json()
},
async getTop(limit=20){
const res = await fetch(`/api/scores/top?limit=${limit}`)
if(!res.ok) throw new Error('Failed to load leaderboard')
return res.json()
}
}
export default API