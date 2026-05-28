export interface AdminRecord {
  id: string
  username: string
  email: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export interface AdminPagination {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface GetAdminsResponse {
  status: boolean
  message: string
  data: {
    items: AdminRecord[]
    pagination: AdminPagination
  }
}

export interface CreateAdminResponse {
  status: boolean
  message: string
  data: {
    id: string
  }
}