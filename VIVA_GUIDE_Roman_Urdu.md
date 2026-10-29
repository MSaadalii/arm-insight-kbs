# ARM / INSIGHT — Poori Samajh + Viva Guide (Roman Urdu)

> Yeh file tumhari **personal study notes** hai. Isay yaad karo / padho — report English mein submit hogi, lekin samajh yahan se clear hogi.

**Live demo:** https://arm-insight-kbs-dist.vercel.app/  
**Local run:** folder mein `py -3 serve.py` → browser `http://localhost:8000`

---

## 1. Course / CCP mein kya maanga gaya tha?

**Subject:** Knowledge Based Systems (CT-359)  
**Assignment type:** Complex Computing Problem (CCP)

### Asal problem (simple words)

Factory mein industrial machines (humne **robotic arm** liya) kharab hoti hain. Fault dhundna mushkil hota hai kyunki knowledge alag alag jagah hai:

- operator kya dekhta hai  
- sensor / controller alarm  
- purani maintenance history  
- technician inspection  
- manuals / expert experience  

Teachers ne kaha: aisa **Knowledge-Based System (KBS)** banao jo:

1. Equipment knowledge ko **represent** kare  
2. Incomplete / conflicting info handle kare  
3. Possible **fault** bataye  
4. **Maintenance action** suggest kare  
5. **Explain** kare ke result kyun aaya  
6. **Safety, cost, downtime** ka khayal rakhe  

### Teen CLOs (yeh viva mein poochhein ge)

| CLO | Seedhi baat |
|-----|-------------|
| **CLO 1** | Knowledge representation — equipment, components, symptoms, faults, causes, actions ko kisi formalism (rules/frames/ontology…) se dikhao |
| **CLO 2** | Problem analysis — incomplete requirements, stakeholders, constraints samjho aur design karo |
| **CLO 3** | Method choose karo (forward/backward chaining etc.) aur **justify** karo (explainability, safety, cost…) |

### Rubric (10 marks — roughly)

1. Problem samajhna  
2. Research + knowledge base  
3. KBS approach + representation  
4. Working implementation  
5. Report + presentation  

### Deliverables

- Dataset + source code  
- Report (template ke mutabiq)  
- Presentation  
- Demo + viva  

---

## 2. Humne kya banaya? (Project identity)

**Project naam (UI):** ARM / INSIGHT  
**Official title (report):** Intelligent Knowledge-Based System for Industrial Equipment Fault Diagnosis and Maintenance Decision Support  

**Simple definition (yaad rakho):**

> Yeh ek **rule-based explainable KBS** hai jo robotic arm ke symptoms se possible faults nikalta hai, maintenance suggest karta hai, aur step-by-step batata hai ke rule kyun fire hui. Yeh ML nahi hai, real robot se connected nahi hai — educational prototype hai.

### Scope (kitna cover kiya)

- **1 generic robotic arm** (saari industry nahi)  
- **19 symptoms**  
- **8 fault rules**  
- **13 synthetic test cases** (sab PASS)  
- Browser app + optional Supabase + Vercel deploy  

---

## 3. KBS basics — viva language

### Knowledge-Based System kya hota hai?

Aisa system jisme:

1. **Knowledge Base** — rules / frames (expert jaisa knowledge)  
2. **Inference Engine** — us knowledge se conclusion nikalta hai  
3. **Explanation** — bata sakta hai *kyun*  

ML se farq: ML data se pattern seekhta hai; KBS **explicit rules** use karta hai jo tum padh / edit / explain kar sakte ho.

### Humari knowledge representation (CLO 1)

Humne **frames + production rules** use kiye (JSON file mein).

| Cheez | Matlab | Example |
|-------|--------|---------|
| Equipment | Machine | Robotic arm |
| Component | Hissa | Joint, gripper, encoder |
| Symptom | Observation | Protective stop, grip loss |
| Fault | Problem hypothesis | Payload mismatch |
| Cause | Possible reason | Galat tool mass config |
| Action | Maintenance step | Qualified tech se settings check |

**Production rule example:**

```text
IF protective_stop = Yes
AND payload_mismatch = Yes
THEN fault = Payload configuration mismatch
     action = payload settings review (qualified technician)
```

File: `dist/knowledge_base.json`

---

## 4. Inference — forward chaining (CLO 3) — DIL ka hissa

### Forward chaining kya hai?

**Facts se shuru** → rules ke IF match karo → conclusion nikaalo.  
Matlab: “jo symptoms diye gaye hain, unse kaunsi fault rules fire hoti hain?”

### Backward chaining se farq

| Forward (humara) | Backward |
|------------------|----------|
| Observations → possible faults | Ek suspected fault se peeche evidence maangna |
| Screening / diagnosis start ke liye best | Jab pehle se target fault pata ho |

