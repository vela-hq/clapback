import type { CSSProperties, ReactNode } from "react";

/* Drawn screens of "Driftly", the fictional SaaS roasted in the heuristic
   evaluation article. Same low-fi wireframe language as the landing page's
   Mockup component: decorative, inline-styled, one screen per heuristic. */

const frame: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  background: "#f3efe7",
  fontFamily: "var(--font-body)",
  overflow: "hidden",
  aspectRatio: "16 / 9.4",
};

const bar = (w: string, color = "#e3ddd2", h = 6): CSSProperties => ({
  height: h,
  width: w,
  background: color,
  borderRadius: 3,
});

const btn = (bg: string, w = 74, fg?: string): CSSProperties => ({
  height: 20,
  width: w,
  background: bg,
  borderRadius: 5,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: fg ?? "#fff",
  fontSize: 8.5,
  fontWeight: 600,
  padding: "0 6px",
  whiteSpace: "nowrap",
});

const text = (size: number, color = "#4a453d", weight = 500): CSSProperties => ({
  fontSize: size,
  color,
  fontWeight: weight,
  lineHeight: 1.35,
});

function Chrome({ path }: { path: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "6px 10px",
        background: "#e7e1d6",
        borderBottom: "1px solid #ded7ca",
        flexShrink: 0,
      }}
    >
      <span style={{ display: "flex", gap: 3.5 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{ width: 7, height: 7, borderRadius: "50%", background: "#cbc3b4" }}
          />
        ))}
      </span>
      <span
        style={{
          flex: 1,
          maxWidth: 240,
          height: 13,
          background: "#fff",
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
          fontSize: 8,
          color: "#9a948a",
          fontFamily: "var(--font-mono)",
        }}
      >
        driftly.app{path}
      </span>
    </div>
  );
}

function Sidebar() {
  return (
    <div
      style={{
        width: "21%",
        background: "#1A1815",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "10px 8px",
        flexShrink: 0,
      }}
    >
      <div style={{ ...text(9, "#f2b705", 700) }}>Driftly</div>
      <div style={bar("88%", "#3a352e")} />
      <div style={bar("74%", "#3a352e")} />
      <div style={bar("82%", "#3a352e")} />
      <div style={bar("66%", "#3a352e")} />
    </div>
  );
}

function Modal({ w = "58%", children }: { w?: string; children: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26,24,21,0.24)",
        padding: 12,
      }}
    >
      <div
        style={{
          width: w,
          maxWidth: 330,
          background: "#fff",
          border: "1px solid #e7e1d6",
          borderRadius: 9,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 9,
          boxShadow: "0 10px 22px -12px rgba(0,0,0,.35)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ShotImportStall() {
  return (
    <div style={frame}>
      <Chrome path="/import" />
      <Modal>
        <div style={text(10.5, "#1a1815", 700)}>Importing your data</div>
        <div style={text(9, "#6b655c")}>Importing…</div>
        <div style={{ height: 7, background: "#efece4", borderRadius: 100 }} />
        <div style={text(8, "#9a948a")}>Started 4 minutes ago</div>
      </Modal>
    </div>
  );
}

export function ShotJargon() {
  return (
    <div style={frame}>
      <Chrome path="/home" />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 16,
          }}
        >
          <div style={text(11, "#1a1815", 700)}>No workstream artifacts yet</div>
          <div style={{ ...text(8.5, "#6b655c"), textAlign: "center", maxWidth: 220 }}>
            Instantiate a workstream artifact to begin resource-loading your
            delivery cadence.
          </div>
          <div style={btn("#1A1815", 120)}>Instantiate artifact</div>
        </div>
      </div>
    </div>
  );
}

export function ShotNoUndo() {
  return (
    <div style={frame}>
      <Chrome path="/boards" />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={bar("34%", "#2a2722", 9)} />
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  background: i === 1 ? "#efece4" : "#fff",
                  border: "1px dashed #ddd6ca",
                  borderRadius: 6,
                  opacity: i === 1 ? 0.45 : 1,
                }}
              />
            ))}
          </div>
          <div
            style={{
              alignSelf: "center",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#1A1815",
              borderRadius: 6,
              padding: "7px 12px",
            }}
          >
            <span style={text(8.5, "#fff")}>Board “Q3 launch” archived forever</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShotInconsistent() {
  return (
    <div style={frame}>
      <Chrome path="/settings" />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 12 }}>
            {["Profile", "Billing", "Team"].map((tab, i) => (
              <span
                key={tab}
                style={{
                  ...text(8.5, i === 0 ? "#1a1815" : "#9a948a", 600),
                  borderBottom: i === 0 ? "2px solid #E8442A" : "none",
                  paddingBottom: 2,
                }}
              >
                {tab}
              </span>
            ))}
          </div>
          {[
            { label: "Profile", cta: "Save", bg: "#1A1815" },
            { label: "Billing", cta: "Apply changes", bg: "#E8442A" },
            { label: "Team", cta: "Commit", bg: "#2f6b46" },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                border: "1px solid #e7e1d6",
                borderRadius: 6,
                padding: "8px 10px",
              }}
            >
              <div style={bar("30%")} />
              <div style={btn(row.bg, 78)}>{row.cta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShotDateTrap() {
  return (
    <div style={frame}>
      <Chrome path="/sprints/new" />
      <Modal>
        <div style={text(10.5, "#1a1815", 700)}>New sprint</div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...text(7.5, "#9a948a"), marginBottom: 3 }}>Starts</div>
            <div
              style={{
                height: 18,
                border: "1px solid #ddd6ca",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                paddingLeft: 6,
                ...text(8, "#4a453d"),
              }}
            >
              Jul 18, 2026
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...text(7.5, "#9a948a"), marginBottom: 3 }}>Ends</div>
            <div
              style={{
                height: 18,
                border: "1.5px solid #E8442A",
                borderRadius: 5,
                display: "flex",
                alignItems: "center",
                paddingLeft: 6,
                ...text(8, "#4a453d"),
              }}
            >
              Jul 4, 2026
            </div>
          </div>
        </div>
        <div
          style={{
            background: "#fbeae5",
            border: "1px solid #f0cabc",
            borderRadius: 5,
            padding: "5px 8px",
            ...text(7.5, "#b0533a"),
          }}
        >
          Submission failed. Please review your input.
        </div>
        <div style={btn("#1A1815", 88)}>Create sprint</div>
      </Modal>
    </div>
  );
}

