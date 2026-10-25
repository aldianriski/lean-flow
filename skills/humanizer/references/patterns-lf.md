# Humanizer: lean-flow overlay patterns

Five patterns that `patterns-en.md` lacks. This file belongs to lean-flow: it is not vendored, so a re-sync of the upstream catalog never overwrites it. Read it after `patterns-en.md`, in full, on the same terms: a pattern marked *weak alone* needs company from other tells in the same passage before you act. The numbers carry an `LF-` prefix so a renumbering upstream never collides with them. Each Before and After pair keeps its facts equal, and so must every fix you make: an LF pattern names dressing, so cut the dressing and keep the claim it was dressing (who picks the columns, who the change is for). Dropping that claim is an error under SKILL.md step 6, the same as adding one.

### LF-1. An abstraction given a human verb

**Watch for:** a dashboard, dataset, system, or process that "understands", "wants", "knows", "decides", "cares about" or "believes". Act on one sighting when the verb needs a mind.
**Problem:** The verb credits a thing with intent it cannot have, and it hides who does the work or what the reader should do. Name the actor, or state the action as an instruction or a plain fact.
**Before:**
> The data wants to be filtered by region before anyone reads the totals.
**After:**
> Filter the data by region before reading the totals.
**When not to act:** ordinary product verbs are fine ("the report shows", "the filter narrows", "the query returns"), and so is a verb inside a quotation or a deliberate metaphor in a personal essay.

### LF-2. Filler phrases

**Watch for:** "in order to", "due to the fact that", "it is important to note that", "it should be noted that", "at this point in time", "for the purpose of". *Weak alone.*
**Problem:** Each phrase spends several words on what one word or none would carry. A single sighting is common in careful human prose; a text that leans on them reads as padded.
**Before:**
> In order to rotate the keys, it is important to note that the service must be restarted, due to the fact that it caches them at startup.
**After:**
> To rotate the keys, restart the service, which caches them at startup.
**When not to act:** legal, contractual and quoted text, where the long form is the wording; a lone "in order to" that keeps a sentence from misreading.

### LF-3. Synonym cycling

**Watch for:** one referent renamed in each sentence to avoid repeating a word: "the config file", then "the settings document", then "the configuration manifest". *Weak alone.*
**Problem:** The reader has to check whether three names mean three things. A person repeats the plain noun or uses "it".
**Before:**
> The tool reads the config file. The settings document is then validated, and the configuration manifest is written back.
**After:**
> The tool reads the config file. The file is then validated and written back.
**When not to act:** the names are different things (a source file and its compiled output), a term policy asks for the first-use gloss, or the text is verse or fiction where variation is the style.

### LF-4. Empty "from X to Y" ranges

**Watch for:** "from X to Y" where X and Y are not two ends of one scale or sequence, so the phrase implies a span that does not exist: "from bold ambitions to your biggest growth plans". *Weak alone.*
**Problem:** The range borrows the sound of breadth to join two items. Name the items, or say what they have in common. When an end names nothing the text supports (a slogan such as "your biggest growth plans"), drop the range and the scope it implies; do not keep the other end as an apparently concrete claim ("covers every invoice"), and do not turn either end into an item. Keep only what the rest of the text supports.
**Before:**
> From bold ambitions to your biggest growth plans, the release fixes three bugs.
**After:**
> The release fixes three bugs.
**When not to act:** a real range ("from 2 GB to 16 GB", "from the first release to the current one") stays, and so does a route or a before-and-after pair.

### LF-5. Clusters of scare quotes

**Watch for:** several words in quotation marks in one passage, used for emphasis or to distance the writer from the word: 'the importer reads "large" files and "supports" Windows'. *Weak alone.*
**Problem:** Quotes with no speaker signal doubt or irony without saying what the doubt is. One sets a term apart; a cluster is a tic. Drop the quotes, or say the reservation in words.
**Before** (the author confirmed these quotes were emphasis, not doubt):
> The importer reads "large" files in 10 minutes and "supports" Windows.
**After:**
> The importer reads large files in 10 minutes and supports Windows.
**When not to act:** dialogue, real quotations, titles, and a term mentioned as a term (the word "cache" in a glossary) keep their quotes. A single scare quote the writer means is theirs to keep. Preserve deliberate doubt or irony whatever the quote count; when you cannot tell emphasis from doubt, ask or leave the quotes.
