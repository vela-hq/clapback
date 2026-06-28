import type { CSSProperties } from "react";

export type Shot =
  | "signup-error"
  | "dashboard-cta"
  | "pricing-page"
  | "onboarding-step3"
  | "settings-account"
  | "checkout-payment";

const wrap: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  background: "#f3efe7",
  fontFamily: "var(--font-body)",
  overflow: "hidden",
};

const bar = (w: string, color = "#e3ddd2", h = 5): CSSProperties => ({
  height: h,
  width: w,
  background: color,
  borderRadius: 3,
});

/** Browser-chrome strip shared by every shot. */
function Chrome() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 8px",
        background: "#e7e1d6",
        borderBottom: "1px solid #ded7ca",
        flexShrink: 0,
      }}
    >
      <span style={{ display: "flex", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#cbc3b4",
            }}
          />
        ))}
      </span>
      <span style={{ flex: 1, height: 10, background: "#fff", borderRadius: 4 }} />
    </div>
  );
}

/**
 * Low-fidelity wireframe of a roasted screen, mirroring the design's Mockup
 * component. Decorative-only, so it is rendered with inline styles rather than
 * a class explosion.
 */
export default function Mockup({ shot = "signup-error" }: { shot?: Shot }) {
  return (
    <div style={wrap}>
      <Chrome />
      {shot === "signup-error" && (
        <div style={center()}>
          <div style={card("70%", 210)}>
            <div style={bar("58%", "#2a2722", 9)} />
            <div style={field()} />
            <div style={{ ...field(), border: "1.5px solid #E8442A" }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#fbeae5",
                border: "1px solid #f0cabc",
                borderRadius: 5,
                padding: "5px 7px",
              }}
            >
              <span style={errBadge()}>!</span>
              <div style={bar("60%", "#d98a72")} />
            </div>
            <div style={{ height: 16, background: "#1A1815", borderRadius: 5 }} />
          </div>
        </div>
      )}

      {shot === "dashboard-cta" && (
        <div style={{ flex: 1, display: "flex" }}>
          <div
            style={{
              width: "24%",
              background: "#1A1815",
              display: "flex",
              flexDirection: "column",
              gap: 7,
              padding: "9px 7px",
            }}
          >
            <div style={bar("70%", "#5a554c", 7)} />
            <div style={bar("90%", "#3a352e", 6)} />
            <div style={bar("80%", "#3a352e", 6)} />
            <div style={bar("85%", "#3a352e", 6)} />
          </div>
          <div
            style={{
              flex: 1,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div style={bar("38%", "#2a2722", 8)} />
              <div
                style={{
                  background: "#eceae4",
                  border: "1px solid #e3ddd2",
                  borderRadius: 5,
                  padding: "5px 10px",
                }}
              >
                <div style={bar("34px", "#cfcabf")} />
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={tile()} />
              ))}
            </div>
          </div>
        </div>
      )}

      {shot === "pricing-page" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 10,
          }}
        >
          <div style={{ ...bar("30%", "#2a2722", 8), margin: "2px auto" }} />
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: 5,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e7e1d6",
                  borderRadius: 5,
                  padding: "6px 4px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <div style={bar("60%", "#2a2722", 9)} />
                <div style={bar("80%")} />
                <div style={bar("70%")} />
                <div style={bar("80%")} />
                <div style={bar("65%")} />
                <div style={{ ...bar("84%", "#ddd6ca", 8), marginTop: "auto" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {shot === "onboarding-step3" && (
        <div style={center()}>
          <div style={card("72%", 220, 13)}>
            <div style={bar("64%", "#2a2722", 9)} />
            <div style={bar("88%")} />
            <div style={{ ...field(), marginTop: 2 }} />
            <div style={field()} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <div style={{ height: 16, width: 46, background: "#1A1815", borderRadius: 5 }} />
            </div>
          </div>
        </div>
      )}

      {shot === "settings-account" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 7,
            padding: "11px 14px",
            background: "#fff",
          }}
        >
          <div style={{ ...bar("32%", "#2a2722", 8), marginBottom: 2 }} />
          {[42, 36].map((w) => (
            <div
              key={w}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #efeae0",
                paddingBottom: 7,
              }}
            >
              <div style={bar(`${w}%`)} />
              <div style={{ width: 22, height: 11, background: "#ddd6ca", borderRadius: 100 }} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 7, marginTop: "auto" }}>
            <div style={{ flex: 1, height: 17, background: "#1A1815", borderRadius: 5 }} />
            <div style={{ flex: 1, height: 17, background: "#E8442A", borderRadius: 5 }} />
          </div>
        </div>
      )}

      {shot === "checkout-payment" && (
        <div style={center()}>
          <div style={card("72%", 220, 13)}>
            <div style={bar("50%", "#2a2722", 8)} />
            <div style={field()} />
            <div style={{ display: "flex", gap: 7 }}>
              <div style={{ ...field(), flex: 1 }} />
              <div style={{ ...field(), flex: 1 }} />
            </div>
            <div style={{ height: 16, background: "#1A1815", borderRadius: 5 }} />
            <div style={{ ...bar("30%"), margin: "1px auto 0" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function center(): CSSProperties {
  return {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  };
}

function card(width: string, maxWidth: number, padding = 12): CSSProperties {
  return {
    width,
    maxWidth,
    background: "#fff",
    border: "1px solid #e7e1d6",
    borderRadius: 8,
    padding,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "0 8px 18px -12px rgba(0,0,0,.3)",
  };
}

function field(): CSSProperties {
  return { height: 14, background: "#fff", border: "1px solid #ddd6ca", borderRadius: 5 };
}

function tile(): CSSProperties {
  return { background: "#fff", border: "1px solid #e7e1d6", borderRadius: 6 };
}

function errBadge(): CSSProperties {
  return {
    width: 11,
    height: 11,
    borderRadius: "50%",
    background: "#E8442A",
    color: "#fff",
    fontSize: 8,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };
}
