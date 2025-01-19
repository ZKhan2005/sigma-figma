// import {createClient} from "next-sanity"
// import { projectId } from "../env"
// const client = createClient({
//     projectId : "h7j0dwun",
//     dataset : "production",
//     useCdn : true,
//     apiVersion : "2023-10-10"
// })
// export async function sanityFetch(query: any,params= {}):{query: string , params?: any}{
//     return await client.fetch(query,params)
// }

import { createClient } from "next-sanity";

// Import project environment variables
import { projectId } from "../env";

// Ensure `projectId` is properly used or default it directly here
const client = createClient({
    projectId: projectId || "h7j0dwun", // Fallback if `projectId` isn't defined in `env`
    dataset: "production",
    useCdn: true,
    apiVersion: "2023-10-10", // Ensure this version is compatible with your setup
});

// Function to fetch data from Sanity
export async function sanityFetch<T>(query: string, params: Record<string, any> = {}): Promise<T> {
    try {
        return await client.fetch(query, params);
    } catch (error) {
        console.error("Sanity Fetch Error:", error);
        throw new Error("Failed to fetch data from Sanity");
    }
}
