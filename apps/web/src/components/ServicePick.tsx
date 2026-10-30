'use client';

/** Botón "Cotizar" de cada servicio: baja al formulario con ese servicio ya elegido. */
export function ServicePick({ id, title }: { id: string; title: string }) {
  return (
    <a
      className="card__cta link-arrow"
      href="#quote-form"
      aria-label={`Cotizar ${title}`}
      onClick={() => window.dispatchEvent(new CustomEvent('noir:service', { detail: id }))}
    >
      Cotizar <span aria-hidden="true">→</span>
    </a>
  );
}
