import { Link } from "react-router-dom";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import RadarChart from "./RadarChart";

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

const ReviewCard = ({ id, outlet_name, address, city, visit_date, price, product_type, notes, image_url, scores }: ReviewCardProps) => {
  const priceCategory = getPriceCategory(price);
  
  return (
    <Link to={`/review/${id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-hover hover:-translate-y-1 cursor-pointer">
        {image_url && (
          <div className="relative h-48 overflow-hidden bg-muted">
            <img 
              src={image_url} 
              alt={outlet_name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={product_type === "kuah" ? "default" : "secondary"}>
                {product_type === "kuah" ? "Kuah" : "Goreng"}
              </Badge>
            </div>
          </div>
        )}
        
        <CardHeader>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {outlet_name}
          </h3>
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
          <div className="mb-4">
            <RadarChart data={scores} size="small" />
          </div>
          
          {notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
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
