import json
import re

# Read the current JSON
with open('src/content/episodes.json', 'r') as f:
    episodes = json.load(f)

# Read the complete transcript from the HTML file
with open('S1E2_Spencer.html', 'r') as f:
    html_content = f.read()

# Extract transcript content between the transcript-container div
transcript_match = re.search(r'<div class="transcript-container">(.*?)</div>', html_content, re.DOTALL)
if transcript_match:
    transcript_content = transcript_match.group(1)
    # Clean up the content - remove the wrapper div
    transcript_content = re.sub(r'<div class="form-space-transcript-content.*?">', '', transcript_content)
    transcript_content = transcript_content.strip()
    
    # Find Spencer's episode (episode-2) and update the transcript
    for episode in episodes:
        if episode['id'] == 'episode-2':
            episode['transcript'] = transcript_content
            break
    
    # Write back to JSON
    with open('src/content/episodes.json', 'w') as f:
        json.dump(episodes, f, indent=2)
    
    print('Spencer transcript updated successfully!')
else:
    print('Could not find transcript content') 