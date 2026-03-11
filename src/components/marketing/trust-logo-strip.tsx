import { Badge } from "@/components/ui/badge";
import { trustLogos } from "@/components/marketing/marketing-site-data";

function TrustLogoWordmark({ name }: { name: string }) {
  switch (name) {
    case "Microsoft 365":
      return (
        <svg viewBox="0 0 194 36" className="h-8 w-auto" role="img" aria-label="Microsoft 365">
          <path d="M4 4H15V15H4V4Z" fill="#F25022" />
          <path d="M18 4H29V15H18V4Z" fill="#7FBA00" />
          <path d="M4 18H15V29H4V18Z" fill="#00A4EF" />
          <path d="M18 18H29V29H18V18Z" fill="#FFB900" />
          <text x="40" y="22" fill="#F8FAFC" fontSize="16" fontWeight="600" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
            Microsoft 365
          </text>
        </svg>
      );
    case "Gmail":
      return (
        <svg viewBox="0 0 146 36" className="h-8 w-auto" role="img" aria-label="Gmail">
          <path d="M4 27V9.2L10.6 14.3V27H4Z" fill="#4285F4" />
          <path d="M10.6 14.3L18 20.1L25.4 14.3V27H10.6V14.3Z" fill="#34A853" />
          <path d="M25.4 14.3L32 9.2V27H25.4V14.3Z" fill="#FBBC04" />
          <path d="M4 9.2L18 20.1L32 9.2L28.1 6.2L18 14.2L7.9 6.2L4 9.2Z" fill="#EA4335" />
          <text x="42" y="22" fill="#F8FAFC" fontSize="16" fontWeight="600" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
            Gmail
          </text>
        </svg>
      );
    case "NetSuite":
      return (
        <svg viewBox="0 0 170 36" className="h-8 w-auto" role="img" aria-label="NetSuite">
          <path d="M7 27V8L19 20V27H7Z" fill="#75AADB" />
          <path d="M19 20V8H31V27L19 20Z" fill="#5477A3" />
          <text x="42" y="22" fill="#D8E5F4" fontSize="16" fontWeight="700" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
            NetSuite
          </text>
        </svg>
      );
    case "SAP":
      return (
        <svg viewBox="0 0 110 36" className="h-8 w-auto" role="img" aria-label="SAP">
          <path d="M4 6H88L74 30H4V6Z" fill="#0FAAFF" />
          <text x="18" y="23" fill="#FFFFFF" fontSize="16" fontWeight="800" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
            SAP
          </text>
        </svg>
      );
    case "Dynamics 365":
      return (
        <svg viewBox="0 0 190 36" className="h-8 w-auto" role="img" aria-label="Dynamics 365">
          <path d="M7 7L22 13V29L7 22V7Z" fill="#4FD1FF" />
          <path d="M22 13L30 7V23L22 29V13Z" fill="#6366F1" />
          <text x="42" y="22" fill="#EEF2FF" fontSize="16" fontWeight="600" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
            Dynamics 365
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 138 36" className="h-8 w-auto" role="img" aria-label="Stripe">
          <text x="4" y="24" fill="#A78BFA" fontSize="22" fontWeight="800" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif">
            stripe
          </text>
        </svg>
      );
  }
}

export function TrustLogoStrip() {
  const items = [...trustLogos, ...trustLogos];

  return (
    <section className="mt-4 space-y-5">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="muted">Ecosystem fit</Badge>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Built to fit the systems distributor teams already run every day.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/64">
          OrderPilot is designed for shared mailbox intake, reviewer workflow, billing readiness, and ERP handoff — not for a disconnected demo flow.
        </p>
      </div>

      <div className="logo-marquee">
        <div className="logo-marquee-track">
          {items.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="mx-2 flex min-w-[230px] flex-col justify-center rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex h-8 items-center">
                <TrustLogoWordmark name={logo.name} />
              </div>
              <div className="mt-4 border-t border-white/8 pt-3">
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">{logo.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}