const API_URL = 'http://localhost:5001'

export async function fetchDFAList() {
  const res = await fetch(`${API_URL}/dfa`)
  if (!res.ok) throw new Error('failed to load DFA list')
  return res.json()
}

export async function fetchDFA(id, variant) {
  const qs = variant ? `?variant=${encodeURIComponent(variant)}` : ''
  const res = await fetch(`${API_URL}/dfa/${id}${qs}`)
  if (!res.ok) throw new Error(`failed to load DFA ${id}`)
  return res.json()
}
