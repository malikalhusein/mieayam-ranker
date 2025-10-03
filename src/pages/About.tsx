import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Tentang Mie Ayam Ranger</h1>
            <p className="text-xl text-muted-foreground">
              Platform review mie ayam dengan sistem penilaian yang objektif dan transparan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Objektif</h3>
                <p className="text-sm text-muted-foreground">
                  Penilaian berdasarkan formula matematis yang adil
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-secondary/10 rounded-full">
                    <Award className="h-8 w-8 text-secondary" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Transparan</h3>
                <p className="text-sm text-muted-foreground">
                  Semua skor dan metodologi terbuka untuk publik
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <TrendingUp className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h3 className="font-bold mb-2">Komprehensif</h3>
                <p className="text-sm text-muted-foreground">
                  Menilai berbagai aspek dari rasa hingga fasilitas
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-3">Misi Kami</h2>
                <p className="text-muted-foreground">
                  Mie Ayam Ranger hadir untuk memberikan panduan objektif dalam memilih warung mie ayam terbaik. 
                  Kami percaya bahwa setiap orang berhak mendapatkan informasi yang jelas dan adil tentang kualitas 
                  makanan yang mereka konsumsi.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Metodologi Penilaian</h2>
                <p className="text-muted-foreground mb-4">
                  Sistem penilaian kami menggunakan formula:
                </p>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <code className="text-sm">Score = (Rasa + Fasilitas) / Harga × 1000</code>
                </div>
                <p className="text-muted-foreground mb-3">
                  Formula ini memastikan bahwa warung dengan harga lebih murah namun kualitas baik akan mendapat 
                  skor lebih tinggi dibanding warung mahal dengan kualitas serupa.
                </p>
                <p className="text-muted-foreground">
                  Setiap aspek dinilai dengan skala 1-10 berdasarkan kriteria yang konsisten, mencakup:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Kuah: kekentalan, kaldu, keseimbangan, aroma</li>
                  <li>Mie: tipe dan tekstur</li>
                  <li>Ayam: bumbu dan potongan</li>
                  <li>Fasilitas: kebersihan, alat makan, tempat</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Perceptual Mapping</h2>
                <p className="text-muted-foreground">
                  Kami juga menggunakan perceptual mapping untuk memvisualisasikan karakteristik rasa setiap 
                  warung mie ayam berdasarkan complexity dan sweetness. Ini membantu Anda menemukan mie ayam 
                  sesuai preferensi rasa pribadi.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Tim Kami</h2>
                <p className="text-muted-foreground">
                  Mie Ayam Ranger dijalankan oleh food enthusiast yang passionate terhadap kuliner lokal Indonesia, 
                  khususnya mie ayam. Setiap review dilakukan dengan standar yang sama untuk menjaga konsistensi 
                  dan keadilan penilaian.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
