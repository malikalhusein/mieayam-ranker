import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";

interface ReviewCardProps {
  id: string;
  outlet_name: string;
  address: string;
  city: string;
  visit_date: string;
  price: number;
  product_type: "kuah" | "goreng";
  notes?: string;
  image_url?: string;
  image_urls?: string[];
  overall_score?: number;
  scores: {
    kuah: number;
    mie: number;
    ayam: number;
    fasilitas: number;
  };
}

const getPriceCategory = (price: number) => {
  if (price < 8000) return { label: "Murah Ga Masuk Akal", stars: 1 };
  if (price <= 10000) return { label: "Murah", stars: 2 };
  if (price <= 12000) return { label: "Normal", stars: 3 };
  if (price <= 15000) return { label: "Resto Menengah", stars: 4 };
  if (price <= 20000) return { label: "Cukup Mahal", stars: 5 };
  return { label: "Mahal", stars: 6 };
};

const ReviewCard = ({ id, outlet_name, address, city, visit_date, price, product_type, notes, image_url, image_urls, overall_score, scores }: ReviewCardProps) => {
  const priceCategory = getPriceCategory(price);
  const allImages = image_urls && image_urls.length > 0 ? image_urls : (image_url ? [image_url] : []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer bg-card border-border/40">
      <Link to={`/review/${id}`} className="block">
        <CardContent className="p-6 space-y-4">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                {outlet_name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{new Date(visit_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{city}</span>
              </div>
              {notes && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {notes}
                </p>
              )}
            </div>
            <Badge variant="outline" className="rounded-full px-3 py-1 whitespace-nowrap">
              Top rated
            </Badge>
          </div>

          {/* Image Section with Carousel */}
          {allImages.length > 0 && (
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-[4/3]">
              <img 
                src={allImages[currentImageIndex]} 
                alt={outlet_name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-0 shadow-lg">
                  {product_type === "kuah" ? "Kuah" : "Goreng"}
                </Badge>
                <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-0 shadow-lg">
                  {priceCategory.label}
                </Badge>
              </div>
              
              {/* Score Badge */}
              {overall_score && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-bold text-sm">{overall_score.toFixed(1)}</span>
                </div>
              )}

              {/* Carousel Dots */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(index);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex 
                          ? 'w-6 bg-white' 
                          : 'w-1.5 bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex-1">
              <div className="text-2xl font-bold">
                Rp {price.toLocaleString('id-ID')}
                <span className="text-sm font-normal text-muted-foreground ml-1">/ porsi</span>
              </div>
            </div>
            <Button 
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/review/${id}`;
              }}
            >
              Lihat Detail
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ReviewCard;
