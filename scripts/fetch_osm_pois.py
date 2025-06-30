
import requests
import csv
import json
import os

# Overpass API endpoint
OVERPASS_URL = "http://overpass-api.de/api/interpreter"

# Overpass QL query to get POIs in Dadaocheng, Taipei
# This query uses a bounding box (south, west, north, east) to define the area.
# Coordinates are approximately for the Dadaocheng area.
OVERPASS_QUERY = """
[out:json][timeout:60];
(
  node["amenity"](25.0500,121.5050,25.0600,121.5150);
  way["amenity"](25.0500,121.5050,25.0600,121.5150);
  relation["amenity"](25.0500,121.5050,25.0600,121.5150);

  node["shop"](25.0500,121.5050,25.0600,121.5150);
  way["shop"](25.0500,121.5050,25.0600,121.5150);
  relation["shop"](25.0500,121.5050,25.0600,121.5150);

  node["tourism"](25.0500,121.5050,25.0600,121.5150);
  way["tourism"](25.0500,121.5050,25.0600,121.5150);
  relation["tourism"](25.0500,121.5050,25.0600,121.5150);

  node["historic"](25.0500,121.5050,25.0600,121.5150);
  way["historic"](25.0500,121.5050,25.0600,121.5150);
  relation["historic"](25.0500,121.5050,25.0600,121.5150);

  node["craft"](25.0500,121.5050,25.0600,121.5150);
  way["craft"](25.0500,121.5050,25.0600,121.5150);
  relation["craft"](25.0500,121.5050,25.0600,121.5150);
);
out center;
"""

def fetch_osm_pois():
    """
    Fetches POI data from OpenStreetMap using the Overpass API
    and saves it to a CSV file.
    """
    print("Fetching POIs from OpenStreetMap for Dadaocheng...")
    try:
        response = requests.post(OVERPASS_URL, data=OVERPASS_QUERY, timeout=60)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        print(f"Successfully fetched {len(data.get('elements', []))} elements.")
        return data.get('elements', [])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Overpass API: {e}")
        return None

def save_pois_to_csv(pois, output_dir="data"):
    """
    Saves a list of POI data into a CSV file.
    """
    if not pois:
        print("No POIs to save.")
        return

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)
    filename = os.path.join(output_dir, "osm_pois.csv")

    # Define the headers for the CSV file
    headers = [
        'id', 'type', 'lat', 'lon', 'name', 'amenity', 'shop',
        'tourism', 'historic', 'craft', 'other_tags'
    ]

    # Using a set to ensure we don't write duplicate POIs
    processed_ids = set()

    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=headers)
        writer.writeheader()

        for poi in sorted(pois, key=lambda x: x.get('id', 0)):
            poi_id = poi.get('id')
            if poi_id in processed_ids:
                continue
            processed_ids.add(poi_id)

            # Extract center geometry for ways/relations
            if 'center' in poi:
                lat = poi['center'].get('lat')
                lon = poi['center'].get('lon')
            else:
                lat = poi.get('lat')
                lon = poi.get('lon')

            # Skip if essential data is missing
            if not all([poi_id, lat, lon]):
                continue

            tags = poi.get('tags', {})
            # Prioritize Chinese name, then default name
            name = tags.get('name:zh', tags.get('name', 'N/A'))

            # Collect all other tags into a JSON string
            other_tags = {
                k: v for k, v in tags.items()
                if k not in headers
            }

            row = {
                'id': poi_id,
                'type': poi.get('type'),
                'lat': lat,
                'lon': lon,
                'name': name,
                'amenity': tags.get('amenity'),
                'shop': tags.get('shop'),
                'tourism': tags.get('tourism'),
                'historic': tags.get('historic'),
                'craft': tags.get('craft'),
                'other_tags': json.dumps(other_tags, ensure_ascii=False)
            }
            writer.writerow(row)

    print(f"Successfully saved {len(processed_ids)} unique POIs to {filename}")

if __name__ == "__main__":
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Set the project root as the parent directory of the script's directory
    project_root = os.path.dirname(script_dir)
    # Define the output directory relative to the project root
    output_directory = os.path.join(project_root, 'data')

    osm_pois = fetch_osm_pois()
    if osm_pois:
        save_pois_to_csv(osm_pois, output_dir=output_directory)
