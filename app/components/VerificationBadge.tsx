'use client';
export default function VerificationBadge({ verified = true }: { verified?: boolean }) {
  if (!verified) return null;
  
  return (
    <>
      <style>{`
        .badge { display: inline-flex; align-items: center; gap: 6px; background: #d5f7c7; color: #1f9b62; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; }
        .badge-dot { width: 6px; height: 6px; background: #1f9b62; border-radius: 50%; }
      `}</style>
      <div className="badge">
        <div className="badge-dot" />
        Verificado
      </div>
    </>
  );
}
