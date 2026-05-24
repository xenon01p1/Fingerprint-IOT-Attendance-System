import { useState, useEffect } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import { 
  Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight, 
  Search, Loader2, MonitorSmartphone
} from 'lucide-react'
import Swal from 'sweetalert2'

// Interface matching the required device data metrics
interface DeviceRecord {
  id: string
  name: string
  companyName: string
  location: {
    address: string
    roomLocation: string
  }
  createdAt: string
  updatedAt: string
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

export default function DevicePage() {
  // 1. Control States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 2. Data States
  const [records, setRecords] = useState<DeviceRecord[]>([])
  const [localDatabase, setLocalDatabase] = useState<DeviceRecord[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 3. Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingRecord, setEditingRecord] = useState<DeviceRecord | null>(null)
  
  // Form Field States explicitly tailored for the specific device adjustment parameters
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    address: '',
    roomLocation: ''
  })

  // Populate dynamic system structure matching requirements
  useEffect(() => {
    const mockDatabase = Array.from({ length: 14 }, (_, i) => {
      const companies = ['LightDigital Corp', 'Nostromo Logistics', 'Cyberdyne Systems', 'Weyland-Yutani']
      const buildings = ['Main Headquarter Block A', 'Industrial Plant Zone 4', 'Research Lab Complex', 'Distribution Hub C']
      return {
        id: `DEV-${90210 + i}`,
        name: ['Edge Gateway Router', 'Biometric Access Scanner', 'IoT Environmental Node', 'Core Switch 48P', 'SAN Storage Array'][i % 5] + ` v${1 + (i % 3)}`,
        companyName: companies[i % companies.length],
        location: {
          address: buildings[i % buildings.length] + ', Jakarta',
          roomLocation: `Server Room Floor ${2 + (i % 4)}, Rack ${(i % 3)}-0${i + 1}`.replace('A', String.fromCharCode(65 + (i % 3)))
        },
        createdAt: `2026-03-${String(10 + i).padStart(2, '0')} 09:15`,
        updatedAt: `2026-05-${String(20 + (i % 4)).padStart(2, '0')} 14:22`
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
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.roomLocation.toLowerCase().includes(searchQuery.toLowerCase())
        )

        const offset = (currentPage - 1) * pageSize
        const paginatedSlice = filtered.slice(offset, offset + pageSize)

        setRecords(paginatedSlice)
        setTotalItems(filtered.length)
      } catch (error) {
        console.error("Failed fetching device register:", error)
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
      name: '', 
      companyName: '', 
      address: '', 
      roomLocation: '' 
    })
    setIsModalOpen(true)
  }

  const openEditModal = (record: DeviceRecord) => {
    setModalMode('edit')
    setEditingRecord(record)
    setFormData({
      name: record.name,
      companyName: record.companyName,
      address: record.location.address,
      roomLocation: record.location.roomLocation
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    darkSwal.fire({
      title: 'Decommission Device?',
      text: `Are you sure you want to remove register reference: ${id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm Deletion',
      cancelButtonText: 'Abort',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        setLocalDatabase(prev => prev.filter(item => item.id !== id))
        darkSwal.fire({
          icon: 'success',
          title: 'Device Purged',
          text: 'Hardware registry was cleaned from system metrics.',
          timer: 1500,
          showConfirmButton: false
        })
      }
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!formData.name.trim() || !formData.companyName.trim() || !formData.address.trim() || !formData.roomLocation.trim()) {
      darkSwal.fire({
        icon: 'error',
        title: 'Missing Node Attributes',
        text: 'All parameters are necessary to build explicit hardware mappings.'
      })
      return
    }

    const currentTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 16)

    try {
      if (modalMode === 'add') {
        const nextId = `DEV-${90210 + localDatabase.length + Math.floor(Math.random() * 100)}`
        const newRecord: DeviceRecord = {
          id: nextId,
          name: formData.name,
          companyName: formData.companyName,
          location: {
            address: formData.address,
            roomLocation: formData.roomLocation
          },
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp
        }
        setLocalDatabase(prev => [newRecord, ...prev])
        setCurrentPage(1)
      } else if (modalMode === 'edit' && editingRecord) {
        setLocalDatabase(prev => prev.map(item => 
          item.id === editingRecord.id 
            ? { 
                ...item,
                name: formData.name,
                companyName: formData.companyName,
                location: {
                  address: formData.address,
                  roomLocation: formData.roomLocation
                },
                updatedAt: currentTimestamp // Automated stamp updating
              }
            : item
        ))
      }
      setIsModalOpen(false)
      darkSwal.fire({
        icon: 'success',
        title: modalMode === 'add' ? 'Device Provisioned' : 'Inventory Synchronized',
        text: 'Configuration successfully committed to cluster mapping.',
        timer: 1500,
        showConfirmButton: false
      })
    } catch {
      console.error('State cluster adjustment failed.')
    }
  }

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Hardware Node Registry</h1>
          <p className="text-xs text-neutral-500 mt-1">Monitor, assign, and configure network endpoint terminals and tracking metrics.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-all group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Provision Device
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
              placeholder="Search by device name, company, location..." 
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
                <span className="text-xs font-medium font-mono">Querying edge node cluster states...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/60 bg-neutral-900/20 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="py-3.5 px-6">Device Node</th>
                <th className="py-3.5 px-6">Company Client</th>
                <th className="py-3.5 px-6">Deployment Address</th>
                <th className="py-3.5 px-6">Internal Room Placement</th>
                <th className="py-3.5 px-6">Created Stamp</th>
                <th className="py-3.5 px-6">Last Config Sync</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40 text-xs text-neutral-300">
                {records.length > 0 ? (
                    records.map((row) => (
                    <tr key={row.id} className="hover:bg-neutral-900/30 transition-colors">
                        <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-400 group-hover:text-indigo-400 transition-colors">
                            <MonitorSmartphone className="w-3.5 h-3.5" />
                            </div>
                            <div>
                            <p className="font-semibold text-neutral-200">{row.name}</p>
                            <span className="text-[10px] font-mono font-medium text-neutral-500">{row.id}</span>
                            </div>
                        </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-neutral-300">{row.companyName}</td>
                        <td className="py-4 px-6 text-neutral-400 max-w-[200px] truncate">{row.location.address}</td>
                        
                        {/* Adjusted to display as completely clean, unbadged text */}
                        <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                        {row.location.roomLocation}
                        </td>
                        
                        <td className="py-4 px-6 text-neutral-500 font-mono text-[11px]">{row.createdAt}</td>
                        <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">{row.updatedAt}</td>
                        <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                            onClick={() => openEditModal(row)}
                            className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors"
                            title="Modify Attributes"
                            >
                            <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                            title="Purge From Registry"
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
                        No connected hardware infrastructure located matching filters.
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
            <span className="font-semibold text-neutral-300">{totalItems}</span> asset profiles
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
                {modalMode === 'add' ? 'Provision Edge Terminal' : `Update System Matrix: ${editingRecord?.id}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Hardware Asset Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Core Switch 48P v2"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Owning Company Client</label>
                <input 
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="e.g. LightDigital Corp"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Deployment Physical Address</label>
                <input 
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. Main Headquarter Block A, Jakarta"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">Internal Room Placement / Tracking Info</label>
                <input 
                  type="text"
                  value={formData.roomLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, roomLocation: e.target.value }))}
                  placeholder="e.g. Server Room Floor 3, Rack B-04"
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
                  {modalMode === 'add' ? 'Initialize Node' : 'Commit Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}