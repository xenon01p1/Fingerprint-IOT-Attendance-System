import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  Calendar,
  LogIn,
  LogOut,
  Smartphone,
  MapPin,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { fetcher } from '../services/fetcher'

interface AttendanceEmployee {
  id: string
  employeeNumber: number
  fullname: string
  username: string
  email: string
}

interface AttendanceDevice {
  id: string
  name: string
  location: string
}

interface AttendanceRecord {
  id: string
  type: 'checkIn' | 'checkOut'
  employee: AttendanceEmployee | null
  device: AttendanceDevice | null
  createdAt: string
}

interface AttendancePagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface AttendanceResponse {
  status: boolean
  message: string
  data: {
    items: AttendanceRecord[]
    pagination: AttendancePagination
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

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const [pagination, setPagination] = useState<AttendancePagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(false)

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams()

      params.set('page', String(currentPage))
      params.set('pageSize', String(pageSize))

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim())
      }

      /*
        Your endpoint was written as:
        POST /api/attendance?page=1&pageSize=10

        If your backend actually uses GET for viewing data,
        change method: 'POST' to method: 'GET', or remove the options object.
      */
      const response = await fetcher<AttendanceResponse>(
        `/api/attendance?${params.toString()}`
      )

      setRecords(response.data.items)
      setPagination(response.data.pagination)
    } catch (error) {
      darkSwal.fire({
        icon: 'error',
        title: 'Failed to load attendance',
        text:
          error instanceof Error
            ? error.message
            : 'Unable to retrieve attendance records.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, searchQuery])

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

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

  const formatType = (type: AttendanceRecord['type']) => {
    if (type === 'checkIn') return 'CHECK IN'
    if (type === 'checkOut') return 'CHECK OUT'
    return type
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Attendance Tracking Audit
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            View employee check-in and check-out attendance logs.
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
              placeholder="Search employee, email, device..."
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
                  Loading attendance records...
                </span>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/60 bg-neutral-900/20 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                <th className="py-3.5 px-6">Attendance ID</th>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Device</th>
                <th className="py-3.5 px-6">Location</th>
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
                      <div>
                        <p className="font-semibold text-neutral-200">
                          {row.employee?.fullname || '-'}
                        </p>

                        <div className="flex flex-col gap-0.5 mt-1">
                          <span className="text-[10px] font-mono font-medium text-neutral-500">
                            EMP NO: {row.employee?.employeeNumber || '-'}
                          </span>

                          <span className="text-[10px] text-neutral-500">
                            {row.employee?.email || '-'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                          row.type === 'checkIn'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {row.type === 'checkIn' ? (
                          <LogIn className="w-3 h-3" />
                        ) : (
                          <LogOut className="w-3 h-3" />
                        )}

                        {formatType(row.type)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                        <span>{formatDate(row.createdAt)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                      {row.device ? (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Smartphone className="w-3.5 h-3.5 text-neutral-500" />
                            <span>{row.device.name}</span>
                          </div>

                          <span className="text-[10px] text-neutral-600">
                            {row.device.id}
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-600 font-sans tracking-wider">
                          —
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-neutral-400 text-[11px]">
                      {row.device?.location ? (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{row.device.location}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
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
                      : 'No attendance records found.'}
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
            attendance records
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