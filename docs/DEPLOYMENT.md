# Isoliertes Deployment und Rückweg

Es wurden keine Verbindungen per SSH/SFTP, keine Serveränderungen und keine
Produktiv-Updates vorgenommen. Ein separates Testpostfach und ein Testpfad
existieren laut Benutzer noch nicht.

## Lokaler Test

Der Stalwart-Build wird mit dem unveränderten Upstream-Testserver unter
`/webmail-test/` emuliert. Diese Vorschau dient Layout-, Asset- und Routingtests.
Sie hat selbst keine JMAP-, Discovery- oder Token-Endpunkte.

## Test auf NewEVEn vorbereiten

1. Dediziertes Testkonto in Stalwart mit synthetischen Nachrichten, Kontakten und
   Terminen anlegen. Zugangsdaten lokal verwalten, nicht ins Repository schreiben.
2. Bestehende produktive Application-Konfiguration, verwendete Bundle-URL,
   ZIP und SHA-256 außerhalb dieses Projekts sichern. Auch ggf. die aktuelle
   Caddy-Konfiguration sichern, bevor sie später überhaupt geändert wird.
3. Das erzeugte ZIP `dist/neweven-mail-1.17.0-stalwart.zip` per vorhandenem
   SSH/SFTP-Zugang `webdeploy` in einen versionierten Release-Ordner hochladen.
   Keine Produktionsdateien überschreiben. Zielpfad und erreichbare HTTPS-
   Download-URL sind vor dem ersten Upload anhand der Serverkonfiguration zu prüfen.
4. In Stalwart eine **zusätzliche Application** für `webmail-test` erstellen.
   Die tatsächlichen Felder und Rechte anhand der installierten Stalwart-Version
   prüfen. Als Ressource die eigene versionierte ZIP-URL nutzen. `/webmail/`
   und `/admin/` unangetastet lassen. Für SSO eine zur Test-Application passende
   OAuth-Konfiguration mit dem Testpfad verwenden.
5. Unter `https://neweven.ebriefbox.de/webmail-test/` alle Akzeptanztests durchführen.
   Der Stalwart-Build verwendet denselben Origin als JMAP-Server und erkennt seinen
   Mount selbst. Caddy nicht pauschal umschreiben.

Offizielle Ausgangsdokumentation:
https://www.bulwarkmail.org/docs/deployment/stalwart-app
Die Serververwaltung und konkrete installierte Version bleiben maßgeblich;
API-Felder und SSH-Konfiguration werden hier nicht erfunden.

## Akzeptanz vor Produktion

- Login, falsches Passwort, TOTP, ggf. SSO, Logout und erneuter Login.
- JMAP-Discovery/Session; synthetische Mail senden, empfangen und beantworten.
- Anhang senden/herunterladen, Ordner/Tags, Suche.
- Kontakt und Termin anlegen/ändern/löschen, Datei hoch-/herunterladen.
- Desktop, Tablet, Smartphone; Chrome/Firefox/Safari soweit verfügbar.
- Netzwerkübertragung, Ladezeit und Fehlerkonsole prüfen.
- Keine echten Mailinhalte in Screenshots oder Logs; Browser-Traces nur mit Testkonto.

## Produktionswechsel und Rollback

Erst nach bestandenen Tests die bestehende produktive Application gezielt auf die
neue versionierte Ressource umstellen. Vorher die vollständige vorherige
Application-Konfiguration einschließlich alter Ressourcen-URL und ZIP aufbewahren.
Keine Datenbank-/Mailbox-Migration ist Teil dieser Designänderung.

Bei Problemen die alte Ressourcen-URL bzw. alte ZIP-Version in derselben
Application wiederherstellen, Update auslösen und `/webmail/` mit frischer
Browsersitzung prüfen. Die Test-Application zur Diagnose behalten. Keine
Cache-Löschung aller Browserdaten als Rollback-Ersatz verwenden. Der konkrete
Update- und Rücksetzablauf muss zuerst mit der zusätzlichen Test-Application
auf diesem Server erprobt werden.
