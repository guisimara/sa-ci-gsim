import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RefreshCw, Wifi, WifiOff, UserPlus, Kanban,
  Clock, CheckCheck, MessageCircle, Phone, AlertCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { crmStages } from "@/lib/mock-data";
import { toast } from "sonner";

// ─── Mock conversations ───────────────────────────────────────────────────────
interface WaConversation {
  id: string;
  name: string;
  phone: string;
  lastMsg: string;
  time: string;
  unread: number;
  imported: boolean;
  stageId?: string;
}

const MOCK_CONVS: WaConversation[] = [
  { id: "w1", name: "João Silva", phone: "(81) 99999-1001", lastMsg: "Olá, vi o apartamento no Instagram e tenho interesse.", time: "10:32", unread: 3, imported: false },
  { id: "w2", name: "Maria Pereira", phone: "(81) 98888-2002", lastMsg: "Tenho interesse no imóvel AP-0142, qual o valor do condomínio?", time: "09:15", unread: 0, imported: false },
  { id: "w3", name: "Carlos Mota", phone: "(81) 97777-3003", lastMsg: "Qual o valor do aluguel? Tenho família com 2 filhos.", time: "Ontem", unread: 1, imported: false },
  { id: "w4", name: "Ana Lima", phone: "(81) 96666-4004", lastMsg: "Boa tarde! Você faz avaliação de imóveis para venda?", time: "Ontem", unread: 0, imported: false },
  { id: "w5", name: "Pedro Santos", phone: "(11) 95555-5005", lastMsg: "Quero agendar uma visita essa semana, pode ser quarta?", time: "2 dias atrás", unread: 2, imported: false },
  { id: "w6", name: "Fernanda Costa", phone: "(81) 94444-6006", lastMsg: "Recebi sua indicação de lançamento no Pina, quero saber mais", time: "3 dias atrás", unread: 0, imported: false },
];

// ─── Connection status type ───────────────────────────────────────────────────
type Status = "disconnected" | "qr" | "connecting" | "connected";

