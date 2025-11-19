export const api = {
  async getTransactions() {
    const res = await fetch('/api/transactions')
    if (!res.ok) throw new Error('Failed to fetch transactions')
    return await res.json()
  },

  async addTransaction(tx) {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to add transaction: ${text}`)
    }
    return await res.json()
  },

  async deleteTransaction(id) {
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete transaction')
    return true
  },
}
