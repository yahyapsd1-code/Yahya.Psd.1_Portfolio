import {
  getSiteContent,
  getPublishedPortfolio,
  getPublishedTestimonials,
} from "@/lib/content";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Workflow } from "@/components/site/Workflow";
import { Journey } from "@/components/site/Journey";
import { Services } from "@/components/site/Services";
import { Statistics } from "@/components/site/Statistics";
import { Portfolio } from "@/components/site/Portfolio";
import { Testimonials } from "@/components/site/Testimonials";
import { Social } from "@/components/site/Social";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import type {
  SettingsData,
  BackgroundData,
  SectionBg,
  HeroData,
  AboutData,
  WorkflowData,
  JourneyData,
  ServicesData,
  StatisticsData,
  SocialData,
  ContactData,
  FooterData,
} from "@/lib/types";

export const dynamic = "force-dynamic";

const typed = <T,>(value: unknown): T => value as T;

export default async function Home() {
  const [content, portfolioItems, testimonials] = await Promise.all([
    getSiteContent(),
    getPublishedPortfolio(),
    getPublishedTestimonials(),
  ]);

  const settings = typed<SettingsData>(content.settings);
  const backgrounds = typed<BackgroundData>(content.background);
  const sections = backgrounds.sections ?? {};
  const sec = (key: string): SectionBg | undefined => sections[key];

  return (
    <>
      <Navbar
        brand={settings.brandName}
        initials={settings.brandInitials}
        ctaLabel="Let's Talk"
      />
      <main>
        <Hero data={typed<HeroData>(content.hero)} bg={sec("hero")} />

        <About data={typed<AboutData>(content.about)} bg={sec("about")} />

        <Workflow
          data={typed<WorkflowData>(content.workflow)}
          bg={sec("workflow")}
        />

        <Services
          data={typed<ServicesData>(content.services)}
          bg={sec("services")}
        />

        <Portfolio items={portfolioItems} bg={sec("portfolio")} />

        <Statistics
          data={typed<StatisticsData>(content.statistics)}
          bg={sec("statistics")}
        />

        <Journey data={typed<JourneyData>(content.journey)} bg={sec("journey")} />

        <Testimonials items={testimonials} bg={sec("testimonials")} />

        <Social data={typed<SocialData>(content.social)} bg={sec("social")} />

        <Contact data={typed<ContactData>(content.contact)} bg={sec("contact")} />
      </main>

      <Footer
        data={typed<FooterData>(content.footer)}
        social={typed<SocialData>(content.social)}
        brand={settings.brandName}
        initials={settings.brandInitials}
        email={typed<ContactData>(content.contact).email}
        bg={sec("footer")}
      />
    </>
  );
}
