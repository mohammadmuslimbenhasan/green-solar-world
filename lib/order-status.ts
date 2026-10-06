// Order status constants — pure module, safe to import from client components.

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'ready_for_pickup'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'ready_for_pickup',
  'shipped',
  'completed',
  'cancelled',
];

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  ready_for_pickup: 'Ready for Pickup',
  shipped: 'Shipped',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
