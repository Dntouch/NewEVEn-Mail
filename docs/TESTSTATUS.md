# Teststand – 23. Oktober 2026

## Erfolgreich geprüft

- Frischer Aufbau aus festgelegtem Upstream-Commit; alle zwölf Patches anwendbar.
- Lockfile-Installation mit `npm ci --ignore-scripts`; die korrigierten Abhängigkeiten
  ließen sich auch mit dem vorher gefüllten npm-Cache ohne Netz installieren.
- 211 Tests in sieben Vitest-Dateien: Lite-Konfiguration, Stalwart-Mount-Laufzeit,
  Lite-Anmeldung und Sitzung, HTML-Mail-Sanitizing, eingebaute Themes sowie
  Textkontraste des NewEVEn-Themes. Darin 24 Kontrastprüfungen mit mindestens 4,5:1.
- Beide Produktionsbuilds mit TypeScript-Prüfung: statischer Export und
  Stalwart-Application-ZIP. Upstreams Export-/Paketprüfung erfolgreich.
- Nach gezielten Updates auf Next 16.4.2 und DOMPurify 3.4.17 meldete npm audit
  keine bekannten Schwachstellen. Das ist eine Momentaufnahme, kein Dauerzertifikat.
- Chromium: Login bei 1440×1000, 768×1024, 390×844 und 320×740. Logo geladen,
  kein horizontales Überlaufen, Passwort ein-/ausblenden, 2FA-Feld und numerische
  Eingabe, Sprachwechsel Deutsch/Englisch unter `/webmail-test/`.
- Chromium: Mail, Kalender, Kontakte, Dateien und Einstellungen auf Desktop und
  Smartphone mit Bulwarks synthetischer Demo. Zehn Prüfungen für aktives
  NewEVEn-Theme, dunkle Farbwerte, geladenen Anwendungszustand und Seitenbreite.
  Keine JavaScript-Laufzeitfehler in diesen geprüften Abläufen.
- Eigene Hintergrunddatei im WebP-Format: etwa 196 KB. Das geprüfte
  Stalwart-Bundle umfasst etwa 11,7 MB. Größen sind keine Ladezeitmessung.

Browserberichte und Screenshots stehen lokal unter `artifacts/`. Sie enthalten
nur leere Loginfelder bzw. Bulwarks synthetische Demo-Daten, keine echten Postfächer.
Die Browserprüfungen verhindern externe Netzwerkanfragen.

## Noch offen

Es gibt noch kein separates NewEVEn-Testpostfach und keine separate Server-
Application. Deshalb sind echter Login/Logout, TOTP-/SSO-Ablauf, JMAP, Versand,
Empfang, Anhänge, Kontakte-/Kalenderänderungen und Datei-Uploads gegen NewEVEn
noch nicht integriert getestet. Die automatisierten Eingabe- und Storetests
ersetzen diese Tests nicht.

Firefox, Safari, reale Mobilgeräte, Tastatur-/Screenreader-Komplettprüfung,
Ladezeit-/Speicherprofile und Lasttests sind noch nicht durchgeführt.
Die GitHub-Actions-Workflowdatei ist eingerichtet, aber noch nicht auf einem
entfernten Repository ausgeführt.

Ein lokal geprüftes Vorgänger-Bundle wurde per SSH/SFTP als versionierter
Download bereitgestellt. Keine Änderung an Stalwart, Caddy oder der produktiven
Webmail-Application. Der dokumentierte Rollback muss zuerst mit einer separaten
Test-Application auf dem tatsächlichen Server erprobt werden.

GitHub-Veröffentlichung vorbereitet: Release-Job nach beiden Build-Jobs,
Tag-Muster `neweven-v*`, direkter ZIP-Download und SHA-256-Prüfsummen. YAML
lokal geparst, 211 Tests nach Ergänzung des Projekt-Quellcodelinks erneut bestanden.
Die neue Workflow-Ausführung und tatsächliche Veröffentlichung sind noch offen.


## Helles Theme mit Login-Anmutung

Die helle Variante nutzt eine marineblaue Navigation mit dezentem Sternmuster und
blauen Akzenten. Nachrichteninhalt und die gesamte Lesefläche bleiben weiß.
Dark Mode bleibt unverändert. Geprüft mit 211 Regressionstests und 22 Browser-
Ansichtsprüfungen für beide Modi auf Desktop und Smartphone. In den zusätzlichen
Leseansicht-Prüfungen müssen Mailinhalt und Lesefläche jeweils exakt Weiß sein.
Die neue Gestaltung wurde lokal für beide Build-Ziele erzeugt. Diese Prüfungen
verwenden weiterhin ausschließlich synthetische Demo-Daten.
