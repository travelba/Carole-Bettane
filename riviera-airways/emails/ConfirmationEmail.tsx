import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { FLIGHT_DATA, formatPassengerCount } from '@/types/registration';
import type { Passenger } from '@/types/registration';

export interface ConfirmationEmailProps {
  prenom: string;
  bookingId: string;
  passengers: Passenger[];
}

const COLORS = {
  bg: '#1A1612',
  card: '#231F1A',
  card2: '#2C2620',
  text: '#F5E6C8',
  accent: '#C9A84C',
  muted: '#7a6e64',
  border: 'rgba(201,168,76,0.2)',
};

export function ConfirmationEmail({
  prenom,
  bookingId,
  passengers,
}: ConfirmationEmailProps) {
  const { aller, retour } = FLIGHT_DATA;
  const count = formatPassengerCount(passengers);

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Vos billets pour Saint-Tropez — {count} · Réservation {bookingId}
      </Preview>
      <Body style={{ backgroundColor: COLORS.bg, margin: 0, padding: '24px 0', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
          <Section style={{ padding: '32px 32px 8px' }}>
            <Text style={{ color: COLORS.accent, fontSize: 13, letterSpacing: 2, margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>
              Riviera Private Airways
            </Text>
            <Text style={{ color: COLORS.muted, fontSize: 11, margin: '4px 0 0' }}>
              by Travel Booking Agency
            </Text>
          </Section>

          <Section style={{ padding: '8px 32px 0' }}>
            <Heading style={{ color: COLORS.text, fontSize: 26, fontStyle: 'italic', margin: '8px 0', fontWeight: 400 }}>
              Bonjour {prenom},
            </Heading>
            <Text style={{ color: COLORS.text, fontSize: 15, lineHeight: '24px', margin: '0 0 8px' }}>
              Votre inscription pour le Week-end Bobo Bling à Saint-Tropez
              est confirmée. Vos billets sont joints à cet email en pièces jointes
              (téléchargement individuel).
            </Text>
            <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: 700, margin: '12px 0' }}>
              Réservation {bookingId} · {count}
            </Text>
          </Section>

          <Hr style={{ borderColor: COLORS.border, margin: '8px 32px' }} />

          <Section style={{ padding: '8px 32px' }}>
            <FlightRow label="Vol aller" {...aller} />
            <FlightRow label="Vol retour" {...retour} />
          </Section>

          <Hr style={{ borderColor: COLORS.border, margin: '8px 32px' }} />

          <Section style={{ padding: '8px 32px 16px' }}>
            <Text style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>
              Passagers
            </Text>
            {passengers.map((p, i) => (
              <Text
                key={i}
                style={{ color: COLORS.text, fontSize: 14, margin: '2px 0' }}
              >
                {p.type === 'Enfant' ? '🧒' : '✈'} {p.prenom} {p.nom.toUpperCase()}
                <span style={{ color: COLORS.muted, fontSize: 12 }}> · {p.type}</span>
              </Text>
            ))}
          </Section>

          <Section style={{ backgroundColor: COLORS.card2, padding: '20px 32px' }}>
            <Text style={{ color: COLORS.muted, fontSize: 12, margin: 0, textAlign: 'center' as const }}>
              Organisé par Travel Booking Agency · contact@travelba.fr
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function FlightRow(props: {
  label: string;
  code: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  dep: string;
  arr: string;
  date: string;
}) {
  return (
    <Section style={{ backgroundColor: COLORS.card2, borderRadius: 12, padding: 16, margin: '8px 0', border: `1px solid ${COLORS.border}` }}>
      <Row>
        <Column>
          <Text style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
            {props.label} · {props.code}
          </Text>
        </Column>
        <Column align="right">
          <Text style={{ color: COLORS.muted, fontSize: 12, margin: 0 }}>{props.date}</Text>
        </Column>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <Column>
          <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: 700, margin: 0 }}>{props.from}</Text>
          <Text style={{ color: COLORS.muted, fontSize: 11, margin: 0 }}>{props.fromCity}</Text>
          <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: 700, margin: '4px 0 0' }}>{props.dep}</Text>
        </Column>
        <Column align="center" style={{ width: 40 }}>
          <Text style={{ color: COLORS.accent, fontSize: 16, margin: 0 }}>✈</Text>
        </Column>
        <Column align="right">
          <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: 700, margin: 0 }}>{props.to}</Text>
          <Text style={{ color: COLORS.muted, fontSize: 11, margin: 0 }}>{props.toCity}</Text>
          <Text style={{ color: COLORS.accent, fontSize: 14, fontWeight: 700, margin: '4px 0 0' }}>{props.arr}</Text>
        </Column>
      </Row>
    </Section>
  );
}

export default ConfirmationEmail;
