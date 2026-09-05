/**
 * Saudi Real Estate Registered Operations - July 2026
 * Source: Ministry of Justice (وزارة العدل) & SDAIA via Saudi Open Data Portal (منصة البيانات المفتوحة)
 * Dataset Resource ID: c4eb90eb-de47-4996-9eba-8ae503980bcf
 * URL: https://open.data.gov.sa/ar/datasets/view/c4eb90eb-de47-4996-9eba-8ae503980bcf/resources
 */

export interface RealEstateRecord {
  region: string;
  city: string;
  sector: string;
  service: string;
  operationType: string;
  dateGregorian: string;
  dateHijri: string;
  count: number;
}

export interface RegionalSummary {
  region: string;
  totalOperations: number;
  conveyance: number;
  seizures: number;
  mortgages: number;
  inKindRegistry: number;
  percentage: number;
}

export interface DailyActivity {
  date: string;
  dayLabel: string;
  dayLabelEn: string;
  total: number;
  conveyance: number;
  seizures: number;
  releases: number;
  registry: number;
}

export const SAUDI_REAL_ESTATE_METADATA = {
  datasetNameArabic: "العمليات العقارية المسجلة - يوليو 2026",
  datasetNameEnglish: "Registered Real Estate Operations - July 2026",
  source: "منصة البيانات المفتوحة السعودية (Open Data Gov SA)",
  entity: "وزارة العدل (Ministry of Justice - MOJ)",
  resourceId: "c4eb90eb-de47-4996-9eba-8ae503980bcf",
  period: "يوليو 2026 (محرم 1448 هـ)",
  totalOperations: 65702,
  totalConveyance: 8785,
  totalPrecautionarySeizures: 19086,
  totalSeizureReleases: 16887,
  totalInKindRegistry: 16696,
  totalMortgages: 337,
  totalMortgageReleases: 507,
  totalLegacyDeedRegistrations: 1465,
  totalRecordsCount: 345,
};

export const SAUDI_REGIONAL_SUMMARY: RegionalSummary[] = [
  {
    "region": "منطقة الرياض",
    "totalOperations": 54413,
    "conveyance": 855,
    "seizures": 19086,
    "mortgages": 65,
    "inKindRegistry": 16696,
    "percentage": 82.82
  },
  {
    "region": "الخدمات الرقمية",
    "totalOperations": 8436,
    "conveyance": 5339,
    "seizures": 0,
    "mortgages": 663,
    "inKindRegistry": 0,
    "percentage": 12.84
  },
  {
    "region": "منطقة مكة المكرمه",
    "totalOperations": 1535,
    "conveyance": 1472,
    "seizures": 0,
    "mortgages": 41,
    "inKindRegistry": 0,
    "percentage": 2.34
  },
  {
    "region": "منطقة الشرقية",
    "totalOperations": 500,
    "conveyance": 476,
    "seizures": 0,
    "mortgages": 21,
    "inKindRegistry": 0,
    "percentage": 0.76
  },
  {
    "region": "منطقة عسير",
    "totalOperations": 272,
    "conveyance": 256,
    "seizures": 0,
    "mortgages": 13,
    "inKindRegistry": 0,
    "percentage": 0.41
  },
  {
    "region": "منطقة المدينة المنوره",
    "totalOperations": 217,
    "conveyance": 177,
    "seizures": 0,
    "mortgages": 16,
    "inKindRegistry": 0,
    "percentage": 0.33
  },
  {
    "region": "منطقة القصيم",
    "totalOperations": 84,
    "conveyance": 70,
    "seizures": 0,
    "mortgages": 9,
    "inKindRegistry": 0,
    "percentage": 0.13
  },
  {
    "region": "منطقة حائل",
    "totalOperations": 84,
    "conveyance": 54,
    "seizures": 0,
    "mortgages": 7,
    "inKindRegistry": 0,
    "percentage": 0.13
  },
  {
    "region": "منطقة تبوك",
    "totalOperations": 70,
    "conveyance": 28,
    "seizures": 0,
    "mortgages": 3,
    "inKindRegistry": 0,
    "percentage": 0.11
  },
  {
    "region": "منطقة الحدود الشمالية",
    "totalOperations": 38,
    "conveyance": 27,
    "seizures": 0,
    "mortgages": 2,
    "inKindRegistry": 0,
    "percentage": 0.06
  },
  {
    "region": "منطقة جازان",
    "totalOperations": 22,
    "conveyance": 13,
    "seizures": 0,
    "mortgages": 1,
    "inKindRegistry": 0,
    "percentage": 0.03
  },
  {
    "region": "منطقة الجوف",
    "totalOperations": 11,
    "conveyance": 7,
    "seizures": 0,
    "mortgages": 0,
    "inKindRegistry": 0,
    "percentage": 0.02
  },
  {
    "region": "منطقة الباحة",
    "totalOperations": 10,
    "conveyance": 5,
    "seizures": 0,
    "mortgages": 0,
    "inKindRegistry": 0,
    "percentage": 0.02
  },
  {
    "region": "منطقة نجران",
    "totalOperations": 10,
    "conveyance": 6,
    "seizures": 0,
    "mortgages": 4,
    "inKindRegistry": 0,
    "percentage": 0.02
  }
];

