import bcrypt from 'bcryptjs';

export const INITIAL_SOCIETIES = [
  {
    id: 'soc-krs',
    name: 'KIIT Robotics Society (KRS)',
    category: 'Robotics & Hardware',
    logo: '/images/logos/krs.svg',
    shortDescription: 'Fostering innovation in autonomous rovers, drone systems, and competitive robotics since 2012.',
    fullDescription: 'KIIT Robotics Society (KRS) is the premier robotics research and development collective at KIIT Deemed to be University. Our student-led lab focuses on industrial automation, swarm robotics, unmanned aerial vehicles (UAVs), and autonomous rover exploration. We represent KIIT in prestigious national and international robotics competitions including Robocon, University Rover Challenge, and IIT Techfests. We actively conduct hands-on bootcamps in ROS2, embedded systems, PCB designing, and CAD modeling for aspiring engineers.',
    website: 'https://krs.kiit.ac.in',
    instagram: 'https://instagram.com/kiitrobotics',
    linkedin: 'https://linkedin.com/company/kiit-robotics-society',
    adminCode: 'KIIT-KRS-2026',
    createdAt: '2026-01-10T09:00:00.000Z'
  },
  {
    id: 'soc-gdsc',
    name: 'Google Developer Student Clubs (GDSC KIIT)',
    category: 'Technical & Coding',
    logo: '/images/logos/gdsc.svg',
    shortDescription: 'A university-based community group for students interested in Google developer technologies and open source.',
    fullDescription: 'GDSC KIIT is an official developer chapter empowering students to bridge the gap between theory and practical industry engineering. We organize community workshops on Cloud Computing, Android & Flutter development, Full-Stack Web Development, and Applied Machine Learning. Our flagship initiatives include open-source hackathons, Google Cloud Study Jams, and tech speaker sessions featuring seasoned software architects and alumni.',
    website: 'https://gdsc.community.dev/kalinga-institute-of-industrial-technology-bhubaneswar/',
    instagram: 'https://instagram.com/gdsc.kiit',
    linkedin: 'https://linkedin.com/company/gdsc-kiit',
    adminCode: 'KIIT-GDSC-2026',
    createdAt: '2026-01-11T10:00:00.000Z'
  },
  {
    id: 'soc-ecell',
    name: 'KIIT E-Cell (Entrepreneurship Cell)',
    category: 'E-Cell & Entrepreneurship',
    logo: '/images/logos/ecell.svg',
    shortDescription: 'Nurturing student startup founders, venture creators, and business leaders through mentorship and funding.',
    fullDescription: 'KIIT Entrepreneurship Cell (E-Cell) is dedicated to fostering the spirit of enterprise among youth. Recognized as one of Eastern India’s most proactive entrepreneurship bodies, E-Cell collaborates closely with KIIT-TBI (Technology Business Incubator) to provide seed funding avenues, venture incubation, pitch mentorship, and legal advisory. We host the annual E-Summit, bringing together angel investors, venture capitalists, unicorn founders, and over 3,000 student delegates.',
    website: 'https://ecell.org.in',
    instagram: 'https://instagram.com/kiit_ecell',
    linkedin: 'https://linkedin.com/company/kiitecell',
    adminCode: 'KIIT-ECELL-2026',
    createdAt: '2026-01-12T11:00:00.000Z'
  },
  {
    id: 'soc-kamakshi',
    name: 'Kamakshi - The Dance Society of KIIT',
    category: 'Cultural & Arts',
    logo: '/images/logos/kamakshi.svg',
    shortDescription: 'The official eastern and western choreography society showcasing expressive rhythm and stagecraft.',
    fullDescription: 'Kamakshi is the flagship dance society of KIIT Deemed to be University, representing the university across national inter-collegiate cultural festivals such as Mood Indigo, Rendezvous, and Spring Fest. With specialized wings in Indian Classical (Odissi, Kathak, Bharatanatyam), Contemporary, Street Hip-Hop, and Cinematic Broadway styles, Kamakshi provides an electric platform for dancers to train, choreograph, and perform on celebrated national stages.',
    website: 'https://ksac.kiit.ac.in/societies/kamakshi',
    instagram: 'https://instagram.com/kamakshi_kiit',
    linkedin: 'https://linkedin.com/company/kamakshi-kiit',
    adminCode: 'KIIT-KMKS-2026',
    createdAt: '2026-01-13T12:00:00.000Z'
  },
  {
    id: 'soc-kronicle',
    name: 'KRONICLE - The Literary & Debating Society',
    category: 'Social & Literary',
    logo: '/images/logos/kronicle.svg',
    shortDescription: 'The home of parliamentary debaters, creative writers, quizzers, and thoughtful public speakers.',
    fullDescription: 'KRONICLE is the vibrant literary guild of KIIT under the KSAC banner. We represent the university in prestigious Asian Parliamentary Debates, British Parliamentary debates, Model United Nations, and National Quizzing Circuits. Through regular open mics, creative writing anthologies, slam poetry evenings, and policy deliberations, KRONICLE champions critical thought and eloquent discourse across campus.',
    website: 'https://ksac.kiit.ac.in/societies/kronicle',
    instagram: 'https://instagram.com/kronicle_kiit',
    linkedin: 'https://linkedin.com/company/kronicle-kiit',
    adminCode: 'KIIT-KRON-2026',
    createdAt: '2026-01-14T13:00:00.000Z'
  },
  {
    id: 'soc-kfoc',
    name: 'KIIT Fest Organizing Committee (KFOC)',
    category: 'Cultural & Arts',
    logo: '/images/logos/kfoc.svg',
    shortDescription: 'The central engine behind Central India and Eastern India’s largest annual techno-cultural extravaganza.',
    fullDescription: 'KIIT Fest Organizing Committee manages the university’s premier annual festival, drawing over 35,000 students from 200+ universities worldwide. KFOC coordinates mega concerts with renowned artists, national robotics challenges, design hackathons, celebrity pro-nights, gaming championships, and cultural carnivals. Joining KFOC offers students real-world corporate sponsorship, mega-event logistics, artist management, and branding experience.',
    website: 'https://kiitfest.org',
    instagram: 'https://instagram.com/kiitfest_official',
    linkedin: 'https://linkedin.com/company/kiitfest',
    adminCode: 'KIIT-KFOC-2026',
    createdAt: '2026-01-15T14:00:00.000Z'
  },
  {
    id: 'soc-fet',
    name: 'Federation of Engineering & Technology (FET / IoT Lab)',
    category: 'Technical & Coding',
    logo: '/images/logos/fet.svg',
    shortDescription: 'Specializing in IoT hardware engineering, smart sensor nodes, and embedded firmware research.',
    fullDescription: 'The Federation of Engineering & Technology (FET) operates dedicated student laboratory spaces in Campus 3 for IoT development, embedded microcontrollers (ESP32, STM32, ARM Cortex), industrial wireless sensor networks, and edge AI computation. FET mentors undergraduate researchers to publish patents, draft IEEE conference papers, and engineer deployable smart campus solutions.',
    website: 'https://fet.kiit.ac.in',
    instagram: 'https://instagram.com/fet_kiit',
    linkedin: 'https://linkedin.com/company/fet-kiit',
    adminCode: 'KIIT-FET-2026',
    createdAt: '2026-01-16T15:00:00.000Z'
  },
  {
    id: 'soc-korus',
    name: 'Korus - The Music Society of KIIT',
    category: 'Cultural & Arts',
    logo: '/images/logos/korus.svg',
    shortDescription: 'Uniting vocalists, instrumentalists, sound producers, and multi-genre campus bands.',
    fullDescription: 'Korus is the soulful musical heartbeat of KIIT University. Comprising rock bands, Hindustani classical ensembles, western acoustic trios, and electronic music producers, Korus leads campus musical showcases and competes in premier inter-college battle-of-the-bands. The society hosts acoustic jam circles, professional vocal training workshops, and music production clinics at the KSAC audio suites.',
    website: 'https://ksac.kiit.ac.in/societies/korus',
    instagram: 'https://instagram.com/korus_kiit',
    linkedin: 'https://linkedin.com/company/korus-kiit',
    adminCode: 'KIIT-KORUS-2026',
    createdAt: '2026-01-17T16:00:00.000Z'
  },
  {
    id: 'soc-kas',
    name: 'KIIT Automobile Society (KAS)',
    category: 'Technical & Coding',
    logo: '/images/logos/kas.svg',
    shortDescription: 'Designing, fabricating, and racing high-performance Formula Student & SAE Baja vehicles.',
    fullDescription: 'KIIT Automobile Society (KAS) is the multidisciplinary automotive team that designs, simulates, and manufactures formula racing cars and all-terrain off-road electric buggies from scratch. Representing KIIT at Formula Bharat and BAJA SAEINDIA, KAS engineers work with FEA structural simulation, telemetry sensors, custom suspension geometry, battery pack design, and lightweight composite fabrication.',
    website: 'https://kas.kiit.ac.in',
    instagram: 'https://instagram.com/kiitautomobile',
    linkedin: 'https://linkedin.com/company/kiit-automobile-society',
    adminCode: 'KIIT-KAS-2026',
    createdAt: '2026-01-18T17:00:00.000Z'
  },
  {
    id: 'soc-klarity',
    name: 'Klarity - The Photography & Film Club',
    category: 'Cultural & Arts',
    logo: '/images/logos/klarity.svg',
    shortDescription: 'Capturing moments, telling cinematic campus stories, and exploring visual arts through photography.',
    fullDescription: 'Klarity is KIIT’s creative visual media guild. From high-fashion editorial portraits and wildlife photography expeditions to campus documentary filmmaking, post-production color grading, and drone cinematography, Klarity members document every monumental university event while running seasonal exhibitions and technical camera masterclasses.',
    website: 'https://ksac.kiit.ac.in/societies/klarity',
    instagram: 'https://instagram.com/klarity_kiit',
    linkedin: 'https://linkedin.com/company/klarity-kiit',
    adminCode: 'KIIT-KLAR-2026',
    createdAt: '2026-01-19T18:00:00.000Z'
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-krs-hackathon',
    societyId: 'soc-krs',
    title: 'RoboWars 2026: Combat Robotics Championship',
    bannerImage: '/images/banners/robowars.svg',
    date: '2026-10-24',
    time: '10:00 AM - 06:00 PM',
    venue: 'Campus 6, Open Air Theatre Arena',
    category: 'Competition',
    fullDescription: 'Prepare for adrenaline-fueled metal combat! RoboWars 2026 invites student teams to bring their 15kg and 30kg combat-ready robots into an armored bulletproof polycarbonate arena. Pneumatic flippers, spinning drum cutters, and brushless lifters will battle for the championship trophy and cash prizes worth ₹80,000. Registration is open to all engineering departments.',
    externalLink: 'https://unstop.com/competitions/robowars-kiit-2026',
    createdAt: '2026-02-01T10:00:00.000Z'
  },
  {
    id: 'evt-krs-recruitment',
    societyId: 'soc-krs',
    title: 'KRS Annual Core Recruitment Drive 2026',
    bannerImage: '/images/banners/krs_recruit.svg',
    date: '2026-10-14',
    time: '04:30 PM - 08:00 PM',
    venue: 'Campus 3, Auditorium & Lab 302',
    category: 'Recruitment',
    fullDescription: 'Are you passionate about robotics, drone flight dynamics, microcontrollers, CAD modeling, or technical sponsorship? KIIT Robotics Society is opening applications for 1st, 2nd, and 3rd-year students. Recruitment tracks include Mechanical & Fabrication, Embedded Firmware (C++/RTOS), Computer Vision/AI, and PR & Corporate Logistics. No prior experience required; we assess enthusiasm and problem-solving aptitude!',
    createdAt: '2026-02-02T11:00:00.000Z'
  },
  {
    id: 'evt-gdsc-hackathon',
    societyId: 'soc-gdsc',
    title: 'DevHack 2026: 36-Hour National Hackathon',
    bannerImage: '/images/banners/devhack.svg',
    date: '2026-11-06',
    time: '09:00 AM (36 Hours Continuous)',
    venue: 'Campus 15, Central Multipurpose Hall',
    category: 'Hackathon',
    fullDescription: 'Join 500+ student developers at DevHack 2026, hosted by GDSC KIIT. Build solutions for real-world impact across Web3, AI & Agents, Smart Health, and Sustainable Smart Cities. Enjoy 24/7 food, developer swag bags, hands-on mentorship from senior industry tech leads, and win cash prizes from a prize pool of ₹1,50,000 along with direct internship interview opportunities.',
    externalLink: 'https://devfolio.co/devhack-kiit-2026',
    createdAt: '2026-02-03T09:30:00.000Z'
  },
  {
    id: 'evt-gdsc-workshop',
    societyId: 'soc-gdsc',
    title: 'Hands-on Cloud Architect & Kubernetes Bootcamp',
    bannerImage: '/images/banners/cloud_workshop.svg',
    date: '2026-10-18',
    time: '02:00 PM - 05:30 PM',
    venue: 'Campus 8, Computer Science Lab 104',
    category: 'Workshop',
    fullDescription: 'Step up your DevOps knowledge in this intensive, beginner-friendly lab session. Learn how to containerize microservices using Docker, configure automated CI/CD pipelines, and deploy resilient scalable services to Google Kubernetes Engine (GKE). Bring your laptop with Docker Desktop installed.',
    createdAt: '2026-02-04T12:00:00.000Z'
  },
  {
    id: 'evt-ecell-pitch',
    societyId: 'soc-ecell',
    title: 'E-Summit 2026: The Million Dollar Pitch',
    bannerImage: '/images/banners/pitch_deck.svg',
    date: '2026-11-14',
    time: '11:00 AM - 05:00 PM',
    venue: 'KIIT-TBI Convention Centre, Campus 11',
    category: 'Competition',
    fullDescription: 'Have a startup idea with scalable potential? Pitch live to a jury of leading venture capitalists, angel investors, and seasoned founders at KIIT E-Summit. Shortlisted student ventures will compete for up to ₹10 Lakhs in non-dilutive prototype grant support and 12-month incubation access at KIIT-TBI.',
    externalLink: 'https://ecell.org.in/esummit26-pitch',
    createdAt: '2026-02-05T14:00:00.000Z'
  },
  {
    id: 'evt-ecell-workshop',
    societyId: 'soc-ecell',
    title: 'From Dorm to Demo Day: Startup 101 Masterclass',
    bannerImage: '/images/banners/startup101.svg',
    date: '2026-10-20',
    time: '05:00 PM - 07:30 PM',
    venue: 'Campus 6, Auditorium Hall B',
    category: 'Workshop',
    fullDescription: 'A pragmatic seminar on validating business models, finding your first 100 paying customers, and navigating the legal framework for student-led companies in India. Conducted by Forbes 30-Under-30 KIIT alumni founders.',
    createdAt: '2026-02-06T15:00:00.000Z'
  },
  {
    id: 'evt-kamakshi-auditions',
    societyId: 'soc-kamakshi',
    title: 'Kamakshi Dance Auditions: Monsoon Cycle 2026',
    bannerImage: '/images/banners/kamakshi_auditions.svg',
    date: '2026-10-16',
    time: '03:30 PM - 08:30 PM',
    venue: 'Student Activity Centre (KSAC), Dance Studio',
    category: 'Recruitment',
    fullDescription: 'Showcase your groove, grace, and storytelling. Kamakshi is scouting for dancers across Classical (Kathak, Odissi, Bharatnatyam), Western Contemporary, Lyrical, and Hip-Hop & Popping styles. Prepare a 90-second solo choreography or participate in our spot-freestyle cipher. Open to all year batches.',
    createdAt: '2026-02-07T10:00:00.000Z'
  },
  {
    id: 'evt-kronicle-debate',
    societyId: 'soc-kronicle',
    title: 'KIIT Parliamentary Debate Championship (KPDC 2026)',
    bannerImage: '/images/banners/debate.svg',
    date: '2026-10-28',
    time: '09:00 AM - 07:00 PM',
    venue: 'Campus 7, School of Law Moot Court',
    category: 'Competition',
    fullDescription: 'Eastern India’s most prestigious Asian Parliamentary debate competition returns. Teams of three will clash across 5 preliminary rounds on geopolitical policy, ethics, economics, and pop culture. Adjudicated by premier international debate adjudicators with ₹50,000 in speaker and team prizes.',
    createdAt: '2026-02-08T11:00:00.000Z'
  },
  {
    id: 'evt-fet-workshop',
    societyId: 'soc-fet',
    title: 'Smart Campus IoT: ESP32 & MQTT Protocol Lab',
    bannerImage: '/images/banners/iot_workshop.svg',
    date: '2026-10-22',
    time: '02:30 PM - 06:00 PM',
    venue: 'Campus 3, Room 214 Hardware Lab',
    category: 'Workshop',
    fullDescription: 'Hands-on practical session building wireless sensor nodes connected via MQTT to Grafana dashboards. Every participant team receives an ESP32 hardware kit with DHT22 temperature and ultrasonic distance sensors for the duration of the workshop.',
    createdAt: '2026-02-09T13:00:00.000Z'
  },
  {
    id: 'evt-korus-concert',
    societyId: 'soc-korus',
    title: 'Acoustic Nirvana: Unplugged Live Showcase',
    bannerImage: '/images/banners/acoustic_night.svg',
    date: '2026-10-30',
    time: '06:00 PM - 09:30 PM',
    venue: 'Campus 6, Open Air Amphitheatre',
    category: 'Cultural',
    fullDescription: 'An atmospheric autumn evening of acoustic harmonies, indie folk, and rock anthems under the stars. Free admission for all students and faculty with valid KIIT University identity cards. Food stalls and merchandise booths on site.',
    createdAt: '2026-02-10T16:00:00.000Z'
  },
  {
    id: 'evt-kas-recruitment',
    societyId: 'soc-kas',
    title: 'Formula Student & SAE Baja Team Inductions',
    bannerImage: '/images/banners/kas_induction.svg',
    date: '2026-10-15',
    time: '05:00 PM - 08:00 PM',
    venue: 'Campus 12, Mechanical Engineering Workshop',
    category: 'Recruitment',
    fullDescription: 'Want to design, weld, wire, and race actual open-wheel formula cars and off-road electric vehicles? KIIT Automobile Society is recruiting students for Powertrain & EV Battery Systems, Chassis & Rollcage Fabrication, Aerodynamics, and Suspension subsystems.',
    createdAt: '2026-02-11T17:00:00.000Z'
  },
  {
    id: 'evt-klarity-walk',
    societyId: 'soc-klarity',
    title: 'Heritage Bhubaneswar Photo Walk & Street Photography',
    bannerImage: '/images/banners/photowalk.svg',
    date: '2026-11-01',
    time: '06:30 AM - 11:30 AM',
    venue: 'Assembly at Campus 1 Main Gate (Transport Provided)',
    category: 'Cultural',
    fullDescription: 'Explore the ancient temple architecture and bustling morning flower markets of Old Town Bhubaneswar with veteran photographers. Learn manual camera settings, framing, golden-hour exposure, and visual storytelling. All equipment from smartphones to full-frame DSLRs welcome.',
    createdAt: '2026-02-12T18:00:00.000Z'
  }
];

