import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const API = "http://localhost:8081";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/api/products`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Products request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      /*
       * Spring Boot may return:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * OR a Spring Page:
       *
       * {
       *   "content": [...]
       * }
       */

      const rawProducts = Array.isArray(data)
        ? data
        : Array.isArray(data.content)
        ? data.content
        : Array.isArray(data.products)
        ? data.products
        : [];

      const normalizedProducts = rawProducts.map(normalizeProduct);

      setProducts(normalizedProducts);

      /*
       * Build category list from the actual backend products.
       */
      const uniqueCategories = [
        ...new Set(
          normalizedProducts
            .map((product) => product.category)
            .filter(Boolean)
        ),
      ].sort((a, b) => a.localeCompare(b));

      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Failed to load GALERIE products:", err);

      setProducts([]);
      setCategories([]);

      setError(
        "Unable to load products. Make sure the Spring Boot server is running on port 8081."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Convert the Spring Boot Product entity into the shape
   * expected by the existing GALERIE ProductCard.
   */
  function normalizeProduct(product) {
    const categoryName =
      typeof product.category === "string"
        ? product.category
        : product.category?.name || "Collection";

    const vendorName =
      typeof product.vendor === "string"
        ? product.vendor
        : product.vendor?.storeName ||
          product.vendor?.name ||
          "Galerie Studio";

    const image =
      product.imageUrl ||
      product.image ||
      product.image_link ||
      "";

    const price = Number(product.price || 0);

    const rating = Number(product.rating || 0);

    const reviewCount = Number(
      product.reviewCount ||
        product.reviews ||
        0
    );

    const stock = Number(
      product.stock ??
        product.inventory?.quantity ??
        0
    );

    return {
      ...product,

      id: product.id,

      name:
        product.name ||
        "Untitled product",

      description:
        product.description ||
        product.desc ||
        "A curated product from the GALERIE marketplace.",

      desc:
        product.description ||
        product.desc ||
        "A curated product from the GALERIE marketplace.",

      price,

      rating,

      reviews: reviewCount,

      reviewCount,

      stock,

      image,

      imageUrl: image,

      vendor: vendorName,

      vendorName,

      category: categoryName,

      categoryName,
    };
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * Search
     */
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) => {
        const name = String(product.name || "").toLowerCase();

        const description = String(
          product.description || ""
        ).toLowerCase();

        const vendor = String(
          product.vendor || ""
        ).toLowerCase();

        const categoryName = String(
          product.category || ""
        ).toLowerCase();

        return (
          name.includes(query) ||
          description.includes(query) ||
          vendor.includes(query) ||
          categoryName.includes(query)
        );
      });
    }

    /*
     * Category filter
     */
    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    /*
     * Sorting
     */
    if (sort === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    /*
     * Featured:
     * keep the backend order.
     */
    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  return (
    <main className="min-h-screen px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================== */}
        <section className="mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-purple-400">
            Galerie Marketplace
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-serif text-5xl italic tracking-tight sm:text-6xl">
                Explore
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                Discover curated products from independent
                studios across GALERIE.
              </p>
            </div>

            <div className="text-sm text-muted-foreground">
              {loading
                ? "Loading..."
                : `${filteredProducts.length} products`}
            </div>
          </div>
        </section>

        {/* =========================
            SEARCH + FILTERS
        ========================== */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.025] p-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search products, vendors, categories..."
                className="h-12 w-full rounded-full border border-white/10 bg-background/50 pl-11 pr-11 text-sm outline-none transition focus:border-purple-400/50"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="h-12 rounded-full border border-white/10 bg-background px-5 text-sm outline-none"
              >
                <option value="featured">
                  Featured
                </option>

                <option value="rating">
                  Top rated
                </option>

                <option value="price-low">
                  Price: low to high
                </option>

                <option value="price-high">
                  Price: high to low
                </option>
              </select>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {["All", ...categories].map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setCategory(item)
                    }
                    className={cn(
                      "whitespace-nowrap rounded-full border px-4 py-2 text-xs transition",

                      category === item
                        ? "border-purple-400/50 bg-purple-500/15 text-purple-200"
                        : "border-white/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </section>

        {/* =========================
            LOADING
        ========================== */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />

              <span>
                Loading GALERIE products...
              </span>
            </div>
          </div>
        )}

        {/* =========================
            ERROR
        ========================== */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-8 text-center">
            <p className="text-sm text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm text-background transition hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center">
              <h2 className="font-serif text-2xl italic">
                No products available
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                The GALERIE catalog is currently empty.
              </p>
            </div>
          )}

        {/* =========================
            SEARCH EMPTY
        ========================== */}
        {!loading &&
          !error &&
          products.length > 0 &&
          filteredProducts.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center">
              <h2 className="font-serif text-2xl italic">
                Nothing found
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Try another search or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-5 rounded-full bg-foreground px-5 py-2.5 text-sm text-background"
              >
                Clear filters
              </button>
            </div>
          )}

        {/* =========================
            PRODUCTS
        ========================== */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}