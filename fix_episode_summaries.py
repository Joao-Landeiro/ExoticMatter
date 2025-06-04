import json

# Read the current JSON file
with open('src/content/episodes.json', 'r', encoding='utf-8') as f:
    episodes_data = json.load(f)

# Correct summaries for episodes 2 and 3
spencer_summary = "Spencer Ayres explores the value of workshops in productizing expertise, discussing the commonalities of successful workshops and the future of expertise work. He shares insights on designing collaborative experiences that drive real outcomes and the evolution of digital collaboration tools. Connect with Spencer on LinkedIn: https://www.linkedin.com/in/spencerayres/"

danilo_summary = "Danilo Kreimer discusses growth strategies for early-stage consulting firms, focusing on the challenges of market entry and the importance of tailored advice over generic marketing strategies. He emphasizes the need for specialized support and understanding the unique context of each consulting practice. Connect with Danilo: BoutiqueConsultingClub.com and LinkedIn: https://www.linkedin.com/in/danilokreimer/ - Also check out his newsletter for consulting insights."

# Update the summaries for episodes 2 and 3
for episode in episodes_data:
    if episode['id'] == 'episode-2':
        episode['summary'] = spencer_summary
        print(f"Updated summary for {episode['title']}")
    elif episode['id'] == 'episode-3':
        episode['summary'] = danilo_summary
        print(f"Updated summary for {episode['title']}")

# Write the updated JSON back to the file
with open('src/content/episodes.json', 'w', encoding='utf-8') as f:
    json.dump(episodes_data, f, indent=2, ensure_ascii=False)

print("Episode summaries fixed successfully!") 