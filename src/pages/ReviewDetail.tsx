import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import RadarChart from "@/components/RadarChart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, Clock, ArrowLeft, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const scores = calculateScores(data);
      setReview({ ...data, scores });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateScores = (review: any) => {
    const kuahScore = review.product_type === "kuah" 
      ? ((review.kuah_kekentalan || 0) + (review.kuah_kaldu || 0) + (review.kuah_keseimbangan || 0) + (review.kuah_aroma || 0)) / 4
      : 0;
    
    const mieScore = review.mie_tekstur || 0;
    const ayamScore = ((review.ayam_bumbu || 0) + (review.ayam_potongan || 0)) / 2;
    const fasilitasScore = ((review.fasilitas_kebersihan || 0) + (review.fasilitas_alat_makan || 0) + (review.fasilitas_tempat || 0)) / 3;

    return {
      kuah: parseFloat(kuahScore.toFixed(1)),
      mie: parseFloat(mieScore.toFixed(1)),
      ayam: parseFloat(ayamScore.toFixed(1)),
      fasilitas: parseFloat(fasilitasScore.toFixed(1)),
    };
  };

  const getPriceCategory = (price: number) => {
    if (price < 8000) return { label: "Murah Ga Masuk Akal", stars: 1 };
    if (price <= 10000) return { label: "Murah", stars: 2 };
    if (price <= 12000) return { label: "Normal", stars: 3 };
    if (price <= 15000) return { label: "Resto Menengah", stars: 4 };
    if (price <= 20000) return { label: "Cukup Mahal", stars: 5 };
    return { label: "Mahal", stars: 6 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Review tidak ditemukan</p>
          <Link to="/">
            <Button className="mt-4">Kembali ke Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const priceCategory = getPriceCategory(review.price);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image & Info */}
          <div className="space-y-6">
            {review.image_url && (
              <Card className="overflow-hidden">
                <img 
                  src={review.image_url} 
                  alt={review.outlet_name}
                  className="w-full h-96 object-cover"
                />
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold">{review.outlet_name}</h1>
                  <Badge variant={review.product_type === "kuah" ? "default" : "secondary"}>
                    {review.product_type === "kuah" ? "Kuah" : "Goreng"}
                  </Badge>
                </div>

                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{review.address}</p>
                      <p className="font-medium text-foreground">{review.city}</p>
                    </div>
                  </div>

                  {review.google_map_url && (
                    <a 
                      href={review.google_map_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buka di Google Maps
                    </a>
                  )}

                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>Dikunjungi: {new Date(review.visit_date).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    <span className="font-semibold text-foreground">
                      Rp {review.price.toLocaleString('id-ID')}
                    </span>
                    <Badge variant="outline" className="ml-3">
                      {priceCategory.label}
                    </Badge>
                  </div>

                  {review.service_durasi && (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      <span>Waktu Penyajian: {review.service_durasi} menit</span>
                    </div>
                  )}
                </div>

                {review.notes && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2">Catatan</h3>
                    <p className="text-muted-foreground">{review.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scores */}
          <div className="space-y-6">
            {/* Radar Chart */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Ringkasan Skor</h2>
                <RadarChart data={review.scores} size="large" />
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Detail Penilaian</h2>
                
                {review.product_type === "kuah" && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 text-lg">Kuah</h3>
                    <div className="space-y-2">
                      <ScoreBar label="Kekentalan" score={review.kuah_kekentalan} />
                      <ScoreBar label="Kaldu" score={review.kuah_kaldu} />
                      <ScoreBar label="Keseimbangan" score={review.kuah_keseimbangan} />
                      <ScoreBar label="Aroma" score={review.kuah_aroma} />
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-lg">Mie</h3>
                  <p className="text-sm text-muted-foreground mb-2">Tipe: {review.mie_tipe || "-"}</p>
                  <ScoreBar label="Tekstur" score={review.mie_tekstur} />
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-lg">Ayam</h3>
                  <div className="space-y-2">
                    <ScoreBar label="Bumbu" score={review.ayam_bumbu} />
                    <ScoreBar label="Potongan" score={review.ayam_potongan} />
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-lg">Fasilitas</h3>
                  <div className="space-y-2">
                    <ScoreBar label="Kebersihan" score={review.fasilitas_kebersihan} />
                    <ScoreBar label="Alat Makan" score={review.fasilitas_alat_makan} />
                    <ScoreBar label="Tempat" score={review.fasilitas_tempat} />
                  </div>
                </div>

                {(review.complexity || review.sweetness) && (
                  <div>
                    <h3 className="font-semibold mb-3 text-lg">Perceptual Mapping</h3>
                    <div className="space-y-2">
                      <ScoreBar label="Complexity" score={review.complexity} />
                      <ScoreBar label="Sweetness" score={review.sweetness} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold text-primary">{score}/10</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-primary transition-all duration-300"
          style={{ width: `${(score / 10) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ReviewDetail;
