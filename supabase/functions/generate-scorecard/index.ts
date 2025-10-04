import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { review } = await req.json();
    console.log('Generating scorecard for review:', review.outlet_name);

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Calculate scores
    const kuahScore = review.product_type === "kuah" 
      ? ((review.kuah_kekentalan || 0) + (review.kuah_kaldu || 0) + (review.kuah_keseimbangan || 0) + (review.kuah_aroma || 0)) / 4
      : 0;
    const mieScore = review.mie_tekstur || 0;
    const ayamScore = ((review.ayam_bumbu || 0) + (review.ayam_potongan || 0)) / 2;
    const fasilitasScore = ((review.fasilitas_kebersihan || 0) + (review.fasilitas_alat_makan || 0) + (review.fasilitas_tempat || 0)) / 3;

    // Create a detailed prompt for the scorecard
    const prompt = `Create a professional Instagram story scorecard (1920x1080px landscape) for a Mie Ayam (Indonesian chicken noodle) restaurant review with these specifications:

**Restaurant:** ${review.outlet_name}
**Location:** ${review.city}
**Type:** ${review.product_type === "kuah" ? "Kuah (Soup)" : "Goreng (Fried)"}
**Price:** Rp ${review.price.toLocaleString('id-ID')}
**Visit Date:** ${new Date(review.visit_date).toLocaleDateString('id-ID')}

**Scores (out of 10):**
${review.product_type === "kuah" ? `- Kuah (Broth): ${kuahScore.toFixed(1)}/10` : ''}
- Mie (Noodles): ${mieScore.toFixed(1)}/10
- Ayam (Chicken): ${ayamScore.toFixed(1)}/10
- Fasilitas (Facilities): ${fasilitasScore.toFixed(1)}/10

**Design Requirements:**
- Warm, appetizing color scheme (oranges, yellows, warm reds)
- "MIE AYAM RANGER" branding at the top
- Clean, modern layout with good readability
- Use gradient backgrounds
- Include food-related decorative elements (noodle illustrations, bowl icons)
- Display scores with visual bars or circular progress indicators
- Professional typography
- Instagram story optimized format (1920x1080px landscape)

Make it look appetizing, professional, and share-worthy for social media!`;

    console.log('Sending request to Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response from AI Gateway');

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated in response');
    }

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in generate-scorecard function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
