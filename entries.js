/*
  HOW TO ADD A NEW ENTRY
  ----------------------
  Copy the block below and paste it at the TOP of the ENTRIES array
  (right after "const ENTRIES = [").  Newest entries go on top.

  {
    date: "YYYY-MM-DD",          // required — the day this entry is for
    heading: "Short title",       // optional — bolded line under the date, can be ""
    prose: true,                  // optional — show items as written paragraphs instead of bullets
    items: [                      // required — array of notes/bullets (or paragraphs)
      "A plain bullet point",
      ["A nested sub-point (indented, use for follow-up thoughts)"],
    ],
  },

  Notes:
  - `items` can mix plain strings and one-level nested arrays for indents.
  - You can use basic HTML inside any string, e.g. "Met with <a href='https://example.com'>Noah</a>"
    or "<em>emphasis</em>" or "<strong>bold</strong>".
  - Dates automatically get formatted into things like "MONDAY, SEPTEMBER 28, 2026" — just type YYYY-MM-DD.
*/

const CURRENTLY = "just started ideating on Prototype 2";

const ENTRIES = [
  {
    date: "2026-10-09",
    heading: "Thesis Exchange",
    prose: true,
    items: [
      "A week later, we had our Thesis Exchange, where we got to present our ideas to our peers and get feedback. I presented <em>The Bureau of Too Far</em>, but this time with a much more specific direction. Instead of trying to create the entire Bureau at once, I decided to focus on developing the <strong>case files</strong> for Prototype 1.",
      "I honestly got some incredible feedback and references that made me think about the project in ways I hadn't considered before.",
      "One person pointed out that if they hadn't seen the original video or campaign, they probably wouldn't understand the controversy, which made me realize how important it is to give people enough context before asking them to form an opinion.",
      "Someone else brought up how our standards of what's considered acceptable have evolved over time. We also had an interesting conversation about how something might seem innocent when an individual does it, but when a corporation does the exact same thing, there are completely different expectations and responsibilities attached to it.",
      "There were also some really fun suggestions for the execution. Someone mentioned creating an internal training video from the Bureau, which could be an interesting direction to explore later. Another suggestion was to make the case folders out of acetate or vellum, which I thought was really cool considering how transparency and censorship are such big parts of the concept.",
      "I was also introduced to Hans Haacke's <em>MoMA Poll</em>, which felt like a great reference for the participatory aspect of the Bureau.",
      "Another suggestion was to look at controversial campaigns from the last ten years so that the cases would feel more familiar and relatable to the people interacting with them.",
      "Overall, I left with a lot more to think about. I was glad I'd narrowed my focus down to the case files because it made the feedback much more specific and gave me a clearer idea of what I needed to work on next.",
      "<strong>What's next?</strong>",
      "Start researching and finalizing the cases I want to feature, figure out how much context each file needs, and begin experimenting with the physical format and materials. The goal is to make the case files feel like actual documents from a fictional institution while still leaving enough room for people to form their own opinions.",
    ],
  },
  {
    date: "2026-10-02",
    heading: "Graphic Strategies Workshop",
    prose: true,
    items: [
      "Today's Graphic Strategies workshop helped me finally bring some of my ideas to life. We had to come up with proposals based on the black and white cards we were given, which pushed us to think about how our topics could actually turn into projects rather than just remaining ideas.",
      "I came up with four proposals: <em>Rules Subject to Change</em>, <em>A Field Guide to the Resident Alien</em>, <em>The Bureau of Too Far</em>, and <em>Resident Alien, A Natural History</em>. Even after exploring all four, I was still pretty torn between my <em>Aliens</em> and <em>Statement Piece</em> topics.",
      "We also had one-on-ones with Dinah, which were really helpful. She seemed to really enjoy my ideas, but we also realized that the National Geographic-style documentary might be a little too ambitious for me right now. I don't have much experience with filmmaking, and finding actors and figuring out production would be a whole other challenge.",
      "What I really liked about our conversation was that she suggested I didn't necessarily have to abandon either topic just yet. I could explore <em>Statement Piece</em> for Prototype 1 and <em>Aliens</em> for Prototype 2, giving myself the chance to experiment with both before making a final decision.",
      "She also pointed out that <em>The Bureau of Too Far</em> could honestly be an entire year's thesis project on its own. I had imagined so many different elements for it that trying to execute everything for Prototype 1 would be a little insane. So instead, she encouraged me to pick just one aspect of the Bureau and focus on developing that properly.",
      "I left the workshop feeling a lot better about my direction. I still hadn't picked one topic, but at least I had a way to explore both without forcing myself to make that decision immediately.",
      "<strong>What's next?</strong>",
      "Figure out which part of the Bureau I want to develop for Prototype 1 and start narrowing down the scope. The challenge now is figuring out how to make one small part of a much bigger idea feel like a complete project.",
    ],
  },
  {
    date: "2026-09-25",
    heading: "5×5×5",
    prose: true,
    items: [
      "256 was finally over, and we officially entered our thesis journey! We started off with the 5×5×5 exercise, where we had to pitch five topics we were interested in exploring, along with five questions for each.",
      "My five topics were <em>Reduced and Overlooked</em>, <em>Aliens</em>, <em>Tolerance</em>, <em>Target Audience</em>, and <em>Statement Piece</em>.",
      "At the end of everyone's presentations, we each had a card where our classmates could vote for the topics they found most interesting. Turns out, my classmates really liked <em>Aliens</em>, <em>Tolerance</em>, and <em>Statement Piece</em>, which honestly just made me even more confused about which direction to go in.",
      "I was hoping the voting would help me narrow things down, but instead I ended up with three topics I was equally excited about. Not exactly helpful, but also not the worst problem to have.",
      "I was just glad to have topics I genuinely liked and could choose between, rather than being stuck in a position where none of my ideas excited me.",
      "<strong>What's next?</strong>",
      "Figure out which of these three topics I actually want to spend an entire year working on. Easier said than done.",
    ],
  },
];
