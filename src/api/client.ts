import type {
  AuthUser,
  CreateServiceRequestPayload,
  CustomerDashboard,
  LocationPayload,
  LoginPayload,
  Mechanic,
  MechanicDashboard,
  NearbyMechanic,
  RegisterCustomerPayload,
  RegisterMechanicPayload,
  ServiceRequest,
  TrackingResponse,  
  User,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new ApiError(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;

}

export const api = {
  registerCustomer: (payload: RegisterCustomerPayload) =>
    request<User>('/api/customer/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  registerMechanic: (payload: RegisterMechanicPayload) =>
    request<Mechanic>('/api/mechanic/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  loginCustomer: (payload: LoginPayload) =>
    request<AuthUser>('/api/customer/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  loginMechanic: (payload: LoginPayload) =>
    request<AuthUser>('/api/mechanic/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getCustomerDashboard: (customerId: number, token: string) =>
    request<CustomerDashboard>(`/api/customer/${customerId}/dashboard`, {}, token),

  getMechanicDashboard: (mechanicId: number, token: string) =>
    request<MechanicDashboard>(`/api/mechanic/${mechanicId}/dashboard`, {}, token),

  updateLocation: (userId: number, payload: LocationPayload, token: string) =>
    request<User>(`/api/customer/${userId}/location`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token),

  updateMechanicLocation: (userId: number, payload: LocationPayload, token: string) =>
    request<User>(`/api/mechanic/${userId}/location`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token),

  getNearbyMechanics: (customerId: number, token: string) =>
    request<NearbyMechanic[]>(`/api/customer/${customerId}/nearby-mechanics`, {}, token),

  createServiceRequest: (payload: CreateServiceRequestPayload, token: string) =>
    request<ServiceRequest>('/api/request/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token),

  getCustomerRequests: (customerId: number, token: string) =>
    request<ServiceRequest[]>(`/api/request/customer/${customerId}`, {}, token),

  completeRequest: (requestId: number, token: string) =>
    request<ServiceRequest>(`/api/request/${requestId}/complete`, {
      method: 'PUT',
    }, token),

  getPendingRequests: (token: string) =>
    request<ServiceRequest[]>('/api/mechanic/pending-requests', {}, token),

  acceptRequest: (mechanicId: number, requestId: number, token: string) =>
    request<ServiceRequest>(`/api/mechanic/${mechanicId}/accept/${requestId}`, {
      method: 'PUT',
    }, token),

  getMechanicRequests: (mechanicId: number, token: string) =>
    request<ServiceRequest[]>(`/api/request/mechanic/${mechanicId}`, {}, token),

  searchMechanics: (specialization: string, token: string) =>
    request<Mechanic[]>(`/api/mechanic/search?specialization=${encodeURIComponent(specialization)}`, {}, token),

  getTracking: (requestId: number, token: string) =>
    request<TrackingResponse>(
      `/api/request/${requestId}/tracking`,
      {},
      token
    ),

    rateMechanic: (
      requestId: number,
      rating: number,
      token: string
    ) =>
      request(
        "/api/customer/rate",
        {
            method: "POST",
            body: JSON.stringify({
                requestId,
                rating,
            }),
        },
        token
    ),

    cancelRequest: (requestId: number, token: string) =>
      request<ServiceRequest>(
        `/api/customer/request/${requestId}/cancel`,
        {
          method: "PUT",
        },
        token
      ),
};

export { ApiError };
