export interface MinyanTime {
  sunday?: string;
  mondayToFriday?: string;
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
  shabbosOnly?: boolean;
  chassidus?: MinyanTime;
  shachris: MinyanTime;
  mincha: MinyanTime;
  maariv: MinyanTime;
  shiurim?: {
    title: string;
    time: string;
    description?: string;
    rabbi?: string;
  }[];
  shabbos: {
    kabbalatShabbat?: string;
    shachris?: string;
    mincha?: string;
    farbrengen?: string;
  };
}

export const minyanim: any[] = [

  {
    id: "bm",
    name: "Bais moshe",
    address: "425 Tioga Ave, Kingston, PA 18704",
    imageUrl: "https://files.anash.org/uploads/2023/05/WhatsApp-Image-2023-04-27-at-9.38.26-PM.jpg",
    website: "https://www.baismoshe.com/",
    phone: "(570) 561-4555",
    rabbi: "Rabbi Gedalia Oberlnader",
    chassidus: {
      sunday: "7:45 AM",
      mondayToFriday: "6:30 AM",
      shabbos: "9:00 AM"
    },
    shachris: {
      sunday: "7:00 AM, 8:30 AM, 9:00 AM, 10:00 AM",
      mondayToFriday: "7:00 AM, 7:15 AM, 8:15 AM",
      shabbos: "10:00 AM"
    },
    mincha: {
      sunday: "25 minutes before sunset, 15 minutes before sunset",
      mondayToFriday: "25 minutes before sunset, 15 minutes before sunset",
      shabbos: "Candle lighting"
    },
    maariv: {
      sunday: "Tzais, 9:30 PM",
      mondayToFriday: "Tzais, 9:30 PM",
      shabbos: "Bzman"
    },
    shiurim: [
      {
        title: "Likutei Sichos",
        time: "8:45 AM Sunday",
        description: "Project Likutei Sichos",
        rabbi: "Rabbi Mendel Gorman"
      },
      {
        title: "Sunday Kolel",
        time: "9:15 AM",
        description: "Weekly sunday kollel",
        rabbi: "Assorted"
      }
    ],
    shabbos: {
      kabbalatShabbat: "Bzman",
      shachris: "10:00 AM",
      mincha: "Candle Lighting",
      farbrengen: "After Davening"
    }
  },
  {
    id: "cheder-sheni",
    name: "Cheder Sheni",
    address: "445 Wyoming Ave, Kingston, PA 18704",
    imageUrl: "https://cheder2.com/images/shul.jpg",
    phone: "(718) 735-0400",
    rabbi: "Rabbi Mendy Majesky",
    chassidus: {
      sunday: "7:30 AM",
      mondayToFriday: "6:20 AM",
      shabbos: "9:15 AM"
    },
    shachris: {
      sunday: "8:00 AM",
      mondayToFriday: "6:45 AM",
      shabbos: "10:00 AM"
    },
    mincha: {
      sunday: "n/a",
      mondayToFriday: "n/a",
      shabbos: "Candle lighting"
    },
    maariv: {
      sunday: "8:30 PM",
      mondayToFriday: "8:30 PM",
      shabbos: "Tzais"
    },
    shiurim: [
      {
        title: "Ein Yaakov",
        time: "After Maariv",
        description: "Daily study of the Ein Yaakov",
        rabbi: "Rabbi Mendy Majesky"
      }
    ],
    shabbos: {
      kabbalatShabbat: "10 minutes after candle lighting",
      shachris: "10:00 AM",
      mincha: "Candle lighting",
      farbrengen: "After Davening"
    }
  },
  {
    id: "bais-tzvi-yosef",
    name: "Bais tzvi Yosef",
    address: "17 2nd Ave, Kingston, PA 18704",
    imageUrl: "https://static.wixstatic.com/media/626909_5236b528a4ee4fe09351f88a7781c208~mv2.png/v1/fill/w_960,h_752,al_c,q_85,usm_0.66_1.00_0.01/626909_5236b528a4ee4fe09351f88a7781c208~mv2.png",
    phone: "(518) 496-0011",
    rabbi: "Rabbi Mendel Serobransky",
    shabbosOnly: true,
    chassidus: {
      shabbos: "8:30 AM"
    },
    shachris: {
      shabbos: "9:30 AM"
    },
    mincha: {
      shabbos: "Candle Lighting"
    },
    maariv: {
      shabbos: "Bzman"
    },
    shiurim: [
      {
        title: "Shabbos Morning Chassidus",
        time: "8:30 AM Shabbos",
        description: "In-depth study of Chassidic teachings",
        rabbi: "Rabbi Mendel Serobransky"
      }
    ],
    shabbos: {
      kabbalatShabbat: "10 minutes after candle lighting",
      shachris: "9:30 AM",
      mincha: "Varies by week - check bulletin",
      farbrengen: "After Shabbos morning davening"
    }
  },
  {
    id: "deli-minyan",
    name: "Deli Minyan",
    shabbosOnly: true,
    address: "445 Wyoming Ave, Kingston, PA 18704",
    imageUrl: "https://crownheights.info/assets/2018/01/1-15.jpg",
    phone: "(718) 493-3996",
    rabbi: "Rabbi Sholom Liane",
    chassidus: {
      sunday: "6:45 AM",
      mondayToFriday: "6:00 AM",
      shabbos: "9:30 AM"
    },
    shachris: {
      sunday: "7:30 AM, 8:30 AM, 9:30 AM",
      mondayToFriday: "7:00 AM, 8:00 AM",
      shabbos: "10:30 AM"
    },
    mincha: {
      sunday: "1:30 PM, 3:00 PM (Winter), 7:30 PM (Summer)",
      mondayToFriday: "1:30 PM, 3:00 PM (Winter), 7:30 PM (Summer)",
      shabbos: "Following the Kiddush"
    },
    maariv: {
      sunday: "After Mincha, 9:15 PM",
      mondayToFriday: "After Mincha, 9:15 PM",
      shabbos: "N/A"
    },
  
    shabbos: {
      kabbalatShabbat: "Tzais",
      shachris: "10:30 AM",
      mincha: "N/A",
      farbrengen: "After Mussaf"
    }
  }
];
