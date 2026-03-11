import { Badge } from "@/components/ui/badge";
import { trustLogos } from "@/components/marketing/marketing-site-data";

function TrustLogoGlyph({ name }: { name: string }) {
  switch (name) {
    case "Microsoft 365":
      return (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 4H10V10H4V4Z" fill="#72E4FF" /><path d="M14 4H20V10H14V4Z" fill="#A78BFA" />
          <path d="M4 14H10V20H4V14Z" fill="#5EEAD4" /><path d="M14 14H20V20H14V14Z" fill="#F8FAFC" fillOpacity="0.92" />
        </svg>
      );
    case "Gmail":
      return (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M4 7.5L12 13.5L20 7.5" stroke="#72E4FF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.5 7H18.5C19.3 7 20 7.7 20 8.5V16.5C20 17.3 19.3 18 18.5 18H5.5C4.7 18 4 17.3 4 16.5V8.5C4 7.7 4.7 7 5.5 7Z" stroke="white" strokeOpacity="0.9" strokeWidth="1.6" />
        </svg>
      );
    case "NetSuite":
      return (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M5 17.5V6.5L12 13L19 6.5V17.5" stroke="white" strokeOpacity="0.92" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 17.5H19" stroke="#72E4FF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "SAP":
      return (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M5 8H19" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 12H16" stroke="white" strokeOpacity="0.92" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 16H13" stroke="#72E4FF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "Dynamics 365":
      return (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 5L15.5 8.5V19L7 15V5Z" fill="#72E4FF" fillOpacity="0.92" />
          <path d="M15.5 8.5L19 5V15.5L15.5 19V8.5Z" fill="#A78BFA" fillOpacity="0.92" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 8.5H17.5L14 12L17.5 15.5H7" stroke="white" strokeOpacity="0.92" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 6.5H18" stroke="#72E4FF" strokeWidth="1.8" strokeLinecap="round" />
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
              className="mx-2 flex min-w-[210px] items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex size-12 items-center justify-center rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <TrustLogoGlyph name={logo.name} />
              </div>
              <div>
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