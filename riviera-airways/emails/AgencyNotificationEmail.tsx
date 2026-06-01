import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { formatPassengerCount } from '@/types/registration';
import type { Contact, Passenger } from '@/types/registration';

export interface AgencyNotificationEmailProps {
  contact: Contact;
  passengers: Passenger[];
  bookingId: string;
  whatsappSent: boolean;
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

export function AgencyNotificationEmail({
  contact,
  passengers,
  bookingId,
  whatsappSent,
}: AgencyNotificationEmailProps) {
  const count = formatPassengerCount(passengers);

  return (
    <Html lang="fr">
      <Head />
      <Preview>
        Nouvelle inscription {bookingId} · {contact.prenom} {contact.nom} · {count}
      </Preview>
      <Body style={{ backgroundColor: COLORS.bg, margin: 0, padding: '24px 0', fontFamily: 'Georgia, serif' }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', backgroundColor: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
          <Section style={{ padding: '24px 32px 0' }}>
            <Text style={{ color: COLORS.accent, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', margin: 0, fontWeight: 700 }}>
              Notification agence
            </Text>
            <Heading style={{ color: COLORS.text, fontSize: 22, margin: '8px 0', fontWeight: 400 }}>
              Nouvelle inscription · {bookingId}
            </Heading>
          </Section>

          <Hr style={{ borderColor: COLORS.border, margin: '8px 32px' }} />

          <Section style={{ padding: '8px 32px' }}>
            <Field label="Contact" value={`${contact.prenom} ${contact.nom.toUpperCase()}`} />
            <Field label="Email" value={contact.email} />
            <Field label="Téléphone" value={contact.telephone ?? '— non fourni —'} />
            <Field label="Date de naissance" value={contact.dateNaissance} />
            <Field label="Passagers" value={`${count} (total ${passengers.length})`} />
            <Field label="WhatsApp" value={whatsappSent ? '✅ envoyé' : '— non envoyé —'} />
          </Section>

          <Hr style={{ borderColor: COLORS.border, margin: '8px 32px' }} />

          <Section style={{ padding: '8px 32px 24px' }}>
            <Text style={{ color: COLORS.muted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>
              Détail passagers
            </Text>
            {passengers.map((p, i) => (
              <Text key={i} style={{ color: COLORS.text, fontSize: 14, margin: '2px 0' }}>
                {i + 1}. {p.prenom} {p.nom.toUpperCase()} · {p.type} · né(e) {p.dateNaissance}
              </Text>
            ))}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Text style={{ margin: '6px 0' }}>
      <span style={{ color: COLORS.muted, fontSize: 12, display: 'inline-block', width: 140 }}>
        {label}
      </span>
      <span style={{ color: COLORS.text, fontSize: 14, fontWeight: 700 }}>{value}</span>
    </Text>
  );
}

export default AgencyNotificationEmail;