export const SAUDI_TOP_CITIES = [
  {
    "city": "الرياض",
    "count": 54337,
    "percentage": 82.7
  },
  {
    "city": "عام",
    "count": 7881,
    "percentage": 12.0
  },
  {
    "city": "جده",
    "count": 796,
    "percentage": 1.21
  },
  {
    "city": "كتابة عدل مدمجة - افتراضية",
    "count": 555,
    "percentage": 0.84
  },
  {
    "city": "مكة المكرمة",
    "count": 549,
    "percentage": 0.84
  },
  {
    "city": "الدمام",
    "count": 242,
    "percentage": 0.37
  },
  {
    "city": "المدينة المنورة",
    "count": 213,
    "percentage": 0.32
  },
  {
    "city": "ابها",
    "count": 206,
    "percentage": 0.31
  },
  {
    "city": "مكة المكرمة",
    "count": 186,
    "percentage": 0.28
  },
  {
    "city": "الخبر",
    "count": 85,
    "percentage": 0.13
  },
  {
    "city": "حائل",
    "count": 84,
    "percentage": 0.13
  },
  {
    "city": "الاحساء",
    "count": 68,
    "percentage": 0.1
  },
  {
    "city": "بريده",
    "count": 67,
    "percentage": 0.1
  },
  {
    "city": "تبوك",
    "count": 62,
    "percentage": 0.09
  },
  {
    "city": "خميس مشيط",
    "count": 55,
    "percentage": 0.08
  }
];

export const SAUDI_TOP_OPERATIONS = [
  {
    "operation": "عقارات/الحجز التحفظي على ممتلكات شخص",
    "count": 19086,
    "percentage": 29.05
  },
  {
    "operation": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "count": 16887,
    "percentage": 25.7
  },
  {
    "operation": "عقارات/مسجل عينيا",
    "count": 16696,
    "percentage": 25.41
  },
  {
    "operation": "عقارات/افراغ",
    "count": 8785,
    "percentage": 13.37
  },
  {
    "operation": "عقارات/تسجيل صك قديم",
    "count": 1465,
    "percentage": 2.23
  },
  {
    "operation": "عقارات/فك رهن العقارات",
    "count": 507,
    "percentage": 0.77
  },
  {
    "operation": "عقارات/حجز/فك حجز",
    "count": 472,
    "percentage": 0.72
  },
  {
    "operation": "عقارات/تعديل صك",
    "count": 410,
    "percentage": 0.62
  },
  {
    "operation": "عقارات/رهن العقارات",
    "count": 337,
    "percentage": 0.51
  },
  {
    "operation": "عقارات/تعريف الصكوك للفرز",
    "count": 278,
    "percentage": 0.42
  },
  {
    "operation": "عقارات/فرز صكوك",
    "count": 165,
    "percentage": 0.25
  },
  {
    "operation": "عقارات/تسجيل ملكية عقار بدون صك",
    "count": 108,
    "percentage": 0.16
  },
  {
    "operation": "عقارات/نقل شرح بانتقال ملكية",
    "count": 105,
    "percentage": 0.16
  },
  {
    "operation": "عقارات/تملك نصيب",
    "count": 96,
    "percentage": 0.15
  },
  {
    "operation": "عقارات/منح",
    "count": 90,
    "percentage": 0.14
  },
  {
    "operation": "عقارات/ربط صك بالهوية العقارية",
    "count": 65,
    "percentage": 0.1
  },
  {
    "operation": "عقارات/دمج عقارات",
    "count": 57,
    "percentage": 0.09
  },
  {
    "operation": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "count": 54,
    "percentage": 0.08
  },
  {
    "operation": "عقارات/تعديل صك قديم",
    "count": 18,
    "percentage": 0.03
  },
  {
    "operation": "عقارات/تعويض أنقاض دون العقار",
    "count": 13,
    "percentage": 0.02
  },
  {
    "operation": "عقارات/منحة بديلة",
    "count": 5,
    "percentage": 0.01
  },
  {
    "operation": "عقارات/موافقة الجهة الحكومية على فك قيد صك",
    "count": 1,
    "percentage": 0.0
  },
  {
    "operation": "عقارات/نقل شرح رهن بدون انتقال ملكية",
    "count": 1,
    "percentage": 0.0
  },
  {
    "operation": "عقارات/دمج صكوك",
    "count": 1,
    "percentage": 0.0
  }
];

