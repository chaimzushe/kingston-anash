export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
  category: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'New Sefer Torah Dedicated at Kingston Avenue Shul',
    summary: 'The Kingston Avenue Shul celebrated the dedication of a new Sefer Torah this past Sunday. The event was attended by hundreds of community members and featured music, dancing, and a festive meal.',
    date: 'May 15, 2024',
    author: 'Mendel Goldstein',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    sourceUrl: '#',
    source: 'COLlive',
    category: 'Community'
  },
  {
    id: '2',
    title: 'Annual Lag B\'Omer Parade Scheduled for Next Week',
    summary: 'The annual Lag B\'Omer parade will take place next Thursday on Eastern Parkway. Organizers expect thousands of children and adults to participate in what has become one of the largest Jewish parades in the United States.',
    date: 'May 14, 2024',
    author: 'Sarah Levin',
    imageUrl: 'https://images.unsplash.com/photo-1566996533071-2c578080c06e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    sourceUrl: '#',
    source: 'Crown Heights Info',
    category: 'Events'
  },
  {
    id: '3',
    title: 'New Kosher Restaurant Opens on Kingston Avenue',
    summary: 'A new kosher restaurant specializing in Mediterranean cuisine has opened its doors on Kingston Avenue. "Taste of Jerusalem" offers a variety of traditional dishes and modern interpretations of classic Middle Eastern fare.',
    date: 'May 12, 2024',
    author: 'Dovid Katz',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    sourceUrl: '#',
    source: 'Anash.org',
    category: 'Business'
  },
  {
    id: '4',
    title: 'Community Chesed Initiative Helps Hundreds of Families',
    summary: 'The Kingston Anash Chesed Initiative has reported helping over 500 families in the past year with food, clothing, and financial assistance. The organization is now launching a new program focused on job placement and career development.',
    date: 'May 10, 2024',
    author: 'Chaya Mushka Friedman',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd59a93f9724?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    sourceUrl: '#',
    source: 'Chabad.org',
    category: 'Chesed'
  },
  {
    id: '5',
    title: 'Local Yeshiva Students Win National Torah Competition',
    summary: 'A team of students from Oholei Torah Yeshiva has won first place in the National Torah Competition held in Chicago last week. The team demonstrated exceptional knowledge of Talmudic law and Jewish philosophy.',
    date: 'May 8, 2024',
    author: 'Yosef Levine',
    imageUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    sourceUrl: '#',
    source: 'COLlive',
    category: 'Education'
  },
  {
    id: '6',
    title: 'Community Safety Patrol Expands Coverage Area',
    summary: 'The Crown Heights Shomrim has announced an expansion of their patrol area to include several additional blocks. The volunteer safety patrol will also be adding new vehicles and communication equipment thanks to a community fundraising effort.',
    date: 'May 5, 2024',
    author: 'Zalman Goldberg',
    imageUrl: 'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    sourceUrl: '#',
    source: 'Crown Heights Info',
    category: 'Safety'
  }
];
