#!/usr/bin/env python3
"""
TranscriptToJSON.py

Converts plain text podcast transcripts to HTML format suitable for JSON embedding.

Usage:
    python TranscriptToJSON.py <input_file>

The script will:
1. Keep the original transcript file unchanged
2. Create a new file with "_formatted.html" suffix containing the JSON-escaped HTML output
3. Display the formatted content for easy copying to JSON

Example:
    python TranscriptToJSON.py "transcripts/Transcript - Alex James.txt"
    
This will create: "transcripts/Transcript - Alex James_formatted.html"
"""

import re
import sys
import os
import html
import json


def escape_html_content(text):
    """Escape HTML entities in text content"""
    return html.escape(text, quote=False)


def convert_timestamp(timestamp_match):
    """Convert (XX:XX) format to [XX:XX] format"""
    return timestamp_match.replace('(', '[').replace(')', ']')


def parse_transcript_line(line):
    """
    Parse a line to determine if it's a speaker line or content.
    Returns tuple: (is_speaker, speaker_name, timestamp, content)
    """
    line = line.strip()
    if not line:
        return False, None, None, None
    
    # Match pattern: "Speaker Name (XX:XX)" or "Speaker Name (XXX:XX)"
    speaker_pattern = r'^(.+?)\s+\((\d{1,3}:\d{2})\)$'
    match = re.match(speaker_pattern, line)
    
    if match:
        speaker_name = match.group(1).strip()
        timestamp = match.group(2)
        return True, speaker_name, timestamp, None
    else:
        return False, None, None, line


def get_speaker_attribute(speaker_name):
    """
    Determine if the speaker is João and return appropriate data attribute.
    Returns the data-speaker attribute string or empty string.
    """
    normalized = speaker_name.strip().lower()
    if normalized in ['joão', 'joao']:
        return ' data-speaker="joao"'
    return ''


def process_transcript(input_file):
    """
    Process the transcript file and convert to HTML format.
    Returns the HTML string ready for JSON embedding.
    """
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"Error: File '{input_file}' not found.")
        return None
    except Exception as e:
        print(f"Error reading file: {e}")
        return None
    
    html_parts = []
    current_speaker = None
    current_timestamp = None
    current_content = []
    
    for line_num, line in enumerate(lines, 1):
        is_speaker, speaker_name, timestamp, content = parse_transcript_line(line)
        
        if is_speaker:
            # If we have accumulated content from previous speaker, process it
            if current_speaker and current_content:
                # Join all content for this speaker
                full_content = ' '.join(current_content).strip()
                if full_content:
                    # Escape HTML entities in content
                    escaped_content = escape_html_content(full_content)
                    
                    # Create the HTML paragraph
                    speaker_attr = get_speaker_attribute(current_speaker)
                    speaker_tag = f'<span class="transcript-meta">[{current_timestamp}] {current_speaker}:</span><br>'
                    paragraph = f'<p class="text-body"{speaker_attr}>{speaker_tag}{escaped_content}</p>'
                    html_parts.append(paragraph)
            
            # Start new speaker section
            current_speaker = speaker_name
            current_timestamp = timestamp
            current_content = []
            
        elif content:
            # Accumulate content for current speaker
            current_content.append(content)
    
    # Process the last speaker's content
    if current_speaker and current_content:
        full_content = ' '.join(current_content).strip()
        if full_content:
            escaped_content = escape_html_content(full_content)
            speaker_attr = get_speaker_attribute(current_speaker)
            speaker_tag = f'<span class="transcript-meta">[{current_timestamp}] {current_speaker}:</span><br>'
            paragraph = f'<p class="text-body"{speaker_attr}>{speaker_tag}{escaped_content}</p>'
            html_parts.append(paragraph)
    
    # Join all parts into single HTML string
    return ''.join(html_parts)


def main():
    if len(sys.argv) != 2:
        print("Usage: python TranscriptToJSON.py <input_file>")
        print("Example: python TranscriptToJSON.py 'transcripts/Transcript - Alex James.txt'")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    if not os.path.exists(input_file):
        print(f"Error: Input file '{input_file}' does not exist.")
        sys.exit(1)
    
    print(f"Processing: {input_file}")
    
    # Process the transcript
    html_output = process_transcript(input_file)
    
    if html_output is None:
        print("Failed to process transcript.")
        sys.exit(1)
    
    # Create output filename
    base_name = os.path.splitext(input_file)[0]
    output_file = f"{base_name}_formatted.html"
    
    # Create JSON-ready output (properly escaped)
    json_ready_output = json.dumps(html_output)
    
    # Write the JSON-escaped output to file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(json_ready_output)
        print(f"✓ JSON-ready transcript saved to: {output_file}")
    except Exception as e:
        print(f"Error writing output file: {e}")
        sys.exit(1)
    
    # Display the output for easy copying
    print("\n" + "="*80)
    print("JSON-READY TRANSCRIPT (properly escaped):")
    print("="*80)
    print(json_ready_output)
    print("="*80)
    print(f"\nThe JSON-escaped content has been saved to: {output_file}")
    print("Copy the content above (including quotes) and paste it as the value for 'transcript' in your episode JSON file.")


if __name__ == "__main__":
    main()