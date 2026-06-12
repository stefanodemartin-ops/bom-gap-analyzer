import {
  Document,
  Page,
  Text,
  View,
  Svg,
  Path,
  Rect,
  StyleSheet,
} from "@react-pdf/renderer";
import { Asset, MissingPart, Session } from "./types";

// Brand palette (matches the app)
const NAVY = "#1B2A4A";
const SKY = "#0EA5E9";
const RED = "#DC2626";
const GREEN = "#16A34A";
const AMBER = "#D97706";
const SLATE = "#475569";
const SLATE_LIGHT = "#94A3B8";
const BG = "#F8FAFC";
const BORDER = "#E2E8F0";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#1E293B", paddingBottom: 46 },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 36,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandName: { color: "#FFFFFF", fontSize: 16, fontFamily: "Helvetica-Bold" },
  brandTag: { color: "#7DD3FC", fontSize: 8, marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  reportTitle: { color: "#FFFFFF", fontSize: 11, fontFamily: "Helvetica-Bold" },
  reportDate: { color: "#CBD5E1", fontSize: 8, marginTop: 2 },
  body: { paddingHorizontal: 36, paddingTop: 20 },
  h2: { fontSize: 12, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 6 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
    marginTop: 16,
    marginBottom: 6,
  },
  meta: { fontSize: 9, color: SLATE, marginBottom: 2 },
  metaLabel: { fontFamily: "Helvetica-Bold", color: NAVY },
  statRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  statValue: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  statLabel: { fontSize: 7.5, color: SLATE_LIGHT, marginTop: 3 },
  alertBand: {
    marginTop: 12,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 6,
    padding: 10,
  },
  alertText: { color: RED, fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  visualBand: {
    marginTop: 8,
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: "#BAE6FD",
    borderRadius: 6,
    padding: 10,
  },
  visualBandText: { color: "#0369A1", fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  card: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
    backgroundColor: "#FFFFFF",
  },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  partNumber: {
    fontFamily: "Courier-Bold",
    fontSize: 8.5,
    backgroundColor: BG,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  partDesc: { fontFamily: "Helvetica-Bold", fontSize: 9.5, marginLeft: 6, flex: 1 },
  chip: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 3,
  },
  cardLine: { fontSize: 8.5, color: SLATE, marginTop: 4, lineHeight: 1.35 },
  cardLineLabel: { fontFamily: "Helvetica-Bold", color: NAVY },
  visualNote: { fontSize: 8.5, color: "#0369A1", marginTop: 4, lineHeight: 1.35 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  th: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: SLATE_LIGHT },
  tr: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  td: { fontSize: 8.5, color: SLATE },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 8,
  },
  footerText: { fontSize: 7.5, color: SLATE_LIGHT },
});

function chipColors(criticality: MissingPart["criticality"]) {
  if (criticality === "CRITICAL") return { backgroundColor: "#FEE2E2", color: RED };
  if (criticality === "IMPORTANT") return { backgroundColor: "#FEF3C7", color: AMBER };
  return { backgroundColor: "#F1F5F9", color: SLATE };
}