export function ShotIconMystery() {
  return (
    <div style={frame}>
      <Chrome path="/board/q3-launch" />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              gap: 6,
              background: "#fff",
              border: "1px solid #e7e1d6",
              borderRadius: 6,
              padding: 6,
              alignSelf: "flex-start",
            }}
          >
            {["◇", "⌘", "≡", "⊕", "↯", "⌗", "◨"].map((icon, i) => (
              <span
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #efece4",
                  borderRadius: 4,
                  fontSize: 10,
                  color: "#6b655c",
                }}
              >
                {icon}
              </span>
            ))}
          </div>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e7e1d6", borderRadius: 6 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShotOneByOne() {
  return (
    <div style={frame}>
      <Chrome path="/tasks?filter=done" />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={bar("28%", "#2a2722", 8)} />
            <div style={text(8, "#9a948a")}>41 completed tasks</div>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                border: "1px solid #e7e1d6",
                borderRadius: 5,
                padding: "6px 9px",
              }}
            >
              <div style={bar(`${46 - i * 6}%`)} />
              <div style={btn("#efece4", 52, "#6b655c")}>Archive</div>
            </div>
          ))}
          <div style={{ ...text(7.5, "#9a948a"), textAlign: "center" }}>
            + 37 more, one Archive click each
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShotBannerPile() {
  return (
    <div style={frame}>
      <Chrome path="/dashboard" />
      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { bg: "#fdf3d7", border: "#eede9d", label: "🎉 Driftly Summit early-bird tickets are live!" },
            { bg: "#fbeae5", border: "#f0cabc", label: "Upgrade to Pro and unlock 14 more widgets" },
            { bg: "#e8f0fb", border: "#c9d9f0", label: "New: AI sprint names (beta)" },
            { bg: "#e7f0e9", border: "#bcd6c4", label: "Rate us on G2 and get a sticker pack" },
          ].map((banner) => (
            <div
              key={banner.label}
              style={{
                background: banner.bg,
                border: `1px solid ${banner.border}`,
                borderRadius: 5,
                padding: "5px 9px",
                ...text(7.5, "#4a453d"),
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{banner.label}</span>
              <span style={{ color: "#9a948a" }}>✕</span>
            </div>
          ))}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, minHeight: 30 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e7e1d6", borderRadius: 6 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShotHexError() {
  return (
    <div style={frame}>
      <Chrome path="/tasks/2481" />
      <Modal w="62%">
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#E8442A",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          !
        </div>
        <div style={text(10.5, "#1a1815", 700)}>Something went wrong</div>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            color: "#6b655c",
            background: "#f3efe7",
            border: "1px solid #e7e1d6",
            borderRadius: 5,
            padding: "5px 8px",
          }}
        >
          ERR_SAVE_FAILED 0x80040154 (REGDB_E_CLASSNOTREG)
        </div>
        <div style={btn("#1A1815", 46)}>OK</div>
      </Modal>
    </div>
  );
}

export function ShotPdfHelp() {
  return (
    <div style={frame}>
      <Chrome path="/help" />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 16,
        }}
      >
        <div style={{ ...text(11, "#1a1815", 700) }}>Need help?</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            border: "1px solid #e7e1d6",
            borderRadius: 6,
            padding: "9px 14px",
          }}
        >
          <span
            style={{
              width: 22,
              height: 26,
              background: "#E8442A",
              borderRadius: 3,
              color: "#fff",
              fontSize: 7,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            PDF
          </span>
          <div>
            <div style={text(8.5, "#1a1815", 600)}>Driftly_Manual_v3_FINAL(2).pdf</div>
            <div style={text(7.5, "#9a948a")}>214 pages · updated 14 months ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
