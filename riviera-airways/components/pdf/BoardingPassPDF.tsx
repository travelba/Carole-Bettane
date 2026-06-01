import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { BoardingPassData } from '@/types/registration';

/**
 * Billet PDF — format A6 paysage (420×210pts), taille réelle d'un boarding pass.
 * Couleurs imposées par le design system (voir .cursor/rules/03-pdf-boarding-pass).
 */

const COLORS = {
  bg: '#1A1612',
  bg2: '#231F1A',
  text: '#F5E6C8',
  accent: '#C9A84C',
  muted: '#7a6e64',
  enfant: '#B76E79',
  border: 'rgba(201,168,76,0.25)',
} as const;

// Police par défaut Helvetica (intégrée à react-pdf) — pas de fetch réseau au build.
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg,
    color: COLORS.text,
    fontFamily: 'Helvetica',
  },
  // Souche détachable à droite
  stub: {
    width: 120,
    backgroundColor: COLORS.bg2,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    borderLeftStyle: 'dashed',
    padding: 16,
    justifyContent: 'space-between',
  },
  main: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  airline: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  agency: {
    fontSize: 6,
    color: COLORS.muted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  classBadge: {
    fontSize: 7,
    color: COLORS.bg,
    backgroundColor: COLORS.accent,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  route: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  airportBlock: {
    alignItems: 'flex-start',
  },
  airportBlockRight: {
    alignItems: 'flex-end',
  },
  iata: {
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    letterSpacing: 1,
  },
  city: {
    fontSize: 7,
    color: COLORS.muted,
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    color: COLORS.accent,
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
  },
  planeIcon: {
    fontSize: 14,
    color: COLORS.accent,
  },
  divider: {
    flex: 1,
    height: 1,
    marginHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderTopStyle: 'dotted',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  infoCell: {
    flexDirection: 'column',
  },
  infoLabel: {
    fontSize: 6,
    color: COLORS.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginTop: 2,
  },
  stubLabel: {
    fontSize: 6,
    color: COLORS.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stubValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginTop: 1,
  },
  stubAccent: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.accent,
  },
  barcode: {
    flexDirection: 'row',
    marginTop: 8,
    height: 26,
    alignItems: 'flex-end',
  },
});

/** Génère une "fausse" code-barres déterministe à partir du bookingId + nom. */
function Barcode({ seed }: { seed: string }) {
  const bars: number[] = [];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  for (let i = 0; i < 34; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    bars.push((hash % 3) + 1);
  }
  return (
    <View style={styles.barcode}>
      {bars.map((w, i) => (
        <View
          key={i}
          style={{
            width: w,
            height: i % 2 === 0 ? 26 : 18,
            backgroundColor: i % 2 === 0 ? COLORS.text : 'transparent',
            marginRight: 1,
          }}
        />
      ))}
    </View>
  );
}

export interface BoardingPassPDFProps extends BoardingPassData {}

export function BoardingPassPDF({
  passenger,
  flight,
  direction,
  bookingId,
  seat,
}: BoardingPassPDFProps) {
  const passengerName = `${passenger.prenom} ${passenger.nom.toUpperCase()}`;
  const accent = passenger.type === 'Enfant' ? COLORS.enfant : COLORS.accent;
  const directionLabel = direction === 'aller' ? 'ALLER' : 'RETOUR';

  return (
    <Document
      title={`Billet ${flight.code} — ${passengerName}`}
      author="Riviera Private Airways · Travel Booking Agency"
    >
      <Page size={[420, 210]} style={styles.page}>
        <View style={styles.main}>
          <View style={styles.header}>
            <View>
              <Text style={styles.airline}>RIVIERA PRIVATE AIRWAYS</Text>
              <Text style={styles.agency}>by Travel Booking Agency · {directionLabel}</Text>
            </View>
            <Text style={[styles.classBadge, { backgroundColor: accent }]}>
              SAINT-TROPEZ
            </Text>
          </View>

          <View style={styles.route}>
            <View style={styles.airportBlock}>
              <Text style={styles.iata}>{flight.from}</Text>
              <Text style={styles.city}>{flight.fromCity}</Text>
              <Text style={[styles.time, { color: accent }]}>{flight.dep}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={[styles.planeIcon, { color: accent }]}>✈</Text>
            <View style={styles.divider} />
            <View style={styles.airportBlockRight}>
              <Text style={styles.iata}>{flight.to}</Text>
              <Text style={styles.city}>{flight.toCity}</Text>
              <Text style={[styles.time, { color: accent }]}>{flight.arr}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Passager</Text>
              <Text style={styles.infoValue}>{passengerName}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Vol</Text>
              <Text style={styles.infoValue}>{flight.code}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{flight.date}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Siège</Text>
              <Text style={[styles.infoValue, { color: accent }]}>{seat}</Text>
            </View>
          </View>
        </View>

        <View style={styles.stub}>
          <View>
            <Text style={styles.stubLabel}>Réservation</Text>
            <Text style={[styles.stubAccent, { color: accent }]}>{bookingId}</Text>
            <Text style={[styles.stubLabel, { marginTop: 8 }]}>Passager</Text>
            <Text style={styles.stubValue}>{passenger.prenom}</Text>
            <Text style={styles.stubValue}>{passenger.nom.toUpperCase()}</Text>
            <Text style={[styles.stubLabel, { marginTop: 8 }]}>Vol · Siège</Text>
            <Text style={styles.stubValue}>
              {flight.code} · {seat}
            </Text>
          </View>
          <Barcode seed={`${bookingId}-${flight.code}-${passengerName}`} />
        </View>
      </Page>
    </Document>
  );
}

export default BoardingPassPDF;
