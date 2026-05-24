import { useState, useEffect } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import { 
  Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, 
  Search, Loader2 
} from 'lucide-react'
import Swal from 'sweetalert2'

// Updated interface matching your requested fields
interface AdminRecord {
  id: string
  username: string
  email: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

const darkSwal = Swal.mixin({
  background: '#171717', // neutral-900
  color: '#e5e5e5',      // neutral-200
  confirmButtonColor: '#4f46e5', // indigo-600
  cancelButtonColor: '#262626',  // neutral-800
  customClass: {
    popup: 'border border-neutral-800 rounded-2xl font-sans text-xs',
    title: 'text-neutral-100 font-bold',
    htmlContainer: 'text-neutral-400',
    confirmButton: 'rounded-xl px-4 py-2 text-xs font-semibold',
    cancelButton: 'rounded-xl px-4 py-2 text-xs font-semibold text-neutral-400 border border-neutral-800'
  }
})

export default function AdminPage() {
  // 1. Control States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 2. Data States
  const [records, setRecords] = useState<AdminRecord[]>([])
  const [localDatabase, setLocalDatabase] = useState<AdminRecord[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null)
  
  // Form Field States (Includes password)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: ''
  })

  // Initialize updated dummy data matching the new columns
  useEffect(() => {
    const mockDatabase = Array.from({ length: 24 }, (_, i) => {
      const dayStr = String(10 + (i % 20)).padStart(2, '0')
      return {
        id: `USR-${1000 + i}`,
        username: ['sarah_c', 'james_h', 'ripley_e', 'johndoe', 'marcus_w', 'kyle_r'][i % 6] + (i > 5 ? i : ''),
        email: ['sarah@skynet.com', 'james@hudson.dev', 'ripley@nostromo.org', 'john@gmail.com', 'marcus@cyber.io', 'kyle@resistance.net'][i % 6],
        phoneNumber: `+62 812-3456-78${String(10 + i).padStart(2, '0')}`,
        createdAt: `2026-05-${dayStr} 08:30`,
        updatedAt: `2026-05-${dayStr} 14:15`
      }
    })
    setLocalDatabase(mockDatabase)
  }, [])

  // Process data locally
  useEffect(() => {
    if (localDatabase.length === 0 && totalItems === 0) return

    const fetchServerData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))
        
        // Filter updated to track username, email, or phone layout
        const filtered = localDatabase.filter(item => 
          item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phoneNumber.includes(searchQuery)
        )

        const offset = (currentPage - 1) * pageSize
        const paginatedSlice = filtered.slice(offset, offset + pageSize)

        setRecords(paginatedSlice)
        setTotalItems(filtered.length)
      } catch (error) {
        console.error("Failed fetching data:", error)
        darkSwal.fire({
          icon: 'error',
          title: 'Sync Failed',
          text: 'There was a problem syncing your database changes.'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServerData()
  }, [currentPage, pageSize, searchQuery, localDatabase])

  const totalPages = Math.ceil(totalItems / pageSize)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  // --- CRUD Handlers ---

  const openAddModal = () => {
    setModalMode('add')
    setEditingRecord(null)
    setFormData({ username: '', password: '', email: '', phoneNumber: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (record: AdminRecord) => {
    setModalMode('edit')
    setEditingRecord(record)
    setFormData({
      username: record.username,
      password: '', // Kept empty as it's optional for edit layouts
      email: record.email,
      phoneNumber: record.phoneNumber
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    darkSwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this account removal!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setLocalDatabase(prev => prev.filter(item => item.id !== id))
          darkSwal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The user registry has been cleared.',
            timer: 2000,
            showConfirmButton: false
          })
        } catch {
          darkSwal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong while trying to delete.'
          })
        }
      }
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Enforce password visibility restriction for "add" only
    if (!formData.username.trim() || !formData.email.trim() || !formData.phoneNumber.trim() || (modalMode === 'add' && !formData.password)) {
      darkSwal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please populate all mandatory form parameters.'
      })
      return
    }

    const currentTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16)

    try {
      if (modalMode === 'add') {
        const newId = `USR-${1000 + localDatabase.length + Math.floor(Math.random() * 1000)}`
        const newRecord: AdminRecord = {
          id: newId,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp
        }
        setLocalDatabase(prev => [newRecord, ...prev])
        setCurrentPage(1)

        darkSwal.fire({
          icon: 'success',
          title: 'Account Created',
          text: 'New credentials set correctly.',
          timer: 1800,
          showConfirmButton: false
        })
      } else if (modalMode === 'edit' && editingRecord) {
        setLocalDatabase(prev => prev.map(item => 
          item.id === editingRecord.id 
            ? { 
                ...item, 
                username: formData.username,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                updatedAt: currentTimestamp 
              }
            : item
        ))

        darkSwal.fire({
          icon: 'success',
          title: 'Changes Applied',
          text: 'The user account updates are now active.',
          timer: 1800,
          showConfirmButton: false
        })
      }
      setIsModalOpen(false)
    } catch {
      darkSwal.fire({
        icon: 'error',
        title: 'Execution Interrupted',
        text: 'An error occurred while saving states.'
      })
    }
  }

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Admin Operations Management</h1>
          <p className="text-xs text-neutral-500 mt-1">Review, add, modify, or remove admin account directories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-all group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Add New User
        </button>
      </div>

      {/* DATATABLE CONTAINER */}
      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        
        {/* Table Top Controls */}
        <div className="p-5 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-xs w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search username, email or phone..." 
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Show</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={20}>20 entries</option>
            </select>
          </div>
        </div>

        {/* The Responsive Table View */}
        <div className="overflow-x-auto relative min-h-[250px]">
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xxs flex items-center justify-center z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-indigo-400 shadow-xl">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium font-mono">Syncing database...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/60 bg-neutral-900/20 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="py-3.5 px-6">ID</th>
                <th className="py-3.5 px-6">Username</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Phone Number</th>
                <th className="py-3.5 px-6">Created At</th>
                <th className="py-3.5 px-6">Updated At</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40 text-xs text-neutral-300">
              {records.length > 0 ? (
                records.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-neutral-500">{row.id}</td>
                    <td className="py-4 px-6 font-semibold text-neutral-200">{row.username}</td>
                    <td className="py-4 px-6 text-neutral-400">{row.email}</td>
                    <td className="py-4 px-6 font-mono text-neutral-400">{row.phoneNumber}</td>
                    <td className="py-4 px-6 font-mono text-neutral-500">{row.createdAt}</td>
                    <td className="py-4 px-6 font-mono text-neutral-500">{row.updatedAt}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(row)}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                          title="Edit row"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 font-medium">
                    No matching records discovered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500">
            Showing <span className="font-semibold text-neutral-300">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-neutral-300">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
            <span className="font-semibold text-neutral-300">{totalItems}</span> matching indices
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  disabled={isLoading}
                  className={`w-8 h-8 rounded-xl text-xs font-semibold font-mono transition-all ${currentPage === pageNumber ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'}`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0 || isLoading}
              className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL WINDOW VIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-100">
                {modalMode === 'add' ? 'Register New User Profile' : `Modify User Settings: ${editingRecord?.id}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Username</label>
                <input 
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="e.g. sarah_connor"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">
                  Password {modalMode === 'edit' && <span className="text-neutral-500 font-normal">(Optional)</span>}
                </label>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={modalMode === 'edit' ? "Leave blank to keep current password" : "••••••••"}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Phone Number</label>
                <input 
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="e.g. +62 812-3456-7890"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-md shadow-indigo-600/10 transition-colors"
                >
                  {modalMode === 'add' ? 'Save Record' : 'Apply Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}