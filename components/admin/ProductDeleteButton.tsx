'use client';

import { useRouter } from 'next/navigation';
import ConfirmButton, { apiDelete } from '@/components/admin/ConfirmButton';

export default function ProductDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <ConfirmButton
      message="Delete this product?"
      confirmLabel="Delete"
      onConfirm={async () => {
        const res = await apiDelete(`/api/admin/products/${id}`);
        if (res.ok) router.refresh();
        return res;
      }}
    />
  );
}
