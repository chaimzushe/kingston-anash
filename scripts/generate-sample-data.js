const XlsxPopulate = require('xlsx-populate');
const fs = require('fs');
const path = require('path');

// Sample data for community members
const communityMembers = [
  {
    id: '1',
    firstName: 'Mendel',
    lastName: 'Goldstein',
    email: 'mendel.goldstein@example.com',
    phone: '(555) 123-4567',
    address: '770 Eastern Parkway, Brooklyn, NY 11213',
    occupation: 'Rabbi',
    birthday: '15 Nissan',
    anniversary: '10 Kislev',
    spouse: 'Chaya Goldstein',
    children: 'Moshe, Rivka, Yosef',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Rabbi Mendel has been serving the Kingston community for over 15 years. He specializes in Jewish education and community outreach.',
    joinedDate: '2008',
    role: 'Rabbi',
    committees: 'Education, Events'
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Levin',
    email: 'sarah.levin@example.com',
    phone: '(555) 987-6543',
    address: '788 Montgomery St, Brooklyn, NY 11213',
    occupation: 'Teacher',
    birthday: '20 Tammuz',
    anniversary: '5 Adar',
    spouse: 'David Levin',
    children: 'Rachel, Yaakov, Leah',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Sarah is a dedicated teacher at the local Jewish day school. She is passionate about early childhood education and Jewish values.',
    joinedDate: '2012',
    role: 'Teacher',
    committees: 'Education, Women\'s Circle'
  },
  {
    id: '3',
    firstName: 'Yosef',
    lastName: 'Cohen',
    email: 'yosef.cohen@example.com',
    phone: '(555) 456-7890',
    address: '792 Crown St, Brooklyn, NY 11213',
    occupation: 'Business Owner',
    birthday: '3 Shevat',
    anniversary: '17 Elul',
    spouse: 'Esther Cohen',
    children: 'Shmuel, Devorah, Chaim, Tzvi',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Yosef runs a successful kosher catering business that serves the greater Brooklyn area. He is known for his generosity and community support.',
    joinedDate: '2010',
    role: 'Business Owner',
    committees: 'Finance, Events'
  },
  {
    id: '4',
    firstName: 'Rivka',
    lastName: 'Shapiro',
    email: 'rivka.shapiro@example.com',
    phone: '(555) 234-5678',
    address: '415 Kingston Ave, Brooklyn, NY 11213',
    occupation: 'Doctor',
    birthday: '12 Cheshvan',
    anniversary: '22 Sivan',
    spouse: 'Avi Shapiro',
    children: 'Shira, Menachem, Chana',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Dr. Rivka is a pediatrician who provides medical care to many families in the community. She volunteers her time for community health initiatives.',
    joinedDate: '2015',
    role: 'Doctor',
    committees: 'Health, Women\'s Circle'
  },
  {
    id: '5',
    firstName: 'Shlomo',
    lastName: 'Friedman',
    email: 'shlomo.friedman@example.com',
    phone: '(555) 345-6789',
    address: '580 Crown St, Brooklyn, NY 11213',
    occupation: 'Sofer (Scribe)',
    birthday: '25 Iyar',
    anniversary: '14 Tevet',
    spouse: 'Miriam Friedman',
    children: 'Yitzchak, Bracha, Dovid',
    imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Shlomo is a skilled sofer who writes Torah scrolls, tefillin, and mezuzot. He also teaches the art of Jewish calligraphy to interested community members.',
    joinedDate: '2011',
    role: 'Sofer',
    committees: 'Education, Religious Affairs'
  },
  {
    id: '6',
    firstName: 'Chaya',
    lastName: 'Berkowitz',
    email: 'chaya.berkowitz@example.com',
    phone: '(555) 567-8901',
    address: '525 Empire Blvd, Brooklyn, NY 11213',
    occupation: 'Event Planner',
    birthday: '8 Adar',
    anniversary: '19 Av',
    spouse: 'Moshe Berkowitz',
    children: 'Shifra, Yehuda, Batya',
    imageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Chaya runs an event planning business specializing in Jewish lifecycle events. She is known for her creativity and attention to detail.',
    joinedDate: '2014',
    role: 'Event Planner',
    committees: 'Events, Women\'s Circle'
  },
  {
    id: '7',
    firstName: 'Dovid',
    lastName: 'Katz',
    email: 'dovid.katz@example.com',
    phone: '(555) 678-9012',
    address: '640 Eastern Parkway, Brooklyn, NY 11213',
    occupation: 'Software Developer',
    birthday: '17 Tevet',
    anniversary: '3 Tammuz',
    spouse: 'Leah Katz',
    children: 'Ari, Sara',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Dovid works as a software developer for a tech company. He volunteers his technical skills to help the community with various digital initiatives.',
    joinedDate: '2017',
    role: 'Tech Professional',
    committees: 'Technology, Youth'
  },
  {
    id: '8',
    firstName: 'Esther',
    lastName: 'Rosenfeld',
    email: 'esther.rosenfeld@example.com',
    phone: '(555) 789-0123',
    address: '710 Montgomery St, Brooklyn, NY 11213',
    occupation: 'Artist',
    birthday: '2 Nisan',
    anniversary: '11 Shevat',
    spouse: 'Yaakov Rosenfeld',
    children: 'Elisheva, Noam',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Esther is a talented artist who specializes in Jewish-themed artwork. She teaches art classes to children and adults in the community.',
    joinedDate: '2016',
    role: 'Artist',
    committees: 'Arts, Education'
  },
  {
    id: '9',
    firstName: 'Chaim',
    lastName: 'Greenberg',
    email: 'chaim.greenberg@example.com',
    phone: '(555) 890-1234',
    address: '820 Crown St, Brooklyn, NY 11213',
    occupation: 'Accountant',
    birthday: '14 Kislev',
    anniversary: '7 Cheshvan',
    spouse: 'Dina Greenberg',
    children: 'Yonatan, Talia, Ezra',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Chaim is an accountant who provides financial services to many community members and businesses. He serves as the treasurer for several community organizations.',
    joinedDate: '2013',
    role: 'Accountant',
    committees: 'Finance, Fundraising'
  },
  {
    id: '10',
    firstName: 'Miriam',
    lastName: 'Stern',
    email: 'miriam.stern@example.com',
    phone: '(555) 901-2345',
    address: '450 Kingston Ave, Brooklyn, NY 11213',
    occupation: 'Nurse',
    birthday: '21 Sivan',
    anniversary: '9 Elul',
    spouse: 'Daniel Stern',
    children: 'Aviva, Eitan',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Miriam works as a nurse at a local hospital. She organizes health education programs for the community and provides medical advice when needed.',
    joinedDate: '2018',
    role: 'Nurse',
    committees: 'Health, Women\'s Circle'
  },
  {
    id: '11',
    firstName: 'Moshe',
    lastName: 'Weiss',
    email: 'moshe.weiss@example.com',
    phone: '(555) 012-3456',
    address: '530 Empire Blvd, Brooklyn, NY 11213',
    occupation: 'Kosher Supervisor',
    birthday: '18 Av',
    anniversary: '4 Nissan',
    spouse: 'Rachel Weiss',
    children: 'Shmuel, Rivky, Zalman',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Moshe works as a kosher supervisor for several restaurants and food establishments. He is an expert in kosher laws and practices.',
    joinedDate: '2009',
    role: 'Kosher Supervisor',
    committees: 'Religious Affairs, Kashrus'
  },
  {
    id: '12',
    firstName: 'Leah',
    lastName: 'Schwartz',
    email: 'leah.schwartz@example.com',
    phone: '(555) 123-4567',
    address: '675 Crown St, Brooklyn, NY 11213',
    occupation: 'Preschool Director',
    birthday: '6 Tishrei',
    anniversary: '13 Iyar',
    spouse: 'Yehuda Schwartz',
    children: 'Chana, Mendel, Rochel, Levi',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Leah is the director of a local Jewish preschool. She has developed innovative educational programs that integrate Jewish values with early childhood development.',
    joinedDate: '2011',
    role: 'Educator',
    committees: 'Education, Children\'s Programs'
  }
];

// Create the Excel file
async function createExcelFile() {
  try {
    // Create a new workbook
    const workbook = await XlsxPopulate.fromBlankAsync();
    
    // Get the sheet
    const sheet = workbook.sheet(0);
    
    // Set headers
    const headers = [
      'id', 'firstName', 'lastName', 'email', 'phone', 'address', 'occupation',
      'birthday', 'anniversary', 'spouse', 'children', 'imageUrl', 'bio',
      'joinedDate', 'role', 'committees'
    ];
    
    headers.forEach((header, index) => {
      sheet.cell(1, index + 1).value(header);
    });
    
    // Add data
    communityMembers.forEach((member, rowIndex) => {
      const row = rowIndex + 2; // Start from row 2 (after headers)
      
      headers.forEach((header, colIndex) => {
        sheet.cell(row, colIndex + 1).value(member[header] || '');
      });
    });
    
    // Save the workbook
    const outputPath = path.join(__dirname, '..', 'data', 'anash.xlsx');
    await workbook.toFileAsync(outputPath);
    
    console.log(`Excel file created successfully at: ${outputPath}`);
  } catch (error) {
    console.error('Error creating Excel file:', error);
  }
}

// Create the directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Run the function
createExcelFile();
