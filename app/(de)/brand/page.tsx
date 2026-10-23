import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Impulse } from "@/components/brand/Impulse";
import { Wordmark } from "@/components/brand/Wordmark";
import { colors } from "@/lib/brand/tokens";

export const metadata: Metadata = {
  title: "Marke – Smart Flow",
  robots: { index: false, follow: false },
};

const wordmarks = [
  { variant: "underscore", label: "A · underscore (nicht gewählt)" },
  { variant: "impulse", label: "B · impulse (freigegeben, Bildmarke zwischen den Wörtern)" },
] as const;

const grounds = [
  { color: colors.ground, name: "Hintergrund" },
  { color: colors.groundEnd, name: "Grund-Ende" },
] as const;

const palette = [
  { name: "Hintergrund", hex: colors.ground, role: "Raum, Seite" },
  { name: "Grund-Ende", hex: colors.groundEnd, role: "Verlaufsende, Flächen" },
  {
    name: "Akzent",
    hex: colors.accent,
    role: "Das Signal. Aktives Bauteil, Links, CTA, Impuls. Einziger Akzent.",
  },
  { name: "Gedimmt", hex: colors.muted, role: "Sekundärtext, inaktive Labels" },
  { name: "Tinte", hex: colors.ink, role: "Fließtext, Überschriften" },
] as const;

const markSizes = [
  { size: 32, animated: false },
  { size: 64, animated: false },
  { size: 256, animated: false },
  { size: 256, animated: true },
] as const;

const headlines = [
  { px: 56, className: "text-[56px]", text: "Montag, sieben Uhr. Der Transporter ist gepackt." },
  { px: 40, className: "text-[40px]", text: "Die Praxis öffnet um acht." },
  { px: 28, className: "text-[28px]", text: "Drei Angebote liegen noch auf dem Schreibtisch." },
  { px: 20, className: "text-[20px]", text: "Die Heizungswartung ist auf Donnerstag verschoben." },
] as const;

const bodies = [
  {
    px: 18,
    className: "text-[18px]",
    text: "Am Vormittag ruft eine Kundin an und fragt nach dem Stand ihrer Badsanierung. Das Aufmaß liegt im Transporter, die Fotos sind auf dem Handy des Gesellen.",
  },
  {
    px: 16,
    className: "text-[16px]",
    text: "Am Empfang klingelt das Telefon, während zwei Patientinnen auf ihre Unterlagen warten. Die Rückrufliste steht auf einem Zettel neben der Tastatur.",
  },
] as const;

const labels = [
  { px: 14, className: "text-[14px]", text: "Station 01 · Anfrage" },
  { px: 12, className: "text-[12px]", text: "Rückruf · 14:30 Uhr" },
] as const;

function Caption({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[12px] text-muted">{children}</p>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="text-[28px] leading-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function BrandPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-28 px-6 py-24">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-[14px] text-muted">Richtung „Signal“ · Arbeitsstand</p>
        <h1 className="text-[56px] leading-none">Marke</h1>
        <p className="max-w-[60ch] text-[18px] text-muted">
          Diese Seite zeigt Wortmarke, Bildmarke, Farben und Schrift. Freigegeben ist
          Variante B mit der Bildmarke an der Stelle des Unterstrichs.
        </p>
      </header>

      <Section title="Wortmarke">
        {wordmarks.map(({ variant, label }) => (
          <div key={variant} className="flex flex-col gap-4">
            <h3 className="font-mono text-[14px] font-semibold tracking-normal text-accent">
              {label}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {grounds.map(({ color, name }) => (
                <figure key={color} className="flex flex-col gap-3">
                  <div
                    className="flex min-h-[220px] flex-col items-start justify-center gap-10 border border-line px-10 py-12"
                    style={{ background: color }}
                  >
                    <Wordmark variant={variant} size={48} className="h-auto max-w-full" />
                    <Wordmark variant={variant} size={20} className="h-auto max-w-full" />
                  </div>
                  <figcaption>
                    <Caption>
                      auf {name} {color} · 48 px und 20 px hoch
                    </Caption>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Bildmarke">
        <div className="flex flex-wrap items-end gap-x-12 gap-y-10">
          {markSizes.map(({ size, animated }) => (
            <figure key={`${size}-${animated}`} className="flex flex-col gap-3">
              <div className="border border-line p-6">
                <Impulse size={size} animated={animated} />
              </div>
              <figcaption>
                <Caption>
                  {size} px{animated ? " · animiert" : ""}
                </Caption>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Farben">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {palette.map(({ name, hex, role }) => (
            <li key={hex} className="flex flex-col gap-3">
              <div className="h-28 border border-line" style={{ background: hex }} />
              <p className="text-[16px] font-semibold">{name}</p>
              <p className="font-mono text-[14px]">{hex}</p>
              <p className="text-[14px] text-muted">{role}</p>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 border border-line" style={{ background: colors.groundEnd }} />
          <div className="flex flex-col gap-1">
            <p className="font-mono text-[14px]">{colors.groundEnd}</p>
            <p className="text-[14px] text-muted">Hintergrund hell (Szenenende)</p>
          </div>
        </div>
      </Section>

      <Section title="Schrift">
        <div className="flex flex-col gap-8">
          {headlines.map(({ px, className, text }) => (
            <div key={px} className="flex flex-col gap-2">
              <Caption>Schibsted Grotesk 800 · {px} px</Caption>
              <p className={`${className} font-extrabold leading-tight tracking-[-0.03em]`}>{text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {bodies.map(({ px, className, text }) => (
            <div key={px} className="flex max-w-[65ch] flex-col gap-2">
              <Caption>Schibsted Grotesk 400 · {px} px</Caption>
              <p className={`${className} leading-relaxed`}>{text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-8">
          {labels.map(({ px, className, text }) => (
            <div key={px} className="flex flex-col gap-2">
              <Caption>JetBrains Mono 400 · {px} px</Caption>
              <p className={`${className} font-mono`}>{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tonprobe">
        <figure className="flex max-w-[60ch] flex-col gap-4 border-l-2 border-accent pl-6">
          <figcaption>
            <Caption>Tonprobe, keine finale Zeile</Caption>
          </figcaption>
          <blockquote className="text-[24px] leading-snug">
            <p>
              „Zu viel Signal. Zu wenig Nutzen. Wir trennen, was Ihrem Betrieb hilft, von dem,
              was nur laut ist. Dann setzen wir es um, bis es läuft.“
            </p>
          </blockquote>
        </figure>
      </Section>
    </main>
  );
}
