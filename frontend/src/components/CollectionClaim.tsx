import { useCollectionStatus, useClaimCollection } from '../hooks/useQueries';
import { CheckCircle, Crown } from 'lucide-react';

export function CollectionClaim() {
  const { data: hasBeenClaimed, isLoading: isCheckingClaim } = useCollectionStatus();
  const { mutate: claimCollection, isPending: isClaiming } = useClaimCollection();

  if (isCheckingClaim) {
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
        Checking collection status...
      </div>
    );
  }

  if (hasBeenClaimed) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle className="w-5 h-5" />
        Collection has been claimed
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-300">This collection is available to claim!</p>
      <button
        onClick={() => claimCollection()}
        disabled={isClaiming}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed rounded-lg transition-colors"
      >
        {isClaiming ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Claiming...
          </>
        ) : (
          <>
            <Crown className="w-4 h-4" />
            Claim Collection
          </>
        )}
      </button>
    </div>
  );
}
