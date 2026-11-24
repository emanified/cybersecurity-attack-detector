const API_URL = 'http://localhost:5001'

export async function fetchNFAList() {
  const res = await fetch(`${API_URL}/nfa`)
  if (!res.ok) throw new Error('failed to load NFA list')
  return res.json()
}

export async function fetchConversion(id) {
  const res = await fetch(`${API_URL}/nfa/${id}/dfa`)
  if (!res.ok) throw new Error(`failed to convert NFA ${id}`)
  return res.json()
}
