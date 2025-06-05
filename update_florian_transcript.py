import json
import re

def process_transcript_line(line):
    """
    Convert a transcript line from format:
    'Speaker Name (timestamp)' or 'Speaker Name (timestamp) content'
    to HTML format with proper styling
    """
    line = line.strip()
    if not line:
        return None
    
    # Match pattern: Speaker Name (timestamp) followed by content
    # Handle cases where content might be on the same line or next lines
    speaker_match = re.match(r'^([^(]+)\s*\(([^)]+)\)\s*(.*)', line)
    
    if speaker_match:
        speaker = speaker_match.group(1).strip()
        timestamp = speaker_match.group(2).strip()
        content = speaker_match.group(3).strip()
        
        # Format timestamp to match existing format [MM:SS]
        if ':' not in timestamp:
            # If timestamp is just seconds, convert to MM:SS format
            try:
                total_seconds = int(float(timestamp))
                minutes = total_seconds // 60
                seconds = total_seconds % 60
                formatted_timestamp = f"{minutes:02d}:{seconds:02d}"
            except:
                formatted_timestamp = timestamp
        else:
            formatted_timestamp = timestamp
        
        # Create the HTML formatted line
        if content:
            return f'<p class="text-body"><span class="transcript-meta">[{formatted_timestamp}] {speaker}:</span><br>{content}</p>'
        else:
            return f'<span class="transcript-meta">[{formatted_timestamp}] {speaker}:</span><br>'
    
    # If no speaker pattern found, treat as continuation content
    return line

def convert_transcript_to_html(transcript_text):
    """
    Convert the raw transcript text to HTML format
    """
    lines = transcript_text.split('\n')
    html_parts = []
    current_paragraph = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if this line starts with a speaker name and timestamp
        speaker_match = re.match(r'^([^(]+)\s*\(([^)]+)\)', line)
        
        if speaker_match:
            # If we have a current paragraph, close it
            if current_paragraph:
                html_parts.append(current_paragraph + '</p>')
                current_paragraph = None
            
            # Process this speaker line
            processed = process_transcript_line(line)
            if processed:
                if processed.endswith('</p>'):
                    html_parts.append(processed)
                else:
                    current_paragraph = processed.replace('<br>', '<br>')
        else:
            # This is continuation content
            if current_paragraph:
                current_paragraph += ' ' + line
            else:
                # Orphaned content, add to last paragraph or create new one
                if html_parts and not html_parts[-1].endswith('</p>'):
                    html_parts[-1] += ' ' + line
                else:
                    current_paragraph = '<p class="text-body">' + line
    
    # Close any remaining paragraph
    if current_paragraph and not current_paragraph.endswith('</p>'):
        html_parts.append(current_paragraph + '</p>')
    
    return ''.join(html_parts)

# Read the raw transcript
with open('transcripts/Transcript - Florian Heinrichs.txt', 'r', encoding='utf-8') as f:
    raw_transcript = f.read()

# Convert to HTML format
html_transcript = convert_transcript_to_html(raw_transcript)

# Read the current JSON file
with open('src/content/episodes/S1E4_Florian.json', 'r', encoding='utf-8') as f:
    episode_data = json.load(f)

# Update the transcript field
episode_data['transcript'] = html_transcript

# Write back to JSON file
with open('src/content/episodes/S1E4_Florian.json', 'w', encoding='utf-8') as f:
    json.dump(episode_data, f, indent=2, ensure_ascii=False)

print('Florian transcript updated successfully!')
print(f'Transcript length: {len(html_transcript)} characters') 