function Logo() {
  return (
    <Svg width={26} height={26} viewBox="0 0 32 32">
      <Rect x={0} y={0} width={32} height={32} rx={7} fill={SKY} />
      <Path
        d="M13 9H11a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V11a2 2 0 00-2-2h-2M13 9a2 2 0 002 2h2a2 2 0 002-2M13 9a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        stroke="#FFFFFF"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ReportDocument({ session, asset }: { session: Session; asset: Asset }) {
  const { result } = asset;
  const s = result.summary;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const critical = result.missing_from_cmms.filter((p) => p.criticality === "CRITICAL");
  const important = result.missing_from_cmms.filter((p) => p.criticality === "IMPORTANT");
  const routine = result.missing_from_cmms.filter((p) => p.criticality === "ROUTINE");
  const visualFinds = result.missing_from_cmms.filter((p) => p.source === "visual_inspection");

  const missingGroups: { label: string; items: MissingPart[] }[] = [
    { label: "Critical", items: critical },
    { label: "Important", items: important },
    { label: "Routine", items: routine },
  ];

  return (
    <Document
      title={`SparesView Gap Analysis — ${asset.name}`}
      author="SparesView"
      creator="SparesView — sparesview.com"
    >
      <Page size="LETTER" style={styles.page}>
        {/* Branded header */}
        <View style={styles.header} fixed>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Logo />
            <View>
              <Text style={styles.brandName}>SparesView</Text>
              <Text style={styles.brandTag}>SPARE PARTS INTELLIGENCE</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>Spare Parts Gap Analysis</Text>
            <Text style={styles.reportDate}>{date}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Asset & client block */}
          <Text style={styles.h2}>{asset.name}</Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Client: </Text>{session.clientName}
            {"   "}
            <Text style={styles.metaLabel}>Plant / Site: </Text>{session.plantName}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>Equipment identified: </Text>
            {result.equipment_identified}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>OEM documents: </Text>
            {asset.oemFileNames.join(", ")}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>CMMS export: </Text>
            {session.cmmsFileName} ({session.cmmsRowCount.toLocaleString()} rows)
          </Text>

          {/* Executive summary */}
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: SKY }]}>{Math.round(s.match_rate * 100)}%</Text>
              <Text style={styles.statLabel}>MATCH RATE</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: GREEN }]}>{s.matched_count}</Text>
              <Text style={styles.statLabel}>MATCHED</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: RED }]}>{s.missing_count}</Text>
              <Text style={styles.statLabel}>MISSING FROM CMMS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: RED }]}>{s.critical_missing_count}</Text>
              <Text style={styles.statLabel}>CRITICAL MISSING</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: AMBER }]}>{s.extra_count}</Text>
              <Text style={styles.statLabel}>EXTRA IN CMMS</Text>
            </View>
          </View>

          {s.critical_missing_count > 0 && (
            <View style={styles.alertBand}>
              <Text style={styles.alertText}>
                {s.critical_missing_count} critical part{s.critical_missing_count === 1 ? " is" : "s are"} missing
                from the CMMS — immediate attention recommended.
              </Text>
            </View>
          )}

          {visualFinds.length > 0 && (
            <View style={styles.visualBand}>
              <Text style={styles.visualBandText}>
                {visualFinds.length} component{visualFinds.length === 1 ? "" : "s"} identified by AI visual
                inspection of engineering drawings — listed in no parts table.
              </Text>
            </View>
          )}

          {/* Missing parts by criticality */}
          {missingGroups.map(({ label, items }) =>
            items.length === 0 ? null : (
              <View key={label}>
                <Text style={styles.sectionTitle}>
                  Missing from CMMS — {label} ({items.length})
                </Text>
                {items.map((p, i) => (
                  <View key={i} style={styles.card} wrap={false}>
                    <View style={styles.cardHeaderRow}>
                      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        {p.oem_part_number ? (
                          <Text style={styles.partNumber}>{p.oem_part_number}</Text>
                        ) : null}
                        <Text style={styles.partDesc}>{p.oem_description}</Text>
                      </View>
                      <Text style={[styles.chip, chipColors(p.criticality)]}>{p.criticality}</Text>
                    </View>
                    <Text style={styles.cardLine}>
                      <Text style={styles.cardLineLabel}>Risk: </Text>{p.reason}
                    </Text>
                    <Text style={styles.cardLine}>
                      <Text style={styles.cardLineLabel}>Recommendation: </Text>{p.recommendation}
                    </Text>
                    {p.source === "visual_inspection" && p.visual_note ? (
                      <Text style={styles.visualNote}>
                        Found by drawing inspection: {p.visual_note}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )
          )}

          {/* Matched parts */}
          {result.matched.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Matched Parts ({result.matched.length})</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { width: "44%" }]}>OEM PART</Text>
                <Text style={[styles.th, { width: "44%" }]}>CMMS ENTRY</Text>
                <Text style={[styles.th, { width: "12%", textAlign: "right" }]}>CONFIDENCE</Text>
              </View>
              {result.matched.map((p, i) => (
                <View key={i} style={styles.tr} wrap={false}>
                  <Text style={[styles.td, { width: "44%", paddingRight: 6 }]}>
                    {p.oem_part_number ? `${p.oem_part_number} — ` : ""}{p.oem_description}
                  </Text>
                  <Text style={[styles.td, { width: "44%", paddingRight: 6 }]}>
                    {p.cmms_part_number ? `${p.cmms_part_number} — ` : ""}{p.cmms_description}
                  </Text>
                  <Text style={[styles.td, { width: "12%", textAlign: "right", color: GREEN, fontFamily: "Helvetica-Bold" }]}>
                    {Math.round(p.confidence * 100)}%
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Extra in CMMS */}
          {result.extra_in_cmms.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>
                In CMMS but not in OEM documents ({result.extra_in_cmms.length})
              </Text>
              {result.extra_in_cmms.map((p, i) => (
                <View key={i} style={styles.card} wrap={false}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {p.cmms_part_number ? (
                      <Text style={styles.partNumber}>{p.cmms_part_number}</Text>
                    ) : null}
                    <Text style={styles.partDesc}>{p.cmms_description}</Text>
                  </View>
                  <Text style={styles.cardLine}>{p.note}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated by SparesView — Spare Parts Intelligence · sparesview.com
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