export const SAUDI_DAILY_TIMELINE: DailyActivity[] = [
  {
    "date": "2026/07/01",
    "dayLabel": "يوم 01 يوليو",
    "dayLabelEn": "July 1",
    "total": 18894,
    "conveyance": 2760,
    "seizures": 6035,
    "releases": 4391,
    "registry": 4189
  },
  {
    "date": "2026/07/02",
    "dayLabel": "يوم 02 يوليو",
    "dayLabelEn": "July 2",
    "total": 16616,
    "conveyance": 2200,
    "seizures": 4986,
    "releases": 4217,
    "registry": 4098
  },
  {
    "date": "2026/07/03",
    "dayLabel": "يوم 03 يوليو",
    "dayLabelEn": "July 3",
    "total": 5196,
    "conveyance": 544,
    "seizures": 3445,
    "releases": 1156,
    "registry": 0
  },
  {
    "date": "2026/07/04",
    "dayLabel": "يوم 04 يوليو",
    "dayLabelEn": "July 4",
    "total": 8108,
    "conveyance": 836,
    "seizures": 2912,
    "releases": 1749,
    "registry": 2534
  },
  {
    "date": "2026/07/05",
    "dayLabel": "يوم 05 يوليو",
    "dayLabelEn": "July 5",
    "total": 16888,
    "conveyance": 2445,
    "seizures": 1708,
    "releases": 5374,
    "registry": 5875
  }
];

export const SAUDI_SECTOR_DISTRIBUTION = [
  { sector: "القطاع العام", count: 62187, percentage: 94.65 },
  { sector: "القطاع الخاص", count: 3515, percentage: 5.35 }
];

