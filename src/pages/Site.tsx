import { Link } from "react-router-dom";
import { useRef, useState, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useSite } from "@/context/SiteContext";

// Compress image to max 900px and WebP 0.72 quality — keeps base64 small enough for localStorage
function compressImage(file: File, maxPx = 900, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          const r = Math.min(maxPx / width, maxPx / height);
          width = Math.round(width * r);
          height = Math.round(height * r);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp", quality));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const PALETTE = [
  "#7c3aed", "#4f46e5", "#0ea5e9", "#14b8a6",
  "#10b981", "#f59e0b", "#f97316", "#ef4444",
  "#ec4899", "#f43f5e", "#0f1b3d", "#475569",
];

function ImageUpload({
  label,
  value,
  onChange,
  accept,
  maxMB,
}: {
  label: string;
  value: string | null;
  onChange: (b64: string | null) => void;
  accept: string;
  maxMB: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo ${maxMB}MB.`);
      return;
    }
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      toast.error("Erro ao processar imagem.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }, [maxMB, onChange]);

  return (
    <div>
      <Label>{label}</Label>
      <div
        className="mt-1.5 border-2 border-dashed border-border rounded-xl p-4 text-center text-sm text-muted-foreground hover:border-primary cursor-pointer flex flex-col items-center gap-2"
        onClick={() => !loading && ref.current?.click()}
      >
        {loading ? (
          <div className="flex items-center gap-2 text-primary">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Processando...
          </div>
        ) : value ? (
          <img src={value} alt="preview" className="max-h-24 object-contain rounded" />
        ) : (
          <>
            <Upload className="w-5 h-5 opacity-50" />
            <span>Clique para fazer upload (PNG/JPG, até {maxMB}MB)</span>
          </>
        )}
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <button className="text-xs text-destructive mt-1 hover:underline" onClick={() => onChange(null)}>
          Remover imagem
        </button>
      )}
    </div>
  );
}

export default function Site() {
  const { config, updateConfig, saveConfig } = useSite();
  const [published, setPublished] = useState(false);

  function handlePublish() {
    saveConfig();
    toast.success("Site publicado com sucesso!");
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  }

  return (
    <>
      <PageHeader title="Site / Portfólio" description="Configure seu site profissional white-label">
        <Button variant="outline" asChild className="gap-2">
          <Link to={`/site/${config.slug}`} target="_blank">
            <ExternalLink className="w-4 h-4" /> Ver preview público
          </Link>
        </Button>
        <Button
          className="gradient-primary border-0 shadow-glow gap-2"
          onClick={handlePublish}
        >
          {published ? <><CheckCircle2 className="w-4 h-4" /> Publicado!</> : "Publicar alterações"}
        </Button>
      </PageHeader>

      {/* Layout & Theme row */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="p-4 shadow-card flex-1 min-w-[260px]">
          <h3 className="font-semibold mb-3 text-sm">Layout</h3>
          <div className="flex gap-3">
            {([1, 2, 3] as const).map((l) => (
              <button
                key={l}
                onClick={() => updateConfig({ layout: l })}
                className={`flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-colors ${
                  config.layout === l
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="text-xs font-bold mb-1">Layout {l}</div>
                <div className="text-xs text-muted-foreground">
                  {l === 1 && "Clássico"}
                  {l === 2 && "Quinto Andar"}
                  {l === 3 && "Busca fora do banner"}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-3 text-sm">Tema</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={config.theme === "light" ? "default" : "outline"}
              onClick={() => updateConfig({ theme: "light" })}
            >
              ☀️ Claro
            </Button>
            <Button
              size="sm"
              variant={config.theme === "dark" ? "default" : "outline"}
              onClick={() => updateConfig({ theme: "dark" })}
            >
              🌙 Escuro
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Brand identity */}
        <Card className="p-6 shadow-card lg:col-span-2">
          <h3 className="font-semibold mb-5">Identidade da marca</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Nome</Label>
                <Input
                  className="mt-1.5"
                  value={config.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug do site</Label>
                <Input
                  className="mt-1.5"
                  value={config.slug}
                  onChange={(e) => updateConfig({ slug: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>WhatsApp</Label>
                <Input
                  className="mt-1.5"
                  value={config.whatsapp}
                  onChange={(e) => updateConfig({ whatsapp: e.target.value })}
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  className="mt-1.5"
                  value={config.email}
                  onChange={(e) => updateConfig({ email: e.target.value })}
                />
              </div>
            </div>

            <ImageUpload
              label="Logo"
              value={config.logo}
              onChange={(v) => updateConfig({ logo: v })}
              accept="image/png,image/svg+xml,image/jpeg"
              maxMB={2}
            />

            <ImageUpload
              label="Imagem do Banner Principal"
              value={config.heroImage}
              onChange={(v) => updateConfig({ heroImage: v })}
              accept="image/png,image/jpeg"
              maxMB={5}
            />

            <ImageUpload
              label="Imagem Sobre/Bio"
              value={config.bioImage}
              onChange={(v) => updateConfig({ bioImage: v })}
              accept="image/png,image/jpeg"
              maxMB={5}
            />

            <div>
              <Label>Cores da marca</Label>
              <div className="grid grid-cols-8 gap-2 mt-2">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateConfig({ brandColor: c })}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      config.brandColor === c
                        ? "ring-2 ring-offset-2 ring-primary scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <Label>Título do hero</Label>
                <Input
                  className="mt-1.5"
                  value={config.heroTitle}
                  onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                />
              </div>
              <div>
                <Label>Subtítulo</Label>
                <Input
                  className="mt-1.5"
                  value={config.heroSubtitle}
                  onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Texto sobre / bio</Label>
              <Textarea
                rows={3}
                className="mt-1.5"
                value={config.about}
                onChange={(e) => updateConfig({ about: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Blocks */}
        <Card className="p-6 shadow-card">
          <h3 className="font-semibold mb-1">Blocos da página</h3>
          <p className="text-xs text-muted-foreground mb-5">Ative/desative as seções do seu site.</p>
          <div className="space-y-3">
            {config.blocks.map((b, i) => (
              <div
                key={b.id}
                className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-muted text-xs font-semibold flex items-center justify-center text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{b.name}</span>
                </div>
                <Switch
                  checked={b.on}
                  onCheckedChange={(v) =>
                    updateConfig({
                      blocks: config.blocks.map((x) =>
                        x.id === b.id ? { ...x, on: v } : x
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
