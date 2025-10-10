# Mie Ayam Ranger

Direktori review warung mie ayam dengan sistem penilaian yang adil dan transparan.

## 🚀 Features

- **Comprehensive Reviews**: Detailed scoring system for taste, facilities, and value
- **Interactive Visualizations**: Perceptual mapping and radar charts
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Image Galleries**: Multiple photos per review with lazy loading
- **Advanced Filtering**: Search by name, city, or product type
- **Accessibility**: ARIA labels, keyboard navigation, focus states
- **Performance Optimized**: Lazy loading, code splitting, optimized builds

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Build Tool**: Vite
- **Charts**: Recharts
- **State Management**: React Query

## 📦 Installation

1. Clone the repository
```bash
git clone <YOUR_GIT_URL>
cd mie-ayam-ranger
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

4. Run development server
```bash
npm run dev
```

## 🏗️ Build for Production

```bash
npm run build
```

The build will generate:
- Optimized production bundle in `dist/`
- Bundle analyzer report in `dist/stats.html`

## 🧪 Quality Assurance

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## 🔒 Security

- ✅ Input validation using Zod schemas
- ✅ Text sanitization to prevent XSS
- ✅ Secure Supabase RLS policies
- ✅ Environment variables for sensitive data
- ✅ Error boundary for runtime errors

## ♿ Accessibility

- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- High contrast color scheme
- Semantic HTML structure

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized images with lazy loading

## 🎨 Design System

Colors follow a warm, food-inspired palette:
- **Primary**: Warm amber/orange (mie)
- **Secondary**: Deep red (ayam)
- **Accent**: Fresh green

All colors use HSL format for consistency and accessibility.

## 📊 Performance

- Lazy-loaded routes
- Image lazy loading
- Code splitting
- Optimized bundle size
- Cached assets

## 🚀 Deployment

Deploy to Lovable:
1. Visit your [Lovable Project](https://lovable.dev/projects/78a6629f-6bff-49c2-bccc-303d3cfcba45)
2. Click Share → Publish
3. Configure custom domain in Project Settings if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📄 CI/CD

GitHub Actions workflow automatically:
- Runs ESLint on pull requests
- Builds the project
- Uploads build artifacts

## 🙏 Acknowledgments

- shadcn/ui for beautiful components
- Supabase for backend infrastructure
- Recharts for data visualization
