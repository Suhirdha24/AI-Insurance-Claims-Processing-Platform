'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { ClaimReviewWorkspace } from '@/components/claims/ClaimReviewWorkspace';

export default function AdjusterClaimReviewPage() {
  const params = useParams();
  const claimId = params.id as string;
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClaimData = () => {
    setIsLoading(true);
    api.get(`/claims/${claimId}`)
      .then((res: any) => setData(res.data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchClaimData();
  }, [claimId]);

  if (isLoading) return <div className="p-8 text-center text-xs text-slate-400">Loading claim review workspace...</div>;
  if (!data) return <div className="p-8 text-center text-xs text-rose-500">Claim data not found.</div>;

  return <ClaimReviewWorkspace data={data} onRefresh={fetchClaimData} />;
}
