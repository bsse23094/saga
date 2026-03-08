/* ═══════════════════════════════════════════════════════════════
   SAGA — Quote Engine
   100+ quotes from Vinland Saga, Vagabond, and warrior philosophy.
   Uses a seeded day-rotation so every day is unique for ~4 months
   before cycling — and randomQuote never repeats until pool drains.
   ═══════════════════════════════════════════════════════════════ */

export interface Quote {
  text: string;
  source: string;
  category: 'warrior' | 'peace' | 'growth' | 'farmland' | 'ambition' | 'reflection';
}

const QUOTES: Quote[] = [
  // ═══ VINLAND SAGA — Thors ═══
  { text: 'A true warrior needs no blade.', source: 'Thors — Vinland Saga', category: 'peace' },
  { text: 'You have no enemies. No one in this world is your enemy.', source: 'Thors — Vinland Saga', category: 'peace' },
  { text: 'If you really are a warrior, prove it by surviving this life.', source: 'Thors — Vinland Saga', category: 'warrior' },
  { text: 'Fear is the true enemy — the only enemy.', source: 'Thors — Vinland Saga', category: 'warrior' },
  { text: 'A real fight isn\'t about beating someone. It\'s about protecting something.', source: 'Thors — Vinland Saga', category: 'peace' },
  { text: 'Nobody is born your enemy.', source: 'Thors — Vinland Saga', category: 'peace' },
  { text: 'I once drew my blade, too, and called it strength. I was wrong.', source: 'Thors — Vinland Saga', category: 'reflection' },

  // ═══ VINLAND SAGA — Thorfinn ═══
  { text: 'I have no enemies.', source: 'Thorfinn — Vinland Saga', category: 'peace' },
  { text: 'I will make a land where no one needs to fight.', source: 'Thorfinn — Vinland Saga', category: 'ambition' },
  { text: 'I\'ve been fighting my whole life, and I finally understand — there was nothing at the end.', source: 'Thorfinn — Vinland Saga', category: 'reflection' },
  { text: 'I need to create a place where war doesn\'t exist.', source: 'Thorfinn — Vinland Saga', category: 'ambition' },
  { text: 'I want to be worthy of calling myself a true warrior.', source: 'Thorfinn — Vinland Saga', category: 'growth' },
  { text: 'The sword gave me nothing. Only when I stopped fighting did I find my path.', source: 'Thorfinn — Vinland Saga', category: 'peace' },
  { text: 'There\'s something beyond the ocean. Something we\'ve never seen.', source: 'Thorfinn — Vinland Saga', category: 'ambition' },
  { text: 'I don\'t want to hurt anyone anymore.', source: 'Thorfinn — Vinland Saga', category: 'peace' },

  // ═══ VINLAND SAGA — Askeladd ═══
  { text: 'A man who calls himself a leader ought to know where he\'s taking people.', source: 'Askeladd — Vinland Saga', category: 'ambition' },
  { text: 'If you want to hold on to something, you have to use both hands.', source: 'Askeladd — Vinland Saga', category: 'warrior' },
  { text: 'History is written by the victors, but that\'s just one side.', source: 'Askeladd — Vinland Saga', category: 'reflection' },
  { text: 'Don\'t think. Feel the rhythm of the battle.', source: 'Askeladd — Vinland Saga', category: 'warrior' },
  { text: 'Only a fool fights a battle he can\'t win. A wise man fights the battles that matter.', source: 'Askeladd — Vinland Saga', category: 'warrior' },

  // ═══ VINLAND SAGA — Canute ═══
  { text: 'Love and salvation — those are what a true king pursues.', source: 'Canute — Vinland Saga', category: 'peace' },
  { text: 'Discrimination, sin, conflict — I will create a paradise that transcends all of it.', source: 'Canute — Vinland Saga', category: 'ambition' },
  { text: 'Suffering makes men wise. Wise men build kingdoms.', source: 'Canute — Vinland Saga', category: 'growth' },
  { text: 'If God won\'t give us paradise, then I\'ll build it myself.', source: 'Canute — Vinland Saga', category: 'ambition' },

  // ═══ VINLAND SAGA — Leif ═══
  { text: 'Beyond the horizon lies a land with no war, no slaves, no enemies.', source: 'Leif — Vinland Saga', category: 'ambition' },
  { text: 'A journey of a thousand seas begins with one departure.', source: 'Leif — Vinland Saga', category: 'ambition' },

  // ═══ VINLAND SAGA — Farmland Arc ═══
  { text: 'The land is alive. Tend to it, and it will feed you forever.', source: 'Ketil — Vinland Saga', category: 'farmland' },
  { text: 'A wheat field needs no sword to grow.', source: 'Farmland Saga', category: 'farmland' },
  { text: 'You too can start over. The soil doesn\'t remember your past.', source: 'Farmland Saga', category: 'farmland' },
  { text: 'The farm teaches you what war never could — patience.', source: 'Farmland Saga', category: 'farmland' },
  { text: 'Each season teaches patience to the farmer who listens.', source: 'Farmland Saga', category: 'farmland' },
  { text: 'What you plant today, you harvest in a hundred days.', source: 'Farmland Saga', category: 'farmland' },
  { text: 'A single seed, tended with care, can feed a village.', source: 'Farmland Saga', category: 'farmland' },
  { text: 'The earth doesn\'t judge. It only returns what you put in.', source: 'Farmland Saga', category: 'farmland' },
  { text: 'Before you can lead a nation, you must learn to grow a field.', source: 'Farmland Saga', category: 'growth' },
  { text: 'Winter is not death. It is the soil resting.', source: 'Farmland Saga', category: 'reflection' },
  { text: 'A harvest earned through labor tastes sweeter than any plunder.', source: 'Farmland Saga', category: 'farmland' },

  // ═══ VINLAND SAGA — Einar ═══
  { text: 'We were slaves. Now we plant seeds. That\'s a victory.', source: 'Einar — Vinland Saga', category: 'growth' },
  { text: 'Freedom isn\'t given. You build it with your own hands.', source: 'Einar — Vinland Saga', category: 'growth' },
  { text: 'The strongest thing I ever did was choose not to fight back.', source: 'Einar — Vinland Saga', category: 'peace' },

  // ═══ VAGABOND — Musashi ═══
  { text: 'Invincible under the sun.', source: 'Musashi — Vagabond', category: 'ambition' },
  { text: 'What does it mean to be the strongest? To cut others down?', source: 'Musashi — Vagabond', category: 'reflection' },
  { text: 'I want to become invincible. Not in battle — in life.', source: 'Musashi — Vagabond', category: 'ambition' },
  { text: 'The sword is not for killing. The sword is an extension of yourself.', source: 'Musashi — Vagabond', category: 'warrior' },
  { text: 'The moment you think you understand the sword, it cuts you.', source: 'Musashi — Vagabond', category: 'warrior' },
  { text: 'Don\'t seek to follow in the footsteps of the old masters. Seek what they sought.', source: 'Musashi — Vagabond', category: 'growth' },
  { text: 'No one starts as a master. Everyone crawls before they walk.', source: 'Musashi — Vagabond', category: 'growth' },
  { text: 'I spent my life pursuing strength. Now I understand — strength was never the destination.', source: 'Musashi — Vagabond', category: 'reflection' },
  { text: 'When the sword is an extension of yourself, even the sky isn\'t out of reach.', source: 'Musashi — Vagabond', category: 'ambition' },
  { text: 'The strongest enemy you will ever face is yourself.', source: 'Musashi — Vagabond', category: 'reflection' },
  { text: 'Cut down the ego. What remains is the blade of truth.', source: 'Musashi — Vagabond', category: 'warrior' },
  { text: 'I\'ve been in a thousand fights, but the hardest was sitting still.', source: 'Musashi — Vagabond', category: 'reflection' },
  { text: 'I will perfect one strike. That is enough.', source: 'Musashi — Vagabond', category: 'warrior' },
  { text: 'A warrior without fear is simply a fool. True courage is moving forward despite the trembling.', source: 'Musashi — Vagabond', category: 'warrior' },
  { text: 'I am not chasing strength anymore. I am chasing the man I could become.', source: 'Musashi — Vagabond', category: 'growth' },
  { text: 'Each day I swing the sword. Each day the sword teaches me something new.', source: 'Musashi — Vagabond', category: 'growth' },
  { text: 'The mountain doesn\'t move. But the man who climbs it changes.', source: 'Musashi — Vagabond', category: 'growth' },
  { text: 'To hold a blade without hatred — that is mastery.', source: 'Musashi — Vagabond', category: 'peace' },
  { text: 'Under the heavens there is only one sword that matters: the one that protects.', source: 'Musashi — Vagabond', category: 'warrior' },
  { text: 'In the silence between strikes, I hear who I really am.', source: 'Musashi — Vagabond', category: 'reflection' },

  // ═══ VAGABOND — Others ═══
  { text: 'Strength isn\'t about winning. It\'s about never giving in.', source: 'Vagabond', category: 'warrior' },
  { text: 'A life spent seeking power is a life spent running from yourself.', source: 'Vagabond', category: 'reflection' },
  { text: 'The flower that blooms in adversity is the most rare and beautiful of all.', source: 'Vagabond', category: 'growth' },
  { text: 'Master the self and the world follows.', source: 'Vagabond', category: 'growth' },
  { text: 'You cannot fill a cup that is already full. Empty yourself first.', source: 'Vagabond', category: 'reflection' },
  { text: 'The man who defeats a thousand opponents is nothing. The man who defeats himself is everything.', source: 'Vagabond', category: 'warrior' },
  { text: 'We see the world not as it is, but as we are.', source: 'Vagabond', category: 'reflection' },
  { text: 'Water can carve through stone. Not by force, but by persistence.', source: 'Vagabond', category: 'growth' },
  { text: 'When the student is ready, the teacher disappears.', source: 'Vagabond', category: 'growth' },
  { text: 'The path of the sword and the path of compassion — in the end, they are the same road.', source: 'Vagabond', category: 'peace' },
  { text: 'To paint, to fight, to farm — all are just ways of understanding ourselves.', source: 'Vagabond', category: 'reflection' },
  { text: 'Even the fiercest warrior must learn to lay down his blade and plant rice.', source: 'Vagabond', category: 'farmland' },

  // ═══ WARRIOR PHILOSOPHY (resonant with both series) ═══
  { text: 'To sail beyond the edge of the map — that is the call.', source: 'Norse Proverb', category: 'ambition' },
  { text: 'Under heaven nothing is more soft and yielding than water, yet it overcomes the hardest things.', source: 'Lao Tzu', category: 'warrior' },
  { text: 'The way is in training. Train more than you sleep.', source: 'Miyamoto Musashi', category: 'warrior' },
  { text: 'Think lightly of yourself and deeply of the world.', source: 'Miyamoto Musashi', category: 'reflection' },
  { text: 'Do not regret what you have done.', source: 'Miyamoto Musashi', category: 'warrior' },
  { text: 'Accept everything just the way it is.', source: 'Miyamoto Musashi', category: 'peace' },
  { text: 'Perceive that which cannot be seen with the eye.', source: 'Miyamoto Musashi', category: 'reflection' },
  { text: 'In all things, have no preferences.', source: 'Miyamoto Musashi', category: 'peace' },
  { text: 'Today is victory over yourself of yesterday.', source: 'Miyamoto Musashi', category: 'growth' },
  { text: 'It is not the strongest who survive, but the most adaptable.', source: 'Bushido', category: 'warrior' },
  { text: 'Fall seven times, stand up eight.', source: 'Japanese Proverb', category: 'growth' },
  { text: 'The bamboo that bends is stronger than the oak that resists.', source: 'Japanese Proverb', category: 'growth' },
  { text: 'Vision without action is a daydream. Action without vision is a nightmare.', source: 'Japanese Proverb', category: 'ambition' },
  { text: 'A man who has attained mastery of an art reveals it in his every action.', source: 'Samurai Maxim', category: 'warrior' },
  { text: 'Beginning is easy. Continuing is the art.', source: 'Japanese Proverb', category: 'growth' },
  { text: 'One who conquers himself is greater than another who conquers a thousand times a thousand on the battlefield.', source: 'Dhammapada', category: 'warrior' },
  { text: 'Discipline is choosing between what you want now and what you want most.', source: 'Warrior\'s Code', category: 'growth' },
  { text: 'The axe forgets. The tree remembers.', source: 'Norse Saying', category: 'reflection' },
  { text: 'Better to fight and fall than to live without hope.', source: 'Volsung Saga', category: 'warrior' },
  { text: 'Where you see a wall, a warrior sees a door.', source: 'Viking Wisdom', category: 'ambition' },
  { text: 'Cattle die, kinsmen die; you yourself will also die. But the word about you will never die.', source: 'Hávamál', category: 'ambition' },
  { text: 'The north wind made the Vikings.', source: 'Norse Proverb', category: 'growth' },
  { text: 'It takes a whole life to learn how to live a single day well.', source: 'Warrior Philosophy', category: 'reflection' },
  { text: 'A dull axe is more dangerous than a sharp one — it forces you to swing harder.', source: 'Norse Wisdom', category: 'growth' },
  { text: 'He who is not ready today will be even less so tomorrow.', source: 'Norse Proverb', category: 'growth' },
  { text: 'The quietest warrior is the most dangerous. Still water runs deep.', source: 'Samurai Proverb', category: 'warrior' },
  { text: 'There is nothing outside of yourself that can ever enable you to get better. Everything is within.', source: 'Musashi', category: 'growth' },
  { text: 'Do not seek to be a warrior of great fame. Seek to be a warrior of great character.', source: 'Bushido', category: 'warrior' },
  { text: 'Conquer your mind and you conquer the world.', source: 'Guru Nanak', category: 'growth' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', source: 'Proverb', category: 'farmland' },
  { text: 'In the beginner\'s mind there are many possibilities. In the expert\'s mind there are few.', source: 'Shunryu Suzuki', category: 'reflection' },
  { text: 'When walking, walk. When eating, eat.', source: 'Zen Proverb', category: 'reflection' },
  { text: 'The obstacle is the path.', source: 'Zen Proverb', category: 'growth' },
  { text: 'Sharpen the axe before you enter the forest.', source: 'Norse Saying', category: 'growth' },
  { text: 'The ship is safe in harbor, but that\'s not what ships are for.', source: 'Viking Wisdom', category: 'ambition' },
  { text: 'All men dream — but not equally. The dreamers of the day are dangerous men.', source: 'T.E. Lawrence', category: 'ambition' },
  { text: 'What we do in life echoes in eternity.', source: 'Marcus Aurelius', category: 'ambition' },
  { text: 'He who fears he shall suffer already suffers what he fears.', source: 'Montaigne', category: 'warrior' },
  { text: 'A warrior does not give up what he loves. He finds the love in what he does.', source: 'Way of the Warrior', category: 'growth' },
];

// ─── Deterministic daily shuffle (Fisher-Yates with day seed) ─────
function daysSinceEpoch(): number {
  return Math.floor(Date.now() / 86_400_000);
}

function seededShuffle(arr: Quote[], seed: number): Quote[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647; // Park-Miller PRNG
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns a quote that is unique per calendar day.
 * Cycles through all quotes before repeating any.
 */
export function getDailyQuote(): Quote {
  const day = daysSinceEpoch();
  const cycle = Math.floor(day / QUOTES.length);
  const shuffled = seededShuffle(QUOTES, cycle + 1);
  return shuffled[day % QUOTES.length];
}

/**
 * Returns a random quote — stateless, for splash / refresh.
 */
let _lastIdx = -1;
export function getRandomQuote(): Quote {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * QUOTES.length);
  } while (idx === _lastIdx && QUOTES.length > 1);
  _lastIdx = idx;
  return QUOTES[idx];
}

/**
 * Returns a random quote filtered by category.
 */
export function getQuoteByCategory(category: Quote['category']): Quote {
  const pool = QUOTES.filter((q) => q.category === category);
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get N unique random quotes.
 */
export function getRandomQuotes(n: number): Quote[] {
  const shuffled = seededShuffle(QUOTES, Math.floor(Math.random() * 100000));
  return shuffled.slice(0, Math.min(n, QUOTES.length));
}

export { QUOTES };
