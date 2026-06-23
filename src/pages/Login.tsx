import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden md:flex flex-col justify-between p-12 gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
        <div className="relative flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold">Corretor<span className="text-primary-glow">360</span></span>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            A plataforma completa do corretor de imóveis.
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            CRM, site profissional, gestão de imóveis, contratos, vistorias e financeiro — em um único lugar.
          </p>
          <div className="flex gap-6 pt-4">
            {["Site profissional", "CRM Kanban", "Contratos digitais"].map((f) => (
              <div key={f} className="text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-glow mb-2" />
                {f}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-sm text-primary-foreground/60">© 2025 Corretor360</div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <Card className="w-full max-w-md p-8 shadow-card border-border/60">
          <div className="md:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">Corretor360</span>
          </div>
          <h2 className="text-2xl font-bold">Bem-vindo de volta</h2>
          <p className="text-sm text-muted-foreground mt-1">Entre na sua conta para continuar.</p>

          <Button variant="outline" className="w-full mt-6 gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continuar com Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou com e-mail</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="voce@corretor360.com" className="mt-1.5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button className="text-xs text-primary hover:underline">Esqueceu a senha?</button>
              </div>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1.5" />
            </div>
            <Button asChild className="w-full gradient-primary border-0 shadow-glow">
              <Link to="/dashboard">Entrar</Link>
            </Button>
          </div>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Novo por aqui? <Link to="/onboarding" className="text-primary font-medium hover:underline">Criar conta grátis</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
