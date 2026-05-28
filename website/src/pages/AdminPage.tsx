import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../app/layouts/DashboardLayout'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from 'lucide-react'
import Swal from 'sweetalert2'
import { fetcher } from '../services/fetcher'

interface AdminRecord {
  id: string
  username: string
  email: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

interface AdminPagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

interface GetAdminsResponse {
  status: boolean
  message: string
  data: {
    items: AdminRecord[]
    pagination: AdminPagination
  }
}

interface CreateAdminResponse {
  status: boolean
  message: string
  data: {
    id: string
  }
}

interface UpdateAdminResponse {
  status: boolean
  message: string
  data: {
    id: string
  }
}

interface DeleteAdminResponse {
  status: boolean
  message: string
  data?: unknown
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

export default function AdminPage() {
  const [records, setRecords] = useState<AdminRecord[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const [pagination, setPagination] = useState<AdminPagination>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
  })

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams()

      params.set('page', String(currentPage))
      params.set('pageSize', String(pageSize))

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim())
      }

      const response = await fetcher<GetAdminsResponse>(
        `/api/admin?${params.toString()}`
      )

      setRecords(response.data.items)
      setPagination(response.data.pagination)
    } catch (error) {
      darkSwal.fire({
        icon: 'error',
        title: 'Failed to load admins',
        text:
          error instanceof Error
            ? error.message
            : 'Unable to retrieve admin data.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize, searchQuery])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const totalPages = Math.max(pagination.totalPages || 1, 1)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const openAddModal = () => {
    setModalMode('add')
    setEditingRecord(null)

    setFormData({
      username: '',
      password: '',
      email: '',
      phoneNumber: '',
    })

    setIsModalOpen(true)
  }

  const openEditModal = (record: AdminRecord) => {
    setModalMode('edit')
    setEditingRecord(record)

    setFormData({
      username: record.username,
      password: '',
      email: record.email,
      phoneNumber: record.phoneNumber,
    })

    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (isSubmitting) return

    setIsModalOpen(false)
    setEditingRecord(null)
    setModalMode('add')

    setFormData({
      username: '',
      password: '',
      email: '',
      phoneNumber: '',
    })
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const username = formData.username.trim()
    const password = formData.password.trim()
    const email = formData.email.trim()
    const phoneNumber = formData.phoneNumber.trim()

    if (!username || !email || !phoneNumber) {
      darkSwal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Username, email, and phone number are required.',
      })
      return
    }

    if (modalMode === 'add' && !password) {
      darkSwal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password is required when creating a new admin.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      if (modalMode === 'add') {
        const response = await fetcher<CreateAdminResponse>('/api/admin', {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
            email,
            phoneNumber,
          }),
        })

        closeModal()

        darkSwal.fire({
          icon: 'success',
          title: 'Admin Created',
          text: response.message || 'Admin created successfully.',
          timer: 1600,
          showConfirmButton: false,
        })

        if (currentPage !== 1) {
          setCurrentPage(1)
        } else {
          fetchAdmins()
        }

        return
      }

      if (modalMode === 'edit' && editingRecord) {
        const response = await fetcher<UpdateAdminResponse>(
          `/api/admin/${editingRecord.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              username,
              email,
              phoneNumber,
            }),
          }
        )

        closeModal()

        darkSwal.fire({
          icon: 'success',
          title: 'Admin Updated',
          text: response.message || 'Admin updated successfully.',
          timer: 1600,
          showConfirmButton: false,
        })

        fetchAdmins()
      }
    } catch (error) {
      darkSwal.fire({
        icon: 'error',
        title: modalMode === 'add' ? 'Create Failed' : 'Update Failed',
        text:
          error instanceof Error
            ? error.message
            : modalMode === 'add'
              ? 'Unable to create admin.'
              : 'Unable to update admin.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (record: AdminRecord) => {
    const result = await darkSwal.fire({
      title: 'Delete admin?',
      text: `Admin "${record.username}" will be deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    setIsDeleting(true)

    try {
      const response = await fetcher<DeleteAdminResponse>(
        `/api/admin/${record.id}`,
        {
          method: 'DELETE',
        }
      )

      darkSwal.fire({
        icon: 'success',
        title: 'Admin Deleted',
        text: response.message || 'Admin deleted successfully.',
        timer: 1600,
        showConfirmButton: false,
      })

      /*
        If the current page only has 1 item and we delete it,
        move back one page to avoid showing an empty page.
      */
      if (records.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      } else {
        fetchAdmins()
      }
    } catch (error) {
      darkSwal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text:
          error instanceof Error
            ? error.message
            : 'Unable to delete admin.',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-16 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">
            Admin Operations Management
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            View, create, update, and delete admin account directories.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 transition-all group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Add New Admin
        </button>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden backdrop-blur-md">
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
          {(isLoading || isDeleting) && (
            <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xxs flex items-center justify-center z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-indigo-400 shadow-xl">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-medium font-mono">
                  {isDeleting ? 'Deleting admin...' : 'Loading admins...'}
                </span>
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
                  <tr
                    key={row.id}
                    className="hover:bg-neutral-900/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono font-medium text-neutral-500">
                      {row.id}
                    </td>

                    <td className="py-4 px-6 font-semibold text-neutral-200">
                      {row.username}
                    </td>

                    <td className="py-4 px-6 text-neutral-400">
                      {row.email}
                    </td>

                    <td className="py-4 px-6 font-mono text-neutral-400">
                      {row.phoneNumber}
                    </td>

                    <td className="py-4 px-6 font-mono text-neutral-500">
                      {formatDate(row.createdAt)}
                    </td>

                    <td className="py-4 px-6 font-mono text-neutral-500">
                      {formatDate(row.updatedAt)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(row)}
                          disabled={isLoading || isDeleting}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors disabled:opacity-50"
                          title="Edit admin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          disabled={isLoading || isDeleting}
                          className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800/60 text-neutral-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors disabled:opacity-50"
                          title="Delete admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-neutral-500 font-medium"
                  >
                    {isLoading ? 'Loading data...' : 'No admin records found.'}
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
            records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading || isDeleting}
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
                    disabled={isLoading || isDeleting}
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
              disabled={currentPage === totalPages || isLoading || isDeleting}
              className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
              <h2 className="text-sm font-bold text-neutral-100">
                {modalMode === 'add'
                  ? 'Register New Admin'
                  : `Edit Admin: ${editingRecord?.id}`}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">
                  Username
                </label>

                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  placeholder="updatedadmin"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                />
              </div>

              {modalMode === 'add' && (
                <div>
                  <label className="block text-neutral-400 font-medium mb-1.5">
                    Password
                  </label>

                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="123123"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                  />
                </div>
              )}

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="updated@example.com"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1.5">
                  Phone Number
                </label>

                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="+62887654321"
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors disabled:opacity-50"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl font-medium text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-md shadow-indigo-600/10 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}

                  {modalMode === 'add' ? 'Save Admin' : 'Update Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}