### Humare 5 statuses

Har rule ke liye engine yeh decide karta hai:

| Status | Kab |
|--------|-----|
| **Supported** | Saari conditions **Yes** → action recommend |
| **Possible** | Kuch Yes, baqi Unknown |
| **Conflicted** | Kisi condition pe Conflict |
| **Contradicted** | Koi condition **No** |
| **Unassessed** | Abhi relevant evidence nahi |

Code: `dist/engine.mjs` → function `diagnose()`

### Incomplete data

Agar symptom check hi nahi hua → **Unknown**.  
System kabhi Unknown ko No nahi maanta. Yeh bahut important viva point hai.

### Conflict handling

Agar:

- Operator: payload_mismatch = **Yes**  
- Sensor: payload_mismatch = **No**  

→ merge = **Conflict**  
→ woh symptom “Yes” count nahi hota  
→ rule fully **Supported** nahi ban sakti  

Code: `dist/evidence.mjs` → `resolveClaims()`

### Safety

Kuch dangerous symptoms (smoke, unexpected motion, …) alag se **alert** dete hain — chahe koi rule Supported ho ya na ho.

### Ranking / policy

Pehle status + severity, phir user policy:

- Safety first  
- Lower cost  
- Less downtime  

---

## 5. Poora project workflow (user ka flow)

```text
1. App kholo (Vercel / localhost)
2. Splash screen (ARM/INSIGHT) ~2 sec
3. Diagnostic Studio
4. Symptoms select karo (Yes/No/?/!)
   YA Guided mode
   YA Demo scenario
   YA “Record source” (operator/sensor claims)
5. Engine diagnose() chalta hai
6. Findings dikhte hain + Reasoning timeline
7. Supported fault pe maintenance task bana sakte ho
8. Case save → Case history
9. Evaluation lab → 13 scenarios test
10. Optional: Sync with Supabase
```

### Viva demo button

Header pe **▶ Viva demo**:

1. Payload fault (Supported)  
2. Conflict wala case  
3. Evaluation lab 13/13  

Yeh button tumhari life easy karta hai viva mein.

---

## 6. App ke pages / modules

| Page | Kaam |
|------|------|
| **Diagnostic studio** | Evidence + findings + trace |
| **Case history** | Save / open / compare cases |
| **Maintenance board** | Open / In progress / Completed tasks |
| **Rule explorer** | Rules dekhna / edit (educational) |
| **Evaluation lab** | 13 synthetic tests |

### Extra UI polish (optional mention)

- Glass + motion background  
- Cursor glow  
- Moving ticker text  
- Light/dark theme  

Viva mein zyada time UI pe mat lagao — **KBS logic** pe lagao.

---

## 7. Tech stack (seedha jawab)

| Layer | Tech |
|-------|------|
| UI | HTML, CSS, JavaScript ES modules |
| Inference | Pure JS (`engine.mjs`) — no ML library |
| Knowledge | JSON files |
| Local save | Browser `localStorage` |
| Cloud (optional) | Supabase (workspaces, cases, tickets) |
| Hosting | Vercel (`dist/` folder) |
| Local server | Python `serve.py` |
| Tests | Node.js `test.mjs` etc. |

### Important files

| File | Kaam |
|------|------|
| `dist/knowledge_base.json` | Rules + symptoms |
| `dist/sample_cases.json` | 13 test scenarios |
| `dist/engine.mjs` | Forward chaining brain |
| `dist/evidence.mjs` | Conflict merge |
| `dist/state.mjs` | Validation |
| `dist/app.mjs` | UI + events + viva demo |
| `dist/cloud.mjs` | Supabase sync |
| `dist/config.mjs` | Supabase URL + anon key |
| `supabase/schema.sql` | DB tables |
| `serve.py` | Localhost |
| `vercel.json` | Deploy config |

### Data flow (yaad karo)

```text
User symptoms
    → app.mjs
        → diagnose(kb, evidence, policy)  [engine.mjs]
            → results + trace + alerts
        → screen pe show
        → localStorage save
        → (optional) Supabase push
```

---

## 8. Dataset / testing

### Knowledge base

- 19 symptoms  
- 8 faults: payload, mechanical, thermal, encoder, gripper, communication, power, brake  

### Sample cases

13 synthetic scenarios — Evaluation lab mein **13/13 PASS**.

**Yeh field accuracy nahi hai** — yeh regression / software behaviour check hai. Viva mein zaroor bolo:

> “Synthetic tests prove our rules behave as designed; yeh real plant accuracy claim nahi hai.”

### Knowledge sources (research)

Universal Robots docs se **concepts** (protective stop / payload):

