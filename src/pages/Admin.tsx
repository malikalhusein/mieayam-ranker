import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Upload, X } from "lucide-react";

const reviewSchema = z.object({
  outlet_name: z.string().min(1, "Nama outlet wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
  visit_date: z.string().min(1, "Tanggal kunjungan wajib diisi"),
  price: z.string().min(1, "Harga wajib diisi"),
  product_type: z.enum(["kuah", "goreng"]),
  mie_tipe: z.string().optional(),
  google_map_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
  notes: z.string().optional(),
  fasilitas_kebersihan: z.number().min(0).max(10).optional(),
  fasilitas_alat_makan: z.number().min(0).max(10).optional(),
  fasilitas_tempat: z.number().min(0).max(10).optional(),
  service_durasi: z.number().min(0).max(10).optional(),
  complexity: z.number().min(0).max(10).optional(),
  sweetness: z.number().min(0).max(10).optional(),
  kuah_kekentalan: z.number().min(0).max(10).optional(),
  kuah_kaldu: z.number().min(0).max(10).optional(),
  kuah_keseimbangan: z.number().min(0).max(10).optional(),
  kuah_aroma: z.number().min(0).max(10).optional(),
  mie_tekstur: z.number().min(0).max(10).optional(),
  ayam_bumbu: z.number().min(0).max(10).optional(),
  ayam_potongan: z.number().min(0).max(10).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product_type: "kuah",
    },
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({ title: "Akses Ditolak", variant: "destructive" });
      navigate("/");
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 6) {
      toast({ title: "Maksimal 6 gambar", variant: "destructive" });
      return;
    }

    setImageFiles([...imageFiles, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('review-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const onSubmit = async (data: ReviewFormData) => {
    setSubmitting(true);
    try {
      const imageUrls = await uploadImages();

      const reviewData = {
        outlet_name: data.outlet_name,
        address: data.address,
        city: data.city,
        visit_date: data.visit_date,
        price: parseInt(data.price),
        product_type: data.product_type,
        mie_tipe: data.mie_tipe || null,
        google_map_url: data.google_map_url || null,
        notes: data.notes || null,
        image_urls: imageUrls,
        fasilitas_kebersihan: data.fasilitas_kebersihan || null,
        fasilitas_alat_makan: data.fasilitas_alat_makan || null,
        fasilitas_tempat: data.fasilitas_tempat || null,
        service_durasi: data.service_durasi || null,
        complexity: data.complexity || null,
        sweetness: data.sweetness || null,
        kuah_kekentalan: data.kuah_kekentalan || null,
        kuah_kaldu: data.kuah_kaldu || null,
        kuah_keseimbangan: data.kuah_keseimbangan || null,
        kuah_aroma: data.kuah_aroma || null,
        mie_tekstur: data.mie_tekstur || null,
        ayam_bumbu: data.ayam_bumbu || null,
        ayam_potongan: data.ayam_potongan || null,
      };

      const { data: review, error } = await supabase
        .from("reviews")
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;

      // Calculate overall score
      const kuahScore = data.product_type === "kuah" 
        ? ((data.kuah_kekentalan || 0) + (data.kuah_kaldu || 0) + (data.kuah_keseimbangan || 0) + (data.kuah_aroma || 0)) / 4
        : 0;
      const mieScore = data.mie_tekstur || 0;
      const ayamScore = ((data.ayam_bumbu || 0) + (data.ayam_potongan || 0)) / 2;
      const fasilitasScore = ((data.fasilitas_kebersihan || 0) + (data.fasilitas_alat_makan || 0) + (data.fasilitas_tempat || 0)) / 3;
      
      let overallScore: number;
      if (data.product_type === "kuah") {
        overallScore = (kuahScore * 0.3) + (mieScore * 0.3) + (ayamScore * 0.25) + (fasilitasScore * 0.15);
      } else {
        overallScore = (mieScore * 0.4) + (ayamScore * 0.4) + (fasilitasScore * 0.2);
      }

      await supabase
        .from("reviews")
        .update({ overall_score: overallScore })
        .eq("id", review.id);

      toast({ title: "Review berhasil dibuat!" });
      form.reset();
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  const productType = form.watch("product_type");

  return (
    <div className="min-h-screen bg-gradient-subtle p-8">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buat Review Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informasi Dasar</h3>
                
                <div>
                  <Label htmlFor="outlet_name">Nama Outlet</Label>
                  <Input id="outlet_name" {...form.register("outlet_name")} />
                  {form.formState.errors.outlet_name && (
                    <p className="text-sm text-destructive">{form.formState.errors.outlet_name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Alamat</Label>
                  <Input id="address" {...form.register("address")} />
                  {form.formState.errors.address && (
                    <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" {...form.register("city")} />
                    {form.formState.errors.city && (
                      <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="visit_date">Tanggal Kunjungan</Label>
                    <Input id="visit_date" type="date" {...form.register("visit_date")} />
                    {form.formState.errors.visit_date && (
                      <p className="text-sm text-destructive">{form.formState.errors.visit_date.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Harga (Rp)</Label>
                    <Input id="price" type="number" {...form.register("price")} />
                    {form.formState.errors.price && (
                      <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product_type">Tipe Produk</Label>
                    <Select onValueChange={(value) => form.setValue("product_type", value as "kuah" | "goreng")} defaultValue="kuah">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kuah">Kuah</SelectItem>
                        <SelectItem value="goreng">Goreng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="mie_tipe">Tipe Mie (opsional)</Label>
                  <Input id="mie_tipe" {...form.register("mie_tipe")} placeholder="contoh: telur, keriting" />
                </div>

                <div>
                  <Label htmlFor="google_map_url">Google Maps URL (opsional)</Label>
                  <Input id="google_map_url" {...form.register("google_map_url")} placeholder="https://maps.google.com/..." />
                  {form.formState.errors.google_map_url && (
                    <p className="text-sm text-destructive">{form.formState.errors.google_map_url.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes">Catatan (opsional)</Label>
                  <Textarea id="notes" {...form.register("notes")} rows={3} />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gambar (max 6)</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded" />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {imageFiles.length < 6 && (
                    <label className="border-2 border-dashed rounded h-32 flex items-center justify-center cursor-pointer hover:bg-muted/50">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Ratings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Penilaian (0-10)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fasilitas_kebersihan">Kebersihan</Label>
                    <Input id="fasilitas_kebersihan" type="number" step="0.1" min="0" max="10" 
                      {...form.register("fasilitas_kebersihan", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="fasilitas_alat_makan">Alat Makan</Label>
                    <Input id="fasilitas_alat_makan" type="number" step="0.1" min="0" max="10"
                      {...form.register("fasilitas_alat_makan", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="fasilitas_tempat">Tempat</Label>
                    <Input id="fasilitas_tempat" type="number" step="0.1" min="0" max="10"
                      {...form.register("fasilitas_tempat", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="service_durasi">Durasi Service</Label>
                    <Input id="service_durasi" type="number" step="0.1" min="0" max="10"
                      {...form.register("service_durasi", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="mie_tekstur">Tekstur Mie</Label>
                    <Input id="mie_tekstur" type="number" step="0.1" min="0" max="10"
                      {...form.register("mie_tekstur", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="ayam_bumbu">Bumbu Ayam</Label>
                    <Input id="ayam_bumbu" type="number" step="0.1" min="0" max="10"
                      {...form.register("ayam_bumbu", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="ayam_potongan">Potongan Ayam</Label>
                    <Input id="ayam_potongan" type="number" step="0.1" min="0" max="10"
                      {...form.register("ayam_potongan", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="complexity">Complexity</Label>
                    <Input id="complexity" type="number" step="0.1" min="0" max="10"
                      {...form.register("complexity", { valueAsNumber: true })} />
                  </div>

                  <div>
                    <Label htmlFor="sweetness">Sweetness</Label>
                    <Input id="sweetness" type="number" step="0.1" min="0" max="10"
                      {...form.register("sweetness", { valueAsNumber: true })} />
                  </div>
                </div>

                {productType === "kuah" && (
                  <>
                    <h4 className="font-medium mt-4">Penilaian Kuah</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="kuah_kekentalan">Kekentalan</Label>
                        <Input id="kuah_kekentalan" type="number" step="0.1" min="0" max="10"
                          {...form.register("kuah_kekentalan", { valueAsNumber: true })} />
                      </div>

                      <div>
                        <Label htmlFor="kuah_kaldu">Kaldu</Label>
                        <Input id="kuah_kaldu" type="number" step="0.1" min="0" max="10"
                          {...form.register("kuah_kaldu", { valueAsNumber: true })} />
                      </div>

                      <div>
                        <Label htmlFor="kuah_keseimbangan">Keseimbangan</Label>
                        <Input id="kuah_keseimbangan" type="number" step="0.1" min="0" max="10"
                          {...form.register("kuah_keseimbangan", { valueAsNumber: true })} />
                      </div>

                      <div>
                        <Label htmlFor="kuah_aroma">Aroma</Label>
                        <Input id="kuah_aroma" type="number" step="0.1" min="0" max="10"
                          {...form.register("kuah_aroma", { valueAsNumber: true })} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Menyimpan..." : "Buat Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
