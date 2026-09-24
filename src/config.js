// -----------------------------------------------------------------------------
// HOSTEL CONFIGURATION
// -----------------------------------------------------------------------------
// Change all branding / contact details of the hostel in one single place.
// -----------------------------------------------------------------------------

export const HOSTEL = {
  name: 'Sai Krishna',
  shortName: 'Sai Krishna',
  tagline: 'Your Safe & Comfortable Home Away From Home',

  phone: '+91 98765 43210',
  whatsapp: '9876543210',
  email: 'contact@staynest.in',

  address: 'B-204, Green Meadows, Anna Nagar, Chennai, Tamil Nadu 600040',
  city: 'Chennai',
  state: 'Tamil Nadu',

  // Google Maps embed URL (shows an embedded map on the contact page)
  mapsEmbed:
    'https://www.google.com/maps?q=Anna%20Nagar%20Chennai&output=embed',
  mapsLink: 'https://maps.google.com/?q=Anna+Nagar+Chennai',

  // The configured demo owner mobile identifier (used only to identify the
  // demo owner during sign-in - NO password / OTP is ever hard-coded).
  ownerMobile: '6303693659',

  // Currency symbol used for formatting
  currency: '₹',

  // Optional WhatsApp number; when set, "Book Now" can be linked to WhatsApp
  whatsappBooking: '',

  // Social media links (replace with the hostel's real profiles)
  social: {
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
    whatsapp: 'https://wa.me/91876543210',
  },
}

export const PRICING = {
  // Extra charges applied on top of room rent for every booking
  foodCharges: 2000,
  electricityCharges: 500,
  securityDeposit: 2000,

  // Room base rents (per month) and advance (one time)
  rooms: {
    six: { rent: 6000, advance: 6000 },
    ten: { rent: 5000, advance: 5000 },
  },
}

// The 18 currently available beds shown on the home page hero
export const AVAILABLE_BEDS = 150 // beds currently available (home page hero)