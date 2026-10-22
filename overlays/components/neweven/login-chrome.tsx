"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { withBasePath } from "@/lib/browser-navigation";
import { LITE_BUILD_ID } from "@/lib/lite";
import { Shield, User, Server } from "@/components/icons";

export function NewEVEnBrand() {
  const de = useLocale() === "de";
  return <header className="neweven-brand">
    <img src={withBasePath(`/branding/neweven/mark.svg?v=${LITE_BUILD_ID}`)} alt="" width="152" height="152" />
    <h1>NewEVEn <span>Mail</span></h1>
    <p>{de ? "SICHER. PERSÖNLICH. UNABHÄNGIG." : "SECURE. PERSONAL. INDEPENDENT."}</p>
  </header>;
}

export function NewEVEnLanguage() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const search = useSearchParams();
  return <label className="neweven-language">
    <span aria-hidden="true">◎</span>
    <select aria-label={locale === "de" ? "Sprache" : "Language"} value={locale}
      onChange={event => router.replace(`${pathname}${search.size ? `?${search.toString()}` : ""}`, { locale: event.target.value })}>
      <option value="de">Deutsch</option><option value="en">English</option>
    </select>
  </label>;
}

export function NewEVEnBenefits() {
  const de = useLocale() === "de";
  const items = de ? [
    [Shield, "Sicherheit", "Ihre Kommunikation auf Ihrem eigenen Mailserver."],
    [User, "Persönlich", "Für Menschen. Für Ihre Kommunikation."],
    [Server, "Unabhängig", "Offene Software. Unter Ihrer Kontrolle."],
  ] as const : [
    [Shield, "Security", "Your communication on your own mail server."],
    [User, "Personal", "For people. For your communication."],
    [Server, "Independent", "Open software. Under your control."],
  ] as const;
  return <section className="neweven-benefits" aria-label={de ? "NewEVEn Mail" : "About NewEVEn Mail"}>
    {items.map(([Icon, title, text]) => <div key={title}><span className="neweven-benefit-icon"><Icon size={25} /></span><div><h2>{title}</h2><p>{text}</p></div></div>)}
  </section>;
}
