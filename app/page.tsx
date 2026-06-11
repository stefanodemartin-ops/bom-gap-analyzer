"use client";

import { useState } from "react";
import { Asset, Session } from "@/lib/types";
import StartScreen from "@/components/StartScreen";
import AssetList from "@/components/AssetList";
import AddAsset from "@/components/AddAsset";
import AssetDetail from "@/components/AssetDetail";
import RollupDashboard from "@/components/RollupDashboard";

type View = "start" | "asset-list" | "add-asset" | "asset-detail" | "rollup";

export default function Home() {
  const [view, setView] = useState<View>("start");
  const [session, setSession] = useState<Session | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? null;

  const handleSessionStart = (s: Session) => {
    setSession(s);
    setAssets([]);
    setView("asset-list");
  };

  const handleAssetComplete = (asset: Asset) => {
    setAssets((prev) => [...prev, asset]);
    setView("asset-list");
  };

  const handleUpdateAsset = (updated: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleSelectAsset = (id: string) => {
    setSelectedAssetId(id);
    setView("asset-detail");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Persistent header */}
      <header className="bg-[#1B2A4A] border-b border-[#253d6a] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center gap-3">
          <button
            onClick={() => view !== "start" && setView("asset-list")}
            className={["flex items-center gap-3", view !== "start" ? "cursor-pointer" : ""].join(" ")}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500 shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white leading-tight tracking-tight">SparesView</p>
              <p className="text-xs text-sky-300 leading-tight">Spare Parts Intelligence</p>
            </div>
          </button>

          {session && view !== "start" && (
            <>
              <span className="text-[#3a5580] ml-2 text-lg font-light">|</span>
              <div className="ml-1">
                <p className="text-xs font-semibold text-slate-200">{session.clientName}</p>
                <p className="text-xs text-slate-400">{session.plantName}</p>
              </div>
            </>
          )}

          {view !== "start" && (
            <button
              onClick={() => {
                setSession(null);
                setAssets([]);
                setSelectedAssetId(null);
                setView("start");
              }}
              className="ml-auto text-xs text-slate-300 hover:text-white border border-[#3a5580] rounded-lg px-3 py-1.5 cursor-pointer hover:bg-[#253d6a] transition-colors"
            >
              New Session
            </button>
          )}
        </div>
      </header>

      {/* View router */}
      {view === "start" && (
        <StartScreen onContinue={handleSessionStart} />
      )}

      {view === "asset-list" && session && (
        <AssetList
          session={session}
          assets={assets}
          onAddAsset={() => setView("add-asset")}
          onSelectAsset={handleSelectAsset}
          onOpenRollup={() => setView("rollup")}
        />
      )}

      {view === "add-asset" && session && (
        <AddAsset
          session={session}
          onBack={() => setView("asset-list")}
          onComplete={handleAssetComplete}
        />
      )}

      {view === "asset-detail" && selectedAsset && session && (
        <AssetDetail
          asset={selectedAsset}
          session={session}
          onBack={() => setView("asset-list")}
          onUpdateAsset={handleUpdateAsset}
        />
      )}

      {view === "rollup" && session && (
        <RollupDashboard
          session={session}
          assets={assets}
          onBack={() => setView("asset-list")}
          onSelectAsset={handleSelectAsset}
        />
      )}
    </div>
  );
}
