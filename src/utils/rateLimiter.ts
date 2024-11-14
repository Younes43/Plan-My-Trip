import { LRUCache } from 'lru-cache';

interface RateLimitConfig {
    interval: number;  // in milliseconds
    maxRequests: number;
}

const rateLimits: Record<string, RateLimitConfig> = {
    TRAVEL_PLAN: {
        interval: 60 * 1000, // 1 minute
        maxRequests: 5
    },
    GOOGLE_PLACES: {
        interval: 60 * 1000,
        maxRequests: 100  // Adjust based on your Google Places API quota
    },
    OPENAI: {
        interval: 60 * 1000,
        maxRequests: 20
    }
};

const tokenCache = new LRUCache({
    max: 500,
    ttl: 60 * 1000 // 1 minute
});

export async function checkRateLimit(key: string, identifier: string): Promise<void> {
    const limit = rateLimits[key];
    if (!limit) throw new Error(`Unknown rate limit key: ${key}`);

    const tokenKey = `${key}:${identifier}`;
    const currentRequests = (tokenCache.get(tokenKey) as number) || 0;

    if (currentRequests >= limit.maxRequests) {
        throw new Error(`Rate limit exceeded ${key} : ${limit.maxRequests},  Please try after a while.`);
    }

    tokenCache.set(tokenKey, currentRequests + 1);
}
