# Technische Bestandsaufnahme

Untersucht: offizielles Repository https://github.com/bulwarkmail/webmail,
Tag `1.17.0`, Commit `065006788444e9b680bd69d9243c80c8a211b215`.
Alle folgenden Pfade beziehen sich auf genau diesen Stand, nicht auf Vermutungen.

## Build und Paketierung

Next.js 16, React 19, TypeScript, Tailwind 4, Zustand und next-intl.
`package.json` definiert `build:lite` als `node scripts/lite/build.mjs`.
`prepare.mjs` entfernt Serverrouten, Admin, Sandbox und Tests aus einer wegwerfbaren
Kopie. `NEXT_PUBLIC_BULWARK_LITE=1` aktiviert den statischen Export in
`next.config.ts`. `postbuild.mjs` schreibt Konfiguration, Policy, Manifest und
Einstieg; `verify.mjs` prüft den Export gegen die tatsächlichen Lite-Anforderungen.

`--target=stalwart` erzeugt `bulwark-lite-stalwart.zip`, ohne umschließenden Ordner.
Das Bundle erkennt den tatsächlichen Application-Pfad zur Laufzeit. Deshalb darf
kein `NEXT_PUBLIC_BASE_PATH` fest eingebrannt sein. Einstieg und Asset-URLs werden
über die vorhandene Mount-Logik in `lib/lite.ts` und `scripts/lite/lib.mjs` aufgelöst.
`serve.mjs --stalwart=/webmail-test` emuliert diesen Mechanismus lokal.

Die Upstream-CI `.github/workflows/static-lite.yml` baut statische und Stalwart-
Artefakte separat. Ein zusätzlicher Node-Server ist beim späteren Betrieb unnötig.

## Branding und Oberfläche

`lib/lite-config.ts` verarbeitet unter anderem App-Namen, Logos für beide Modi,
Favicon, Logo-Abmessungen, Firmenname, rechtliche Links, TOTP, Token-Login und
Versionsanzeige. Die statische Konfiguration wird über `hooks/use-config.ts`
gelesen. Die Admin-Branding-Routen gehören zur Serveredition; Lite braucht
`config.json`, nicht das Bulwark-Adminpanel.

`app/(main)/[locale]/login/page.tsx` enthält die vorhandene Anmeldung samt TOTP,
OAuth/PKCE, mehreren Konten und Serverwahl. Sie bleibt Grundlage der Umsetzung.
`app/globals.css`, `app/theme-inline.css`, `stores/theme-store.ts`,
`lib/builtin-themes.ts`, `lib/theme-compiler.ts` und `lib/theme-loader.ts` regeln
globale Tokens, eingebaute Themes und Theme-Verarbeitung. Farben allein reichen
für das neue Login-Layout nicht. Lite deaktiviert die servergebundene Plugin-
und Theme-Verwaltung; eine reine externe Theme-Erweiterung wäre daher keine
vollständige Lösung.

Komponenten für Mail, Layout, Editor, Kontakte, Kalender, Dateien und Einstellungen
liegen getrennt unter `components/`. JMAP und Zustand-Stores bleiben unverändert.
Das Login-CSS ist bewusst auf `.neweven-login` begrenzt. Die angemeldete Oberfläche
verwendet das eigene eingebaute NewEVEn-Theme mit dunkler Startvorgabe.
Helle Variante und bestehende Themes bleiben wählbar.

## Architekturentscheidung

Festgelegtes Upstream-Submodul + kleine, geordnete Patches + eigene Overlay-Dateien.
Ein vollständiger Quellcode-Fork würde bei dieser zunächst schmalen Änderung viele
unveränderte Dateien verdoppeln. Eine reine Branding-Konfiguration könnte Layout,
Hintergrund und Struktur nicht ersetzen. `git apply --check` beendet den Aufbau bei
Patch-Konflikten, statt fehlerhafte Anpassungen stillschweigend zu übernehmen.
Wenn die Webmail-Anpassung später viele Komponenten verändert, ist diese
Entscheidung zugunsten eines gepflegten Forks erneut zu bewerten.

## Eigene Änderungen

