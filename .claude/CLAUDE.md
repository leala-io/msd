# Anleitung — MSD v0.1.0 mit Claude Code umsetzen

Schritt-für-Schritt für den ersten Einsatz von Claude Code. Reihenfolge bewusst gewählt: **erst das Concept Paper manuell ins Repo bringen, dann den Build mit Claude Code.** Begründung steht in Teil B.

Dateien, die du dafür hast: `CLAUDE.md`, `settings.json`, `MSD-v0.1.0-Build-Blueprint_04062026.md` (= der Blueprint).

---

## Teil A — Claude Code installieren (Einmal-Setup)

Voraussetzungen: ein Claude-Pro- oder Max-Abo (oder API-Zugang), ein Terminal, `git` installiert.

1. **Installieren** (nativer Installer, empfohlen):
   - macOS / Linux / WSL: `curl -fsSL claude.ai/install.sh | bash`
   - Windows (PowerShell): `irm https://claude.ai/install.ps1 | iex`
   - Alternative über npm (braucht Node.js 18+): `npm install -g @anthropic-ai/claude-code` — **nicht** mit `sudo`.
2. **Terminal neu öffnen**, dann prüfen: `claude --version`
3. **Anmelden:** `claude` starten → es öffnet den Browser-Login, dort bestätigen.
4. **Gesundheitscheck:** `claude doctor`
5. Offizielle Kurzanleitung bei Problemen: https://code.claude.com/docs/en/quickstart

---

## Teil B — Concept Paper ins Repo bringen (manuell, zuerst)

**Warum manuell und zuerst:** Claude Code kann nicht auf dieses Claude.ai-Projekt zugreifen, also kann es deine aktuelle Concept-Paper-Version nicht selbst holen. Im Repo liegt noch die Version vom 10. März. Bringst du die aktuelle Version zuerst hinein, ist die Wahrheitsquelle sauber, **bevor** Claude Code irgendetwas anfasst — und du machst dabei eine einfache, risikoarme erste git-Übung.

1. **Repo lokal holen** (falls noch nicht): `git clone https://github.com/leala-io/msd.git` und dann `cd msd`
2. **Aktuelle Concept-Paper-Datei bereitlegen** — deine neueste, hier im Projekt gepflegte Version. (Wenn du unsicher bist, welche die letzte ist: kurz hier melden, ich exportiere sie dir.)
3. **Die alte Datei im Repo ersetzen:** Finde die bestehende Concept-Paper-Datei im Repo (die März-Version) und ersetze ihren Inhalt durch deine aktuelle Version. **Denselben Dateinamen/Pfad behalten**, damit Verweise nicht brechen.
4. **Committen und pushen:**
   ```
   git add <pfad/zur/concept-paper-datei>
   git commit -m "Concept Paper auf aktuellen Stand (ersetzt Version 2026-03-10)"
   git push
   ```

---

## Teil C — Leitplanken-Dateien ins Repo legen

1. **`CLAUDE.md`** ins Repo-Root kopieren.
2. **`.claude/`-Ordner anlegen** und **`settings.json`** hineinlegen → `.claude/settings.json`.
3. **Blueprint** ablegen unter `docs/build/MSD-v0.1.0-Build-Blueprint.md` (genau dieser Pfad, weil CLAUDE.md darauf verweist).
4. Committen und pushen:
   ```
   git add CLAUDE.md .claude/settings.json docs/build/MSD-v0.1.0-Build-Blueprint.md
   git commit -m "Build-Leitplanken: CLAUDE.md, settings.json, v0.1.0 Blueprint"
   git push
   ```

Was diese Dateien tun: `CLAUDE.md` = was Claude Code wissen soll (Regeln, Freeze, Konventionen, „bei Unklarheit stoppen und fragen"). `settings.json` = was Claude Code darf (kein `git push` ohne deine Zustimmung, keine Secrets lesen). Der Blueprint = das Detail-Briefing für genau diesen Build.

---

## Teil D — Build mit Claude Code ausführen

1. Im Repo-Ordner: `claude` starten.
2. **Plan Mode nutzen** (mit `Shift`+`Tab` durch die Modi schalten, bis „plan" erscheint). Plan Mode heißt: Claude Code schlägt erst einen Plan vor, du gibst ihn frei, bevor etwas passiert — ideal für den ersten Einsatz.
3. **Kickoff-Prompt** (kopierbar):
   > Read CLAUDE.md and docs/build/MSD-v0.1.0-Build-Blueprint.md. Build the MSD v0.1.0 foundation exactly as the blueprint specifies — schema, registry, validator, test fixtures, CI. Apply conventions C1 and C2. Respect the freeze. Do not edit the Concept Paper. Work through the build sequence step by step and pause to show me each part. When you need a design judgment (required/optional, fares, code-list values), ask me — I will decide against the Concept Paper. Run the validator against the mybuxi example at the end. Do not commit or push; I will review first.
4. **Plan freigeben**, dann den Build laufen lassen. Bei jeder Datei-Änderung zeigt Claude Code einen Diff — **anschauen und freigeben**. Wenn etwas nicht passt: ablehnen oder „stop" sagen.
5. An den E5-Stellen fragt Claude Code dich → siehe Teil E.
6. Am Ende lässt es den Validator laufen und zeigt dir das Ergebnis (mybuxi muss PASS sein, invalide Fixtures müssen FAIL sein).

---

## Teil E — Deine Urteilspunkte (immer gegen das Concept Paper)

Wenn Claude Code fragt, entscheidest du — Referenz ist ausschließlich das Concept Paper:

- **Required/optional eines Felds** → Concept Paper §3 (Struktur/Intention). Faustregel: Was §3 als Kern behandelt, ist required; der Rest optional.
- **Tarifmodell (Halbtax/GA, Zonenpreise)** → Concept Paper §3.5. Höchste Aufmerksamkeit, weil Tarife der Differenzierer sind.
- **Code-Listen-Werte** → nur Werte, die im Concept Paper (oder im mybuxi-File) tatsächlich vorkommen. Nichts Spekulatives.
- **mybuxi-Validierung schlägt fehl** → Frage: Kann das §3-Modell dieses reale Attribut ausdrücken? Wenn ja → Beispiel/Mapping korrigieren. Wenn genuin nein → echte Lücke, **nicht still ergänzen**, sondern notieren.
- **Concept Paper schweigt zu einem Punkt** → du entscheidest und schreibst die Entscheidung anschließend ins Concept Paper zurück, damit es die lebende Quelle bleibt.

---

## Teil F — Abschluss

1. Akzeptanzkriterien aus Blueprint §10 durchgehen (Schema meta-valide, mybuxi PASS, valide/invalide Fixtures korrekt, CI grün, keine eingefrorenen Felder).
2. Erst dann committen lassen; beim `git push` fragt Claude Code dich (settings.json) → freigeben.
3. Damit ist das **Implementation Gate** erfüllt (Producer mybuxi + Validator). Die optionale Juli-Phase (PoC-Engine, GOFS-Angleichung) baut darauf auf.

**Nützliche Befehle:** `/permissions` (Rechte interaktiv anpassen), `/model` (Modell wechseln), `claude doctor` (Diagnose), `/exit` (beenden). Du kannst jederzeit ablehnen, „stop" sagen oder den Plan-Modus erzwingen.
