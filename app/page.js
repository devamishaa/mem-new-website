"use client";

import { lazy } from "react";
import Head from "next/head";
import Link from "next/link";
import Emotion from "./components/cosmic-view/Emotion";
import TestimonialsView from "./components/testimonial-view/Testimonial";
import SuperpowerView from "./components/superpower-ui/SuperpowerView";
import PricingView from "./components/pricing-view/PricingView";

export default function Proto1Phase2() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Genera",
    url: "https://genera.net",
    logo: "https://genera.net/assets/logo-DOE1xxdn.png",
    sameAs: [
      "https://www.linkedin.com/company/genera-hub/",
      "https://x.com/GeneraHub",
      "https://www.instagram.com/generahub/",
    ],
    description:
      "Genera es un hub de transformación digital para empresas. A través de consultoría, innovación y soluciones tecnológicas ayudamos a organizaciones a crecer.",
    department: [
      {
        "@type": "Organization",
        name: "Genera Digital",
        url: "https://genera.net/digital",
      },
      {
        "@type": "Organization",
        name: "Genera Lab",
        url: "https://genera.net/lab",
      },
      {
        "@type": "Organization",
        name: "Genera Consulting",
        url: "https://genera.net/consulting",
      },
    ],
    keywords: [
      "genera",
      "transformación digital empresas",
      "digitalización de negocios",
      "soluciones digitales",
      "consultoría transformación digital",
    ],
  };

  return (
    <>
      <Head>
        <title>Genera | Lidera la Transformación Digital de tu Empresa</title>
        <meta
          name="description"
          content="Impulsa el cambio digital de tu empresa con Genera. Soluciones en consultoría, innovación y tecnología para liderar la transformación en tu sector."
        />
        <link rel="canonical" href="https://genera.net/" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <section className="hidden" aria-hidden="true">
        <h2>¿Estás listo para liderar tu industria con innovación?</h2>
        <p>
          Comienza tu transformación digital con Genera. Hablemos de tu
          proyecto.
        </p>
        <Link href="/contacto" className="cta">
          Contáctanos
        </Link>
      </section>
      <Emotion />
      <TestimonialsView />
      <SuperpowerView />
      <PricingView />
    </>
  );
}
