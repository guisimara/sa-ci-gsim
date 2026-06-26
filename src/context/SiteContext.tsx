import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface SiteBlock {
  id: string;
  name: string;
  on: boolean;
}

export interface SiteConfig {
  name: string;
  slug: string;
  whatsapp: string;
  email: string;
  heroTitle: string;
  heroSubtitle: string;
  about: string;
  brandColor: string;
  logo: string | null;
  heroImage: string | null;
  bioImage: string | null;
  layout: 1 | 2 | 3;
  theme: "light" | "dark";
  blocks: SiteBlock[];
}

const defaultConfig: SiteConfig = {
  name: "Imobiliária Souza",
  slug: "imobiliaria-souza",
  whatsapp: "(81) 99999-0000",
  email: "contato@imobsouza.com.br",
  heroTitle: "Encontre o imóvel dos seus sonhos",
  heroSubtitle: "Imóveis selecionados em Recife e região",
  about: "Há mais de 10 anos conectando pessoas aos melhores imóveis do Nordeste.",
  brandColor: "#7c3aed",
  logo: null,
  heroImage: null,
  bioImage: null,
  layout: 1,
  theme: "light",
  blocks: [
    { id: "menu", name: "Menu com logo", on: true },
    { id: "hero", name: "Banner principal", on: true },
    { id: "rent", name: "Destaques para locação", on: true },
    { id: "sale", name: "Destaques para compra", on: true },
    { id: "cta1", name: "Banner: Quer vender ou alugar?", on: true },
    { id: "reviews", name: "Melhores avaliações", on: true },
    { id: "about", name: "Sobre o corretor/imobiliária", on: true },
    { id: "whats", name: "CTA WhatsApp", on: true },
    { id: "footer", name: "Rodapé com dados de contato", on: true },
  ],
};

const STORAGE_KEY = "site_config";

function loadFromStorage(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultConfig, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return defaultConfig;
}

interface SiteContextValue {
  config: SiteConfig;
  updateConfig: (partial: Partial<SiteConfig>) => void;
  saveConfig: () => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(loadFromStorage);

  const updateConfig = useCallback((partial: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const saveConfig = useCallback(() => {
    setConfig((prev) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
      return prev;
    });
  }, []);

  return (
    <SiteContext.Provider value={{ config, updateConfig, saveConfig }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
