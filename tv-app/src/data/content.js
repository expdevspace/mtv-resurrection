export const CATEGORIES = [
  'Cartoons', 'Comedy', 'Commercials', 'Drama', 'Gameshows', 
  'Kids', 'Movies', 'Music', 'News', 'Other', 
  'Soaps', 'Specials', 'Sports', 'Talkshows', 'Trailers'
];

export const MOCK_CHANNELS = {
  '80s': [
    { title: "Thriller", artist: "Michael Jackson", type: "Music", year: 1983 },
    { title: "Knight Rider", artist: "Intro", type: "Drama", year: 1982 },
    { title: "Transformers", artist: "G1 Intro", type: "Cartoons", year: 1984 },
    { title: "News 88", artist: "Live Report", type: "News", year: 1988 },
    { title: "Diet Coke", artist: "Commercial", type: "Commercials", year: 1986 }
  ],
  '90s': [
    { title: "Smells Like Teen Spirit", artist: "Nirvana", type: "Music", year: 1991 },
    { title: "Friends", artist: "Season 1", type: "Comedy", year: 1994 },
    { title: "Pokemon", artist: "Theme Song", type: "Cartoons", year: 1998 },
    { title: "Fresh Prince", artist: "Intro", type: "Comedy", year: 1990 },
    { title: "Matrix", artist: "Trailer", type: "Trailers", year: 1999 }
  ],
  '00s': [
    { title: "Blame It", artist: "Jamie Foxx", type: "Music", year: 2008 },
    { title: "SpongeBob", artist: "SquarePants", type: "Cartoons", year: 2001 },
    { title: "Halo 2", artist: "E3 Demo", type: "Gameshows", year: 2004 },
    { title: "American Idiot", artist: "Green Day", type: "Music", year: 2004 },
    { title: "The Office", artist: "Pilot", type: "Comedy", year: 2005 },
    { title: "iPod", artist: "Silhouette Ad", type: "Commercials", year: 2003 },
    { title: "Avatar", artist: "The Last Airbender", type: "Cartoons", year: 2005 },
    { title: "Dark Knight", artist: "Trailer", type: "Trailers", year: 2008 }
  ]
};

// Generate filler data
Object.keys(MOCK_CHANNELS).forEach(decade => {
  for(let i=0; i<100; i++) {
    const type = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    MOCK_CHANNELS[decade].push({
      title: `Channel ${i+10}`,
      artist: `Generic ${decade} Content`,
      type: type,
      year: parseInt(decade === '00s' ? 2000 : decade === '90s' ? 1990 : 1980) + Math.floor(Math.random()*10)
    });
  }
});