export const INITIAL_PAST_EVENTS = [
  {
    id: 'past-krs-1',
    societyId: 'soc-krs',
    title: 'National Robocon 2025 National Finals',
    date: '2025-08-15',
    shortDescription: 'Team KRS secured 4th position nationally among 110 university teams with their dual-arm autonomous harvesting rover.',
    images: ['/images/gallery/krs_past1.svg', '/images/gallery/krs_past2.svg'],
    createdAt: '2025-08-20T10:00:00.000Z'
  },
  {
    id: 'past-gdsc-1',
    societyId: 'soc-gdsc',
    title: 'Google Cloud Community Day Bhubaneswar 2025',
    date: '2025-11-10',
    shortDescription: 'Over 800 attendees gathered at Campus 6 Auditorium for keynote sessions with Google Developer Experts.',
    images: ['/images/gallery/gdsc_past1.svg', '/images/gallery/gdsc_past2.svg'],
    createdAt: '2025-11-12T12:00:00.000Z'
  },
  {
    id: 'past-ecell-1',
    societyId: 'soc-ecell',
    title: 'KIIT E-Summit 2025',
    date: '2025-09-22',
    shortDescription: 'Welcomed 2,500+ delegates and disbursed ₹35 Lakhs in incubator grant awards to 7 promising student startups.',
    images: ['/images/gallery/ecell_past1.svg'],
    createdAt: '2025-09-25T14:00:00.000Z'
  },
  {
    id: 'past-kamakshi-1',
    societyId: 'soc-kamakshi',
    title: 'Spring Fest 2025 Choreography Runners-Up',
    date: '2025-01-28',
    shortDescription: 'Kamakshi’s eastern classical production "Ritu-Chakra" bagged the silver trophy at IIT Kharagpur.',
    images: ['/images/gallery/dance_past1.svg'],
    createdAt: '2025-02-01T10:00:00.000Z'
  },
  {
    id: 'past-kfoc-1',
    societyId: 'soc-kfoc',
    title: 'KIIT Fest 2025: Decade Edition',
    date: '2025-02-18',
    shortDescription: 'Three nights of thrilling techno-cultural events featuring international EDM headliners and 30,000 attendees.',
    images: ['/images/gallery/fest_past1.svg', '/images/gallery/fest_past2.svg'],
    createdAt: '2025-02-22T10:00:00.000Z'
  }
];

export async function getInitialAdmins() {
  const defaultPassword = 'kiitadmin2026';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  return INITIAL_SOCIETIES.map(soc => ({
    id: `admin-${soc.id}`,
    societyId: soc.id,
    adminCode: soc.adminCode,
    email: `admin.${soc.id.replace('soc-', '')}@kiit.ac.in`,
    passwordHash,
    role: 'society_admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  }));
}

export async function getInitialStudents() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('asim1179', salt);

  return [
    {
      id: 'usr-student-1',
      name: 'Asim',
      rollNumber: '251551179',
      email: '251551179@kiit.ac.in',
      branch: 'Computer Science & Engineering',
      year: '2nd Year',
      passwordHash,
      role: 'student',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-student-2',
      name: 'Priya Nayak',
      rollNumber: '23052140',
      email: 'priya.nayak@kiit.ac.in',
      branch: 'Electronics & Telecommunication',
      year: '2nd Year',
      passwordHash,
      role: 'student',
      createdAt: '2026-01-02T00:00:00.000Z'
    }
  ];
}
