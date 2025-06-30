
import csv
import json
import os

def classify_poi(row):
    """Applies classification logic to a single POI row."""
    amenity = row.get('amenity', '')
    shop = row.get('shop', '')
    tags = json.loads(row.get('other_tags', '{}'))
    cuisine = tags.get('cuisine', '')
    name = row.get('name', '')

    main_category = '其他'
    sub_category = '其他'

    # 1. Cafe & Teahouses
    if (
        amenity == 'cafe' or
        shop == 'tea' or
        'coffee_shop' in cuisine
    ):
        main_category = '餐飲美食'
        sub_category = '咖啡茶館'

    # 2. Specialty Drinks & Bars
    elif (
        shop == 'beverages' or
        'bubble_tea' in cuisine or
        amenity == 'bar'
    ):
        main_category = '餐飲美食'
        sub_category = '特色飲品與酒吧'

    # 3. Local Snacks & Desserts
    elif (
        amenity == 'fast_food' or
        shop in ['bakery', 'pastry', 'ice_cream'] or
        any(c in cuisine for c in ['local', 'dessert', 'dim_sum', 'snack']) or
        any(s in name for s in ['小吃', '甜品', '豆花', '冰', '米糕', '油飯', '魷魚羹'])
    ):
        main_category = '餐飲美食'
        sub_category = '傳統小吃與點心'

    # 4. Sit-down Meals
    elif amenity == 'restaurant':
        main_category = '餐飲美食'
        sub_category = '正餐選擇'

    # Fallback for other shops/amenities
    elif shop:
        main_category = '特色購物'
        sub_category = shop # Use the specific shop type as sub-category
    elif amenity:
        main_category = '公共設施'
        sub_category = amenity

    row['main_category'] = main_category
    row['sub_category'] = sub_category
    return row

def main():
    """Main function to read, classify, and write POI data."""
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    input_filename = os.path.join(project_root, 'data', 'osm_pois.csv')
    output_filename = os.path.join(project_root, 'data', 'classified_pois.csv')

    try:
        with open(input_filename, 'r', newline='', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            original_fieldnames = reader.fieldnames
            pois = [row for row in reader]

        print(f"Read {len(pois)} POIs from {input_filename}")

        classified_pois = [classify_poi(poi) for poi in pois]

        new_fieldnames = original_fieldnames + ['main_category', 'sub_category']

        with open(output_filename, 'w', newline='', encoding='utf-8') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=new_fieldnames)
            writer.writeheader()
            writer.writerows(classified_pois)

        print(f"Successfully classified POIs and saved to {output_filename}")

    except FileNotFoundError:
        print(f"Error: Input file not found at {input_filename}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
