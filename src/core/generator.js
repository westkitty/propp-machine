// Seeded Proppian tale generator. Plans a function sequence that satisfies the strict grammar,
// fills roles from the data tables and renders prose from templates. Classic script.
(function (root) {
  'use strict';
  const P = root.Propp;

  // ---- prose templates -------------------------------------------------------------------
  // BASE is the first template set (v1). EXTRA was added after the first diversity measurement.
  // Syntax: {slot} fills a value; [a|b|c] picks one alternative (v2 only; v1 always takes the first).
  const BASE = {
    alpha: ['In {home} there lived {hero}, {epithet}.', 'Once, in {home}, lived {hero}, {epithet}.'],
    beta: ['One day {dispatcher} went away to market and did not come back for a long time.', 'Then {dispatcher} set off on business and left {hero} alone.'],
    gamma: ['“Listen,” said {dispatcher}, “{interdiction}.”', 'Before leaving, {dispatcher} warned {hero}: “{interdiction}.”'],
    delta: ['But {violator} forgot the warning at once.', 'Of course {violator} did exactly what was forbidden.'],
    epsilon: ['Meanwhile {villain} came sniffing round the house, asking questions.', '{Villain} sent a crow to find out where things were kept.'],
    zeta: ['A chattering neighbour told {villain} everything.', 'And so {villain} learned all that was needed.'],
    eta: ['{Villain} put on a kindly face and a borrowed voice.', '{Villain} came in disguise, holding out a sweet cake.'],
    theta: ['{Hero} believed every word.', '{Hero} took the cake and fell asleep.'],
    A_abduct: ['That night {villain}, {villainWhat}, carried off {sought} to {lair}.', 'Then {villain} came and took {sought} away.'],
    A_theft: ['Then {villain} came and stole {lack}, and the whole land went dim.', '{Villain}, {villainWhat}, stole {lack}.'],
    a: ['But the land lacked {lack}, and without it nothing was right.', 'Now {father} longed for {lack}, and grew thin with longing.'],
    B: ['{Dispatcher} called {hero} and said: “Go, and bring it back.”', 'The news went round, and at last it reached {hero}.'],
    C: ['“I will go,” said {hero}.', '{Hero} decided to set things right.'],
    up: ['So {hero} left home.', '{Hero} set out along the road.'],
    D: ['On the way {hero} met {donor} {donorWhere}, who said: “First, help me.”', 'There sat {donor} {donorWhere}, who asked {hero} a question.'],
    E_kind: ['{Hero} helped without complaint.', '{Hero} answered politely.'],
    E_clever: ['{Hero} found a clever answer.', '{Hero} solved the puzzle quickly.'],
    E_rude: ['{Hero} was rude and walked on.', '{Hero} laughed and refused.'],
    F: ['{Donor} gave {hero} {gift}.', 'In return {hero} received {gift}.'],
    G: ['Then {hero} travelled {realmWay}, and came to {realm}.', '{Hero} was led {realmWay} as far as {realm}.'],
    H_fight: ['{Villain} came out, and they fought.', '{Hero} and {villain} fought in the open field.'],
    H_contest: ['{Villain} proposed a contest.', '{Villain} challenged {hero} to a contest of riddles.'],
    H_trick: ['{Hero} tricked {villain} instead of fighting.', '{Hero} played a trick on {villain}.'],
    J: ['In the struggle {hero} was marked on the cheek.', '{Sought} tied a ribbon round {his} wrist.'],
    I: ['{Villain} was beaten.', 'And so {villain} was defeated.'],
    K_abduct: ['{Sought} was free.', 'Everything that had been taken was put right.'],
    K_theft: ['{Hero} found {lack} again.', 'Everything that had been taken was put right.'],
    down: ['{Hero} went home.', 'Then {hero} turned back toward {home}.'],
    Pr: ['{Villain} flew after {hero}.', 'Behind came {villain}, chasing.'],
    Rs: ['{Hero} {giftUse}, and escaped.', '{Helper} carried {hero} away to safety.'],
    o: ['{Hero} arrived home, but nobody knew {him}.', 'At home nobody recognised {hero}.'],
    L: ['{FalseHero} claimed the deed for {themselves}.', '{FalseHero} said that {they} had done everything.'],
    M: ['{Father} set a task: {task}.', 'There was one more task: {task}.'],
    N: ['With help from {helperShort}, the task was done.', 'The task was done by morning.'],
    Q: ['Then {sought} recognised {hero}.', 'Everyone recognised {hero} at last.'],
    Ex: ['{FalseHero} was exposed.', 'The lie of {falseHero} came out.'],
    T: ['{Helper} gave {hero} new clothes.', '{Hero} washed and became handsome.'],
    U: ['{Villain} {punishment}.', 'And {villain} {punishment}.'],
    W: ['{Hero} married {sought}, and there was a feast.', 'Then there was a wedding.'],
  };
  const EXTRA = {
    alpha: ['[Beyond the thrice-ninth land|Past three rivers and a rumour|Where the map gives up and the geese take over], in {home}, there [lived|once lived|was born] {hero}, {epithet}.', 'Nobody in {home} expected much of {hero}, {epithet}; [the cat least of all|the neighbours even less|{hero} least of all].', 'They still tell of {hero} in {home}: [the one|that one], {epithet}.'],
    beta: ['[At first frost|On the eve of the fair|When the bees went quiet], {dispatcher} [took a staff|packed three onions and a prayer] and went away, and the house felt [larger|hollow|watched].', 'Then {dispatcher} [fell ill and died|went off to sell a cow and a silence], and {hero} was left [in charge|alone with the stove].'],
    gamma: ['“[One thing|Only one thing|Mind this],” said {dispatcher}, [wagging a finger|not quite meeting {his} eyes|in the voice reserved for funerals]: “{interdiction}.”', 'There was a rule in that house, older than the roof: {interdiction}.', '{Dispatcher} [pinned a note to the door|scratched it into the table|sang it like a lullaby]: {interdiction}.'],
    delta: ['[Within the hour|By the third day|Before the porridge cooled], {violator} [did it anyway|broke the rule, as rules are broken|forgot, then remembered, then did it on purpose].', 'Forbidden things are heavy; {violator} [could not stop carrying this one|put it down in exactly the wrong place].', '[A small sound came from the green dark|Somewhere a door creaked that had no hinges], and {violator} [went to look|could not help looking].'],
    epsilon: ['[At dusk|Under the window|Out of the chimney soot], {villain} [listened|counted the family twice|asked the wind where the precious things were kept].', 'A [one-eyed|polite|very thin] stranger came asking [the way to the well|whose child that was|what the house was afraid of]. It was {villain}.'],
    zeta: ['The [goat|weathervane|youngest cousin] [could not keep a secret|told the stranger everything], and {villain} [smiled with too many teeth|wrote it on a fingernail].', 'What one hears at a keyhole is soon known in a lair: {villain} learned [it all|exactly enough].'],
    eta: ['“[Dear child|Little dove|Kind soul],” said {villain}, [wearing a grandmother’s voice like a shawl|offering a pie that steamed in the wrong direction], “[come closer|open the door|take a bite].”', '{Villain} [forged a voice at the smithy|borrowed a face from a sleeping woman|disguised {self} as a pedlar of ribbons].'],
    theta: ['And {hero}, [being kind|being sleepy|being {epithet2}], [did as asked|opened the door|took the bite].', '{Hero} [nodded|yawned|said yes], which was [the worst thing to say|exactly what was wanted].'],
    A_abduct: ['[That night|At the stroke of nobody’s clock|When the dogs fell silent], {villain}, {villainWhat}, [swept in|seeped under the door|came down the chimney] and [carried off|snatched away|wrapped up and took] {sought} to {lair}.', '[In the morning|Before cockcrow] there was a [cold|wet|scorched] place where {sought} had been. {Villain} had come.'],
    A_theft: ['{Villain} [stole|bit off|bottled up] {lack}, and [the cows gave sour milk|the clocks ran backwards|every candle in the land burned blue].'],
    a: ['[Something was missing|There was a gap in the world] the shape of {lack}, and {father} [could not sleep for it|talked of nothing else].', '“[Without|Lacking|Short of] {lack},” sighed {father}, “[a kingdom is just a field with a fence|we may as well eat the furniture].”'],
    B: ['{Dispatcher} [beat on a pan|rang the cracked bell|wept loudly in the square], and [{hero} heard|it was {hero} who answered].', '“[Who will go?|Is there anyone not busy?|Must I go myself, with my knees?]” cried {dispatcher}. [The brothers looked at the ceiling.|Even the cat looked away.|Only {hero} stood up.]'],
    C: ['“[Give me a crust and a blessing|I have nothing better to do|Well, somebody must], and I will go,” said {hero}.', '{Hero} [tightened {his} belt|put on {his} other boot|said a short rude prayer] and resolved to [try|go|set it right].'],
    up: ['[At dawn|With the crows for company|Before anyone could talk {him} out of it], {hero} [took the road|walked out of {home}|went where {his} feet pointed].', 'And {hero} [went|set off], [it may be near, it may be far|long or short, high or low]; the tale is quick, the road is not.'],
    D: ['[At a crossroads|Under a dripping fir|By a fire nobody had lit], {hero} met {donor} {donorWhere}. “[Do me a service|Answer me this|Carry my bundle a while],” it said, [and its eyes were very old|and the trees leaned in to listen].', '{Donor} {donorWhere} [barred the way|held out a cracked cup|asked for a name and a kindness]: “[First a task, then a road|Feed me, or pass on hungry yourself].”'],
    E_kind: ['{Hero} [shared the last crust|carried the bundle|mended the cup with a spit and a song], [without being asked twice|though it took all night].', '[Being {epithet2}|Since {pro} had been raised properly], {hero} [bowed low|said thank you to the trees|helped, and asked nothing].'],
    E_clever: ['{Hero} [thought sideways|answered with a question|counted the riddle’s teeth] and [found the trick of it|got it right on the third try].', '“[That one is easy|Ask me a harder one],” said {hero}, [and answered|and the answer was correct, which surprised everyone].'],
    E_rude: ['{Hero} [snorted|stepped over the bundle|said something about old age that should not be said], and walked on.', '“[I have no time for riddles|Find your own crust],” said {hero}. {Donor} [watched {him} go|said nothing, which was worse].'],
    F: ['{Donor} [pressed into {his} hand|pulled from a sleeve|coughed up, rather damply] {gift}. “[Use it once|It will know when|Do not thank me yet].”', '[From under the moss|Out of a knot in the wood], {donor} brought {gift}, and [the air smelled of thunder|somewhere a bell rang].'],
    G: ['[On the back of {helperShort}|Following a hare that was not a hare|Riding the wind’s spare horse], {hero} went {realmWay}, until [the road ran out|the stars changed] at {realm}.', 'So {hero} came to {realm}, [having gone|led] {realmWay}.'],
    H_fight: ['{Villain} [came out roaring|unfolded from the dark|rose up three heads high], and they fought [till the grass was flattened|from noon to nobody-knows], [maybe long, maybe short|while the crows kept score].', 'Iron met [bone|wax|brine]. {Hero} and {villain} [wrestled|struck and struck again] until [the hills complained|the moon came out to watch].'],
    H_contest: ['“[Let us not be vulgar|Fighting is for peasants],” said {villain}. “[Let us weigh ourselves on the great scales|A riddle-match, then: loser is eaten].”', '{Villain} set out [a board of black and bone|two bowls and a riddle|the scales of the dead], and they [played|matched wits] [three rounds|until the candle drowned].'],
    H_trick: ['“[Show me how it is done|I am too stupid to understand]," said {hero}, and {villain}, [vain as a peacock|eager to show off], [climbed in to demonstrate|leaned over the edge].', '{Hero} [hid in a cream jug|whispered the wrong name|mended the villain’s shadow badly on purpose], and {villain} [fell for it|went red, then grey].'],
    J: ['[In the fight|In the struggle], {villain} [scratched|scorched] {hero} [across the brow|on the palm]: a mark [that would matter later|like a little moon].', '{Sought} [tore a ribbon from {her} sleeve|pressed a ring] [onto {his} wrist|into {his} hand]. “[So I will know you|Keep this].”'],
    I: ['[With a last blow|With a sound like a wet bell|At the cock’s first crow], {villain} [was undone|burst into moths|melted into a puddle that complained].', '{Villain} [lost|was beaten fair, which was the bitter part], and [slunk away|went to pieces, quite literally].'],
    K_abduct: ['[The cage swung open|The spell came unstitched|The sunrise was let out of its sack], and {sought} [stepped out blinking|was free|laughed for the first time in a year].'],
    K_theft: ['[By the gift’s doing|By {helperShort}’s help|By nobody’s leave but {his} own], {hero} [won back|recovered] {lack}.'],
    down: ['[With the prize in {his} cap|Whistling, which was unwise], {hero} [turned for home|took the road back to {home}].', '[And so|Then|After that], {hero} [went back the way {pro} had come|came home by the short road, which is never short].'],
    Pr: ['[Behind them the sky went dark|Then came a sound of gnawing|The road began to smell of brine]: {villain} was [coming after them|in pursuit|following, and fast].', '{Villain} [flew in a mortar|rolled like a fog|scuttled on a hundred borrowed legs] after {hero}, [shrieking|singing a lullaby, which was worse].'],
    Rs: ['{Hero} {giftUse}, and {villain} [was stuck behind it for three days|had to go round, grumbling].', '[Just in time|At the last breath|When the teeth were an inch away], {helperShort} [snatched {hero} up|hid {him} in a cuckoo’s egg|turned {him} into a spoon nobody looks at].'],
    o: ['{Hero} came back [in rags|as a cook’s boy|with a beard of dust], and [nobody knew {him}|the dog alone wagged].', '[Unknown|Unrecognised|Unremembered], {hero} took work [in the royal kitchen|with a cobbler|minding geese] and waited.'],
    L: ['{FalseHero} [swaggered into court|polished {their} boots] and [claimed|announced] the deed [as {their} own|loudly].', '“[It was us|It was I|Who else?],” said {falseHero}, and [the court believed it|the Tsar clapped, slowly].'],
    M: ['{Father} [stroked {his} beard|tapped the table three times]. “[Whoever can manage this|One small trial]: {task}.”', '[One more trial was set|The court demanded proof]: {task}.'],
    N: ['[With {helperShort}’s help|With the gift’s help|By luck and stubbornness], {hero} [did it before the cock crowed|did it, and yawned].', '[By morning|Overnight|Before the candle was half gone] the task was done, [neatly|with a little left over].'],
    Q: ['{Sought} [saw the mark|saw the ribbon|looked twice] and cried, “[It is you!|This is the one!]”', '[By the mark|By the deed|By {his} old crooked grin], they knew {hero} at last.'],
    Ex: ['[The truth came out like a cat from a sack|The lie fell over by itself]: {falseHero} [had done nothing at all|had spent the whole time hiding].', '{FalseHero} [went red|tried to slip out by the scullery], but [everyone had seen|the goose remembered].'],
    T: ['{Hero} [bathed in the milk of a white mare|stepped through {helperShort}’s ear and out the other] and came out [handsome|glowing like a new kopeck].', '[New boots|A coat of the softest night|A crown that fitted, for once] [appeared|were waiting] for {hero}.'],
    U: ['[As for|And] {villain}: {villain} {punishment}.', '[Justice in that kingdom was strange but thorough|Nobody was sorry]: {villain} {punishment}.'],
    W: ['[So {hero} married {sought}|There was a wedding], [and I was there, and drank mead; it ran down my beard but never reached my mouth|with pancakes stacked to the rafters|and the bells were rung so hard that one ran away].', '{Hero} and {sought} [were wed|ruled together], and [lived long|are living still, if they have not died].'],
  };
  const OPENERS = ['', '', '', 'Meanwhile, ', 'Not long after, ', 'So it was that ', 'And ', 'By then ', 'Well: '];
  // v3: openers are rarer and drawn from a wider pool.
  const OPENERS3 = ['Meanwhile, ', 'Not long after, ', 'And ', 'Well, ', 'Now ', 'Before long ', 'In time ', 'That same week ', 'As it happened, ', 'Wouldn’t you know it, ', 'Three days later ', 'Then, ', 'Of course ', 'Naturally, '];

  function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  const SHORT_FORMS = { hero: (c) => [c.heroShort, c.heroShort, c.heroShort, c.pro === 'she' ? 'the girl' : 'the lad', 'our ' + c.heroShort], villain: (c) => [c.villainShort] };
  function expand(tpl, ctx, r, key, v2) {
    let n = 0;
    const v3 = v2 === 'v3';
    let s = tpl.replace(/\[([^\]]+)\]/g, (_, alts) => { const opts = alts.split('|'); return v2 ? opts[r.int(key + ':alt' + n++, opts.length)] : opts[0]; });
    s = s.replace(/\{(\w+)\}/g, (_, k) => {
      const lower = k[0].toLowerCase() + k.slice(1);
      let val = ctx[k] != null ? ctx[k] : ctx[lower];
      if (val == null) return '{' + k + '}';
      if (v3 && SHORT_FORMS[lower] && ctx._seen) {
        if (ctx._seen[lower]) { const forms = SHORT_FORMS[lower](ctx); val = forms[r.int(key + ':nm' + n++, forms.length)]; }
        ctx._seen[lower] = true;
      }
      return k[0] === k[0].toUpperCase() && ctx[k] == null ? cap(val) : val;
    });
    return s;
  }
  const NAME_KEYS = ['hero', 'villain', 'sought', 'father', 'donor', 'helper', 'dispatcher', 'falseHero'];
  function phrase(name, ctx, r, key, v2, noOpener) {
    const list = v2 ? BASE[name].concat(EXTRA[name] || []) : BASE[name];
    const tpl = list[r.int(key + ':tpl', list.length)];
    let s = expand(tpl, ctx, r, key, v2);
    if (v2 && !noOpener) {
      const op = v2 === 'v3' ? (r.chance(key + ':op?', 0.22) ? OPENERS3[r.int(key + ':open', OPENERS3.length)] : '') : OPENERS[r.int(key + ':open', OPENERS.length)];
      const startsWithName = NAME_KEYS.some((k) => ctx[k] && s.startsWith(cap(ctx[k])) && /^[A-Z]/.test(ctx[k]));
      const connective = /^(Then|And|So|Meanwhile|By|Before|At|With|In|On|When|Within|Just|Up|Behind|Somehow|After|Once|Of|Not|Well|Under|Out|From|Past|Beyond|Where|There|One|Nobody|Justice|As)\b/.test(s);
      const common = /^(The|A|An|It|Everything|Everyone|Iron|What|New|His|Her|Being|Since|Forbidden|Something|Following|Unknown|Unrecognised|Unremembered|Nobody|There)\b/.test(s);
      if (op && !connective && /^[A-Z]/.test(s)) s = op + (common && !startsWithName ? s[0].toLowerCase() + s.slice(1) : s);
    }
    return s;
  }

  // ---- cast ------------------------------------------------------------------------------
  function cast(r) {
    const T = P.tables;
    const hero = r.pick('cast.hero', T.heroes);
    const she = hero.pro === 'she';
    const villain = r.pick('cast.villain', T.villains);
    const donor = r.pick('cast.donor', T.donors);
    const helper = r.pick('cast.helper', T.helpers);
    const sought = r.pick('cast.sought', T.sought);
    const dispatcher = r.pick('cast.dispatcher', T.dispatchers);
    const fh = r.pick('cast.falseHero', T.falseHeroes);
    const offered = []; const pool = T.gifts.slice();
    for (let i = 0; i < 3; i++) offered.push(pool.splice(r.int('cast.gift' + i, pool.length), 1)[0]);
    return {
      hero: hero.name, heroShort: hero.short, villainShort: villain.short, villainKind: villain.what.split(' ').slice(1, 3).join(' ').replace(/ (who|with|made|of|and)$/, ''), epithet: hero.epithet, epithet2: ['stubborn', 'kind', 'curious', 'hungry', 'polite'][r.int('cast.ep2', 5)],
      pro: hero.pro, him: she ? 'her' : 'him', his: she ? 'her' : 'his', her: 'her', self: villain.name.startsWith('the Widow') || villain.name.startsWith('Grandmother') ? 'herself' : 'himself',
      vhim: /^(the Widow|Grandmother)/.test(villain.name) ? 'her' : 'him', villain: villain.name, villainWhat: villain.what, lair: villain.lair,
      donor: donor.name, donorWhere: donor.where,
      helper: helper.name, helperShort: helper.short,
      sought: sought.name, soughtWhat: sought.what, father: sought.father,
      dispatcher: dispatcher.name,
      falseHero: fh.name, they: fh.plural ? 'they' : 'he', their: fh.plural ? 'their' : 'his', themselves: fh.plural ? 'themselves' : 'himself',
      home: r.pick('cast.home', T.homes),
      lack: r.pick('cast.lack', T.lacks),
      interdiction: r.pick('cast.interdiction', T.interdictions),
      task: r.pick('cast.task', T.tasks),
      punishment: r.pick('cast.punishment', T.punishments).replace('{vhim}', /^(the Widow|Grandmother)/.test(villain.name) ? 'her' : 'him'),
      offered,
    };
  }

  const CHOICES = {
    interdiction: { at: 'gamma', prompt: 'Will the hero keep the rule?', options: [['obey', 'Keep the rule'], ['disobey', 'Break it']] },
    donorTest: { at: 'D', prompt: 'How does the hero answer the stranger?', options: [['kind', 'Kindly'], ['clever', 'Cleverly'], ['rude', 'Rudely']] },
    gift: { at: 'F', prompt: 'Which gift does the hero take?', options: null },
    path: { at: 'up', prompt: 'Which road?', options: [['forest', 'The forest road'], ['sea', 'The sea road'], ['below', 'The road down under the earth']] },
    confront: { at: 'H', prompt: 'How does the hero face the villain?', options: [['fight', 'Fight'], ['contest', 'Accept a contest'], ['trick', 'Try a trick']] },
  };

  // ---- planning --------------------------------------------------------------------------
  function plan(seed, opts) {
    opts = opts || {};
    const r = P.prng.streams(seed);
    const play = !!opts.playable;
    const ctx = cast(r);
    const ch = Object.assign({}, opts.choices || {});
    const decide = (k) => {
      if (ch[k] == null) {
        const c = CHOICES[k];
        const options = k === 'gift' ? ctx.offered.map((g) => g.id) : c.options.map((o) => o[0]);
        // Non-interactive default: rude answers are rarer than kind ones.
        if (k === 'donorTest') ch[k] = r.float('choice.' + k) < 0.15 ? 'rude' : (r.float('choice.' + k + '2') < 0.5 ? 'kind' : 'clever');
        else ch[k] = options[r.int('choice.' + k, options.length)];
      }
      return ch[k];
    };
    const m1 = [];
    const push = (mv, f, extra) => mv.push(Object.assign({ f }, extra || {}));
    push(m1, 'alpha');
    if (r.chance('p.beta', 0.55)) push(m1, 'beta');
    if (play || r.chance('p.gd', 0.5)) { push(m1, 'gamma', { choice: 'interdiction' }); push(m1, 'delta'); }
    if (r.chance('p.ez', 0.35)) { push(m1, 'epsilon'); push(m1, 'zeta'); }
    const tricked = r.chance('p.et', 0.35);
    if (tricked) { push(m1, 'eta'); push(m1, 'theta'); }
    const villainy = tricked || r.chance('p.A', 0.6);
    push(m1, villainy ? 'A' : 'a');
    ctx.kMode = villainy && r.chance('p.abduct', 0.6) ? 'abduct' : 'theft';
    if (r.chance('p.B', 0.85)) push(m1, 'B');
    if (r.chance('p.C', 0.75)) push(m1, 'C');
    push(m1, 'up', { choice: 'path' });
    let hasF = false;
    if (play || r.chance('p.D', 0.8)) {
      push(m1, 'D', { choice: 'donorTest' });
      push(m1, 'E');
      if (decide('donorTest') !== 'rude') { push(m1, 'F', { choice: 'gift' }); hasF = true; }
    }
    if (play || r.chance('p.G', 0.7)) push(m1, 'G');
    let hasJ = false;
    if (play || r.chance('p.H', 0.65)) {
      push(m1, 'H', { choice: 'confront' });
      if (r.chance('p.J', 0.3)) { push(m1, 'J'); hasJ = true; }
      push(m1, 'I');
    }
    push(m1, 'K');
    const home = r.chance('p.down', 0.9);
    if (home) push(m1, 'down');
    if (home && r.chance('p.PrRs', 0.4)) { push(m1, 'Pr'); push(m1, 'Rs'); }
    const moves = [m1];
    let last = m1;
    const second = home && r.chance('p.move2', 0.3);
    if (second) {
      const m2 = [];
      push(m2, 'A', { variant: 'betrayal' });
      if (r.chance('p.D2', 0.4)) { push(m2, 'D', { second: true }); push(m2, 'E', { second: true }); push(m2, 'F', { second: true }); }
      if (r.chance('p.G2', 0.35)) push(m2, 'G', { second: true });
      push(m2, 'K', { second: true });
      if (r.chance('p.down2', 0.75)) {
        push(m2, 'down', { second: true });
        if (r.chance('p.PrRs2', 0.3)) { push(m2, 'Pr', { second: true }); push(m2, 'Rs', { second: true }); }
      }
      moves.push(m2); last = m2;
    } else if (!home && r.chance('p.lostMove', 0.5)) {
      // The hero stays abroad: a new lack arises there (a bride for the stranger-hero).
      const m2 = [];
      push(m2, 'a', { variant: 'abroad' });
      if (r.chance('p.B2', 0.5)) push(m2, 'B', { second: true });
      push(m2, 'K', { second: true, variant: 'abroad' });
      moves.push(m2); last = m2;
    }
    if (r.chance('p.o', home ? 0.35 : 0.6)) push(last, 'o');
    const hasL = r.chance('p.L', second ? 0.85 : 0.4);
    if (hasL) push(last, 'L');
    let hasN = false;
    if (r.chance('p.MN', hasL ? 0.7 : 0.45)) { push(last, 'M'); push(last, 'N'); hasN = true; }
    if ((hasJ || hasN) && r.chance('p.Q', 0.9)) push(last, 'Q');
    if (hasL) push(last, 'Ex');
    if (r.chance('p.T', 0.3)) push(last, 'T');
    if (r.chance('p.U', 0.75)) push(last, 'U');
    if (r.chance('p.W', 0.9)) push(last, 'W');
    // resolve choices that the plan uses (so every tale is fully determined)
    for (const mv of moves) for (const e of mv) if (e.choice) decide(e.choice);
    const gift = ctx.offered.find((g) => g.id === ch.gift) || ctx.offered[0];
    Object.assign(ctx, { gift: gift.name, giftUse: hasF ? gift.use : 'ran faster than fear', realm: P.tables.realms[ch.path].name, realmWay: P.tables.realms[ch.path].way });
    ctx.violator = ch.interdiction === 'obey' ? ['the youngest cousin', 'the house cat', 'a visiting aunt'][r.int('violator', 3)] : ctx.hero;
    if (!hasF) ctx.helperShort = 'sheer stubbornness';
    return { seed: String(seed), moves, ctx, choices: ch, hasF };
  }

  // ---- rendering -------------------------------------------------------------------------
  function render(p, opts) {
    const v2 = !opts || !opts.templates || opts.templates === 'v3' ? 'v3' : opts.templates === 'v1' ? false : true;
    const r = P.prng.streams(p.seed + '#prose');
    const ctx = Object.assign({}, p.ctx, { _seen: {} });
    const pages = [];
    let pos = 0;
    p.moves.forEach((mv, m) => mv.forEach((e) => {
      const key = 'p' + pos;
      let name = e.f;
      if (e.f === 'E') name = 'E_' + (e.second ? 'kind' : p.choices.donorTest);
      if (e.f === 'H') name = 'H_' + p.choices.confront;
      if (e.f === 'A') name = 'A_' + ctx.kMode;
      if (e.f === 'K') name = 'K_' + (mv[0] && mv.some((x) => x.f === 'A') ? ctx.kMode : 'theft');
      let pre = '';
      let post = '';
      if (e.f === 'A' && e.variant === 'betrayal') {
        pre = expand(v2 ? '[On the way home|Within sight of the roofs of home], {falseHero} [pushed {hero} down a well|cut the rope and left {hero} in the pit|sold {hero} to a passing bear] and [took the prize|went home with the credit].' : '{FalseHero} betrayed {hero} and took the prize.', ctx, r, key + 'b', v2);
      } else if (e.f === 'gamma') {
        pre = phrase('gamma', ctx, r, key, v2);
        post = p.choices.interdiction === 'obey' ? expand(v2 ? '{Hero} [promised|crossed {his} heart|nodded very seriously], and meant it.' : '{Hero} promised.', ctx, r, key + 'post', v2) : expand(v2 ? '{Hero} [nodded|said “Of course”], [already wondering|and began to wonder at once].' : '{Hero} nodded.', ctx, r, key + 'post', v2);
      } else if (e.f === 'F') {
        pre = expand(v2 ? '{Donor} [opened a sack|unfolded a rag] that held three things: ' : '{Donor} showed three things: ', ctx, r, key + 'pre', v2) + ctx.offered.map((g) => g.name).join('; ') + '.';
        post = phrase('F', ctx, r, key, v2);
      } else if (e.f === 'up') {
        pre = phrase('up', ctx, r, key, v2);
        post = expand(v2 ? '[At the crossroads stone|Where three ways met|Past the post with the rude carving|When the road split like a lizard’s tongue], {hero} [chose|took] the road [{realmWay}|that went {realmWay}].' : '{Hero} took the road {realmWay}.', ctx, r, key + 'post', v2);
      } else if (e.f === 'K' && e.second) {
        pre = expand(v2 ? '[Up out of the dark|Somehow|With help from {helperShort}], {hero} [climbed free|came back into the light], [thinner but alive|cross but whole].' : '{Hero} escaped.', ctx, r, key, v2);
      } else if (e.f === 'down' && e.second) {
        pre = expand(v2 ? '{Hero} [came home a second time|walked home again, angrier than before].' : '{Hero} came home again.', ctx, r, key, v2);
      } else if (e.variant === 'abroad' && e.f === 'a') {
        pre = expand(v2 ? '[Far from home|In {realm}], {hero} [found a court|met a king] [in want of a son-in-law with nerve|short of exactly one brave fool].' : '{Hero} stayed abroad, where a king lacked an heir.', ctx, r, key, v2);
      } else if (e.variant === 'abroad' && e.f === 'K') {
        pre = expand(v2 ? '[The king looked {hero} up and down and|The court held a vote and] [decided {pro} would do|found no better candidate].' : 'The king chose {hero}.', ctx, r, key, v2);
      } else if (e.second && (e.f === 'G' || e.f === 'Pr' || e.f === 'Rs' || e.f === 'B')) {
        const lines = { G: '[{HelperShort} found {hero} and carried {him} by back ways|A stray thread of the road led {hero} on].', Pr: '{FalseHero} [heard of it and came running|sent dogs after {hero}].', Rs: '[{Hero} hid in a haystack until the dogs grew bored|A kind miller turned {hero} into a sack of flour for an afternoon].', B: 'Word reached {hero} that the court was waiting.' };
        pre = expand(v2 ? lines[e.f] : lines[e.f].replace(/\[([^|\]]+)[^\]]*\]/g, '$1'), ctx, r, key, v2);
      } else if (e.f === 'H') {
        pre = expand(v2 ? '[At last|There at the heart of {realm}|In the very middle of {lair}], {hero} stood before {villain}.' : '{Hero} found {villain}.', ctx, r, key + 'pre', v2);
        post = phrase(name, ctx, r, key, v2);
      } else {
        pre = phrase(name, ctx, r, key, v2, pos === 0);
      }
      pages.push({ pos, move: m, f: e.f, choice: e.choice || null, pre, post });
      pos++;
    }));
    return pages;
  }

  function generate(seed, opts) {
    opts = opts || {};
    const p = plan(seed, opts);
    const pages = render(p, opts);
    const text = pages.map((pg) => (pg.pre + (pg.post ? ' ' + pg.post : '')).trim()).join(' ');
    return { seed: p.seed, moves: p.moves.map((mv) => mv.map((e) => e.f)), choices: p.choices, cast: p.ctx, pages, text };
  }

  root.Propp = Object.assign(root.Propp || {}, { generator: { generate, plan, render, CHOICES, BASE, EXTRA } });
})(typeof globalThis !== 'undefined' ? globalThis : this);
