import { Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

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
  const displayImage = (image_urls && image_urls.length > 0) ? image_urls[0] : image_url;
  
  return (
    <Link to={`/review/${id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 cursor-pointer">
        {displayImage && (
          <div className="relative h-48 overflow-hidden bg-muted">
            <img 
              src={displayImage} 
              alt={outlet_name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge variant={product_type === "kuah" ? "default" : "secondary"}>
                {product_type === "kuah" ? "Kuah" : "Goreng"}
              </Badge>
              {overall_score && (
                <Badge className="bg-primary/90 text-primary-foreground font-bold text-base px-3 py-1">
                  {overall_score.toFixed(1)}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
              {outlet_name}
            </h3>
            {overall_score && !displayImage && (
              <Badge className="bg-primary text-primary-foreground font-bold text-lg px-3 py-1">
                {overall_score.toFixed(1)}
              </Badge>
            )}
          </div>
          <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" />
              <span className="truncate">{city}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{new Date(visit_date).toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-1 h-4 w-4" />
              <span>Rp {price.toLocaleString('id-ID')}</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {priceCategory.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {notes && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {notes}
            </p>
          )}
        </CardContent>
        
        <CardFooter>
          <span className="text-sm font-medium text-primary">
            Lihat Detail →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ReviewCard;