export const SAUDI_JULY_2026_RECORDS: RealEstateRecord[] = [
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1292
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 20
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 96
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تملك نصيب",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 30
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/ربط صك بالهوية العقارية",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 23
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 76
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 33
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 183
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/موافقة الجهة الحكومية على فك قيد صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 448
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 136
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك قديم",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 11
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 187
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 5
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح بانتقال ملكية",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 3
  },
  {
    "region": "منطقة الباحة",
    "city": "الباحه",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "عرعر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الافلاج",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الخرج",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 13
  },
  {
    "region": "منطقة الرياض",
    "city": "الخرج",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 325
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 16
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 7
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 6031
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/حجز/فك حجز",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 190
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4388
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/مسجل عينيا",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4189
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 18
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 27
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 29
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/حجز/فك حجز",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 11
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج عقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 13
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 3
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 3
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 25
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منحة بديلة",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح بانتقال ملكية",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 30
  },
  {
    "region": "منطقة الرياض",
    "city": "شقراء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 24
  },
  {
    "region": "منطقة الرياض",
    "city": "شقراء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "وادي الدواسر",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الشرقية",
    "city": "الاحساء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 36
  },
  {
    "region": "منطقة الشرقية",
    "city": "الاحساء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة الشرقية",
    "city": "الجبيل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 26
  },
  {
    "region": "منطقة الشرقية",
    "city": "الخبر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 23
  },
  {
    "region": "منطقة الشرقية",
    "city": "الخبر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 80
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة الشرقية",
    "city": "القطيف",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 14
  },
  {
    "region": "منطقة الشرقية",
    "city": "حفر الباطن",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 11
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة القصيم",
    "city": "عنيزه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 8
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "العلا",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعويض أنقاض دون العقار",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 59
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج عقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة تبوك",
    "city": "البدع",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 9
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 10
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 7
  },
  {
    "region": "منطقة تبوك",
    "city": "ضباء",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة تبوك",
    "city": "ضباء",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعويض أنقاض دون العقار",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 5
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 26
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 5
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 53
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة عسير",
    "city": "بيشه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة عسير",
    "city": "بيشه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 3
  },
  {
    "region": "منطقة عسير",
    "city": "خميس مشيط",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 10
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 64
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 1
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 296
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 4
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 7
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 158
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 6
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "منطقة نجران",
    "city": "نجران",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/01",
    "dateHijri": "1448/01/16",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1238
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 16
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 73
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تملك نصيب",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 27
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/ربط صك بالهوية العقارية",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 16
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 44
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 23
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 75
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 455
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 53
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك قديم",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 6
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 19
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 152
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 6
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح بانتقال ملكية",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 5
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح رهن بدون انتقال ملكية",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة الباحة",
    "city": "الباحه",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة الجوف",
    "city": "القريات",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 3
  },
  {
    "region": "منطقة الجوف",
    "city": "سكاكا",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "عرعر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 3
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "عرعر",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 9
  },
  {
    "region": "منطقة الرياض",
    "city": "البجاديه",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الخرج",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 8
  },
  {
    "region": "منطقة الرياض",
    "city": "الخرج",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 179
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 9
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 4986
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/حجز/فك حجز",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 134
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 4217
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/مسجل عينيا",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 4098
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 18
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 23
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج عقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 15
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 22
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منحة بديلة",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح بانتقال ملكية",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 16
  },
  {
    "region": "منطقة الرياض",
    "city": "المجمعه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "شقراء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 5
  },
  {
    "region": "منطقة الشرقية",
    "city": "الاحساء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 13
  },
  {
    "region": "منطقة الشرقية",
    "city": "الجبيل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 10
  },
  {
    "region": "منطقة الشرقية",
    "city": "الخبر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 17
  },
  {
    "region": "منطقة الشرقية",
    "city": "الخبر",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 64
  },
  {
    "region": "منطقة الشرقية",
    "city": "القطيف",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 6
  },
  {
    "region": "منطقة الشرقية",
    "city": "حفر الباطن",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة الشرقية",
    "city": "حفر الباطن",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 14
  },
  {
    "region": "منطقة القصيم",
    "city": "البكيريه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 4
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 13
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "العلا",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 30
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 10
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 3
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 11
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعويض أنقاض دون العقار",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 9
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 67
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة عسير",
    "city": "خميس مشيط",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 7
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 43
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 5
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 4
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 154
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 1
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 8
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 4
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 119
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة نجران",
    "city": "نجران",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "منطقة نجران",
    "city": "نجران",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/02",
    "dateHijri": "1448/01/17",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 420
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تملك نصيب",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/ربط صك بالهوية العقارية",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 3
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 14
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 7
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 1
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "عرعر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 5
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 24
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 3445
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/حجز/فك حجز",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 7
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 1156
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 5
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 5
  },
  {
    "region": "منطقة الرياض",
    "city": "شقراء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 3
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 8
  },
  {
    "region": "منطقة عسير",
    "city": "خميس مشيط",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 2
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 12
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 22
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 4
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/03",
    "dateHijri": "1448/01/18",
    "count": 47
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 578
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تملك نصيب",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 18
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/ربط صك بالهوية العقارية",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 7
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 3
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 7
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 4
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 5
  },
  {
    "region": "منطقة الجوف",
    "city": "القريات",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "منطقة الجوف",
    "city": "سكاكا",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "منطقة الجوف",
    "city": "سكاكا",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج عقارات",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "منطقة الجوف",
    "city": "سكاكا",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "رفحاء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 9
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "عرعر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 27
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 2912
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/حجز/فك حجز",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 12
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1749
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/مسجل عينيا",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 2534
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج عقارات",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 4
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح بانتقال ملكية",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 9
  },
  {
    "region": "منطقة الشرقية",
    "city": "الخبر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 10
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 28
  },
  {
    "region": "منطقة الشرقية",
    "city": "القطيف",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 3
  },
  {
    "region": "منطقة الشرقية",
    "city": "حفر الباطن",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 7
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 1
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 29
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 3
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 11
  },
  {
    "region": "منطقة عسير",
    "city": "بيشه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 2
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 16
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "القنفذه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 4
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 28
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 3
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 76
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/04",
    "dateHijri": "1448/01/19",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1295
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 12
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 100
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/تملك نصيب",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 19
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/ربط صك بالهوية العقارية",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 16
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 69
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 53
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 192
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 550
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 94
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك قديم",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 8
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "عام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 171
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 11
  },
  {
    "region": "الخدمات الرقمية",
    "city": "كتابة عدل مدمجة - افتراضية",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح بانتقال ملكية",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5
  },
  {
    "region": "منطقة الباحة",
    "city": "الباحه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 4
  },
  {
    "region": "منطقة الباحة",
    "city": "الباحه",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعويض أنقاض دون العقار",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 4
  },
  {
    "region": "منطقة الجوف",
    "city": "القريات",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "رفحاء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة الحدود الشمالية",
    "city": "عرعر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الخرج",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 10
  },
  {
    "region": "منطقة الرياض",
    "city": "الخرج",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 175
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 28
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1708
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/حجز/فك حجز",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 117
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5372
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية",
    "operationType": "عقارات/مسجل عينيا",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5875
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 21
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 13
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 3
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/حجز/فك حجز",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج صكوك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج عقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 22
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك الحجز التحفظي على ممتلكات شخص",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 15
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منحة بديلة",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "الرياض",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/نقل شرح بانتقال ملكية",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 37
  },
  {
    "region": "منطقة الرياض",
    "city": "المزاحميه",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الرياض",
    "city": "شقراء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة الشرقية",
    "city": "الاحساء",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 17
  },
  {
    "region": "منطقة الشرقية",
    "city": "الجبيل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة الشرقية",
    "city": "الخبر",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 32
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 59
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل صك قديم",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/دمج عقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الشرقية",
    "city": "الدمام",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فرز صكوك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة الشرقية",
    "city": "القطيف",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 8
  },
  {
    "region": "منطقة الشرقية",
    "city": "حفر الباطن",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة القصيم",
    "city": "البكيريه",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 27
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 9
  },
  {
    "region": "منطقة القصيم",
    "city": "بريده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "العلا",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 38
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 9
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 3
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة المدينة المنوره",
    "city": "المدينة المنورة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 6
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 3
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 7
  },
  {
    "region": "منطقة تبوك",
    "city": "تبوك",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة تبوك",
    "city": "ضباء",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعويض أنقاض دون العقار",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعويض أنقاض دون العقار",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة جازان",
    "city": "جيزان",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 18
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة حائل",
    "city": "حائل",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/منح",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 3
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 60
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 4
  },
  {
    "region": "منطقة عسير",
    "city": "ابها",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعريف الصكوك للفرز",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة عسير",
    "city": "خميس مشيط",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 34
  },
  {
    "region": "منطقة عسير",
    "city": "خميس مشيط",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة عسير",
    "city": "محايل عسير",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 35
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 240
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/فك رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 9
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تسجيل ملكية عقار بدون صك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "جده",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/تعديل صك بإضافة أو حذف عقار / مالك",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 5
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 136
  },
  {
    "region": "منطقة مكة المكرمه",
    "city": "مكة المكرمة",
    "sector": "القطاع العام",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 1
  },
  {
    "region": "منطقة نجران",
    "city": "نجران",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/افراغ",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  },
  {
    "region": "منطقة نجران",
    "city": "نجران",
    "sector": "القطاع الخاص",
    "service": "خدمة إلكترونية جزئيا",
    "operationType": "عقارات/رهن العقارات",
    "dateGregorian": "2026/07/05",
    "dateHijri": "1448/01/20",
    "count": 2
  }
];

/**
 * Filter transactions by region
 */
export function getOperationsByRegion(regionName: string): RealEstateRecord[] {
  return SAUDI_JULY_2026_RECORDS.filter(r => r.region.toLowerCase().includes(regionName.toLowerCase()));
}

/**
 * Filter transactions by city
 */
export function getOperationsByCity(cityName: string): RealEstateRecord[] {
  return SAUDI_JULY_2026_RECORDS.filter(r => r.city.toLowerCase().includes(cityName.toLowerCase()));
}

/**
 * Filter transactions by operation keyword (e.g. 'افراغ', 'رهن', 'حجز')
 */
export function getOperationsByType(keyword: string): RealEstateRecord[] {
  return SAUDI_JULY_2026_RECORDS.filter(r => r.operationType.includes(keyword));
}
