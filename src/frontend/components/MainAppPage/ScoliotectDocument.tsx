import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  Link,
} from "@react-pdf/renderer";
import getMaxCobbAngle from "@/utils/cobbAngle/getMaxCobbAngle";
import { getRelevantScoliosisInsights } from "@/utils/rag/scoliosisKnowledgeBase";

Font.register({ family: "Manrope", src: "/fonts/Manrope-VariableFont.ttf" });

Font.register({
  family: "Manrope",
  fonts: [
    { src: "/fonts/Manrope-Light.ttf", fontWeight: 400 },
    { src: "/fonts/Manrope-Regular.ttf", fontWeight: 500 },
    { src: "/fonts/Manrope-Bold.ttf", fontWeight: 600 },
  ],
});

const colors = {
  white: "#FFFFFF",
  primary: "#0073f5",
  lightGray: "#4b5563",
  darkGray: "#1f2937",
  border: "#d1d5db",
  severityGreen: "#15803d",
  severityYellow: "#ca8a04",
  severityOrange: "#ea580c",
  severityRed: "#dc2626",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: colors.white,
    fontFamily: "Manrope",
    fontWeight: 500,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
  },
  titleSection: {
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    color: colors.primary,
    fontSize: 32,
  },
  subtitle: {
    fontSize: 11,
    color: colors.lightGray,
    lineHeight: 1.2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  leftColumn: {
    flex: 0.62,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 4,
    marginRight: 6,
  },
  rightColumn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 6,
  },
  rightStack: {
    flex: 0.38,
  },
  severityBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginTop: 6,
  },
  severityLabel: {
    color: colors.darkGray,
    fontSize: 13,
    lineHeight: 1.2,
  },
  severityDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 6,
  },
  imageContainer: {
    height: 370,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  sectionTitle: {
    fontWeight: 600,
    color: colors.darkGray,
    marginBottom: 4,
    fontSize: 15,
  },
  smallText: {
    color: colors.lightGray,
    fontSize: 11,
    lineHeight: 1.2,
  },
  resultLine: {
    color: colors.lightGray,
    fontSize: 11,
    lineHeight: 1.2,
    marginBottom: 2,
  },
  bottomSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 6,
    marginBottom: 8,
  },
  ragHeader: {
    fontWeight: 600,
    color: colors.darkGray,
    fontSize: 14,
    marginBottom: 4,
  },
  ragText: {
    color: colors.lightGray,
    fontSize: 14,
    lineHeight: 1.25,
  },
  footer: {
    position: "absolute",
    fontSize: 10,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

interface IScoliotectDocumentProps {
  scoliotectAPIResponse?: ScoliotectAPIResponseType;
  imageSrc: string;
  originalImageSrc?: string;
}

const ScoliotectDocument: React.FC<IScoliotectDocumentProps> = ({
  scoliotectAPIResponse,
  imageSrc,
  originalImageSrc,
}) => {
  const date = new Date();
  const hasAngles = !!scoliotectAPIResponse?.angles;
  const maxCobb = hasAngles
    ? getMaxCobbAngle(scoliotectAPIResponse.angles as AnglesType)
    : null;

  const pt = hasAngles ? scoliotectAPIResponse.angles!.pt.angle : 0;
  const mt = hasAngles ? scoliotectAPIResponse.angles!.mt.angle : 0;
  const tl = hasAngles ? scoliotectAPIResponse.angles!.tl.angle : 0;

  const classifyAngle = (angle: number) => {
    if (angle < 10) return "Normal";
    if (angle < 25) return "Mild";
    if (angle < 40) return "Moderate";
    return "Severe";
  };

  const pickRag = (query: string) =>
    getRelevantScoliosisInsights(query, 1)[0]?.content || "";

  const angleDrivenInsights = hasAngles
    ? (() => {
        const ptSeverity = classifyAngle(pt);
        const mtSeverity = classifyAngle(mt);
        const tlSeverity = classifyAngle(tl);
        const overallSeverity = classifyAngle(maxCobb!.value);

        const ptNote =
          pt < 10
            ? "Within normal limits; this region does not materially contribute to overall deformity and has no immediate regional concern."
            : pickRag(`pt ${pt.toFixed(2)} ${ptSeverity} proximal thoracic management`);

        const mtBraceNote =
          mt >= 25 && mt < 40
            ? pickRag("bracing range 25 40 moderate guideline srs")
            : "";
        const mtNote =
          `Dominant curve and primary driver of severity. ` +
          (mtBraceNote || pickRag(`mt ${mt.toFixed(2)} ${mtSeverity} main thoracic dominant management`));

        const isBalancedSCurve =
          scoliotectAPIResponse?.curve_type === "S" && Math.abs(mt - tl) <= 5;
        const tlBalanceNote = isBalancedSCurve
          ? pickRag("balanced s-curve compensatory mt tl close")
          : "";
        const tlNote =
          (tlBalanceNote ? `${tlBalanceNote} ` : "") +
          pickRag(`tl ${tl.toFixed(2)} ${tlSeverity} thoracolumbar lumbar progression monitoring`);

        const risserNote = pickRag("risser stage skeletal maturity progression decision");
        const overallNote =
          `S-curve pattern with ${maxCobb!.max.toUpperCase()} as the apex requires active monitoring. ` +
          (risserNote || "Skeletal maturity should be obtained clinically because it affects treatment decisions.");

        const nextStepNote =
          pickRag(`${overallSeverity.toLowerCase()} surveillance progression growth management`) ||
          pickRag("mild follow-up trend monitoring periodic");

        return [
          `PT (${pt.toFixed(2)}° | ${ptSeverity}): ${ptNote}`,
          `MT (${mt.toFixed(2)}° | ${mtSeverity}): ${mtNote}`,
          `TL/L (${tl.toFixed(2)}° | ${tlSeverity}): ${tlNote}`,
          `Overall (${maxCobb!.value.toFixed(2)}° | ${overallSeverity}): ${overallNote}`,
          `Next Step (${overallSeverity} | Apex ${maxCobb!.max.toUpperCase()}): ${nextStepNote}`,
        ];
      })()
    : [];

  const overallSeverity = hasAngles ? classifyAngle(maxCobb!.value) : "Normal";
  const severityColor =
    overallSeverity === "Normal"
      ? colors.severityGreen
      : overallSeverity === "Mild"
        ? colors.severityYellow
        : overallSeverity === "Moderate"
          ? colors.severityOrange
          : colors.severityRed;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            <Text style={{ fontWeight: 600 }}>Scolio</Text>tect
          </Text>
          <Text style={styles.subtitle}>
            Automatic Scoliosis Detection and Cobb Measurement Tool powered by AI
          </Text>
        </View>

        {scoliotectAPIResponse && hasAngles ? (
          <>
            <View style={styles.topRow}>
              <View style={styles.leftColumn}>
                <Text style={styles.sectionTitle}>Images</Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, marginRight: 3 }}>
                    <Text style={[styles.smallText, { marginBottom: 1 }]}>Original</Text>
                    <View style={{ height: 340 }}>
                      <Image style={styles.image} src={originalImageSrc || imageSrc} />
                    </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: 3 }}>
                    <Text style={[styles.smallText, { marginBottom: 1 }]}>Exported</Text>
                    <View style={{ height: 340 }}>
                      <Image style={styles.image} src={imageSrc} />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.rightStack}>
                <View style={styles.rightColumn}>
                  <Text style={styles.sectionTitle}>Results</Text>
                  <Text style={styles.resultLine}>
                    Curve Type: {scoliotectAPIResponse.curve_type}
                  </Text>
                  <Text style={styles.resultLine}>
                    Proximal Thoracic (PT): {pt.toFixed(2)}°
                  </Text>
                  <Text style={styles.resultLine}>
                    Main Thoracic (MT): {mt.toFixed(2)}°
                  </Text>
                  <Text style={styles.resultLine}>
                    Thoracolumbar/Lumbar (TL/L): {tl.toFixed(2)}°
                  </Text>
                  <Text style={styles.resultLine}>
                    greatest bend is found at {maxCobb!.max.toUpperCase()}: {maxCobb!.value.toFixed(2)}° taken from the superior endplate of ({scoliotectAPIResponse.angles![maxCobb!.max].idxs[0] + 1}) and inferior endplate of ({scoliotectAPIResponse.angles![maxCobb!.max].idxs[1] + 1}).
                  </Text>
                </View>
                <View style={styles.severityBox}>
                  <Text style={styles.severityLabel}>Severity:</Text>
                  <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
                </View>
              </View>
            </View>

            <View style={styles.bottomSection}>
              <Text style={styles.ragHeader}>RAG Info</Text>
              <View style={{ marginTop: 0 }}>
                {angleDrivenInsights.map((line, index) => (
                  <Text key={`${index}-${line}`} style={[styles.ragText, { marginBottom: 6 }]}>
                    {line}
                  </Text>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.bottomSection}>
            <Text style={styles.smallText}>No Results found</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Results generated from{" "}
          <Link src="https://scoliotect.app/" style={{ color: colors.primary, textDecoration: "none" }}>
            Scoliotect
          </Link>{" "}
          on {date.toDateString()}
        </Text>
      </Page>
    </Document>
  );
};

export default ScoliotectDocument;
