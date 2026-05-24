import { useState, useEffect } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import { 
  ChevronLeft, ChevronRight, Search, Loader2, Calendar, 
  Terminal, ShieldCheck, Fingerprint
} from 'lucide-react'

// Interface representing the explicit Device Log fields
interface DeviceLogRecord {
  id: string
  deviceId: string
  type: 'REGISTER' | 'FINISH REGISTER' | 'CHECK IN' | 'CHECK OUT' | 'DELETE'
  fingerprintId: number
  datetime: string
}

export default function LogDevicePage() {
  // 1. Control States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10) // Keeping it higher for dense audit viewing
  const [searchQuery, setSearchQuery] = useState('')
  
  // 2. Data States
  const [records, setRecords] = useState<DeviceLogRecord[]>([])
  const [localDatabase, setLocalDatabase] = useState<DeviceLogRecord[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Populate dynamic terminal logs mirroring system lifecycle events
  useEffect(() => {
    const mockDatabase = Array.from({ length: 40 }, (_, i) => {
      const types: DeviceLogRecord['type'][] = ['REGISTER', 'FINISH REGISTER', 'CHECK IN', 'CHECK OUT', 'DELETE']
      const selectedType = types[i % types.length]
      
      const day = String(24 - Math.floor(i / 5)).padStart(2, '0')
      const hour = String(8 + (i % 10)).padStart(2, '0')
      const minute = String(11 + (i * 3) % 48).padStart(2, '0')

      return {
        id: `LOG-${77100 + i}`,
        deviceId: `DEV-${90210 + (i % 4)}`,
        type: selectedType,
        fingerprintId: 100 + (i % 12),
        datetime: `2026-05-${day} ${hour}:${minute}`
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
        await new Promise((resolve) => setTimeout(resolve, 250))
        
        const filtered = localDatabase.filter(item => 
          item.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(item.fingerprintId).includes(searchQuery)
        )

        const offset = (currentPage - 1) * pageSize
        const paginatedSlice = filtered.slice(offset, offset + pageSize)

        setRecords(paginatedSlice)
        setTotalItems(filtered.length)
      } catch (error) {
        console.error("Failed querying localized operational logs:", error)
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

  // Visual style maps mapping out the explicit device life actions distinctly
  const typeBadgeStyle: Record<DeviceLogRecord['type'], string> = {
    'REGISTER': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'FINISH REGISTER': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'CHECK IN': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'CHECK OUT': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'DELETE': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }

  return (
    <DashboardLayout>
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Device Activity Ledger</h1>
          <p className="text-xs text-neutral-500 mt-1">Audit trail tracking hardware handshakes, biometric registration states, and lifecycle actions.</p>
        </div>
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
              placeholder="Search device, event type, fingerprint ID..." 
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
                <span className="text-xs font-medium font-mono">Streaming system telemetry logs...</span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/60 bg-neutral-900/20 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="py-3.5 px-6">Device Node Index</th>
                <th className="py-3.5 px-6">Operational Event</th>
                <th className="py-3.5 px-6">Linked Biometric ID</th>
                <th className="py-3.5 px-6">Execution Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/40 text-xs text-neutral-300">
              {records.length > 0 ? (
                records.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-900/30 transition-colors">
                    
                    {/* Device Identifier layout */}
                    <td className="py-4 px-6 font-mono font-medium text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-neutral-600" />
                        <span className="text-neutral-200 font-semibold">{row.deviceId}</span>
                      </div>
                    </td>

                    {/* Operational Event Badges */}
                    <td className="py-4 px-6">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md border tracking-wide font-mono ${typeBadgeStyle[row.type]}`}>
                        {row.type}
                      </span>
                    </td>

                    {/* Fingerprint ID plain tracking representation */}
                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Fingerprint className="w-3.5 h-3.5 text-neutral-500" />
                        <span>ID #{row.fingerprintId}</span>
                      </div>
                    </td>

                    {/* DateTime stamp */}
                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Calendar className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="text-neutral-400">{row.datetime}</span>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-neutral-500 font-medium">
                    No explicit device transaction traces found inside system matrices.
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
            <span className="font-semibold text-neutral-300">{totalItems}</span> structural device logs
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
    </DashboardLayout>
  )
}