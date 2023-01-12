---
---
# Empty FrontMatter

This file has the front matter marks,
but there's no fields within it.
Should be false in `lib/front-matter.exists()`,
but should be true in `lib/front-matter.empty()`.
Because it's true in `empty()`,
that means `startDelimExists()` is true,
as well as `endDelimExists()`.
