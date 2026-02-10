# Plan Update: Quiz Redesign + Seta Details + KBC-Style Lifelines

This addendum updates the main Valentine website plan with your latest details: Seta as the fine-dine at Hilton with 20% off, the new quiz (text input + MC + hint), and Kaun Banega Crorepati–style funny lifelines.

---

## 1. Seta (confirmed)

- **What it is**: Fine-dine restaurant at Hilton; you went once randomly and both really enjoyed it.
- **Reservation**: 8:00 PM.
- **20% discount**: Include a punchy line so he’s happy about the offer. Examples:
  - “I got us 20% off. You’re welcome.”
  - “Dinner’s on a discount. Romance: optimized.”
  - “8 PM at Seta. I even got us 20% off—consider that my Valentine’s gift to your wallet.”
- **Reveal section**: Date, **8:00 PM**, **Dinner at Seta, Hilton**, then the **20% punchy line**, then “Wear something nice. I already did (this website).” + photo strip.

**No button cycle** can include: “At Seta. 8 PM. 20% off.” in the sequence.

---

## 2. Quiz: KBC-style with mixed question types + funny lifelines

**Format**: Game-show feel. Each question shows **lifelines** he can use (once per game, or once per question for a softer game). Wrong answers show a funny “Try again” or “Lifeline?” nudge. All paths eventually lead to the big “Will you be my Valentine?” ask.

### Question 1 – Text input (no multiple choice)

- **Q**: “What was the place in our initial dates when we had very good pasta?”
- **UI**: Text input + “Submit” (or “Lock kiya?” for KBC vibe).
- **Logic**: Accept correct answer (exact or fuzzy match—you’ll provide the actual place name, e.g. Seta or the exact restaurant name). On correct: “Sahi jawab!” and move to Q2. On wrong: funny message (e.g. “Galat. Lifeline use karo ya phir soch ke likho.”) and let him try again or use a lifeline (e.g. hint: “Starts with S” or “Where we’re going for Valentine’s” if the answer is Seta).

### Question 2 – Multiple choice

- **Q**: “What was the first thing you gave me?”
- **Options**: A) A hug | B) Chocolates | C) A taunt | D) Shoes.  
  Or framed as: **Something to eat/sweet** (Chocolates from Smoor), **Something to wear** (Shoes), A hug, A taunt.
- **Lifelines**: Same pool as below; one use per lifeline per game.

### Question 3 – Multiple choice + hint lifeline

- **Q**: “What was the first sweet gesture that felt cute?”
- **Context**: You have a photo frame with the quote “Grateful, Thankful, Blessed”; he got the same one for his room.
- **Options**: e.g. “Matching photo frames,” “The Grateful/Thankful/Blessed frame,” “Getting the same quote for your room,” etc. (one clear correct).
- **Hint lifeline**: “Hint” button reveals something like: “Think frames. Think a three-word quote. Think my room and yours.” Or: “Grateful, Thankful, ___?” so it’s fun but not a dead giveaway.

### Lifelines (KBC-style but funny)

- **Phone a Friend**: “You’re calling your wife. She says: [hint for current question].” (Pre-written hints per question.)
- **50-50**: “Two wrong answers just left the building.” (Remove two wrong options; funny line like “The other two options have been emotionally unavailable.”)
- **Ask the Audience**: “The audience is just the two of us. I (the audience) say: [hint].” Or: “Audience poll: 100% say ‘use the hint below.’”
- **Optional fourth**: “Skip and regret later” (auto-reveals hint and moves on) or “Text the person who made this” (shows “She’s not picking up” then reveals hint).

**Rules**: Each lifeline usable once per game. Show disabled/greyed state after use. Keep copy witty so it feels like a game, not an exam.

---

## 3. Copy tone – updates

- **Reveal**: “You said yes. So here’s the plan:” → Date, **8:00 PM, Dinner at Seta, Hilton** → **Punchy 20% line** → “Wear something nice. I already did (this website).” + photo strip.
- **No button (cycling)**: Include “At Seta. 8 PM. 20% off.” in the sequence (e.g. after “I already booked dinner.”).
- **After quiz**: Can add “KBC over. Real question now.” as an option.

---

## 4. Implementation notes

- **Quiz UI**: One question at a time; for Q1 show text input + Submit; for Q2 and Q3 show 4 options (A–D) + lifeline buttons (e.g. “Phone a Friend,” “50-50,” “Ask the Audience”). Store which lifelines were used and disable them after use.
- **Q1 validation**: In `script.js`, compare input (trimmed, lowercased) against accepted answers (e.g. “seta”, “hilton seta”); optionally allow “skip after N wrong” or after using a lifeline that reveals the answer.
- **Reveal section**: In `yes.html` or the reveal block in `index.html`, add one short line for the 20% discount so it’s visible and punchy.

---

## 5. Summary of changes vs original plan

| Original | Updated |
| -------- | ------- |
| 5 generic MC questions | 3 questions: Q1 text (pasta place), Q2 MC (first thing you gave me), Q3 MC (first sweet gesture – frame quote) |
| No lifelines | KBC-style lifelines: Phone a Friend, 50-50, Ask the Audience (funny copy) |
| Seta = TBD | Seta = fine-dine at Hilton, 8 PM, 20% off + punchy line in reveal |
| Reveal = “Dinner at Seta” | Reveal = 8 PM, Seta Hilton, 20% discount line, then photos + sign-off |

Use this file together with the main plan when implementing the site.
