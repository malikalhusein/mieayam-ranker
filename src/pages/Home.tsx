import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ReviewCard from "@/components/ReviewCard";
import PerceptualMap from "@/components/PerceptualMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, TrendingUp, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [topReviews, setTopReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const processedReviews = (data || []).map((review) => ({
        ...review,
        scores: calculateScores(review),
        totalScore: calculateTotalScore(review),
      }));

      setReviews(processedReviews);
      setFilteredReviews(processedReviews);
      
      // Get top 5 based on score
      const sorted = [...processedReviews].sort((a, b) => b.totalScore - a.totalScore);
      setTopReviews(sorted.slice(0, 5));
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

  const calculateTotalScore = (review: any) => {
    const scores = calculateScores(review);
    const avgRasa = (scores.kuah + scores.mie + scores.ayam) / 3;
    return ((avgRasa + scores.fasilitas) / review.price) * 1000;
  };

  useEffect(() => {
    let filtered = reviews;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.outlet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (cityFilter !== "all") {
      filtered = filtered.filter(r => r.city === cityFilter);
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(r => r.product_type === typeFilter);
    }

    setFilteredReviews(filtered);
  }, [searchTerm, cityFilter, typeFilter, reviews]);

  const cities = Array.from(new Set(reviews.map(r => r.city)));

  const perceptualData = reviews.map(r => ({
    name: r.outlet_name,
    complexity: (r.complexity || 5) - 5, // Center at 0: convert 0-10 to -5 to 5
    sweetness: (r.sweetness || 5) - 5,   // Center at 0: convert 0-10 to -5 to 5
    type: r.product_type,
  }));

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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">
              Mie Ayam Ranger
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Direktori review warung mie ayam dengan sistem penilaian yang adil dan transparan
            </p>
            <Button size="lg" variant="secondary" className="shadow-glow">
              <TrendingUp className="mr-2 h-5 w-5" />
              Explore Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Top 5 Section */}
      {topReviews.length > 0 && (
        <section className="container py-16">
          <div className="flex items-center justify-center mb-8">
            <Trophy className="h-8 w-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold">Top 5 Rekomendasi</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {topReviews.map((review, index) => (
              <div key={review.id} className="relative">
                <div className="absolute -top-3 -left-3 z-10 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                <ReviewCard
                  id={review.id}
                  outlet_name={review.outlet_name}
                  address={review.address}
                  city={review.city}
                  visit_date={review.visit_date}
                  price={review.price}
                  product_type={review.product_type}
                  notes={review.notes}
                  image_url={review.image_url}
                  scores={review.scores}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Perceptual Map */}
      {perceptualData.length > 0 && (
        <section className="container py-16">
          <div className="bg-card rounded-xl p-8 shadow-card">
            <PerceptualMap data={perceptualData} />
          </div>
        </section>
      )}

      {/* All Reviews Grid */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Semua Review</h2>
        
        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama outlet, alamat, kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="kuah">Kuah</SelectItem>
              <SelectItem value="goreng">Goreng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {reviews.length === 0 ? "Belum ada review tersedia" : "Tidak ada review yang sesuai dengan filter"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                outlet_name={review.outlet_name}
                address={review.address}
                city={review.city}
                visit_date={review.visit_date}
                price={review.price}
                product_type={review.product_type}
                notes={review.notes}
                image_url={review.image_url}
                scores={review.scores}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-card py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Cara Kerja Penilaian</h2>
          
          <div className="space-y-6 text-muted-foreground">
            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold text-foreground mb-2">Formula Penilaian</h3>
              <p className="mb-2">
                <code className="bg-muted px-2 py-1 rounded">Score = (Rasa + Fasilitas) / Harga × 1000</code>
              </p>
              <p className="text-sm">
                Rasa = rata-rata dari skor Kuah, Mie, dan Ayam<br/>
                Fasilitas = rata-rata dari Kebersihan, Alat Makan, dan Tempat
              </p>
            </div>

            <div className="bg-background p-6 rounded-lg">
              <h3 className="font-bold text-foreground mb-3">Kategori Harga</h3>
              <ul className="space-y-2 text-sm">
                <li>• &lt; Rp 8.000 = Murah Ga Masuk Akal ⭐</li>
                <li>• Rp 8.000 - 10.000 = Murah ⭐⭐</li>
                <li>• Rp 11.000 - 12.000 = Normal ⭐⭐⭐</li>
                <li>• Rp 13.000 - 15.000 = Resto Menengah ⭐⭐⭐⭐</li>
                <li>• Rp 18.000 - 20.000 = Cukup Mahal ⭐⭐⭐⭐⭐</li>
                <li>• &gt; Rp 20.000 = Mahal ⭐⭐⭐⭐⭐⭐</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
