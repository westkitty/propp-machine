// Original data tables for the generator: characters, places, objects, gifts. Tone: funny and eerie.
// All names and descriptions are original to this project.
(function (root) {
  'use strict';
  const T = {
    heroes: [
      { name: 'Ivashka Ninth-Son', short: 'Ivashka', epithet: 'who slept on the stove for nineteen winters', pro: 'he' },
      { name: 'Marfa Sootfoot', short: 'Marfa', epithet: 'who could whistle in three directions at once', pro: 'she' },
      { name: 'Tikhon Who Counts Crows', short: 'Tikhon', epithet: 'who had never once finished counting', pro: 'he' },
      { name: 'Dunya of the Leaky Bucket', short: 'Dunya', epithet: 'whose bucket leaked only lies', pro: 'she' },
      { name: 'Prokop Half-Asleep', short: 'Prokop', epithet: 'who was brave only before breakfast', pro: 'he' },
      { name: 'Yelena Thimble-Eyes', short: 'Yelena', epithet: 'who could see a needle think', pro: 'she' },
      { name: 'Savva the Turnip-Brave', short: 'Savva', epithet: 'who once outstared a turnip', pro: 'he' },
      { name: 'Agafya Last-of-Eleven', short: 'Agafya', epithet: 'whom nobody remembered to name until she was six', pro: 'she' },
      { name: 'Kuzma Crookedcap', short: 'Kuzma', epithet: 'whose hat pointed always toward trouble', pro: 'he' },
      { name: 'Olya Ashpocket', short: 'Olya', epithet: 'who kept a live coal in her apron for luck', pro: 'she' },
    ],
    villains: [
      { name: 'Grandmother Ninetoes', short: 'Ninetoes', what: 'a witch who lived in a hut that paced like a dog', lair: 'her pacing hut' },
      { name: 'Zmei Pickleback', short: 'Pickleback', what: 'a salt-green serpent with three heads and one opinion', lair: 'a cave that smelled of brine' },
      { name: 'Count Moth', short: 'the Count', what: 'a lord made of dust and good manners', lair: 'a castle where every candle was afraid' },
      { name: 'the Tallow King', short: 'the waxen king', what: 'a monarch who melted a little whenever he lied', lair: 'a palace of dripping wax' },
      { name: 'Bonelace the Deathless', short: 'Bonelace', what: 'a sorcerer who kept his death somewhere sensible', lair: 'a fortress stitched from bones' },
      { name: 'the Widow of the Well', short: 'the Widow', what: 'a wet grey woman who lived under the bucket', lair: 'the bottom of the old well' },
      { name: 'Old Hungry Mist', short: 'the Mist', what: 'a fog with teeth and an appetite for names', lair: 'the marsh where the road gave up' },
    ],
    donors: [
      { name: 'an old woman knitting fog', where: 'on a stump at the edge of the road' },
      { name: 'a ferryman with no shadow', where: 'at a river that had forgotten its other bank' },
      { name: 'a hedgehog wearing a bishop’s hat', where: 'under a cart that had no wheels' },
      { name: 'a birch tree with a terrible cough', where: 'in a clearing full of polite mushrooms' },
      { name: 'the Grandmother of Owls', where: 'in a hut built entirely of locked doors' },
      { name: 'a drowned soldier who still kept watch', where: 'beside a lake as flat as a coin' },
    ],
    helpers: [
      { name: 'a horse made of rain', short: 'the rain-horse' },
      { name: 'a talkative skull with lantern eyes', short: 'the skull' },
      { name: 'a goose who used to be a judge', short: 'the judge-goose' },
      { name: 'a grey wolf in spectacles', short: 'the wolf' },
      { name: 'a cat with nine lives, six already spent', short: 'the cat' },
      { name: 'a little wooden doll that ate porridge', short: 'the doll' },
    ],
    sought: [
      { name: 'Tsarevna Lumina', what: 'who never blinked', father: 'the Tsar of the Soup Kingdom' },
      { name: 'the Moonmiller’s daughter', what: 'who ground moonlight into flour', father: 'the Moonmiller' },
      { name: 'Princess Vasilka the Unhurried', what: 'who answered questions a week late', father: 'King Barley the Bald' },
      { name: 'Tsarevich Lev Pale-Hands', what: 'who could not bear the sound of spoons', father: 'the Tsaritsa of Nine Rivers' },
    ],
    dispatchers: [
      { name: 'old father Foma', role: 'father' },
      { name: 'the hero’s grandmother', role: 'grandmother' },
      { name: 'the village elder with the brass ear-trumpet', role: 'elder' },
      { name: 'a widowed Tsar', role: 'tsar' },
    ],
    falseHeroes: [
      { name: 'the elder brothers Glib and Gleb', plural: true },
      { name: 'the Captain of Mild Courage', plural: false },
      { name: 'Cousin Smarm the water-carrier', plural: false },
      { name: 'a general with polished boots and no battles', plural: false },
    ],
    homes: [
      'a village where the rooster crowed backwards',
      'a hut beside a river that ran uphill on Sundays',
      'a town whose church bell rang a minute early, out of nerves',
      'a kingdom so small that the Tsar could hear every sneeze in it',
    ],
    realms: {
      forest: { name: 'the Birch Thicket of Unfinished Sentences', way: 'through the forest, where the trees whispered half of everything' },
      sea: { name: 'the Thrice-Tenth Sea', way: 'over the sea, where the fish kept diaries and the waves read them aloud' },
      below: { name: 'the Copper Kingdom under the earth', way: 'down a ladder of roots, deeper than the wells go' },
    },
    lacks: [
      'the kingdom’s last true sunrise',
      'a bride who could laugh',
      'the water of life and the water of death',
      'the egg in which a certain death was kept',
      'a feather of the Ember-Bird',
      'the singing apple that told the truth',
    ],
    gifts: [
      { id: 'comb', name: 'a bone comb that grows forests when thrown', use: 'flung the comb, and a forest sprang up thick as a brush' },
      { id: 'thread', name: 'a ball of red thread that knows the way', use: 'let the red thread roll ahead, and it found the crooked path' },
      { id: 'flute', name: 'a birch-bark flute that makes the dead dance politely', use: 'played the flute, and everything with bones began to dance' },
      { id: 'boots', name: 'boots that walk only forward', use: 'stamped in the forward-boots and could not be turned back' },
      { id: 'cloth', name: 'a handkerchief that unfolds into a lake', use: 'shook out the handkerchief, and a lake lay down across the road' },
      { id: 'hair', name: 'a horse-hair that summons a horse of storm', use: 'burned the horse-hair, and a storm-horse came snorting out of nowhere' },
      { id: 'thunder', name: 'a jar of borrowed thunder', use: 'unstopped the jar, and borrowed thunder rolled out, very loud and slightly apologetic' },
    ],
    interdictions: [
      'do not open the green door at the end of the passage',
      'do not look into the well after the sun goes down',
      'do not answer if someone calls your name from the forest',
      'do not let the stove go cold while I am away',
      'do not eat the third pancake',
    ],
    tasks: [
      'to eat a whole oven of bread before dawn',
      'to find which of twelve identical doves was the princess',
      'to answer a riddle that had no right answer',
      'to build a bridge of crystal in a single night',
      'to sit in a red-hot bathhouse and come out cold',
    ],
    punishments: [
      'was put in a barrel and rolled into the sea, which rolled {vhim} back out, ashamed',
      'was turned into a draughty doorway that everyone complained about',
      'was made to count the crows of the kingdom, and is counting still',
      'was tied to a mule’s tail and taken to a very long sermon',
    ],
  };
  root.Propp = Object.assign(root.Propp || {}, { tables: T });
})(typeof globalThis !== 'undefined' ? globalThis : this);
