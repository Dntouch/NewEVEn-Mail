# NewEVEn Mail

Eigene Gestaltung von **Bulwark Lite 1.17.0**, keine neue Webmail-Implementierung.
Erste Ausbaustufe: echte Bulwark-Anmeldung im NewEVEn-Design, mit unveränderter
Passwort-, TOTP-, Token- und OAuth-Logik. Mail, Kontakte, Kalender und Dateien
bleiben die vorhandenen Bulwark-Komponenten. Das eigene eingebaute Theme
**NewEVEn Mail** führt die Farbpalette in Navigation, Listen, Kalender, Dateien,
Dialogen und Einstellungen fort. Die Standardvorgabe ist dunkel; eine passende
helle Variante und alle bisherigen Themes bleiben wählbar.

## Projektaufbau

- `upstream/`: offizielles Git-Submodul, auf einen Commit festgelegt.
- `patches/`: überprüfbare Änderungen an bestehenden Komponenten und Build.
- `overlays/`: eigene React-Komponenten, CSS und SVG-Bildmarke.
- `branding/`: Designreferenz und generierter Weltraumhintergrund als Quelldatei.
- `.work/webmail/`: wegwerfbare, gepatchte Arbeitskopie; nicht versioniert.
- `dist/`: geprüfter Export und Stalwart-ZIP; nicht versioniert.
- `docs/`: Bestandsaufnahme, Deployment und Teststand.

## Lokaler Start

Voraussetzungen: Git, Python **3.12+**, Node **22.13+** und npm. Getestet mit
Node 26.7.0 und npm 11.19.0. Auf EVE liegt Node derzeit unter
`/home/stefan/.hermes/tools/node-26.7.0-linux-x64/bin`; gegebenenfalls diesen
Ordner vorab dem `PATH` hinzufügen. Für identische Abhängigkeiten immer `npm ci`
verwenden, keine ungeprüften automatischen Upgrades.

```bash
git submodule update --init --recursive
python3 scripts/project.py prepare
python3 scripts/project.py install
python3 scripts/project.py test
python3 scripts/project.py build --target stalwart
python3 scripts/project.py serve --target stalwart
```

Die Vorschau liegt unter **http://localhost:4173/webmail-test/de/login/**.
Sie emuliert den Stalwart-Mount, ist aber kein eigener Mailserver. Ohne Backend
werden keine erfolgreichen Anmeldungen oder Mails vorgetäuscht. Für einen echten
Login ist die isolierte Stalwart-Testinstallation aus `docs/DEPLOYMENT.md` nötig.

Alternativer statischer Export für Caddy oder lokale Oberflächentests:

```bash
python3 scripts/project.py prepare
NEWEVEN_TEST_SERVER=https://neweven.ebriefbox.de python3 scripts/project.py build --target static
python3 scripts/project.py serve --target static
```

Statischer Export: http://localhost:4173/de/login/. Ein vom Mailserver abweichender
Origin benötigt dessen passende CORS-Konfiguration; diese wird hier nicht verändert.
Vor Tests nach einem Build erneut `prepare` ausführen: Upstreams Lite-Build entfernt
serverseitige Komponenten und Testdateien ausschließlich aus der Arbeitskopie.

## Qualität und Releases

`test` führt gezielte vorhandene Regressionstests für Lite-Login und Mount-Pfade aus.
Der Produktionsbuild prüft TypeScript, statischen Export und Stalwart-ZIP-Struktur.
`scripts/browser-check.mjs` prüft zusätzlich die Anmeldung im Browser ohne echte
Zugangsdaten. `scripts/application-check.mjs` prüft das Anwendungsthema auf Desktop
und Smartphone mit Bulwarks synthetischen Demo-Daten. Teststand und Grenzen stehen in `docs/TESTSTATUS.md`.

Die npm-Lockdatei wird einschließlich gezielter Sicherheitsupdates als Patch
versioniert. Hintergrund-WebP und App-Icons werden deterministisch aus den
versionierten Originalen erzeugt. `dist/*-checksums.json` dokumentiert die
Upstream-Version, Patches und Prüfsummen der erzeugten Dateien. Die Build-Pipeline
ist wiederholbar; Byte-Identität über verschiedene Node-/Betriebssystemversionen
wird nicht zugesichert.

AGPL-3.0-only; ursprüngliche Hinweise in `LICENSE` und `NOTICE` bleiben erhalten.
Bei Bereitstellung gehört ein erreichbares Angebot des vollständigen zugehörigen
Quellcodes dazu. Vor Veröffentlichung die eigene Quellcode-URL konfigurieren.

## Anwendung ohne Testpostfach ansehen

Nach dem statischen Build kann eine **separate lokale Kopie** mit Bulwarks
synthetischen Demo-Daten gestartet werden:

```bash
python3 scripts/project.py demo
```

http://localhost:4174/de/login/ → Demo starten. Diese Vorschau verwendet keine
echten Postfächer und versendet keine echten Nachrichten. Der Demo-Schalter wird
nur in `dist/demo/config.json` gesetzt, weder im Stalwart-ZIP noch im statischen
Originalexport. Dort bleibt `demoMode=false`.

Mit laufenden Vorschauen lassen sich die Browserprüfungen wiederholen:

```bash
node scripts/browser-check.mjs
node scripts/application-check.mjs
```

Dafür muss Playwrights Chromium vorhanden sein (`npx playwright install chromium`
in `.work/webmail`), alternativ `CHROMIUM_PATH` auf einen vorhandenen Browser setzen.
Die GitHub-Actions-Workflowdatei führt die zugehörige Prüfung für beide Build-Ziele
aus; sie wurde lokal vorbereitet und noch nicht auf GitHub ausgeführt.
