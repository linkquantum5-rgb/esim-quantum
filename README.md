# eSIM Quantum Store

A complete, modern eSIM store built with Next.js, featuring both physical and API-based eSIM sales, admin panel, shopping cart, and checkout functionality.

## Features

### Customer-Facing Features
- **Home Page**: Hero section with features showcase
- **Plans Browser**: Filter eSIM plans by country with detailed information
- **Plan Details**: Individual plan pages with full specifications
- **Shopping Cart**: Add multiple plans with quantity management
- **Checkout**: Secure checkout with customer information collection
- **Purchase Confirmation**: Instant QR code delivery with activation instructions
- **Information Pages**: How it Works, Benefits, FAQ, and Contact pages

### Admin Features
- **Physical eSIM Management**: Upload and track physical eSIM QR codes
- **Inventory Dashboard**: View available, sold, and total eSIMs
- **Automatic Assignment**: System automatically assigns available QR codes to purchases
- **Status Tracking**: Monitor eSIM status (Available/Sold/Shipped)

### Technical Features
- **Dual eSIM Types**:
  - Physical eSIMs (manually uploaded QR codes)
  - API-based eSIMs (instant generation via provider API)
- **Shopping Cart**: Persistent cart using Zustand
- **QR Code Generation**: Automatic QR code generation from activation codes
- **Responsive Design**: Mobile-first, fully responsive layout
- **Type-Safe**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand (for cart)
- **QR Codes**: qrcode library
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
eSIMQuantum-esim/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Home page
│   │   ├── plans/             # Plans browser and details
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout page
│   │   ├── confirmation/      # Purchase confirmation
│   │   ├── admin/             # Admin panel
│   │   ├── how-it-works/      # Information pages
│   │   ├── benefits/
│   │   ├── faq/
│   │   ├── contact/
│   │   └── api/               # API routes
│   │       ├── plans/         # GET /api/plans
│   │       ├── buy/           # POST /api/buy
│   │       ├── activate/      # POST /api/activate
│   │       └── admin/         # Admin API routes
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   └── lib/                   # Utilities and data
│       ├── data.ts            # Sample data
│       ├── types.ts           # TypeScript types
│       ├── store.ts           # Zustand store
│       └── utils.ts
└── public/                    # Static assets
```

## API Routes

### GET /api/plans
Get all available eSIM plans, optionally filtered by country.

**Query Parameters:**
- `country` (optional): Country code to filter plans

**Response:**
```json
{
  "success": true,
  "plans": [...],
  "countries": [...]
}
```

### POST /api/buy
Purchase eSIM plans and receive QR codes.

**Request Body:**
```json
{
  "items": [
    {
      "plan": { /* plan object */ },
      "quantity": 1
    }
  ],
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "country": "US",
    "deviceType": "iphone"
  }
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "ORD-1234567890",
    "customer": {...},
    "items": [...],
    "total": 19.99,
    "assignedESIMs": [...]
  }
}
```

### POST /api/activate
Activate an eSIM (placeholder for provider integration).

**Request Body:**
```json
{
  "esimId": "esim-123",
  "activationCode": "LPA:1$..."
}
```

### POST /api/admin/upload-esim
Upload a physical eSIM QR code (Admin only).

**Request Body:**
```json
{
  "countryCode": "US",
  "planId": "us-3gb",
  "qrCode": "LPA:1$provider.com$CODE",
  "qrCodeType": "text"
}
```

### GET /api/admin/esims
Get all physical eSIMs in inventory (Admin only).

## Admin Panel

Access the admin panel at `/admin` to manage physical eSIM inventory.

### Features:
1. **Upload eSIMs**: Manually add physical eSIM QR codes
2. **View Inventory**: See all eSIMs with status and customer info
3. **Track Sales**: Monitor available vs. sold eSIMs
4. **Auto-Assignment**: System automatically assigns QR codes during purchase

### Uploading Physical eSIMs:
1. Click "Upload eSIM" button
2. Select country and plan
3. Choose QR code type (text activation code or image URL)
4. Enter the QR code data
5. Submit to add to inventory

## Integrating with Real eSIM Providers

To connect to real eSIM providers like eSIMgo:

1. **Update `/api/buy` route** to call provider API:
```typescript
// Example for API-based eSIMs
const response = await fetch('https://api.esimgo.com/v1/purchase', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.ESIM_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    planId: plan.id,
    customerEmail: customer.email
  })
});

const { qrCode, activationCode } = await response.json();
```

2. **Update `/api/activate` route** for real activation
3. **Add environment variables**:
```env
ESIM_API_KEY=your_api_key
ESIM_API_URL=https://api.provider.com
```

## Database Integration

Currently using in-memory storage. To add database:

1. **Install Prisma or your preferred ORM**:
```bash
bun add @prisma/client
bun add -D prisma
```

2. **Create schema**:
```prisma
model PhysicalESIM {
  id            String   @id @default(cuid())
  countryCode   String
  planId        String
  qrCode        String
  qrCodeType    String
  status        String
  soldAt        DateTime?
  customerEmail String?
  createdAt     DateTime @default(now())
}

model Order {
  id        String   @id
  customer  Json
  items     Json
  total     Float
  status    String
  createdAt DateTime @default(now())
}
```

3. **Replace in-memory arrays** in `src/lib/data.ts` with database queries

## Email Integration

To send QR codes via email, integrate with a service like Resend or SendGrid:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'LR@esimQuantum.com',
  to: customer.email,
  subject: 'Your eSIM Quantum eSIM QR Code',
  html: `<h1>Your eSIM is ready!</h1>
         <p>Scan the QR code below...</p>
         <img src="${qrCodeDataUrl}" />`
});
```

## Customization

### Branding
- Update colors in `src/app/globals.css` (primary color variables)
- Replace logo in `src/components/navbar.tsx` and `footer.tsx`
- Update metadata in `src/app/layout.tsx`

### Adding Countries/Plans
Edit `src/lib/data.ts`:
```typescript
export const countries: Country[] = [
  { code: 'XX', name: 'New Country', flag: '🏳️', region: 'Region' },
  // ...
];

export const plans: Plan[] = [
  {
    id: 'unique-id',
    countryCode: 'XX',
    name: 'Plan Name',
    data: '5GB',
    validity: '30 Days',
    price: 29.99,
    type: 'physical', // or 'api'
    coverage: ['Country 1', 'Country 2'],
    speed: '4G/5G',
    features: ['Feature 1', 'Feature 2']
  },
  // ...
];
```

## Deployment

### Deploy to Netlify (Dynamic)
```bash
# Already configured in netlify.toml
# Just push to GitHub and connect to Netlify
```

### Deploy to Vercel
```bash
vercel deploy
```

### Environment Variables
Required for production:
- `ESIM_API_KEY`: Your eSIM provider API key (if using API-based eSIMs)
- `RESEND_API_KEY`: Email service API key (if sending emails)
- `DATABASE_URL`: Database connection string (if using database)

## Security Considerations

1. **Admin Panel**: Add authentication before deploying
2. **API Keys**: Never commit API keys to version control
3. **Rate Limiting**: Implement rate limiting on API routes
4. **Input Validation**: Add server-side validation for all inputs
5. **CORS**: Configure CORS if API is accessed from other domains

## Support

For issues or questions:
- Email: LR@esimQuantum.com.com
- Documentation: [Link to docs]
- GitHub Issues: [Link to repo]

## License

MIT License - See LICENSE file for details

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
