import json
import csv
import requests
from pathlib import Path


# ============================================================
# GALERIE PRODUCT DATASET GENERATOR
# Amazon Reviews 2023
# ============================================================

BASE_URL = (
    "https://huggingface.co/datasets/"
    "McAuley-Lab/Amazon-Reviews-2023/"
    "resolve/main/raw/meta_categories/"
)

# Number of products per category
PRODUCTS_PER_CATEGORY = 25

# Maximum number of source records to inspect per category.
# This prevents downloading huge category files unnecessarily.
MAX_RECORDS_TO_SCAN = 5000

OUTPUT_FILE = Path("galerie_products.csv")


# ------------------------------------------------------------
# Categories selected for GALERIE
# ------------------------------------------------------------

CATEGORIES = [
    "Electronics",
    "Cell_Phones_and_Accessories",
    "Computers",
    "Amazon_Fashion",
    "Clothing_Shoes_and_Jewelry",
    "Home_and_Kitchen",
    "Appliances",
    "Beauty_and_Personal_Care",
    "All_Beauty",
    "Sports_and_Outdoors",
    "Toys_and_Games",
    "Video_Games",
    "Musical_Instruments",
    "Books",
    "Office_Products",
    "Automotive",
    "Pet_Supplies",
    "Tools_and_Home_Improvement",
    "Arts_Crafts_and_Sewing",
    "Patio_Lawn_and_Garden",
]


# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

def first_image(images):
    """
    Extract a usable high-resolution image URL.
    """

    if not isinstance(images, list):
        return ""

    for image in images:

        if not isinstance(image, dict):
            continue

        url = (
            image.get("hi_res")
            or image.get("large")
            or image.get("thumb")
            or ""
        )

        if url.startswith("http"):
            return url

    return ""


def clean_text(value):
    """
    Convert lists/dicts into readable text.
    """

    if value is None:
        return ""

    if isinstance(value, list):
        return " ".join(
            str(x).strip()
            for x in value
            if x
        )

    if isinstance(value, dict):
        return " ".join(
            f"{k}: {v}"
            for k, v in value.items()
        )

    return str(value).strip()


def valid_product(item):
    """
    Only keep products useful for GALERIE.
    """

    title = clean_text(item.get("title"))
    price = item.get("price")
    image = first_image(item.get("images"))

    if not title:
        return False

    if not image:
        return False

    if price is None:
        return False

    try:
        price = float(price)
    except:
        return False

    if price <= 0:
        return False

    return True


# ------------------------------------------------------------
# Download category
# ------------------------------------------------------------

def process_category(category, writer):

    filename = f"meta_{category}.jsonl"

    url = BASE_URL + filename

    print()
    print("=" * 70)
    print(f"Category: {category}")
    print(f"URL: {url}")
    print("=" * 70)

    try:

        response = requests.get(
            url,
            stream=True,
            timeout=60,
            headers={
                "User-Agent": "GALERIE-Dataset-Generator"
            },
        )

        response.raise_for_status()

    except Exception as error:

        print(
            f"Could not download {category}: {error}"
        )

        return 0

    count = 0
    scanned = 0

    for raw_line in response.iter_lines(
        decode_unicode=True
    ):

        if not raw_line:
            continue

        scanned += 1

        if scanned > MAX_RECORDS_TO_SCAN:
            break

        try:
            item = json.loads(raw_line)

        except json.JSONDecodeError:
            continue

        if not valid_product(item):
            continue

        title = clean_text(
            item.get("title")
        )

        description = clean_text(
            item.get("description")
        )

        features = clean_text(
            item.get("features")
        )

        image = first_image(
            item.get("images")
        )

        price = float(
            item.get("price")
        )

        rating = float(
            item.get(
                "average_rating",
                0
            ) or 0
        )

        review_count = int(
            item.get(
                "rating_number",
                0
            ) or 0
        )

        store = clean_text(
            item.get("store")
        )

        parent_asin = item.get(
            "parent_asin",
            ""
        )

        categories = clean_text(
            item.get("categories")
        )

        # ----------------------------------------------------
        # Write normalized GALERIE product
        # ----------------------------------------------------

        writer.writerow({
            "source_id": parent_asin,
            "name": title,
            "description": (
                description
                or features
                or f"Curated product from {category}."
            )[:3000],
            "image_url": image,
            "price": round(price, 2),
            "rating": round(rating, 2),
            "review_count": review_count,
            "category": category.replace(
                "_",
                " "
            ),
            "store": store,
            "source_categories": categories,
        })

        count += 1

        print(
            f"  [{count}/{PRODUCTS_PER_CATEGORY}] "
            f"{title[:75]}"
        )

        if count >= PRODUCTS_PER_CATEGORY:
            break

    response.close()

    print(
        f"Finished {category}: "
        f"{count} products"
    )

    return count


# ------------------------------------------------------------
# Main
# ------------------------------------------------------------

def main():

    print()
    print("==============================================")
    print(" GALERIE MARKETPLACE DATASET GENERATOR")
    print(" Amazon Reviews 2023")
    print("==============================================")
    print()

    total = 0

    with open(
        OUTPUT_FILE,
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        fieldnames = [
            "source_id",
            "name",
            "description",
            "image_url",
            "price",
            "rating",
            "review_count",
            "category",
            "store",
            "source_categories",
        ]

        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames
        )

        writer.writeheader()

        for category in CATEGORIES:

            count = process_category(
                category,
                writer
            )

            total += count

    print()
    print("==============================================")
    print(" COMPLETE")
    print("==============================================")
    print()
    print(
        f"Products generated: {total}"
    )
    print(
        f"Output file: {OUTPUT_FILE.absolute()}"
    )
    print()


if __name__ == "__main__":
    main()