# Transcript Processing Utilities

## TranscriptToJSON.py

Converts plain text podcast transcripts to HTML format suitable for JSON embedding in episode files.

### Usage

```bash
python3 Utils/TranscriptToJSON.py "path/to/transcript.txt"
```

### Example

```bash
python3 Utils/TranscriptToJSON.py "transcripts/Transcript - Alex James.txt"
```

This will:
1. Keep the original transcript file unchanged
2. Create a new file: `transcripts/Transcript - Alex James_formatted.html`
3. Display the formatted HTML content in the terminal for easy copying

### What it does

The script transforms plain text transcripts from this format:
```
João (00:13)
So hello everyone and welcome to Exotic Matter...

Alex James (00:43)
Thanks for having me.
```

To this HTML format ready for JSON:
```html
<p class="text-body"><span class="transcript-meta">[00:13] João:</span><br>So hello everyone and welcome to Exotic Matter...</p><p class="text-body"><span class="transcript-meta">[00:43] Alex James:</span><br>Thanks for having me.</p>
```

### Transformations Applied

1. **Timestamp format**: `(00:13)` → `[00:13]`
2. **Speaker labels**: Wrapped in `<span class="transcript-meta">` tags
3. **Content wrapping**: Each speaker's content wrapped in `<p class="text-body">` tags
4. **HTML escaping**: Special characters properly escaped
5. **Continuous format**: All content joined into a single HTML string

### Output

- **Terminal display**: Shows the complete formatted HTML for copying
- **File output**: Saves formatted content to `*_formatted.html` file
- **Original preserved**: Original transcript file remains unchanged

Copy the terminal output and paste it into the `transcript` field of your episode JSON file.
