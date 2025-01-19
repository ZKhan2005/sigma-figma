import { defineQuery } from "next-sanity";

// Define the query for fetching all products
export const allProducts = defineQuery(`
  *[_type == 'product'] {
    _id,
    name,
    description,
    price,
    discountPercentage,
    rating,
    ratingCount,
    tags,
    sizes,
    "imageUrl": image.asset->url
  }
`);

export const fourProducts = defineQuery(`
    *[_type == 'product'][0..3] {
      _id,
      name,
      description,
      price,
      discountPercentage,
      rating,
      ratingCount,
      tags,
      sizes,
      "imageUrl": image.asset->url
    }
  `);
  