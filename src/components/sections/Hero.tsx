import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye } from "lucide-react";
import ConsultationForm from "@/components/forms/ConsultationForm";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const slideClass = (index: number) =>
    `absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
      currentSlide === index
        ? "opacity-100 translate-x-0"
        : currentSlide > index
        ? "opacity-0 -translate-x-full pointer-events-none"
        : "opacity-0 translate-x-full pointer-events-none"
    }`;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      {/* Sophisticated layered background */}
      <div className="absolute inset-0">
        {/* Soft diagonal pinstripes — premium corporate texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, hsl(var(--primary-foreground)) 0, hsl(var(--primary-foreground)) 1px, transparent 1px, transparent 14px)`,
            maskImage: 'linear-gradient(180deg, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent, black 20%, black 80%, transparent)',
          }}
        />
        {/* Elegant burgundy aurora — top-left */}
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full opacity-40 blur-[120px]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.7), transparent 65%)' }} />
        {/* Gold ambient — bottom-right */}
        <div className="absolute -bottom-1/3 -right-1/4 w-[700px] h-[700px] rounded-full opacity-25 blur-[120px]"
          style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.6), transparent 65%)' }} />
        {/* Subtle center spotlight for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(ellipse, hsl(var(--accent) / 0.15), transparent 70%)' }} />
        {/* Top vignette for header contrast */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Gold accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-accent to-primary" />

      <div className="container-padding max-w-7xl mx-auto relative z-10 pt-20 w-full">
        <div className="relative min-h-[600px] flex items-center justify-center">

          {/* Slide 1 – What We Do */}
          <div className={slideClass(0)}>
            <div className="text-primary-foreground text-center max-w-4xl mx-auto px-4">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-6">
                Chartered Governance Centre
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-8">
                What Do <span className="text-primary">We Do?</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 leading-relaxed max-w-3xl mx-auto text-justify">
                We provide expert advisory, specialized training, and comprehensive compliance support in <strong className="text-primary-foreground">corporate governance</strong>, <strong className="text-primary-foreground">secretarial practice</strong>, and <strong className="text-primary-foreground">board advisory</strong>—helping organizations build governance systems that drive performance and resilience.
              </p>
              <ConsultationForm
                trigger={
                  <Button variant="hero" size="xl" className="group">
                    Schedule Consultation
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Slide 2 – Who It's For */}
          <div className={slideClass(1)}>
            <div className="text-primary-foreground text-center max-w-4xl mx-auto px-4">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-6">
                Chartered Governance Centre
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-8">
                Who Is It <span className="text-primary">For?</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 leading-relaxed max-w-3xl mx-auto text-justify">
                Our services are designed for <strong className="text-primary-foreground">boards of directors</strong>, <strong className="text-primary-foreground">company secretaries</strong>, <strong className="text-primary-foreground">senior leadership</strong>, and governance professionals across listed and unlisted companies, state corporations, regulators, and NGOs.
              </p>
              <ConsultationForm
                trigger={
                  <Button variant="hero" size="xl" className="group">
                    Schedule Consultation
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Slide 3 – Why It Matters */}
          <div className={slideClass(2)}>
            <div className="text-primary-foreground text-center max-w-4xl mx-auto px-4">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-6">
                Chartered Governance Centre
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-8">
                Why It <span className="text-primary">Matters</span>
              </h1>
              <p className="text-lg sm:text-xl text-primary-foreground/85 mb-10 leading-relaxed max-w-3xl mx-auto text-justify">
                Strong governance drives <strong className="text-primary-foreground">accountability</strong>, <strong className="text-primary-foreground">regulatory compliance</strong>, and <strong className="text-primary-foreground">board effectiveness</strong>—mitigating legal risk and protecting stakeholder value for sustainable institutional success.
              </p>
              <ConsultationForm
                trigger={
                  <Button variant="hero" size="xl" className="group">
                    Schedule Consultation
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-20">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === i ? "bg-primary w-8" : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Short Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 pb-16 -mt-4">
          <div className="bg-background/10 backdrop-blur-sm rounded-xl p-8 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="text-primary-foreground" size={24} />
              </div>
              <h3 className="font-bold text-primary text-xl uppercase tracking-wider">Our Vision</h3>
            </div>
            <p className="text-primary-foreground/85 leading-relaxed">
              To be Africa's leading authority and preferred partner in governance, corporate secretarial, and board advisory services.
            </p>
          </div>
          <div className="bg-background/10 backdrop-blur-sm rounded-xl p-8 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="text-primary-foreground" size={24} />
              </div>
              <h3 className="font-bold text-primary text-xl uppercase tracking-wider">Our Mission</h3>
            </div>
            <p className="text-primary-foreground/85 leading-relaxed">
              To strengthen governance by enhancing board performance, reinforcing compliance, and protecting stakeholder value across public and private institutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
