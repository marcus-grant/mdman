---
---
# Empty FrontMatter

This file has the front matter marks,
but there's no fields within it.
Should be false in `lib/front-matter.matterExists()`,
but should be true in `lib/front-matter.matterEmpty()`.
Because it's true in `matterEmpty()`,
that means `matterStartDelimExists()` is true,
as well as `matterEndDelimExists()`.
