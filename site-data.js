// Intro and contact details supplied by Pradyun; original portfolio content below.
// Public site: https://pradyun-singh.vercel.app/
window.portfolioData = {
  name: 'Pradyun Singh',
  firstName: 'Pradyun',
  bio: "I'm a software engineer in the Bay Area. Lately, I've been going deep on machine learning, with a focus on model training and evaluation.",
  background: 'Previously, I built backend systems and AI tools at an AI startup, from LLM pipelines and evals to payments and data infrastructure.',
  email: 'pradyun.singh23@gmail.com',
  links: [
    { label: 'GitHub', url: 'https://github.com/pradyuns' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/pradyun-s-22a981321/' },
    { label: 'Email', url: 'mailto:pradyun.singh23@gmail.com' },
  ],
  experience: [
    { company: 'Verita AI', logoUrl: './assets/logos/verita.svg', role: 'Software Engineer', period: 'Apr - Oct 2026' },
    { company: 'GSPANN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Gspann-logo.svg', logoCrop: true, role: 'Software Engineer Intern', period: 'Jun - Aug 2025' },
    { company: 'ON24', logoUrl: 'https://companieslogo.com/img/orig/ONTF-e4ed83bd.svg', role: 'Data Science Intern, AI/ML', period: 'May - Aug 2024' },
    { company: 'UC Davis', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/The_University_of_California_Davis.svg', logoFallbackUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/The_University_of_California_Davis.svg/960px-The_University_of_California_Davis.svg.png', role: 'B.S. Computer Science', period: '2022–2026' },
  ],
  projects: [
    { name: 'Shadow', description: 'Competitor intelligence platform: scrapes pages, detects meaningful changes, and routes alerts.', url: 'https://github.com/pradyuns/shadow' },
    { name: 'Visual Agent Debugger', description: 'A local-first debugger for stepping through recorded AI agent traces and comparing runs.', url: 'https://github.com/pradyuns/visual-agent-debugger' },
    { name: 'Fan Experience Agent', description: 'An agentic system that turns ticket purchases into personalized pre-event dining plans.', url: 'https://github.com/pradyuns/fan-experience-agent' },
  ],
  // Add notes as { title, date, paragraphs: ['First paragraph.', 'Next paragraph.'] }.
  notes: [
  {
      "title": "hello world",
      "date": "Nov 6, 2026",
      "paragraphs": [
          "In high school, I hated the idea of sitting behind a computer coding all day. I wanted to study science and help people through medicine. I was dead set on biochemistry, and when I got to college, I went all in. I joined pre-med clubs, volunteered at hospitals, did research, shadowed doctors, the whole nine yards. For about a year and a half, that was my whole life before things started to slowly shift.",
          "I wouldn’t say there was a singular moment that made me change my mind. Over time, I kept noticing how much computer science was changing medicine, and honestly, my day to day life too. Pretty much every idea I had for something I wanted to build seemed to involve code in one way or another. I also took an introductory Python course at the beginning of my second year and realized programming wasn’t nearly as bad as I imagined.",
          "The problem was that it was already winter quarter of my second year, and up until then, pretty much everything I'd done had been geared toward medicine. I had straight A’s that I worked really hard for and I only knew how to create basic Python programs. However, I decided the opportunity was simply too big to pass up. I knew I would always regret not giving it a shot and would be stuck living in the “what if” land.",
          "So I switched.",
          "I worked my butt off to graduate on time, get some internship experience, and eventually found myself working a full-time 9-9-6 engineering job while finishing my last couple months of college.",
          "Looking back, I don’t think what drew me to medicine and technology was all that different. I have always been curious to learn how things work, and technology just gave me a different way to explore that.",
          "Lately, AI has made it easier than ever to build software, but there is a difference between making a working product and creating something people enjoy using. I think about that gap a lot when I am working on evals or my own projects.",
          "I'm still learning how to close that gap, and I think that's part of what makes building things interesting. This is my first note and now I spend most of my days sitting behind a computer :)",
          "More notes are on the way soon too!"
      ]
  },
  ],
  // Preserve the original gallery order. Thumbnails keep the gallery light;
  // opening a photograph loads the original file.
  photos: [
    { src: './assets/photos/photo-02.jpg', thumbnail: './assets/photos/thumbs/photo-02.jpg', width: 1350, height: 1800, alt: 'Golden light over fog-covered hills, framed by tree branches', caption: 'views from mt.tam' },
    { src: './assets/photos/photo-03.jpg', thumbnail: './assets/photos/thumbs/photo-03.jpg', width: 1350, height: 1800, alt: 'Waterfalls flowing into a deep, green-sided mountain gorge', caption: 'waterfalls in Norway' },
    { src: './assets/photos/photo-04.jpg', thumbnail: './assets/photos/thumbs/photo-04.jpg', width: 1350, height: 1800, alt: 'A city skyline lit up against the night sky', caption: 'the city' },
    { src: './assets/photos/photo-01.jpg', thumbnail: './assets/photos/thumbs/photo-01.jpg', width: 1350, height: 1800, alt: 'Warm light illuminating curved orange sandstone walls', caption: 'canyons' },
    { src: './assets/photos/photo-05.jpg', thumbnail: './assets/photos/thumbs/photo-05.jpg', width: 1800, height: 1690, position: '65% center', alt: 'A black dog resting on green grass', caption: 'dog!' },
    { src: './assets/photos/photo-06.jpg', thumbnail: './assets/photos/thumbs/photo-06.jpg', width: 1350, height: 1800, alt: 'Sunset over a lake surrounded by rolling hills', caption: 'sunset' },
    { src: './assets/photos/photo-07.jpg', thumbnail: './assets/photos/thumbs/photo-07.jpg', width: 1350, height: 1800, alt: 'A white rowboat tied to a dock on a blue lake', caption: 'by the dock' },
    { src: './assets/photos/photo-08.jpg', thumbnail: './assets/photos/thumbs/photo-08.jpg', width: 1299, height: 1800, alt: 'A close-up of a black dog resting indoors', caption: 'dog again :)' },
    { src: './assets/photos/photo-09.jpg', thumbnail: './assets/photos/thumbs/photo-09.jpg', width: 1350, height: 1800, alt: 'A child holding a swimming certificate beside an indoor pool', caption: 'my swimming days' },
  ],
};