// ─── QR refresh countdown ─────────────────────────────────────────────────────
function QrCountdown({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    const t = setInterval(() => setLeft((s) => {
      if (s <= 1) { clearInterval(t); onExpire(); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [seconds, onExpire]);
  const pct = (left / seconds) * 100;
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
          <circle cx="16" cy="16" r="13" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 13}`}
            strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct / 100)}`}
            className="transition-all duration-1000" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary">{left}</span>
      </div>
      QR expira em {left}s
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WhatsApp() {
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [status, setStatus] = useState<Status>("disconnected");
  const [convs, setConvs] = useState<WaConversation[]>(MOCK_CONVS);
  const [autoImport, setAutoImport] = useState(false);
  const [targetStage, setTargetStage] = useState(crmStages[0]?.id ?? "s1");
  const [qrKey, setQrKey] = useState(0); // force re-render QR
  const [connectedPhone, setConnectedPhone] = useState("");
  const connectTimeout = useRef<ReturnType<typeof setTimeout>>();

  // QR code image (simulated via public QR API with a unique key per render)
  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=Corretor360-WA-${qrKey}&bgcolor=ffffff&color=111111&margin=6&qzone=2`;

  const startQr = useCallback(() => {
    setStatus("qr");
    setQrKey((k) => k + 1);
  }, []);

  const handleQrExpire = useCallback(() => {
    if (status === "qr") startQr(); // auto-refresh
  }, [status, startQr]);

  // Simula leitura do QR → conectando → conectado
  const simulateConnect = useCallback(() => {
    setStatus("connecting");
    clearTimeout(connectTimeout.current);
    connectTimeout.current = setTimeout(() => {
      setStatus("connected");
      setConnectedPhone("(81) 99900-0000");
      toast.success("WhatsApp conectado com sucesso!");
      addNotification({
        id: `wa${Date.now()}`,
        type: "lead",
        title: "📱 WhatsApp conectado",
        message: "Conexão estabelecida. Novas mensagens serão capturadas automaticamente.",
        time: "agora",
        read: false,
      });
    }, 2000);
  }, [addNotification]);

  const disconnect = () => {
    clearTimeout(connectTimeout.current);
    setStatus("disconnected");
    setConnectedPhone("");
    setConvs(MOCK_CONVS);
    toast.info("WhatsApp desconectado.");
  };

  // Auto-import when connected + autoImport ON
  useEffect(() => {
    if (status === "connected" && autoImport) {
      const notImported = convs.filter((c) => !c.imported);
      if (notImported.length > 0) {
        setConvs((prev) => prev.map((c) => ({ ...c, imported: true, stageId: targetStage })));
        toast.success(`${notImported.length} contatos importados automaticamente para o CRM!`);
        notImported.forEach((c) => {
          addNotification({
            id: `wai${c.id}${Date.now()}`,
            type: "lead",
            title: "📩 Novo lead via WhatsApp",
            message: `${c.name} (${c.phone}) — "${c.lastMsg.slice(0, 50)}..."`,
            time: "agora",
            read: false,
            link: "/crm",
          });
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, autoImport]);

  const importOne = (conv: WaConversation) => {
    setConvs((prev) => prev.map((c) => c.id === conv.id ? { ...c, imported: true, stageId: targetStage } : c));
    addNotification({
      id: `wai${conv.id}${Date.now()}`,
      type: "lead",
      title: "📩 Lead importado do WhatsApp",
      message: `${conv.name} (${conv.phone}) adicionado ao CRM.`,
      time: "agora",
      read: false,
      link: "/crm",
    });
    toast.success(`${conv.name} enviado para o CRM!`, {
      action: { label: "Ver CRM", onClick: () => navigate("/crm") },
    });
  };

  const importAll = () => {
    const pending = convs.filter((c) => !c.imported);
    if (!pending.length) { toast.info("Todos os contatos já foram importados."); return; }
    setConvs((prev) => prev.map((c) => ({ ...c, imported: true, stageId: targetStage })));
    toast.success(`${pending.length} contatos enviados para o CRM!`, {
      action: { label: "Ver CRM", onClick: () => navigate("/crm") },
    });
    pending.forEach((c) => {
      addNotification({
        id: `wai${c.id}${Date.now()}`,
        type: "lead",
        title: "📩 Lead via WhatsApp",
        message: `${c.name} importado para o CRM.`,
        time: "agora",
        read: false,
        link: "/crm",
      });
    });
  };

  const pending = convs.filter((c) => !c.imported).length;
  const stageName = crmStages.find((s) => s.id === targetStage)?.name ?? "Coluna";

  return (
    <>
      <PageHeader title="WhatsApp" description="Conecte seu número e capture leads das conversas">
        {status === "connected" && (
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="text-muted-foreground font-mono">{connectedPhone}</span>
            <Button variant="outline" size="sm" onClick={disconnect} className="ml-2">Desconectar</Button>
          </div>
        )}
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left: connection panel ── */}
        <div className="space-y-4">
          {/* Status card */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                status === "connected" ? "bg-[#25D366]/15 text-[#25D366]" : "bg-muted text-muted-foreground"
              }`}>
                {status === "connected" ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-sm">Status da conexão</div>
                <Badge className={`text-xs mt-0.5 ${
                  status === "connected" ? "bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30" :
                  status === "connecting" ? "bg-warning/20 text-warning border-warning/30" :
                  status === "qr" ? "bg-primary/20 text-primary border-primary/30" :
                  "bg-muted text-muted-foreground border-border"
                }`}>
                  {status === "connected" ? "Conectado" :
                   status === "connecting" ? "Conectando..." :
                   status === "qr" ? "Aguardando leitura" : "Desconectado"}
                </Badge>
              </div>
            </div>

            {/* Disconnected: start button */}
            {status === "disconnected" && (
              <Button className="w-full gap-2" style={{ background: "#25D366", border: "none", color: "#fff" }} onClick={startQr}>
                <MessageCircle className="w-4 h-4" />Conectar WhatsApp
              </Button>
            )}

            {/* QR code */}
            {status === "qr" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-xl border border-border">
                  <img src={qrData} alt="QR Code WhatsApp" className="w-[180px] h-[180px]" />
                  <QrCountdown seconds={30} onExpire={handleQrExpire} />
                </div>
                <div className="text-xs text-muted-foreground space-y-1.5 bg-muted/40 rounded-xl p-3">
                  <p className="font-medium text-foreground">Como conectar:</p>
                  <p>1. Abra o <strong>WhatsApp</strong> no seu celular</p>
                  <p>2. Toque nos <strong>3 pontos</strong> → <strong>Dispositivos conectados</strong></p>
                  <p>3. Toque em <strong>Conectar dispositivo</strong></p>
                  <p>4. Aponte a câmera para este QR code</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-1 text-xs" onClick={startQr}>
                    <RefreshCw className="w-3.5 h-3.5" />Atualizar QR
                  </Button>
                  {/* Dev shortcut: simulate scan */}
                  <Button className="flex-1 text-xs" style={{ background: "#25D366", border: "none", color: "#fff" }} onClick={simulateConnect}>
                    Simular leitura ▶
                  </Button>
                </div>
              </div>
            )}

            {/* Connecting spinner */}
            {status === "connecting" && (
              <div className="flex flex-col items-center gap-3 py-6">
                <svg className="animate-spin w-10 h-10 text-[#25D366]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p className="text-sm text-muted-foreground">Estabelecendo conexão...</p>
              </div>
            )}

            {/* Connected info */}
            {status === "connected" && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-sm font-bold">A</div>
                  <div>
                    <div className="font-medium text-sm">Ana Souza</div>
                    <div className="text-xs text-muted-foreground">{connectedPhone}</div>
                  </div>
                  <CheckCheck className="w-4 h-4 text-[#25D366] ml-auto" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="p-2 rounded-lg bg-muted/40">
                    <div className="font-bold text-lg">{convs.length}</div>
                    <div className="text-xs text-muted-foreground">Conversas</div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/40">
                    <div className="font-bold text-lg text-[#25D366]">{convs.filter((c) => c.imported).length}</div>
                    <div className="text-xs text-muted-foreground">Importados</div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Import settings (only when connected) */}
          {status === "connected" && (
            <Card className="p-5 shadow-card space-y-4">
              <h3 className="font-semibold text-sm">Configurações de importação</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Importação automática</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Envia todo novo contato direto ao CRM</p>
                </div>
                <Switch checked={autoImport} onCheckedChange={setAutoImport} />
              </div>

              <div>
                <Label className="text-sm">Coluna de destino no CRM</Label>
                <Select value={targetStage} onValueChange={setTargetStage}>
                  <SelectTrigger className="mt-1.5 h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {crmStages.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {pending > 0 && (
                <Button className="w-full gap-2 text-sm" style={{ background: "#25D366", border: "none", color: "#fff" }} onClick={importAll}>
                  <UserPlus className="w-4 h-4" />Importar todos ({pending}) para CRM
                </Button>
              )}
            </Card>
          )}

          {/* Info card when disconnected */}
          {status === "disconnected" && (
            <Card className="p-5 shadow-card bg-muted/30 border-dashed">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>A conexão via QR code usa o WhatsApp Web (não-oficial). Mantenha o celular com internet ativa. Não use o número principal da empresa em risco de bloqueio.</p>
              </div>
            </Card>
          )}
        </div>

        {/* ── Right: conversations ── */}
        <div className="lg:col-span-2">
          {status !== "connected" ? (
            <Card className="p-12 shadow-card flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Conecte seu WhatsApp</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Após conectar via QR code, as conversas aparecerão aqui. Você pode enviar cada contato para uma coluna do CRM com um clique.
                </p>
              </div>
              {status === "disconnected" && (
                <Button style={{ background: "#25D366", border: "none", color: "#fff" }} className="gap-2 mt-2" onClick={startQr}>
                  <MessageCircle className="w-4 h-4" />Conectar agora
                </Button>
              )}
            </Card>
          ) : (
            <Card className="shadow-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                <div>
                  <h3 className="font-semibold">Conversas recentes</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pending} pendentes · coluna destino: <strong>{stageName}</strong>
                  </p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={importAll} disabled={pending === 0}>
                  <UserPlus className="w-4 h-4" />Importar todos
                </Button>
              </div>

              <div className="divide-y divide-border">
                {convs.map((c) => (
                  <div key={c.id} className={`flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors ${c.imported ? "opacity-60" : ""}`}>
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-[#25D366]/20 text-[#25D366] font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{c.name}</span>
                        {c.unread > 0 && !c.imported && (
                          <span className="text-[10px] bg-[#25D366] text-white px-1.5 py-0.5 rounded-full font-bold">{c.unread}</span>
                        )}
                        {c.imported && (
                          <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Kanban className="w-2.5 h-2.5" />CRM
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMsg}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                        <Phone className="w-3 h-3" />{c.phone}
                        <span className="mx-1">·</span>
                        <Clock className="w-3 h-3" />{c.time}
                      </div>
                    </div>

                    {/* Action */}
                    {c.imported ? (
                      <Button size="sm" variant="ghost" className="text-xs text-primary gap-1 flex-shrink-0" onClick={() => navigate("/crm")}>
                        <Kanban className="w-3.5 h-3.5" />Ver no CRM
                      </Button>
                    ) : (
                      <Button size="sm" className="text-xs gap-1 flex-shrink-0" style={{ background: "#25D366", border: "none", color: "#fff" }} onClick={() => importOne(c)}>
                        <UserPlus className="w-3.5 h-3.5" />Enviar ao CRM
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
