import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInternetIdentity } from "ic-use-internet-identity";
import { useActor } from "../useActor";
import type {
    Account,
    Account__1,
    TransferArg,
} from "../../../src/declarations/backend/backend.did";

// Collection Status
export function useCollectionStatus() {
    const { actor, isFetching } = useActor();

    return useQuery({
        queryKey: ["collectionStatus"],
        queryFn: async () => {
            if (!actor) return false;
            return actor.collectionHasBeenClaimed();
        },
        enabled: !!actor && !isFetching,
    });
}

// Collection Owner
export function useCollectionOwner() {
    const { actor, isFetching } = useActor();

    return useQuery({
        queryKey: ["collectionOwner"],
        queryFn: async () => {
            if (!actor) return null;
            return actor.getCollectionOwner();
        },
        enabled: !!actor && !isFetching,
    });
}

// Claim Collection
export function useClaimCollection() {
    const queryClient = useQueryClient();
    const { actor } = useActor();

    return useMutation({
        mutationFn: async () => {
            if (!actor) throw new Error("Actor not available");
            return actor.claimCollection();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collectionStatus"] });
            queryClient.invalidateQueries({ queryKey: ["collectionOwner"] });
        },
    });
}

// Mint NFT
export function useMintNFT() {
    const queryClient = useQueryClient();
    const { actor } = useActor();

    return useMutation({
        mutationFn: async ({ to }: { to: Account }) => {
            if (!actor) throw new Error("Actor not available");
            const result = await actor.mint(to);
            if ("err" in result) {
                throw new Error(`Mint failed: ${result.err}`);
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownedNFTs"] });
        },
    });
}

// Owned NFTs
export function useOwnedNFTs() {
    const { identity } = useInternetIdentity();
    const { actor, isFetching } = useActor();

    return useQuery({
        queryKey: ["ownedNFTs", identity?.getPrincipal().toString()],
        queryFn: async () => {
            if (!actor || !identity) return [];

            const tokenIds = await actor.icrc7_tokens_of(
                { owner: identity.getPrincipal(), subaccount: [] },
                [],
                []
            );

            // Get metadata for all tokens in one call
            const metadataArray = await actor.icrc7_token_metadata(tokenIds);

            // Map token IDs to their corresponding metadata (same order)
            const nftsWithMetadata = tokenIds.map(
                (tokenId: bigint, index: number) => ({
                    tokenId,
                    metadata: metadataArray[index] || [],
                })
            );

            return nftsWithMetadata;
        },
        enabled: !!actor && !!identity && !isFetching,
    });
}

// Transfer NFT
export function useTransferNFT() {
    const queryClient = useQueryClient();
    const { actor } = useActor();

    return useMutation({
        mutationFn: async ({
            tokenId,
            to,
        }: {
            tokenId: bigint;
            to: Account;
        }) => {
            if (!actor) throw new Error("Actor not available");

            const transferArg: TransferArg = {
                token_id: tokenId,
                to: {
                    owner: to.owner,
                    subaccount:
                        to.subaccount.length > 0 ? to.subaccount[0] : [],
                } as Account__1,
                memo: [],
                from_subaccount: [],
                created_at_time: [],
            };

            const result = await actor.icrc7_transfer([transferArg]);
            const transferResult = result[0];

            if (!transferResult || transferResult.length === 0) {
                throw new Error("Transfer failed: No result returned");
            }

            const actualResult = transferResult[0];
            if ("Err" in actualResult) {
                throw new Error(
                    `Transfer failed: ${JSON.stringify(actualResult.Err)}`
                );
            }

            return actualResult.Ok;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ownedNFTs"] });
        },
    });
}
