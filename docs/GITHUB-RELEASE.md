# Veröffentlichung über GitHub

Ziel: öffentliches Repository `Dntouch/NewEVEn-Mail`.

## Einmalig

Auf GitHub ein **leeres öffentliches Repository** `NewEVEn-Mail` erstellen,
ohne automatisch erzeugte README, Lizenz oder .gitignore. Diese Dateien sind
bereits Teil dieses Projekts. Anschließend den lokalen geprüften Projektzweig
als Hauptzweig veröffentlichen:

```bash
git remote add origin git@github.com:Dntouch/NewEVEn-Mail.git
git push -u origin HEAD:main
```

Auf GitHub `main` als Standardzweig verwenden. Repository-Zugriff per SSH und
Actions-Berechtigungen müssen für das eigene Konto verfügbar sein.

## Release

Nach erfolgreicher Prüfung des hochgeladenen Commits:

```bash
git tag -a neweven-v1.17.0-1 -m 'NewEVEn Mail: erstes Testrelease'
git push origin neweven-v1.17.0-1
```

Der Workflow baut statisch und für Stalwart, führt die Tests und Browserprüfungen
aus und veröffentlicht erst nach Erfolg beider Jobs das Release. Download-Dateien:

- `bulwark-lite-stalwart.zip`: direkt von Stalwart nutzbares Bundle.
- `SHA256SUMS`: Prüfsummen der Release-Dateien.
- `stalwart-checksums.json`: Upstream-Pin und Dateiprüfsummen.

GitHub-Actions-Artefakte sind Zwischenergebnisse; ihre Downloadseiten sind keine
Stalwart-Ressourcen-URL. Die versionierte direkte Release-URL lautet für den ersten
Tag:

`https://github.com/Dntouch/NewEVEn-Mail/releases/download/neweven-v1.17.0-1/bulwark-lite-stalwart.zip`

Diese Adresse ist erst nach tatsächlich erfolgreicher Veröffentlichung erreichbar.
Sie wird in Stalwart zunächst für eine zusätzliche Anwendung `/webmail-test`
verwendet. Kein automatischer Eingriff auf dem Mailserver ist Teil des Workflows.

Für Updates immer einen neuen Tag und eine neue Release-URL verwenden. Für den
Rollback die zuvor geprüfte Release-URL wieder eintragen. Die Prüfung aller
Application-Ressourcen vor dem globalen Stalwart-Update bleibt erforderlich.

Quellcode rekursiv klonen: `git clone --recurse-submodules
https://github.com/Dntouch/NewEVEn-Mail.git`. GitHubs automatisch erzeugte
Quellcode-ZIPs enthalten nicht den Inhalt des Upstream-Submoduls.