1. Login-Markup: neue äußere Gestaltung, Sprachwahl, Header und Infobereich.
2. Lite-Branding: Logo/Favicon, dunkle Start-Policy und Manifestfarben.
3. Systemschriften statt Build-Downloads bei Google; keine zusätzliche Font-Abhängigkeit.
4. Sicherheit: Next 16.4.2 und DOMPurify 3.4.17 mit festgehaltener Lockdatei.
   Die ursprüngliche Installation meldete zwei kritische Pakete; nach der gezielten
   Aktualisierung meldete `npm audit` keine bekannten Schwachstellen.
5. Webpack statt Turbopack: die lokale Sandbox blockiert Turbopacks interne Ports.

Die Unterschiede zwischen Lite und Serveredition stammen aus Upstream; es werden
keine zusätzlichen Mail-Funktionsgrenzen eingeführt.

## Lizenz

`package.json`, `LICENSE` und `NOTICE`: AGPL-3.0-only, mit überlieferten MIT-Hinweisen
in der Fork-Historie. Hinweise werden beibehalten. Zum angebotenen Quellcode gehören
auch Patches, Overlays, Buildskripte und die referenzierte Upstream-Version.

## Übernahme späterer Versionen

1. Separaten Git-Zweig anlegen, bisheriges geprüftes Release archivieren.
2. Gewünschten offiziellen Tag im Submodul auschecken, Commit/Tag in
   `config/upstream.json` aktualisieren und Submoduländerung versionieren.
3. `prepare` ausführen. Konflikte einzeln anhand des neuen Quellcodes lösen;
   ein fehlgeschlagener Patch darf nicht einfach ausgelassen werden.
4. Sicherheits-Patch prüfen: bereits von Upstream behobene Änderungen entfernen.
5. Sauberes `npm ci`, Regressionstests und beide Build-Ziele ausführen.
6. Mount-Pfade, Sprachwechsel, 2FA/SSO und Mobilansicht prüfen; anschließend
   echte Testpostfach-Abläufe ausführen. Erst danach Release taggen/bereitstellen.

Ergänzung zur Portabilität: Webpack erhält neutrale Chunk-Dateinamen ohne
Route-Klammern. Der Stalwart-Postbuild setzt den Chunk-Präfix auf den zur Laufzeit
erkannten Mount; die Anpassung bricht bei verändertem Runtime-Format ausdrücklich
ab. Die Browserprüfung kontrolliert diesen Pfad anhand des kompilierten Bundles.
Eigene Login-Assets führen die Build-ID im Query, damit immutable Asset-Caches
nach einem Versionswechsel nicht die alte Gestaltung festhalten.

Die erste Ausbaustufe exportiert Deutsch und Englisch. Die Upstream-Übersetzungen
bleiben vollständig im Submodul erhalten; weitere Sprachvarianten können im
Buildprofil und in der Login-Sprachwahl ergänzt werden.


## NewEVEn-Farbthema nach der Anmeldung

`overlays/lib/neweven-theme.ts` definiert ein zusätzliches eingebautes Theme über
die vorhandene `InstalledTheme`-Schnittstelle. Es nutzt Bulwarks semantische Tokens
für Flächen, Text, Sidebar, Auswahl, Bedienelemente und Statusfarben. Ein kleines
Skin ergänzt Dialogschatten und blaue Aktionsflächen; Nachrichtentext und HTML-
Darstellung bleiben in der vorhandenen Mail-Pipeline.

`policy.json` setzt `builtin-neweven` als Vorgabe. Der ThemeProvider berücksichtigt
das Eintreffen der asynchron geladenen Policy. Eine explizite vorhandene Theme-
Auswahl des Benutzers wird dabei beibehalten. In diesem Fall lässt sich NewEVEn
in den Darstellungseinstellungen auswählen. Alle sieben ursprünglichen Themes
bleiben registriert.

24 Kontrastprüfungen kontrollieren zentrale Text-/Flächenpaare in beiden Modi auf
mindestens 4,5:1. Das ist keine vollständige Accessibility-Zertifizierung der
Anwendung. Die separate Demo dient der optischen und technischen Prüfung der
echten Oberflächen mit synthetischen Daten, nicht einem echten JMAP-Integrationstest.
