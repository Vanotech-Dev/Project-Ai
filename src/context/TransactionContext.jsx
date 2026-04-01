import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/api'
import { authClient } from '../lib/authClient'

const CATEGORY_MAP = {
  food: { icon: 'restaurant', label: 'Makanan & Minuman', iconBg: 'bg-surface-container-highest', iconColor: 'text-tertiary' },
  transport: { icon: 'directions_car', label: 'Transportasi', iconBg: 'bg-surface-container-highest', iconColor: 'text-primary' },
  bills: { icon: 'payments', label: 'Tagihan', iconBg: 'bg-surface-container-highest', iconColor: 'text-secondary' },
  entertainment: { icon: 'movie', label: 'Hiburan', iconBg: 'bg-surface-container-highest', iconColor: 'text-tertiary' },
  shopping: { icon: 'shopping_bag', label: 'Belanja', iconBg: 'bg-surface-container-highest', iconColor: 'text-secondary' },
  health: { icon: 'health_and_safety', label: 'Kesehatan', iconBg: 'bg-surface-container-highest', iconColor: 'text-primary' },
  education: { icon: 'school', label: 'Edukasi', iconBg: 'bg-surface-container-highest', iconColor: 'text-tertiary' },
  salary: { icon: 'work', label: 'Jajan', iconBg: 'bg-primary/20', iconColor: 'text-primary' },
  home: { icon: 'home', label: 'Rumah', iconBg: 'bg-surface-container-highest', iconColor: 'text-secondary' },
  other: { icon: 'more_horiz', label: 'Lainnya', iconBg: 'bg-surface-container-highest', iconColor: 'text-on-surface-variant' },
}

const TransactionContext = createContext()

export function TransactionProvider({ children }) {
  const { data: session } = authClient.useSession()
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchTransactions = useCallback(async () => {
    if (!session) {
      setTransactions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await api.get('/api/transactions')
      const data = response.data

      const formatted = data.map((tx) => {
        const catInfo = CATEGORY_MAP[tx.categoryKey] || CATEGORY_MAP.other
        const amountDisplay = 'Rp ' + tx.amount.toLocaleString('id-ID')

        // Build Date Label
        const dateObj = new Date(tx.date)
        const dateStr = dateObj.toISOString().split('T')[0]

        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        const day = dateObj.getDate()
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        const monthStr = months[dateObj.getMonth()]

        let dateLabel
        if (dateStr === today) {
          dateLabel = `Hari Ini, ${day} ${monthStr}`
        } else if (dateStr === yesterday) {
          dateLabel = `Kemarin, ${day} ${monthStr}`
        } else {
          dateLabel = `${day} ${monthStr} ${dateObj.getFullYear()}`
        }

        const time = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`

        return {
          id: tx.id,
          name: tx.notes || catInfo.label,
          category: tx.type === 'income' ? 'Pemasukan' : catInfo.label,
          categoryKey: tx.categoryKey,
          rawDate: dateStr,
          time,
          date: dateStr,
          dateLabel,
          amount: tx.amount,
          amountDisplay,
          type: tx.type,
          icon: catInfo.icon,
          iconBg: tx.type === 'income' ? 'bg-primary/20' : catInfo.iconBg,
          iconColor: tx.type === 'income' ? 'text-primary' : catInfo.iconColor,
          filled: tx.type === 'income',
        }
      })

      setTransactions(formatted)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const addTransaction = async ({ type, amount, categoryKey, date, notes }) => {
    try {
      const amountNum = typeof amount === 'string' ? parseInt(amount.replace(/\./g, ''), 10) : amount;

      await api.post('/api/transactions', {
        type,
        amount: amountNum || 0,
        categoryKey,
        date: new Date(date).toISOString(),
        notes
      })

      fetchTransactions()
    } catch (error) {
      console.error("Failed to add transaction", error)
      throw error
    }
  }

  const editTransaction = async (txId, { type, amount, categoryKey, date, notes }) => {
    try {
      const amountNum = typeof amount === 'string' ? parseInt(amount.replace(/\./g, ''), 10) : amount;

      await api.put(`/api/transactions/${txId}`, {
        type,
        amount: amountNum || 0,
        categoryKey,
        date: new Date(date).toISOString(),
        notes
      })

      fetchTransactions()
    } catch (error) {
      console.error("Failed to edit transaction", error)
      throw error
    }
  }

  const deleteTransaction = async (txId) => {
    try {
      await api.delete(`/api/transactions/${txId}`)
      fetchTransactions()
    } catch (error) {
      console.error("Failed to delete transaction", error)
      throw error
    }
  }

  return (
    <TransactionContext.Provider value={{ transactions, isLoading, addTransaction, editTransaction, deleteTransaction, refreshTransactions: fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider')
  return ctx
}
