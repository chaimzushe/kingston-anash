export interface MinyanTime {
  sunday?: string;
  mondayToThursday?: string;
  friday?: string;
  shabbos?: string;
}

export interface Minyan {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  website?: string;
  phone?: string;
  rabbi?: string;
  shachris: MinyanTime;
  mincha: MinyanTime;
  maariv: MinyanTime;
  shabbos: {
    candleLighting?: string;
    kabbalatShabbat?: string;
    shachris?: string;
    mincha?: string;
    maariv?: string;
    havdalah?: string;
  };
}

export const minyanim: Minyan[] = [
  {
    id: "bm",
    name: "Bais moshe",
    address: "770 Eastern Parkway, Brooklyn, NY 11213",
    imageUrl: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    website: "https://www.770live.com",
    phone: "(718) 493-9250",
    rabbi: "Rabbi Yosef Braun",
    shachris: {
      sunday: "7:00 AM, 8:00 AM, 9:00 AM, 10:00 AM",
      mondayToThursday: "7:00 AM, 8:00 AM, 9:30 AM",
      friday: "7:00 AM, 8:00 AM, 9:30 AM",
      shabbos: "9:30 AM"
    },
    mincha: {
      sunday: "1:45 PM, 3:15 PM (Winter), 7:00 PM (Summer)",
      mondayToThursday: "1:45 PM, 3:15 PM (Winter), 7:00 PM (Summer)",
      friday: "Before Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    maariv: {
      sunday: "After Mincha, 9:30 PM",
      mondayToThursday: "After Mincha, 9:30 PM",
      friday: "After Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    shabbos: {
      candleLighting: "Varies by week - check bulletin",
      kabbalatShabbat: "Varies by week - check bulletin",
      shachris: "9:30 AM",
      mincha: "Varies by week - check bulletin",
      maariv: "Varies by week - check bulletin",
      havdalah: "Varies by week - check bulletin"
    }
  },
  {
    id: "cheder-sheni",
    name: "Cheder Sheni",
    address: "470 Lefferts Avenue, Brooklyn, NY 11225",
    imageUrl: "https://images.unsplash.com/photo-1575384043001-f37b8e8a2b81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    phone: "(718) 735-0400",
    rabbi: "Rabbi Yosef Katzman",
    shachris: {
      sunday: "8:30 AM",
      mondayToThursday: "7:30 AM",
      friday: "7:30 AM",
      shabbos: "9:00 AM"
    },
    mincha: {
      sunday: "2:30 PM (Winter), 7:15 PM (Summer)",
      mondayToThursday: "2:30 PM (Winter), 7:15 PM (Summer)",
      friday: "Before Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    maariv: {
      sunday: "After Mincha, 8:45 PM",
      mondayToThursday: "After Mincha, 8:45 PM",
      friday: "After Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    shabbos: {
      candleLighting: "18 minutes before sunset",
      kabbalatShabbat: "10 minutes after candle lighting",
      shachris: "9:00 AM",
      mincha: "Varies by week - check bulletin",
      maariv: "50 minutes after sunset",
      havdalah: "42 minutes after sunset"
    }
  },
  {
    id: "deli-minyan",
    name: "Bais tzvi Yosef",
    address: "667 Eastern Parkway, Brooklyn, NY 11213",
    imageUrl: "https://images.unsplash.com/photo-1594835898177-dd82f11e7a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    website: "https://www.oholeitorah.com",
    phone: "(718) 493-3996",
    rabbi: "Rabbi Yisroel Belsky",
    shachris: {
      sunday: "7:30 AM, 8:30 AM, 9:30 AM",
      mondayToThursday: "7:00 AM, 8:00 AM",
      friday: "7:00 AM, 8:00 AM",
      shabbos: "9:30 AM"
    },
    mincha: {
      sunday: "1:30 PM, 3:00 PM (Winter), 7:30 PM (Summer)",
      mondayToThursday: "1:30 PM, 3:00 PM (Winter), 7:30 PM (Summer)",
      friday: "Before Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    maariv: {
      sunday: "After Mincha, 9:15 PM",
      mondayToThursday: "After Mincha, 9:15 PM",
      friday: "After Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    shabbos: {
      candleLighting: "18 minutes before sunset",
      kabbalatShabbat: "10 minutes after candle lighting",
      shachris: "9:30 AM",
      mincha: "Varies by week - check bulletin",
      maariv: "50 minutes after sunset",
      havdalah: "42 minutes after sunset"
    }
  },
  {
    id: "bty",
    name: "Bais tzvi Yosef",
    address: "667 Eastern Parkway, Brooklyn, NY 11213",
    imageUrl: "https://images.unsplash.com/photo-1594835898177-dd82f11e7a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    website: "https://www.oholeitorah.com",
    phone: "(718) 493-3996",
    rabbi: "Rabbi Yisroel Belsky",
    shachris: {
      sunday: "7:30 AM, 8:30 AM, 9:30 AM",
      mondayToThursday: "7:00 AM, 8:00 AM",
      friday: "7:00 AM, 8:00 AM",
      shabbos: "9:30 AM"
    },
    mincha: {
      sunday: "1:30 PM, 3:00 PM (Winter), 7:30 PM (Summer)",
      mondayToThursday: "1:30 PM, 3:00 PM (Winter), 7:30 PM (Summer)",
      friday: "Before Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    maariv: {
      sunday: "After Mincha, 9:15 PM",
      mondayToThursday: "After Mincha, 9:15 PM",
      friday: "After Kabbalat Shabbat",
      shabbos: "Varies by week - check bulletin"
    },
    shabbos: {
      candleLighting: "18 minutes before sunset",
      kabbalatShabbat: "10 minutes after candle lighting",
      shachris: "9:30 AM",
      mincha: "Varies by week - check bulletin",
      maariv: "50 minutes after sunset",
      havdalah: "42 minutes after sunset"
    }
  }
];
