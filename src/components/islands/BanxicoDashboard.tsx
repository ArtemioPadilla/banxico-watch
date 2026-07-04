import * as React from 'react';
import { LineChart } from '@/components/ui/charts/line-chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import historial from '@/data/banxico-valores-gubernamentales.json';

interface Registro {
  fecha: string;
  valor: number;
  [key: string]: string | number;
}

const data = (historial as { historial: Registro[] }).historial;

function formatMDP(n: number): string {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 }).format(n);
}

export function BanxicoDashboard() {
  const last = data[data.length - 1];
  const prev = data.length > 1 ? data[data.length - 2] : undefined;
  const deltaPct = prev && prev.valor !== 0 ? ((last.valor - prev.valor) / prev.valor) * 100 : null;
  const isAnomaly =
    last &&
    prev &&
    ((prev.valor === 0 && last.valor !== 0) ||
      Math.abs(last.valor - prev.valor) > 5000 ||
      (deltaPct !== null && Math.abs(deltaPct) > 50));

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
          Banxico Watch
        </h1>
        <p className="text-muted-foreground">
          Monitoreo semanal del renglón <strong>&quot;Valores Gubernamentales&quot;</strong> en el
          Activo del balance de Banxico — señal de uso de la facultad de compra de bonos en
          mercado secundario habilitada por la <strong>Circular 8/2026</strong>.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Último valor</CardDescription>
            <CardTitle className="text-3xl">{last ? formatMDP(last.valor) : '—'}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            millones de pesos · {last?.fecha ?? 'sin datos'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Cambio vs. semana anterior</CardDescription>
            <CardTitle className="text-3xl">
              {deltaPct !== null ? `${deltaPct > 0 ? '+' : ''}${deltaPct.toFixed(1)}%` : '—'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            {prev ? `desde ${formatMDP(prev.valor)} (${prev.fecha})` : 'sin dato previo'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Estado</CardDescription>
            <CardTitle className="text-3xl">
              {isAnomaly ? (
                <Badge className="bg-amber-500 text-white">Anomalía</Badge>
              ) : (
                <Badge className="bg-emerald-600 text-white">Normal</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            Actualizado cada jueves por cron automático
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>
            Valores Gubernamentales en el Activo (millones de pesos) — fuente: Estado de Cuenta
            Consolidado Semanal de Banxico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={data}
            index="fecha"
            series={['valor']}
            height={320}
            ariaLabel="Histórico de Valores Gubernamentales en el balance de Banxico"
          />
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground">
        Fuente:{' '}
        <a
          className="underline"
          href="https://www.banxico.org.mx/publicaciones-y-prensa/informacion-semanal-del-estado-de-cuenta-consolida/estado-cuenta-semanal-consoli.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Banxico — Información semanal del Estado de Cuenta Consolidado
        </a>
        . Este sitio es de monitoreo informativo, no es asesoría financiera.
      </p>
    </div>
  );
}
