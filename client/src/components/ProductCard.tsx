import { Product } from "@shared/schema";
import { cn } from "@/lib/utils";
import { TechButton } from "./TechButton";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative bg-card hover:bg-secondary/20 transition-colors",
        "clip-tech-card border-l-4 border-primary",
        className
      )}
    >
      {/* Image Container with overlay */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-primary text-primary-foreground font-display font-bold px-3 py-1 clip-button shadow-lg shadow-black/20">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <div className="absolute -top-3 left-6 z-20 bg-background px-2 text-xs font-tech text-primary border border-primary/20 uppercase">
          {product.category}
        </div>

        <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 h-10">
          {product.description}
        </p>

        <TechButton 
          className="w-full" 
          onClick={() => window.open(product.link, '_blank')}
          icon={<ExternalLink className="w-4 h-4" />}
        >
          Buy Now
        </TechButton>
      </div>

      {/* Decorative tech lines */}
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-full bg-primary/10 pointer-events-none" />
    </motion.div>
  );
}
