export type Lang = "en" | "he" | "ar";

export interface Strings {
  appTitle: string;
  subtitle: string;
  search: string;
  allRegions: string;
  allCategories: string;
  familyOnly: string;
  freeOnly: string;
  results: (n: number) => string;
  noResults: string;
  clear: string;
  free: string;
  paid: string;
  family: string;
  close: string;
  favorite: string;
  unfavorite: string;
  explore: string;
  trip: string;
  tripCount: (n: number) => string;
  addToTrip: string;
  removeFromTrip: string;
  emptyTrip: string;
  tripStops: string;
  totalDistance: string;
  km: string;
  openMaps: string;
  hours: string;
  price: string;
  openNow: string;
  driving: string;
  about: string;
  days: string;
  day: string;
  stops: string;
  share: string;
  chat: string;
  region: Record<"north" | "center" | "jerusalem" | "south" | "deadsea" | "coast", string>;
  category: Record<"nature" | "history" | "religious" | "beach" | "city" | "museum" | "family", string>;
  langName: string;
}

export const t: Record<"en" | "he" | "ar", Strings> = {
  en: {
    appTitle: "Israel Attractions",
    subtitle: "Discover the best places to visit",
    search: "Search attractions, cities, or vibes…",
    allRegions: "All regions",
    allCategories: "All categories",
    familyOnly: "Family-friendly",
    freeOnly: "Free entry",
    results: (n: number) => `${n} place${n === 1 ? "" : "s"}`,
    noResults: "Nothing matches your filters yet.",
    clear: "Clear",
    free: "Free",
    paid: "Paid",
    family: "Family",
    close: "Close",
    favorite: "Favorite",
    unfavorite: "Unfavorite",
    explore: "Explore",
    trip: "My Trip",
    tripCount: (n: number) => `My Trip · ${n}`,
    addToTrip: "Add to trip",
    removeFromTrip: "Remove",
    emptyTrip: "Your trip is empty. Tap ★ on any attraction to add it.",
    tripStops: "Stops",
    totalDistance: "Total distance",
    km: "km",
    openMaps: "Open in Google Maps",
    hours: "Hours",
    price: "Price",
    openNow: "Open now",
    driving: "Driving",
    about: "~",
    days: "Days",
    day: "Day",
    stops: "stops",
    share: "Share",
    chat: "Chat",
    region: {
      north: "North",
      center: "Center",
      jerusalem: "Jerusalem",
      south: "South & Negev",
      deadsea: "Dead Sea",
      coast: "Coast",
    },
    category: {
      nature: "Nature",
      history: "History",
      religious: "Religious",
      beach: "Beach",
      city: "City",
      museum: "Museum",
      family: "Family",
    },
    langName: "EN",
  },
  he: {
    appTitle: "אטרקציות בישראל",
    subtitle: "גלו את המקומות הכי שווים בארץ",
    search: "חפשו אתרים, ערים, או וייב…",
    allRegions: "כל האזורים",
    allCategories: "כל הקטגוריות",
    familyOnly: "מתאים למשפחות",
    freeOnly: "כניסה חינם",
    results: (n: number) => `${n} מקומות`,
    noResults: "אין אטרקציות שתואמות.",
    clear: "ניקוי",
    free: "חינם",
    paid: "בתשלום",
    family: "משפחה",
    close: "סגור",
    favorite: "הוסף למועדפים",
    unfavorite: "הסר ממועדפים",
    explore: "גילוי",
    trip: "הטיול שלי",
    tripCount: (n: number) => `הטיול שלי · ${n}`,
    addToTrip: "הוסף לטיול",
    removeFromTrip: "הסר",
    emptyTrip: "הטיול שלך ריק. לחצו על ★ באטרקציה כדי להוסיף.",
    tripStops: "תחנות",
    totalDistance: "מרחק כולל",
    km: 'ק"מ',
    openMaps: "פתח ב-Google Maps",
    hours: "שעות",
    price: "מחיר",
    openNow: "פתוח עכשיו",
    driving: "נסיעה",
    about: "כ-",
    days: "ימים",
    day: "יום",
    stops: "תחנות",
    share: "שיתוף",
    chat: "צ'אט",
    region: {
      north: "צפון",
      center: "מרכז",
      jerusalem: "ירושלים",
      south: "דרום והנגב",
      deadsea: "ים המלח",
      coast: "חוף",
    },
    category: {
      nature: "טבע",
      history: "היסטוריה",
      religious: "דת",
      beach: "חוף",
      city: "עיר",
      museum: "מוזיאון",
      family: "משפחה",
    },
    langName: "עב",
  },
  ar: {
    appTitle: "أماكن جذب في إسرائيل",
    subtitle: "اكتشف أفضل الأماكن للزيارة",
    search: "ابحث عن أماكن أو مدن أو أجواء…",
    allRegions: "كل المناطق",
    allCategories: "كل الفئات",
    familyOnly: "مناسب للعائلات",
    freeOnly: "دخول مجاني",
    results: (n: number) => `${n} مكان`,
    noResults: "لا توجد نتائج تطابق التصفية.",
    clear: "مسح",
    free: "مجاني",
    paid: "مدفوع",
    family: "عائلة",
    close: "إغلاق",
    favorite: "إضافة للمفضلة",
    unfavorite: "إزالة",
    explore: "استكشاف",
    trip: "رحلتي",
    tripCount: (n: number) => `رحلتي · ${n}`,
    addToTrip: "أضف إلى الرحلة",
    removeFromTrip: "إزالة",
    emptyTrip: "رحلتك فارغة. اضغط ★ على أي مكان لإضافته.",
    tripStops: "محطات",
    totalDistance: "المسافة الإجمالية",
    km: "كم",
    openMaps: "افتح في خرائط جوجل",
    hours: "ساعات",
    price: "السعر",
    openNow: "مفتوح الآن",
    driving: "قيادة",
    about: "~",
    days: "أيام",
    day: "يوم",
    stops: "محطات",
    share: "مشاركة",
    chat: "محادثة",
    region: {
      north: "الشمال",
      center: "الوسط",
      jerusalem: "القدس",
      south: "الجنوب والنقب",
      deadsea: "البحر الميت",
      coast: "الساحل",
    },
    category: {
      nature: "طبيعة",
      history: "تاريخ",
      religious: "ديني",
      beach: "شاطئ",
      city: "مدينة",
      museum: "متحف",
      family: "عائلة",
    },
    langName: "ع",
  },
};

export const LANGS: Lang[] = ["en", "he", "ar"];
export const RTL_LANGS: Lang[] = ["he", "ar"];
