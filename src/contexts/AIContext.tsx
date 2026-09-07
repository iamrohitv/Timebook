import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AIProviderConfig, AIProviderId } from "../types";
import { getJSON, setJSON } from "../services/storage";

type Ctx = {
  configs: AIProviderConfig[];
  activeProvider: AIProviderId | null;
  setActiveProvider: (id: AIProviderId | null) => void;
  saveConfig: (cfg: AIProviderConfig) => void;
  removeConfig: (id: AIProviderId) => void;
  hasKey: (id: AIProviderId) => boolean;
};

const AIContext = createContext<Ctx | null>(null);

const defaults: AIProviderConfig[] = [
  { providerId: "openai", apiKey: "", model: "gpt-4o-mini", enabled: false },
  { providerId: "google", apiKey: "", model: "gemini-1.5-flash", enabled: false },
  { providerId: "anthropic", apiKey: "", model: "claude-3-5-sonnet-20241022", enabled: false },
];

export function AIProviderCtx({ children }: { children: ReactNode }) {
  const [configs, setConfigs] = useState<AIProviderConfig[]>(() => getJSON("ai:configs", defaults));
  const [activeProvider, setActiveProvider] = useState<AIProviderId | null>(() => getJSON("ai:active", null));

  useEffect(() => setJSON("ai:configs", configs), [configs]);
  useEffect(() => setJSON("ai:active", activeProvider), [activeProvider]);

  function saveConfig(cfg: AIProviderConfig) {
    setConfigs((prev) => {
      const i = prev.findIndex((p) => p.providerId === cfg.providerId);
      if (i >= 0) {
        const c = [...prev];
        c[i] = cfg;
        return c;
      }
      return [...prev, cfg];
    });
  }
  function removeConfig(id: AIProviderId) {
    setConfigs((prev) => prev.map((p) => (p.providerId === id ? { ...p, apiKey: "", enabled: false } : p)));
    if (activeProvider === id) setActiveProvider(null);
  }
  function hasKey(id: AIProviderId) {
    const c = configs.find((x) => x.providerId === id);
    return !!c?.apiKey;
  }

  return (
    <AIContext.Provider value={{ configs, activeProvider, setActiveProvider, saveConfig, removeConfig, hasKey }}>{children}</AIContext.Provider>
  );
}

export function useAISettings() {
  const c = useContext(AIContext);
  if (!c) throw new Error("useAISettings outside provider");
  return c;
}
