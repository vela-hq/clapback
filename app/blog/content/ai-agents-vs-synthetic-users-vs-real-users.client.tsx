"use client";

import { useState } from "react";

/* MethodPicker: three questions, one recommended method. Every question and
   answer option renders in the initial HTML (client components still SSR);
   only the verdict panel depends on state. Nothing is saved or sent anywhere. */

type AnswerKey = "users" | "budget" | "goal";

type Question = {
  id: AnswerKey;
  label: string;
  options: { id: string; label: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "users",
    label: "1 · Do you have paying users yet?",
    options: [
      { id: "none", label: "Not yet" },
      { id: "few", label: "A handful" },
      { id: "plenty", label: "Plenty" },
    ],
  },
  {
    id: "budget",
    label: "2 · Budget this month for finding UX problems?",
    options: [
      { id: "zero", label: "$0" },
      { id: "lunch", label: "Lunch money (under $200)" },
      { id: "real", label: "Real budget" },
    ],
  },
  {
    id: "goal",
    label: "3 · What are you trying to learn?",
    options: [
      { id: "defects", label: "Find defects in my flows" },
      { id: "motivation", label: "Understand motivation and churn" },
    ],
  },
];

function recommend(a: Partial<Record<AnswerKey, string>>): {
  method: string;
  why: string;
} | null {
  const { users, budget, goal } = a;
  if (!users || !budget || !goal) return null;

  if (goal === "defects") {
    if (budget === "zero") {
      return {
        method: "Heuristic evaluation",
        why: "You, Nielsen's 10 heuristics, one afternoon. A single evaluator finds roughly a third of the problems, which beats the zero you are finding now.",
      };
    }
    if (users === "none") {
      return {
        method: "AI agent audit",
        why: "No users to recruit yet, and an agent will sign up, mash your forms, and hand you tickets before your next standup.",
      };
    }
    return {
      method: "AI agent audit, then 5 real users",
      why: "Let the agent catch the broken flows first. Spend your humans on the money flow, not on discovering the dead button.",
    };
  }

  if (users !== "none") {
    return {
      method: "Real users",
      why: "People already pay you. Email 5 of them and watch them work. Recruitment cost: one slightly awkward email.",
    };
  }
  if (budget === "zero") {
    return {
      method: "Synthetic users, as rough draft only",
      why: "They will agree with everything you say. Treat every answer as a hypothesis to test on real humans later, never as a finding.",
    };
  }
  return {
    method: "Real users",
    why: "Motivation is the one question no machine can testify about. Recruit 5 people who look like your target customer.",
  };
}

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

export default function MethodPicker() {
  const [answers, setAnswers] = useState<Partial<Record<AnswerKey, string>>>(
    {},
  );

  const rec = recommend(answers);
  const answered = QUESTIONS.filter((q) => answers[q.id]).length;

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        margin: "26px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 22px",
          background: "var(--surface-soft)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <span style={{ ...mono, color: "var(--accent)" }}>Method picker</span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--ink)",
          }}
        >
          {answered}
          <span style={{ color: "var(--text-faint)", fontWeight: 500 }}>
            {" "}
            / 3 answered
          </span>
        </span>
      </div>

      {QUESTIONS.map((q) => (
        <div key={q.id} style={{ padding: "16px 22px 6px" }}>
          <div
            style={{ ...mono, color: "var(--text-muted)", marginBottom: 10 }}
          >
            {q.label}
          </div>
          {q.options.map((opt) => {
            const on = answers[q.id] === opt.id;
            return (
              <label
                key={opt.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "10px 0",
                  borderTop: "1px solid var(--border-soft)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name={`methodpicker-${q.id}`}
                  checked={on}
                  onChange={() =>
                    setAnswers((a) => ({ ...a, [q.id]: opt.id }))
                  }
                  style={{
                    width: 17,
                    height: 17,
                    accentColor: "var(--accent)",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontSize: 15.5,
                    lineHeight: 1.55,
                    color: on ? "var(--ink)" : "var(--text)",
                    fontWeight: on ? 600 : 400,
                  }}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      ))}

      <div
        style={{
          margin: "10px 22px 16px",
          background: rec ? "#fdf3d7" : "var(--surface-soft)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <div style={{ ...mono, color: "var(--text-muted)", marginBottom: 6 }}>
          Verdict
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 19,
            color: "var(--ink)",
            marginBottom: 4,
          }}
        >
          {rec ? rec.method : "Awaiting your answers"}
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--text)" }}>
          {rec
            ? rec.why
            : "Pick one option per question and the verdict updates live."}
        </div>
      </div>

      <div
        style={{
          padding: "0 22px 16px",
          fontSize: 12.5,
          color: "var(--text-faint)",
        }}
      >
        Nothing is saved or sent anywhere. The reasoning behind each verdict is
        in the stage guide below.
      </div>
    </div>
  );
}
