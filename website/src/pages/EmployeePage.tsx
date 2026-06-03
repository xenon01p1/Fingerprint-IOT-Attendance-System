import { useState, useEffect } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import { 
  Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, 
  Search, Loader2, Zap, XCircle 
} from 'lucide-react'
import Swal from 'sweetalert2'

// Interface representing the explicit Employee fields
interface EmployeeRecord {
  employeeNumber: string // Serves as the unique ID / Identifier
  fullName: string
  username: string
  email: string
  phone: string
  role: string
  employeeStatus: 'Active' | 'On Leave' | 'Suspended' | 'Terminated'
  fingerprintIndex: number | null // Optional fingerprint index
}

const darkSwal = Swal.mixin({
  background: '#171717', 
  color: '#e5e5e5',      
  confirmButtonColor: '#4f46e5', 
  cancelButtonColor: '#262626',  
  customClass: {
    popup: 'border border-neutral-800 rounded-2xl font-sans text-xs',
    title: 'text-neutral-100 font-bold',
    htmlContainer: 'text-neutral-400',
    confirmButton: 'rounded-xl px-4 py-2 text-xs font-semibold',
    cancelButton: 'rounded-xl px-4 py-2 text-xs font-semibold text-neutral-400 border border-neutral-800'
  }
})

export default function EmployeePage() {
  // 1. Control States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 2. Data States
  const [records, setRecords] = useState<EmployeeRecord[]>([])
  const [localDatabase, setLocalDatabase] = useState<EmployeeRecord[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingRecord, setEditingRecord] = useState<EmployeeRecord | null>(null)
  
  // Form Field States explicitly tailored for creation & adjustment parameters
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    role: '',
    employeeStatus: 'Active'
  })

  // Populate localized dummy structure matching requirements
  useEffect(() => {
    const mockDatabase = Array.from({ length: 24 }, (_, i) => {
      const statuses: EmployeeRecord['employeeStatus'][] = ['Active', 'On Leave', 'Suspended', 'Active']
      return {
        employeeNumber: `EMP-${202600 + i}`,
        fullName: ['Sarah Connor', 'James Hudson', 'Ellen Ripley', 'John Doe', 'Marcus Wright', 'Kyle Reese'][i % 6],
        username: ['sarah_c', 'james_h', 'ripley_e', 'johndoe', 'marcus_w', 'kyle_r'][i % 6] + (i > 5 ? i : ''),
        email: ['sarah@skynet.com', 'james@hudson.dev', 'ripley@nostromo.org', 'john@gmail.com', 'marcus@cyber.io', 'kyle@resistance.net'][i % 6],
        phone: `+62 812-5555-88${String(10 + i).padStart(2, '0')}`,
        role: ['SecOps Lead', 'Cloud Engineer', 'Director', 'Frontend Dev', 'QA Engineer', 'Systems Analyst'][i % 6],
        employeeStatus: statuses[i % 4],
        fingerprintIndex: i % 3 === 0 ? null : Math.floor(Math.random() * 10) // Some employees have fingerprints, some don't
      }
    })
    setLocalDatabase(mockDatabase)
  }, [])

  // Process sorting, matching criteria and pagination slices
  useEffect(() => {
    if (localDatabase.length === 0 && totalItems === 0) return

    const fetchServerData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 300))
        
        const filtered = localDatabase.filter(item => 
          item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.role.toLowerCase().includes(searchQuery.toLowerCase())
        )

        const offset = (currentPage - 1) * pageSize
        const paginatedSlice = filtered.slice(offset, offset + pageSize)

        setRecords(paginatedSlice)
        setTotalItems(filtered.length)
      } catch (error) {
        console.error("Failed fetching records:", error)
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

  // --- CRUD Actions ---

  const openAddModal = () => {
    setModalMode('add')
    setEditingRecord(null)
    setFormData({ 
      fullName: '', username: '', password: '', 
      email: '', phone: '', role: '', employeeStatus: 'Active' 
    })
    setIsModalOpen(true)
  }

  const openEditModal = (record: EmployeeRecord) => {
    setModalMode('edit')
    setEditingRecord(record)
    setFormData({
      fullName: record.fullName,
      username: record.username,
      password: '', // Optional during edit phase
      email: record.email,
      phone: record.phone,
      role: record.role,
      employeeStatus: record.employeeStatus
    })
    setIsModalOpen(true)
  }

  const handleDelete = (empNum: string) => {
    darkSwal.fire({
      title: 'Are you sure?',
      text: `You are archiving payroll profile reference: ${empNum}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm Removal',
      cancelButtonText: 'Abort',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setLocalDatabase(prev => prev.filter(item => item.employeeNumber !== empNum))
        darkSwal.fire({
          icon: 'success',
          title: 'Removed Successfully',
          text: 'The employee lifecycle reference was cleaned.',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const handleAssignFingerprint = (record: EmployeeRecord) => {
    darkSwal.fire({
      title: 'Register Fingerprint',
      html: `<div class="text-left"><p class="text-sm mb-3">Assign fingerprint for: <strong>${record.fullName}</strong></p><label class="text-xs block mb-1">Fingerprint Index:</label><input type="number" id="fingerprintInput" class="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-neutral-200 text-sm" placeholder="Enter fingerprint index" min="0"></div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Assign',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      preConfirm: () => {
        const input = (document.getElementById('fingerprintInput') as HTMLInputElement)?.value
        if (!input || isNaN(Number(input))) {
          Swal.showValidationMessage('Please enter a valid fingerprint index')
          return false
        }
        return Number(input)
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newIndex = result.value
        setLocalDatabase(prev => prev.map(item => 
          item.employeeNumber === record.employeeNumber 
            ? { ...item, fingerprintIndex: newIndex }
            : item
        ))
        darkSwal.fire({
          icon: 'success',
          title: 'Fingerprint Assigned',
          text: `Fingerprint index ${newIndex} assigned to ${record.fullName}`,
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const handleDeleteFingerprint = (record: EmployeeRecord) => {
    if (record.fingerprintIndex === null) {
      darkSwal.fire({
        icon: 'info',
        title: 'No Fingerprint',
        text: 'This employee does not have a fingerprint assigned.',
        timer: 1500,
        showConfirmButton: false
      })
      return
    }

    darkSwal.fire({
      title: 'Delete Fingerprint?',
      text: `Remove fingerprint index #${record.fingerprintIndex} from ${record.fullName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        setLocalDatabase(prev => prev.map(item => 
          item.employeeNumber === record.employeeNumber 
            ? { ...item, fingerprintIndex: null }
            : item
        ))
        darkSwal.fire({
          icon: 'success',
          title: 'Fingerprint Removed',
          text: `Fingerprint unassigned from ${record.fullName}`,
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs (password required only for new registrations)
    if (
      !formData.fullName.trim() || !formData.username.trim() || 
      !formData.email.trim() || !formData.phone.trim() || 
      !formData.role.trim() || (modalMode === 'add' && !formData.password)
    ) {
      darkSwal.fire({
        icon: 'error',
        title: 'Missing Required Parameters',
        text: 'All structural fields are necessary to determine directory records.'
      })
      return
    }

    try {
      if (modalMode === 'add') {
        const nextEmpId = `EMP-${202600 + localDatabase.length + Math.floor(Math.random() * 100)}`
        const newRecord: EmployeeRecord = {
          employeeNumber: nextEmpId,
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          employeeStatus: formData.employeeStatus as EmployeeRecord['employeeStatus']
        }
        setLocalDatabase(prev => [newRecord, ...prev])
        setCurrentPage(1)
      } else if (modalMode === 'edit' && editingRecord) {
        setLocalDatabase(prev => prev.map(item => 
          item.employeeNumber === editingRecord.employeeNumber 
            ? { 
                ...item,
                fullName: formData.fullName,
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                employeeStatus: formData.employeeStatus as EmployeeRecord['employeeStatus']
              }
            : item
        ))
      }
      setIsModalOpen(false)
      darkSwal.fire({
        icon: 'success',
        title: modalMode === 'add' ? 'Profile Registered' : 'Data Synchronized',
        text: 'System operations executed flawlessly.',
        timer: 1500,
        showConfirmButton: false
      })
    } catch {
      console.error('State management mutation interrupted.')
    }
  }

  // Visual mapping tracker for cleaner looking badge components 
  const statusBadgeStyle: Record<EmployeeRecord['employeeStatus'], string> = {
    'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'On Leave': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Suspended': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Terminated': 'bg-neutral-500/10 text-neutral-400 border-neutral-800'
  }

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Employee Roster Directory</h1>
          <p className="text-xs text-neutral-500 mt-1">Configure status, operational assignments, and profile directories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-all group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Onboard Employee
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
              placeholder="Search ID, name, username, email..." 
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
                <span className="text-xs font-medium font-mono">Syncing internal databases...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/60 bg-neutral-900/20 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="py-3.5 px-6">Emp Number</th>
                <th className="py-3.5 px-6">Full Name</th>
                <th className="py-3.5 px-6">Contact Info</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Fingerprint</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40 text-xs text-neutral-300">
              {records.length > 0 ? (
                records.map((row) => (
                  <tr key={row.employeeNumber} className="hover:bg-neutral-900/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-medium text-neutral-500">{row.employeeNumber}</td>
                    <td className="py-4 px-6 font-semibold text-neutral-200">{row.fullName}</td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-neutral-400 font-mono text-[11px]">{row.username}</div>
                        <div className="text-neutral-500 text-[10px]">{row.email}</div>
                        <div className="font-mono text-neutral-500 text-[10px]">{row.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-300 font-medium">{row.role}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${statusBadgeStyle[row.employeeStatus]}`}>
                        {row.employeeStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {row.fingerprintIndex !== null ? (
                        <span className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md border bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono">
                          #{row.fingerprintIndex}
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-500 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleAssignFingerprint(row)}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                          title="Assign Fingerprint"
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </button>
                        {row.fingerprintIndex !== null && (
                          <button 
                            onClick={() => handleDeleteFingerprint(row)}
                            className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                            title="Delete Fingerprint"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button 
                          onClick={() => openEditModal(row)}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                          title="Edit Employee Config"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.employeeNumber)}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                          title="Purge Employee Entry"
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
                    No active personnel found matching query configuration.
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
            <span className="font-semibold text-neutral-300">{totalItems}</span> personnel files
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
                {modalMode === 'add' ? 'Onboard New Profile' : `Modify Employee Records: ${editingRecord?.employeeNumber}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1.5">Full Name</label>
                  <input 
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="e.g. Ellen Ripley"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-medium mb-1.5">Username</label>
                  <input 
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="e.g. ripley_e"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">
                  Password {modalMode === 'edit' && <span className="text-neutral-500 font-normal">(Optional)</span>}
                </label>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={modalMode === 'edit' ? "Keep current securely hidden" : "••••••••"}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="ripley@nostromo.org"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Phone Contact</label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +62 812-5555-8800"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1.5">Role / Designation</label>
                  <input 
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Cloud Engineer"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1.5">Lifecycle Status</label>
                  <select
                    value={formData.employeeStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeStatus: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>
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
                  {modalMode === 'add' ? 'Confirm Onboarding' : 'Sync Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}