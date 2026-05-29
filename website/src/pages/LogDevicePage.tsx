import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Calendar,
  Terminal,
  Fingerprint,
  User,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { fetcher } from '../services/fetcher'

interface FingerprintData {
  id: string
  fingerPrintIndex: number
  createdAt: string
  updatedAt: string
  employeeId: string
  deviceId: string
}

interface DeviceLogRecord {
  id: string
  type: 'register' | 'finishRegister' | 'checkIn' | 'checkOut' | 'delete'
  fingerprintId: string
  fingerprint: FingerprintData | null
  createdAt: string
}

interface LogDevicePagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface LogDeviceResponse {
  status: boolean
  message: string
  data: {
    items: DeviceLogRecord[]
    pagination: LogDevicePagination
  }
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
    cancelButton:
      'rounded-xl px-4 py-2 text-xs font-semibold text-neutral-400 border border-neutral-800',
  },
})

export default function LogDevicePage() {
  const [records, setRecords] = useState<DeviceLogRecord[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const [pagination, setPagination] = useState<LogDevicePagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(false)

  const fetchLogDevices = useCallback(async () => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams()

      params.set('page', String(currentPage))
      params.set('pageSize', String(pageSize))

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim())
      }

      const response = await fetcher<LogDeviceResponse>(
        `/api/logDevice?${params.toString()}`
      )

      setRecords(response.data.items)
      setPagination(response.data.pagination)
    } catch (error) {
      darkSwal.fire({
        icon: 'error',
        title: 'Failed to load device logs',
        text:
          error instanceof Error
            ? error.message
            : 'Unable to retrieve log device records.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, searchQuery])

  useEffect(() => {
    fetchLogDevices()
  }, [fetchLogDevices])

  const totalPages = Math.max(pagination.totalPages || 1, 1)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const formatDate = (value: string) => {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatType = (type: DeviceLogRecord['type']) => {
    const labels: Record<DeviceLogRecord['type'], string> = {
      register: 'REGISTER',
      finishRegister: 'FINISH REGISTER',
      checkIn: 'CHECK IN',
      checkOut: 'CHECK OUT',
      delete: 'DELETE',
    }

    return labels[type] || type
  }

  const getTypeBadgeStyle = (type: DeviceLogRecord['type']) => {
    const styles: Record<DeviceLogRecord['type'], string> = {
      register: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      finishRegister: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      checkIn: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      checkOut: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      delete: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    }

    return styles[type] || 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Device Activity Ledger
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            View device activity logs, fingerprint events, and biometric lifecycle actions.
          </p>
        </div>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-5 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-xs w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search device, event type, fingerprint..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Show</span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={20}>20 entries</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto relative min-h-[250px]">
          {isLoading && (
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xxs flex items-center justify-center z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-indigo-400 shadow-xl">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium font-mono">
                  Loading device logs...
                </span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/60 bg-neutral-900/20 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="py-3.5 px-6">Log ID</th>
                <th className="py-3.5 px-6">Event Type</th>
                <th className="py-3.5 px-6">Fingerprint</th>
                <th className="py-3.5 px-6">Employee ID</th>
                <th className="py-3.5 px-6">Device ID</th>
                <th className="py-3.5 px-6">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-800/40 text-xs text-neutral-300">
              {records.length > 0 ? (
                records.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-neutral-900/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-medium text-neutral-500">
                      {row.id}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-md border tracking-wide font-mono ${getTypeBadgeStyle(
                          row.type
                        )}`}
                      >
                        {formatType(row.type)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Fingerprint className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{row.fingerprintId || '-'}</span>
                        </div>

                        <span className="text-[10px] text-neutral-600">
                          Index: {row.fingerprint?.fingerPrintIndex ?? '-'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      {row.fingerprint?.employeeId ? (
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <User className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{row.fingerprint.employeeId}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      {row.fingerprint?.deviceId ? (
                        <div className="flex items-center gap-1.5 text-neutral-300">
                          <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{row.fingerprint.deviceId}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Calendar className="w-3.5 h-3.5 text-neutral-700" />
                        <span className="text-neutral-400">
                          {formatDate(row.createdAt)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-neutral-500 font-medium"
                  >
                    {isLoading
                      ? 'Loading data...'
                      : 'No device log records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-500">
            Showing{' '}
            <span className="font-semibold text-neutral-300">
              {pagination.totalItems === 0
                ? 0
                : (pagination.currentPage - 1) * pagination.pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-neutral-300">
              {Math.min(
                pagination.currentPage * pagination.pageSize,
                pagination.totalItems
              )}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-neutral-300">
              {pagination.totalItems}
            </span>{' '}
            device logs
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    disabled={isLoading}
                    className={`w-8 h-8 rounded-xl text-xs font-semibold font-mono transition-all ${
                      currentPage === pageNumber
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                        : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isLoading}
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