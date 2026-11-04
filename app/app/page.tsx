"use client";

import { useEffect, useState } from "react";
import { Asset, Session } from "@/lib/types";
import { SAMPLE_SESSION, SAMPLE_ASSETS } from "@/lib/sampleData";
import { rememberSession, saveAssets } from "@/lib/persistence";
import { GHOST, Logo, Spinner } from "@/components/ui";
import ServiceChooser from "@/components/ServiceChooser";
import ComingSoon from "@/components/ComingSoon";
import StartScreen from "@/components/StartScreen";
import AssetList from "@/components/AssetList";
import AddAsset from "@/components/AddAsset";
import AssetDetail from "@/components/AssetDetail";
import RollupDashboard from "@/components/RollupDashboard";

type View = "home" | "minmax" | "start" | "asset-list" | "add-asset" | "asset-detail" | "rollup";

// Views that belong to the BOM Gap Analysis service (header shows session + New Session)
const BOM_SERVICE_VIEWS: View[] = ["asset-list", "add-asset", "asset-detail", "rollup"];

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? null;

  const loadSessionById = async (id: string) => {
    setRestoring(true);
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (!res.ok) return false;
      const data = await res.json();
      setSession({
        clientName: data.clientName,
        plantName: data.plantName,
        cmmsFileName: data.cmmsFileName,
        cmmsRowCount: data.cmmsRowCount,
        cmmsText: data.cmmsText,
      });
      setAssets(data.assets ?? []);
      setSessionId(id);
      window.history.replaceState(null, "", `?s=${id}`);
      rememberSession(id, data.clientName, data.plantName);
      setView("asset-list");
      return true;
    } catch {
      return false;
    } finally {
      setRestoring(false);
    }
  };

  // Restore a saved session if the URL carries ?s=<id>, or open the sample
  // analysis directly when linked from the landing page with ?sample=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("s");
    if (id) {
      loadSessionById(id);
    } else if (params.get("sample") === "1") {
      handleLoadSample();
    }
  }, []);

  const handleSessionStart = async (s: Session) => {
    setSession(s);
    setAssets([]);
    setSessionId(null);
    setView("asset-list");

    // Persist in the background — the app keeps working even if saving fails
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, assets: [] }),
      });
      if (res.ok) {
        const { id } = await res.json();
        setSessionId(id);
        window.history.replaceState(null, "", `?s=${id}`);
        rememberSession(id, s.clientName, s.plantName);
      }
    } catch {
      console.warn("[persistence] could not save session — continuing in memory only");
    }
  };

  const handleLoadSample = () => {
    setSession(SAMPLE_SESSION);
    setAssets(SAMPLE_ASSETS);
    setSessionId(null);
    window.history.replaceState(null, "", window.location.pathname);
    setView("asset-list");
  };

  const handleAssetComplete = (asset: Asset) => {
    const next = [...assets, asset];
    setAssets(next);
    saveAssets(sessionId, next);
    setView("asset-list");
  };

  const handleUpdateAsset = (updated: Asset) => {
    const next = assets.map((a) => (a.id === updated.id ? updated : a));
    setAssets(next);
    saveAssets(sessionId, next);
  };

  const handleSelectAsset = (id: string) => {
    setSelectedAssetId(id);
    setView("asset-detail");
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] text-[#0A0A0A]">
      {/* Persistent header */}
      <header className="bg-white border-b border-[#F1F1F3] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center gap-3">
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <Logo />
            <div className="text-left">
              <p className="text-[15px] font-semibold text-[#0A0A0A] leading-tight tracking-[-0.01em]">SparesView</p>
              <p className="text-[11px] text-[#71717A] leading-tight">Spare Parts Intelligence</p>
            </div>
          </button>

          {session && BOM_SERVICE_VIEWS.includes(view) && (
            <>
              <span className="text-[#E4E4E7] ml-2 text-lg font-light">|</span>
              <div className="ml-1">
                <p className="text-xs font-semibold text-[#0A0A0A]">{session.clientName}</p>
                <p className="text-xs text-[#71717A]">{session.plantName}</p>
              </div>
            </>
          )}

          {BOM_SERVICE_VIEWS.includes(view) && (
            <button
              onClick={() => {
                setSession(null);
                setAssets([]);
                setSelectedAssetId(null);
                setSessionId(null);
                window.history.replaceState(null, "", window.location.pathname);
                setView("start");
              }}
              className={`${GHOST} ml-auto !h-9 !text-[13px]`}
            >
              New Session
            </button>
          )}
        </div>
      </header>

      {/* View router */}
      {restoring && (
        <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center gap-3">
          <Spinner className="w-6 h-6 text-[#0A0A0A]" />
          <p className="text-sm text-[#52525B]">Loading saved session…</p>
        </div>
      )}

      {!restoring && view === "home" && (
        <ServiceChooser
          onChooseBom={() => setView("start")}
          onChooseMinMax={() => setView("minmax")}
        />
      )}

      {!restoring && view === "minmax" && <ComingSoon onBack={() => setView("home")} />}

      {!restoring && view === "start" && (
        <StartScreen
          onContinue={handleSessionStart}
          onLoadSample={handleLoadSample}
          onOpenSession={loadSessionById}
          onBack={() => setView("home")}
        />
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
