import type { ServiceRequest } from '../types';

interface StatusBadgeProps {
  status: ServiceRequest['status'];
}

const labels: Record<ServiceRequest['status'], string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  COMPLETED: 'Completed',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{labels[status]}</span>;
}
