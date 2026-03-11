import { Badge } from "@/components/ui/badge";
import { trustLogos } from "@/components/marketing/marketing-site-data";

function PartnerLogo({ id, name }: { id: (typeof trustLogos)[number]["id"]; name: string }) {
  if (id === "microsoft-365") {
    return (
      <svg viewBox="0 0 180 34" className="h-8 w-auto" role="img" aria-label={name}>
        <rect x="0" y="3" width="12" height="12" fill="#F25022" />
        <rect x="14" y="3" width="12" height="12" fill="#7FBA00" />
        <rect x="0" y="17" width="12" height="12" fill="#00A4EF" />
        <rect x="14" y="17" width="12" height="12" fill="#FFB900" />
        <text x="38" y="16" fill="#F8FAFC" fontSize="12" fontWeight="600" fontFamily="Arial, Helvetica, sans-serif">
          Microsoft
        </text>
        <text x="38" y="29" fill="#CBD5E1" fontSize="11" fontWeight="500" fontFamily="Arial, Helvetica, sans-serif">
          365
        </text>
      </svg>
    );
  }

  if (id === "gmail") {
    return (
      <svg viewBox="0 0 148 34" className="h-8 w-auto" role="img" aria-label={name}>
        <path d="M4 25V9.5L17 18.5L30 9.5V25" fill="none" stroke="#EA4335" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 9.5L17 19L30 9.5" fill="none" stroke="#4285F4" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 25H30" stroke="#34A853" strokeWidth="4.2" strokeLinecap="round" />
        <path d="M4 25V13" stroke="#FBBC04" strokeWidth="4.2" strokeLinecap="round" />
        <text x="42" y="22" fill="#F8FAFC" fontSize="14" fontWeight="600" fontFamily="Arial, Helvetica, sans-serif">
          Gmail
        </text>
      </svg>
    );
  }

  if (id === "netsuite") {
    return (
      <svg viewBox="0 0 170 34" className="h-8 w-auto" role="img" aria-label={name}>
        <path d="M7 26V8L21.5 26V8" fill="none" stroke="#59C5FF" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="35" y="22" fill="#F8FAFC" fontSize="14" fontWeight="700" fontFamily="Arial, Helvetica, sans-serif">
          NetSuite
        </text>
      </svg>
    );
  }

  if (id === "sap") {
    return (
      <svg viewBox="0 0 130 34" className="h-8 w-auto" role="img" aria-label={name}>
        <path d="M6 5H102L118 29H6V5Z" fill="#0FAAFF" />
        <text x="28" y="22" fill="white" fontSize="15" fontWeight="800" fontFamily="Arial, Helvetica, sans-serif">
          SAP
        </text>
      </svg>
    );
  }

  if (id === "dynamics-365") {
    return (
      <svg viewBox="0 0 186 34" className="h-8 w-auto" role="img" aria-label={name}>
        <path d="M8 25L21 7L34 15L21 27L8 25Z" fill="#60A5FA" />
        <path d="M21 7L34 15L34 29L21 27V7Z" fill="#2563EB" />
        <text x="48" y="16" fill="#F8FAFC" fontSize="12.5" fontWeight="600" fontFamily="Arial, Helvetica, sans-serif">
          Dynamics
        </text>
        <text x="48" y="29" fill="#CBD5E1" fontSize="11" fontWeight="500" fontFamily="Arial, Helvetica, sans-serif">
          365
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 150 34" className="h-8 w-auto" role="img" aria-label={name}>
      <text x="4" y="23" fill="#A78BFA" fontSize="18" fontWeight="800" fontStyle="italic" fontFamily="Arial, Helvetica, sans-serif">
        stripe
      </text>
    </svg>
  );
}

export function TrustLogoStrip() {
  const items = [...trustLogos, ...trustLogos];

  return (
    <section className="mt-6 space-y-6">
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
              key={`${logo.id}-${index}`}
              className="mx-2 flex min-w-[248px] items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4"
            >
              <div className="flex min-w-0 flex-1 items-center justify-start rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
                <PartnerLogo id={logo.id} name={logo.name} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base font-semibold text-white">{logo.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">{logo.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}