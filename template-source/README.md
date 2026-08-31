# template-source

Everything the five downloadable workbooks in
`amitdusane-site-complete/static/templates/` are built from, plus the pipeline
that captures the M19 screenshots.

**This exists because the .xlsx files are outputs, not sources.** Editing a
template by hand in Excel works once and then the next rebuild overwrites it.
Change the TSV, rebuild, re-stamp.

## Rebuilding a workbook

The data is one TSV per sheet in `data/`. Rows are tab-delimited, and lines
starting with `#` are directives read by `build.ps1`:

| Directive | Does |
|---|---|
| `#TITLE` | Title in A1, bold, 13pt. Data then starts at row 3 |
| `#WIDTHS` | Column widths, in Excel character units |
| `#FILLS` | Header fill per column: `orange`, `green`, `blue`, `grey`, `red` |
| `#COMMENTS` | Cell comment per header column. This is what makes the workbook self-documenting |
| `#FREEZE` | Freeze panes above this row |
| `#FILTER` | Turn on autofilter |
| `#TAB` | Sheet tab colour |
| `#TEXTCOLS` | 1-based columns held as text. Version strings need this |
| `#DATECOLS` | 1-based columns formatted as dates |

Then, per workbook:

```
build.ps1  -Out <path.xlsx> -DataDir data -Title "<document title>" -Sheets @("file.tsv|Sheet Name", ...)
footer.ps1 -Files <path.xlsx>          # print footer, written into the XML
meta.ps1   -File  <path.xlsx> -Title "<document title>"   # document properties
```

`footer.ps1` and `meta.ps1` are separate because **neither could be done through
Excel on this machine.** Every `PageSetup` property assignment throws, plain
strings included, with printers present and `PrintCommunication` disabled; and
`BuiltinDocumentProperties.Item(name).Value` throws silently for every field, so
only the inherited `dc:creator` was landing. Both write the XML directly, which
is what Excel would have produced anyway.

Order matters in `footer.ps1`: `<headerFooter>` must sit after `pageMargins` and
before `drawing`/`legacyDrawing`, or Excel calls the file corrupt.

## The variable map is generated

`genmap.awk` builds the Variable Map sheet from the solution sheets, so the
"Used by" column can never disagree with the design. It reads `usedby.tsv`
(produced by `usedby.awk` over the body files) and `settings.tsv` (allocation,
expiration, event type per slot).

`normalise.awk` pads the hand-written body TSVs to exactly 15 columns and fixes
the leading blanks on continuation rows.

**The SDR sheets are cut from the TSD sheets**, columns 1 to 7, which is why the
two documents cannot drift. Never author them separately.

## Screenshots

`shots.ps1` drives Excel and exports cell ranges as pictures through a temporary
chart. `shotlist-final.tsv` is the spec, one row per shot:

```
book <TAB> sheet <TAB> range <TAB> outname <TAB> comment <TAB> anchor <TAB> hideCols <TAB> widths <TAB> hideRows
```

Four things learned the hard way:

- **Capture at `-Zoom 100`.** The site's convention is that the width and height
  attributes carry the true 1x size while the file keeps 2x pixels, so a capture
  at 200% renders at full column width no matter what. At 100% a small crop
  stays small.
- **Hide the columns that are not the subject**, narrow long text columns, and
  hide rows in the middle. A spreadsheet row is wider than a reading column and
  shrinking the image to fit makes the text unreadable.
- **`DisplayCommentIndicator` must be `-1`**, not `1`. `1` opens *every* comment
  on the sheet.
- **Kill stray `EXCEL` processes first.** `CopyPicture` goes through the
  clipboard and a leftover instance fights for it. It also fails entirely while
  the workstation is locked.

`xlsx.ps1` reads a workbook back as text without Excel, which is the fastest way
to check what actually got written.
