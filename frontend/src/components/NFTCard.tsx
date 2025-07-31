import { useState } from "react";
import { useTransferNFT } from "../hooks/useQueries";
import { Principal } from "@dfinity/principal";
import { Send, Image as ImageIcon } from "lucide-react";
import type { Metadata } from "../types";

interface NFTData {
    tokenId: bigint;
    metadata: Metadata;
}

interface NFTCardProps {
    nft: NFTData;
}

export function NFTCard({ nft }: NFTCardProps) {
    const [recipient, setRecipient] = useState("");
    const [imageError, setImageError] = useState(false);
    const { mutate: transferNFT, isPending: isTransferring } = useTransferNFT();

    // Helper function to get metadata value by key
    const getMetadataValue = (key: string): string => {
        const entry = nft.metadata[0]?.find(([k]) => k === key);
        if (entry && entry[1] && "Text" in entry[1]) {
            return entry[1].Text;
        }
        return "";
    };

    const handleTransfer = () => {
        if (!recipient) return;

        try {
            const recipientPrincipal = Principal.fromText(recipient);
            transferNFT({
                tokenId: nft.tokenId,
                to: { owner: recipientPrincipal, subaccount: [] }, // Assuming no subaccount
            });
            setRecipient("");
        } catch (error) {
            console.error("Invalid principal:", error);
        }
    };

    return (
        <div className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
            {/* NFT Image */}
            <div className="aspect-square bg-gray-800 flex items-center justify-center">
                {!imageError ? (
                    <img
                        src={getMetadataValue("tokenUri")}
                        alt={getMetadataValue("name")}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <ImageIcon className="w-12 h-12" />
                        <span className="text-sm">Image not available</span>
                    </div>
                )}
            </div>

            {/* NFT Details */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="font-semibold text-lg">
                        {getMetadataValue("name")}
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Token ID: {nft.tokenId.toString()}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">
                        {getMetadataValue("description")}
                    </p>
                </div>

                {/* Transfer Form */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                        Transfer to:
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Enter recipient principal"
                            className="flex-1 px-3 py-2 text-sm bg-gray-600 border border-gray-500 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleTransfer}
                            disabled={isTransferring || !recipient}
                            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
                        >
                            {isTransferring ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