- Protective stops article  
- C162 error  
- e-Series handbook  

Lekin exact 8 rules humne educational assumptions se likhi hain.

---

## 9. CLO 2 — Problem analysis (short)

### Stakeholders

- Operator — symptoms likhe  
- Technician — explanation + action  
- Safety officer — hazard alerts  
- Supervisor — cost/downtime (safety ke baad)  
- Teacher — rules + tests inspect  

### Incomplete requirements (CPA-9)

Brief mein robot model, real thresholds, real costs, plant data nahi diya. Is liye:

- generic arm  
- categorical Yes/No  
- qualitative cost/downtime  
- assumptions clearly likhi hain report mein  

### Assumptions (bolo viva mein)

1. Generic arm, specific model nahi  
2. Unknown ≠ No  
3. AND rules; Supported = hypothesis, final certified root cause nahi  
4. Cost/downtime teaching labels hain  
5. Koi live robot control nahi  

---

## 10. CLO 3 — Method justification (short speech)

> “Humne forward chaining + production rules choose kiye kyunki explainability high hai, incomplete evidence safely handle hoti hai, labelled ML dataset nahi tha, aur maintenance recommendations rules se seedhe nikalte hain. Backward chaining tab better hota jab pehle se ek fault suspect ho. Bayesian probabilities ke liye reliable data chahiye tha jo brief mein nahi tha.”

---

## 11. Limitations (honest = marks)

- Sirf 8 faults  
- No live sensors  
- No manufacturer-certified mapping for all rules  
- Supabase demo policies open (education)  
- Tests synthetic  
- Maintenance task = tracking only, safety clearance nahi  

---

## 12. Report / submission checklist

| Cheez | Status / location |
|-------|-------------------|
| Code | GitHub + `dist/` |
| KB + cases | JSON files |
| Report MD | `docs/KBS_Robotic_Arm_CCP_Report.md` |
| Report Word | `docs/KBS_Robotic_Arm_CCP_Report.docx` |
| Live URL | Vercel |
| Word mein edit | Names, signatures, screenshots, PDF export |

---

## 13. 2-minute viva opening (Roman Urdu → English bolo)

English mein yeh bolo (practice):

> “Our CCP is an explainable Knowledge-Based System for robotic-arm fault diagnosis. Knowledge is represented as JSON frames and production rules. Inference is forward chaining with Yes/No/Unknown/Conflict evidence. Only fully matched rules become Supported and get maintenance actions. Conflicts block full support. Safety alerts are separate. We tested 13 synthetic cases with 13/13 pass. It is deployed on Vercel with optional Supabase sync. It does not control a real robot.”

Phir **▶ Viva demo** chalao aur explain karte raho.

---

## 14. Common viva Q&A (Roman Urdu hints + English jawab)

**Q: KBS kya hai?**  
A: Explicit knowledge + inference + explanation wala system.

**Q: ML kyun nahi?**  
A: Labelled plant data nahi; explainability chahiye thi; rules editable hain.

**Q: Forward chaining?**  
A: Facts se rules fire karke conclusions.

**Q: Coverage probability hai?**  
A: **Nahi.** Sirf kitni conditions Yes hain — probability nahi.

**Q: Conflict kaise?**  
A: Same symptom pe Yes aur No sources → Conflict → support block.

**Q: Technician replace?**  
A: Nahi — decision support / academic prototype.

**Q: Supabase kyun?**  
A: Shared cloud storage for cases/tasks; warna sirf ek browser localStorage.

**Q: Dataset kahan se?**  
A: Authored educational KB + UR concept citations; synthetic cases.

---

## 15. 5-minute demo script (practice order)

1. Site kholo  
2. Viva demo **ya** payload scenario load  
3. Reasoning timeline kholo — OBS / RULE / ACTION dikhao  
4. Conflict case samjhao  
5. Evaluation 13/13  
6. Optional Supabase sync  
7. Closing: “software behaviour, not certified plant accuracy”

---

## 16. Ek line mein poora project

> **Symptoms in → forward chaining rules → explainable fault hypotheses + maintenance + safety alerts; JSON knowledge base; synthetic tests; web deploy.**

---

## 17. Agar confuse ho jao viva mein

Yeh 4 lines hamesha safe hain:

1. “This is a **rule-based KBS**, not ML.”  
2. “**Unknown is not No**; **Conflict blocks support**.”  
3. “**Coverage is not probability**.”  
4. “Recommendations need **qualified human review**; no live robot control.”

---

*Last updated with current project: glass UI, splash, viva demo button, Supabase, Vercel, 8 rules, 13 cases.*

**Next step:** is file ko 2–3 dafa padho, phir mock viva karo.
