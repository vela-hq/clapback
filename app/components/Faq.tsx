import styles from "./Faq.module.css";

const ITEMS = [
  {
    q: "How is this different from a manual UX audit?",
    a: "A consultant takes weeks and a retainer. ClapBack takes minutes and a URL: same frameworks, zero scheduling, and the output is tickets, not a 40-slide deck.",
  },
  {
    q: "How is this different from other AI audit tools?",
    a: "Most stop at “here's a list.” We don't. Every finding comes as a fully-written Jira or Linear ticket — severity, screenshot and a concrete fix — so your team triages right where they already work.",
  },
  {
    q: "Do I need to install anything?",
    a: "No SDK, no script tag, no access. Paste a URL and the agent uses your product like any other visitor.",
  },
  {
    q: "Is this a subscription?",
    a: "No. One-time scan, one-time price, tiered by site size. Optional workspace seats only if your team wants to track findings over time.",
  },
  {
    q: "Will it mess with my data?",
    a: "It browses like a user. Point it at staging if live writes scare you. It won't delete your database. It's not that kind of savage.",
  },
  {
    q: "How accurate is an AI agent?",
    a: "Every finding cites a named rule and shows the screenshot. If a receipt's wrong, you'll see it in two seconds. Dismiss it and move on.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className={styles.section} data-screen-label="FAQ">
      <div className={styles.inner}>
        <div className={styles.intro} data-reveal>
          <div className={styles.eyebrow}>FAQ</div>
          <h2 className={styles.title}>The skeptical-PM section.</h2>
        </div>
        <div className={styles.grid} data-reveal>
          {ITEMS.map((item) => (
            <div key={item.q} className={styles.card}>
              <div className={styles.q}>{item.q}</div>
              <div className={styles.a}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
