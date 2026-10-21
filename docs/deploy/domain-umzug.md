# Domain-Umzug von GitHub Pages auf Vercel

Stand 2026-10-21. Für Leon.

**Diese Schritte erst nach FREIGABE 5.** Bis dahin bleibt `smartflow.bayern` unverändert auf der alten Seite (Repository `SmartFlowWebsite-v3`, GitHub Pages). Nichts hiervon wurde ausgeführt.

Voraussetzungen vor dem Start:

- Preview geprüft, `docs/abnahme/checkliste.md` abgearbeitet, Freigabe von Dir gegeben.
- Englische Fassung unter `/en` ist fertig (Startbedingung laut Projektvorgabe).
- Rechtstexte ergänzen, bevor die Domain umzieht: Abschnitt „3. Hosting“ in `public/datenschutz.html` und `public/en/privacy-policy.html` nennt keinen Anbieter (Vercel, AVV); offene Punkte stehen in `docs/content/rechtstexte-offen.md`. Der Text selbst ist Deine Sache bzw. die Deines Anwalts.
- Production-Sperre aufgehoben (siehe `docs/deploy/vercel-einrichten.md`, Abschnitt 3): Production Branch wieder `main`, `vercel.json` ohne Sperre. Die Aufhebung geht über einen eigenen Commit; wann `preview/abnahme` nach `main` gemergt wird, entscheidest Du.

## Ausgangslage (aus dem alten Repository gelesen)

- Die Domain `smartflow.bayern` hängt per `CNAME`-Datei an GitHub Pages in `SmartFlowWebsite-v3`.
- Registrar der Domain: fehlt.
- Aktuelle DNS-Einträge (A, AAAA, CNAME, MX, TXT): fehlt. Vor jeder Änderung vollständig notieren oder als Screenshot sichern, besonders MX- und TXT-Einträge (E-Mail, SPF, DKIM), damit beim Umstellen nichts verloren geht.
- Wo das DNS gehostet wird (Registrar oder externer Anbieter): fehlt.
- TTL der bestehenden Einträge: fehlt. Eine Stunde vorher auf einen niedrigen Wert stellen, falls der Anbieter das erlaubt.

## Schritte

### 1. Domain in Vercel hinzufügen

Projekt, Settings, Domains, **Add**: `smartflow.bayern` und `www.smartflow.bayern`. Eine der beiden als Hauptadresse festlegen, die andere leitet weiter. Welche, entscheidest Du; die Sitemap, die Schema.org-Daten und die Canonical-URLs der Seite verwenden `https://smartflow.bayern/` ohne `www`. Also `smartflow.bayern` als Hauptadresse, `www` leitet darauf um.

Vercel zeigt danach die benötigten DNS-Werte an. Nur diese Werte zählen.

### 2. DNS beim Registrar umstellen

Typische Zielwerte von Vercel (laut Vercel-Dashboard prüfen, sie können sich ändern oder projektspezifisch sein):

| Name | Typ | Wert |
|---|---|---|
| `@` (Apex `smartflow.bayern`) | A | `76.76.21.21` |
| `www` | CNAME | `cname.vercel-dns.com` |

Bei Anbietern, die auf dem Apex ALIAS/ANAME statt A-Records anbieten, kann ein ALIAS auf den von Vercel genannten Zielnamen verwendet werden.

- Die bisherigen A-Records auf GitHub Pages (GitHub-Adressen) und einen bestehenden `www`-CNAME auf `*.github.io` ersetzen, nicht ergänzen.
- AAAA-Records auf GitHub-Adressen entfernen.
- MX- und TXT-Einträge nicht anfassen.
- Konkrete Oberfläche und Menüpunkte beim Registrar: fehlt (Registrar unbekannt).

Warten, bis Vercel in den Domain-Einstellungen „Valid Configuration“ anzeigt. Das Zertifikat stellt Vercel automatisch aus.

### 3. GitHub Pages in `SmartFlowWebsite-v3` abschalten

Erst wenn die Domain auf Vercel zeigt und die neue Seite unter `https://smartflow.bayern` korrekt lädt:

1. Im Repository `SmartFlowWebsite-v3`: Settings, Pages, Custom Domain leeren, danach Pages deaktivieren (Source auf „None“).
2. Die Datei `CNAME` im Repository entfernen und committen.

Das ist eine Änderung am alten Repository; sie macht nur Du, nicht dieser Plan.

### 4. Weiterleitungen und alte Adressen

Schon im Repository erledigt (`vercel.json`):

- `/index.html` auf `/`, `/en/index.html` auf `/en`, `/404.html` auf `/` (je permanent).

Unverändert gültig, keine Weiterleitung nötig: `/impressum.html`, `/datenschutz.html`, `/agb.html`, `/en/legal-notice.html`, `/en/privacy-policy.html`, `/en/terms.html`, `/robots.txt`, `/sitemap.xml`.

Alte Anker der v3-Startseite: Hash-Fragmente sieht der Server nicht, daher löst die Seite sie im Browser auf (`lib/scroll/hash.ts`):

| Alter Anker | Neues Ziel |
|---|---|
| `#contact` | Kontakt (`#kontakt`) |
| `#services` | Abläufe (`#ablaeufe`) |
| `#process` | Vorgehen (`#ablauf`) |
| `#about` | Überblick (`#ueberblick`) |
| `#hero`, `#pains`, `#audiences`, `#faq` | kein Ziel, die Seite startet oben |

Wo diese alten Links außerhalb der Seite verwendet werden (Profile, Signaturen, Verzeichnisse): fehlt. Das weißt nur Du.

### 5. Google Search Console

1. Property für `smartflow.bayern` öffnen. Ob sie schon besteht und wie sie verifiziert ist (DNS-TXT, HTML-Datei, Meta-Tag): fehlt.
2. Wenn die Verifizierung an der alten Seite hing (HTML-Datei oder Meta-Tag im alten Repository), neu verifizieren, bevorzugt per DNS-TXT-Eintrag, der den Umzug überlebt. Im neuen Repository gibt es keine Verifizierungsdatei.
3. Sitemap einreichen: `https://smartflow.bayern/sitemap.xml`.
4. Startseite und `/en` per URL-Prüfung neu indexieren lassen.

### 6. Danach prüfen

- `https://smartflow.bayern`, `https://www.smartflow.bayern` (leitet um), `/en`, alle Rechtsseiten, `robots.txt`, `sitemap.xml`.
- Die Sicherheits-Header und der Cal.com-Embed auf der echten Domain (siehe Abschnitt 5 in `docs/deploy/vercel-einrichten.md`).
- E-Mail an `info@smartflow.bayern` funktioniert weiterhin (MX/TXT unberührt).

## Zurückrollen

Solange GitHub Pages in `SmartFlowWebsite-v3` nicht abgeschaltet und die `CNAME`-Datei nicht entfernt ist, genügt es, die DNS-Einträge auf die alten Werte zurückzusetzen. Deshalb Schritt 3 erst nach erfolgreicher Prüfung.
