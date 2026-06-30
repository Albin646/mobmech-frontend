export type Role = 'CUSTOMER' | 'MECHANIC';

export interface AuthUser {
  token: string;
  role: Role;
  userId: number;
  name: string;
  email: string;
  mechanicId?: number;
}

export interface RegisterCustomerPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterMechanicPayload extends RegisterCustomerPayload {
  experience: number;
  specialization: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  latitude: number;
  longitude: number;
}

export interface Mechanic {
  id: number;
  experience: number;
  specialization: string;
  rating: number;
  user: User;
}

export interface CustomerDashboard {
  totalRequests: number;
  pending: number;
  accepted: number;
  completed: number;
}

export interface MechanicDashboard {
  assignedJobs: number;
  completedJobs: number;
  rating: number;
}

export interface NearbyMechanic {
  mechanicId: number;
  name: string;
  specialization: string;
  distance: number;
  latitude: number;
  longitude: number;
}

export interface ServiceRequest {
  id: number;
  vehicleType: string;
  problemDescription: string;
  location: string;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED';
  customer?: User;
  mechanic?: Mechanic;
}

export interface CreateServiceRequestPayload {
  customerId: number;
  vehicleType: string;
  problemDescription: string;
  location: string;
}

export interface LocationPayload {
  latitude: number;
  longitude: number;
}

export interface TrackingResponse {
  customerLat: number;
  customerLon: number;
  mechanicLat: number;
  mechanicLon: number;
  mechanicName: string;
  status: string;
}