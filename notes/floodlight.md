Every day for the past couple months I would search something in Spotlight and somehow it would surface everything but my intended result. I would ignore it and carry on with the rest of my day before hitting the same annoying issue again. I decided to make my own launcher after 4 searches in 10 minutes where Spotlight didn't show what I wanted. The 4 queries were:

- `claude`**:** the top hits were project files. The Claude app showed up only after a pause.
- `grokbot`**:** the results were a web suggestion, some Messages threads, a website and the
`.dmg` installer, but not the installed Grok Bot app, because Spotlight didn't match a name
typed without its space.
- `whatsapp`**:** Spotlight autocompleted to an `.svg` icon file and buried the app under a wall of icons.
- `test.py`**:** Terminal, TextEdit and a few Settings panes showed up, but not the file.

A good launcher's most important job is to accurately and efficiently put what the user is looking for at the top. Despite all the web search features, AI features, etc. that have polluted Spotlight, in my eyes it is failing in my daily use case. So I decided to build my own and, more importantly, to measure honestly whether it was any better.

## Floodlight

Floodlight is a native Swift launcher with no third-party dependencies. Control-Space opens a search bar, and it searches apps, System Settings panes, and files and folders in your home folder. I have primarily tailored it to my use cases, but will expand upon the project in the future!

![Spotlight vs Floodlight on the typos "chorme" and "trminal"](./assets/notes/floodlight-vs-spotlight.gif)

The main design choices:

- **Its own discovery and index.** It reads the app folders and the home folder directly
instead of relying on the Spotlight index. Each top-level folder is scanned in parallel, so
one slow or permission-blocked folder never holds up the rest.
- **Names are normalized.** Case, accents and invisible characters don't get  
in the way, and "grokbot" matches "Grok Bot".
- **Typo tolerance for apps and settings.** One mistake is forgiven in short names and two in
long ones, without flooding the results with files.
- **Predictable ranking.** Stronger name matches come first. When match strength ties, apps
take priority over files, and usage helps order results of the same type. The same query,
index and usage history produce the same order.
- **Never blocks typing.** Every keystroke searches in the background, and stale results are
thrown away.

## Testing Process

I wanted to create a more robust testing process inspired by Hamel Husain's writing on evals, so I applied what I'd learned from it.

- **Same conditions for every tool:** Spotlight, Raycast and Floodlight each ran in the same
clean macOS virtual machine, with default settings and no usage history.
- **Same typing:** a small probe program typed each query at the same pace for every tool and
read the results through macOS's accessibility interface, 5 times per query.
- **Hidden test queries:** they were generated for 40 invented apps planted in the VM and kept
secret. Before any run, I published a cryptographic fingerprint of them, so I couldn't swap
queries after seeing results.
- **Rules fixed in advance:** the scoring and the main comparison were written down and
published first. That included the bar for "meaningfully better": even the pessimistic end of
the result's range has to be more than 5 points ahead.

## What happened

| Intended app shown first | Spotlight | Raycast | Floodlight |
|---|---|---|---|
| Correctly typed name, prefix, no-space or initials (169 queries) | 100% | 99.4% | 100% |
| One typo in the name (40 queries) | 0% | 27.5% | 100% |
| Main result, 209 queries, apps weighted equally | 80.2% | 84.9% | 100% |
| One typo in a real app's name (69 queries, reported separately) | 1.4% | 23.2% | 100% |

**On 209 unambiguous queries for invented app names, Floodlight led Spotlight by 19.8 percentage points (95% confidence interval, +18.7 to +20.9).** Each app counts equally in the main score, regardless of how many queries it has. The other rows show the percentage of queries answered correctly. The breakdown of this is as follows:

- **Correctly typed names:** all three were essentially perfect.
- **One typo:** Type `trminal` and Spotlight shows only "Search in
Finder" and "Search the Web". Raycast recovered names with a missing letter, but not swapped
or mistyped ones. Floodlight found the app every time.
- **Busy disk and restart didn't change app results.** I also ran a VM with 200,000 extra files on disk, and searched right after restarting each launcher. Results were nearly unchanged on matched queries.

## Timing

I also measured how long each tool took to put the right app first, counted from the last keystroke. A negative time means the app was already first before I finished typing. This only covers the 168 queries all three tools got right every time:

| Time until the app was first | Spotlight | Raycast | Floodlight |
|---|---|---|---|
| Typical (median) | 144 ms | −77 ms | −105 ms |
| Slow case (95th percentile) | 537 ms | 71 ms | 49 ms |

- **Floodlight usually had the app on top before the last key landed.** Raycast was close behind: the 20–30 ms gap is smaller than how often the probe checked the screen (every 50 ms).
- **Spotlight got slower as the test went on.** Its typical time grew from 27 ms in the first run to 371 ms in the fifth.

## Limits

- **App searches only.** Files and settings weren't tested.
- **Synthetic, single typos.** Harder cases, like a typo that matches a different app, weren't
tested.
- **Fresh installs in one VM.** There was no usage history.
- **No Enter key pressed.** Results are the ranked list, not the app that opened.

## Try it and check it

- Code and build instructions: [github.com/pradyuns/Floodlight](https://github.com/pradyuns/Floodlight)
- Full results: [application benchmark report](https://github.com/pradyuns/Floodlight/blob/floodlight/docs/heldout-results.md)
- How to verify results: [data and instructions](https://github.com/pradyuns/Floodlight/tree/floodlight/release/heldout-2026-11-18)

## What I learned

**The test was easier than I meant it to be.** [Hamel Husain and Shreya Shankar](https://hamel.dev/blog/posts/evals-faq/#q-how-much-of-my-development-budget-should-i-allocate-to-evals) mention that getting 100% on an eval can mean the tests are saturated and not hard enough. I completely agree and I would expand the scope of the benchmark to include file searches as well.

A basic offline matcher also reached 100% using name matching and one-edit correction. That helped explain the improvement, but also showed that the test needed more difficult competing matches. Building the launcher involved other problems too. For example, searches run in the background and can finish out of order. Floodlight checks that each result belongs to the latest query before displaying it, so results for `ca` cannot overwrite results for `calc`.

**Things will go wrong mid-run.** My first "restart" run stopped itself halfway through. A rule I'd set beforehand caught Raycast reporting "not ready" too often after restarts, because of a brief accessibility stall. I published a fix to the readiness check, applied it identically to all three tools, and reran. The stopped run's data is published too.

## What's next

1. I would add benchmarking on file searching. I did some testing myself and the search and ranking is much better than Spotlight, but I have to quantitatively prove that.
2. Allow for commands that can open multiple apps at once (saved workflows essentially).
3. Learn from usage behavior to introduce context aware ranking.
4. One feature I missed out on adding was arithmetic support in Floodlight. It's a small addition: type math like `2+2` and see the result right in the launcher similar to Spotlight.
5. Track daily use so I can get real usage benchmarks.
