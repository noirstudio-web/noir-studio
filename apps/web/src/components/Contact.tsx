import { asset, DISCORD_URL } from '@/lib/site';
import { WhatsAppIcon } from './Icon';
import { QuoteForm } from './QuoteForm';
import { SectionHead } from './SectionHead';
import { PhoneText, WaLink } from './WaLink';

export function Contact() {
  return (
    <section className="section section--contact" id="contacto" aria-labelledby="contacto-title">
      <div className="container">
        <SectionHead id="contacto-title" eyebrow="06 — Contacto" title="Construyamos tu visión"
          lead="Cuéntame tu idea y te respondo con una propuesta. La cotización es gratis y sin compromiso." />

        <div className="contact">
          <div className="contact__channels">
            <WaLink wa="cotizar" className="channel glow reveal">
              <span className="channel__icon channel__icon--wa" aria-hidden="true"><WhatsAppIcon /></span>
              <span className="channel__text">
                <span className="channel__label">WhatsApp</span>
                <span className="channel__value"><PhoneText fallback="Escríbenos" /></span>
                <span className="channel__hint">Respuesta rápida · Cotización gratis</span>
              </span>
              <span className="channel__arrow" aria-hidden="true">↗</span>
            </WaLink>

            <a className="channel channel--discord glow reveal" href={DISCORD_URL} target="_blank" rel="noopener">
              <picture className="channel__banner">
                <source srcSet={asset('/assets/discord-banner.webp')} type="image/webp" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset('/assets/discord-banner.jpg')} width={960} height={540} alt="Banner del servidor de Discord de Noir Studio" loading="lazy" />
              </picture>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="channel__icon channel__icon--dc" src={asset('/assets/discord-icono.png')} width={128} height={128} alt="" loading="lazy" />
              <span className="channel__text">
                <span className="channel__label">Comunidad en Discord</span>
                <span className="channel__value">{DISCORD_URL.replace('https://', '')}</span>
                <span className="channel__hint">Únete, pregunta y cotiza</span>
              </span>
              <span className="channel__arrow" aria-hidden="true">↗</span>
            </a>

            <p className="contact__note reveal"><span aria-hidden="true">✦</span> Ideas / Código / Resultados</p>
          </div>

          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
