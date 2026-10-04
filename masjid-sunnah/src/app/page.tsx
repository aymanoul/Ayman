import { Heading, Section } from "@/components/ui";

// TODO (Phase 3): Startseite. Bis dahin Platzhalter.
export default function Home() {
  return (
    <Section tone="navy" className="min-h-[70vh] pt-20">
      <Heading as="h1" size="xl" on="dark" first="Startseite" accent="folgt" />
      <p className="mt-6 text-white/80">TODO: Phase 3. Siehe <a className="underline" href="/styleguide/">/styleguide/</a>.</p>
    </Section>
  );
}
