import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { TechButton } from "@/components/TechButton";
import { categories } from "@shared/schema";
import { motion } from "framer-motion";
import { Code2, Cpu, Globe, Zap, Terminal } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useProducts();

  const skills = [
    { name: "React / Next.js", level: 95, icon: <Globe className="w-5 h-5" /> },
    { name: "Node.js / Express", level: 90, icon: <Terminal className="w-5 h-5" /> },
    { name: "Game Hacking/Reverse Engineering", level: 85, icon: <Cpu className="w-5 h-5" /> },
    { name: "UI/UX Design", level: 80, icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-tech uppercase tracking-widest text-sm mb-6 clip-button">
                Elite Fullstack Developer
              </div>
              <h1 className="text-6xl md:text-7xl font-display font-black mb-6 leading-tight">
                HÀ VĂN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">HUẤN</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg font-body leading-relaxed">
                Building the future of digital experiences. From high-performance web apps to exclusive game modifications.
              </p>
              
              <div className="flex gap-4">
                <TechButton size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Services
                </TechButton>
                <TechButton variant="outline" size="lg">
                  Contact Me
                </TechButton>
              </div>
            </motion.div>

            {/* Profile/Skills Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-full" />
              <div className="relative bg-card border-2 border-secondary p-8 clip-tech-border shadow-2xl">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent p-[2px] clip-button">
                    <div className="w-full h-full bg-black/90 flex items-center justify-center clip-button">
                      <Code2 className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold">Tech Stack</h3>
                    <p className="text-muted-foreground font-tech">Expert Level Proficiency</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {skills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2 font-tech font-bold text-sm uppercase">
                        <span className="flex items-center gap-2">
                          {skill.icon} {skill.name}
                        </span>
                        <span className="text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services/Products Sections */}
      <div id="services" className="space-y-32 container mx-auto px-4">
        {categories.map((category, idx) => {
          const categoryProducts = products?.filter(p => p.category === category.id) || [];
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.id} className="relative">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-12 w-2 bg-primary" />
                <h2 className="text-4xl md:text-5xl font-display text-foreground/90">
                  {category.label}
                </h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Decorative background number */}
              <div className="absolute -top-20 right-0 text-[10rem] font-display font-black text-secondary/30 -z-10 select-none">
                0{idx + 1}
              </div>
            </section>
          );
        })}

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
