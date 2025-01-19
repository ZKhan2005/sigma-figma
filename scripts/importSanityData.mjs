import { createClient } from '@sanity/client';
import fetch from 'node-fetch';

const client = createClient({
    projectId: "h7j0dwun",
    dataset: "production",
    useCdn: true,
    apiVersion: '2025-01-13',
    token: "skMSwCF63jDx9jYUGvBHtHZ8F5EgGuE0unzWe9FtJygd4TQX4PVaooDKgnlfFO6x8F6uq4hh1AQdbHZtQ3QQtz4PH8ZFTvYfp2FUZxoAvF7Q5lahwRb1n3nJilkn2qyIsp5jl5XOXoDbcmLWZ2JqSuyujbQ8W7qU8HC2kMnCRyFmyWSCa4Hw",
});

async function uploadImageToSanity(imageUrl) {
    try {
        console.log(`Uploading image: ${imageUrl}`);

        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${imageUrl}`);
        }

        const buffer = await response.arrayBuffer();
        const bufferImage = Buffer.from(buffer);

        const asset = await client.assets.upload('image', bufferImage, {
            filename: imageUrl.split('/').pop(),
        });

        console.log(`Image uploaded successfully: ${asset._id}`);
        return asset._id;
    } catch (error) {
        console.error('Failed to upload image:', imageUrl, error);
        return null;
    }
}

async function uploadProduct(product) {
    try {
        const imageId = await uploadImageToSanity(product.imageUrl);

        if (imageId) {
            const document = {
                _type: 'products',
                name: product.name,
                description: product.description,
                price: product.price,
                image: {
                    _type: 'image',
                    asset: {
                        _ref: imageId,
                    },
                },
                discountPercent: product.discountPercent,
                isNew: product.isNew,
                colors: product.colors,
                sizes: product.sizes,
            };

            const createdProduct = await client.create(document);
            console.log(`Product ${product.name} uploaded successfully:`, createdProduct);
        } else {
            console.log(`Product ${product.name} skipped due to image upload failure.`);
        }
    } catch (error) {
        console.error('Error uploading product:', error);
    }
}

async function importProducts() {
    try {
        const response = await fetch('https://template1-neon-nu.vercel.app/api/products');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const products = await response.json();

        for (const product of products) {
            await uploadProduct(product);
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

importProducts();