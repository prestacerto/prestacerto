// Lead enrichment utilities - fetch company data from public sources
import axios from 'axios';

export interface EnrichedData {
  company_size?: string;
  industry?: string;
  founded_year?: string;
  location?: string;
  website?: string;
  linkedin_url?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  revenue_estimate?: string;
  description?: string;
}

async function enrichFromWebSearch(company: string, context?: string): Promise<EnrichedData> {
  const data: EnrichedData = {};

  try {
    // Google Custom Search API - requires GOOGLE_SEARCH_API_KEY
    if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
      const searchQuery = `${company} company information ${context || ''}`;
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          q: searchQuery,
          key: process.env.GOOGLE_SEARCH_API_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          num: 5,
        },
      });

      if (response.data.items && response.data.items.length > 0) {
        const result = response.data.items[0];
        data.description = result.snippet;

        // Extract common company metadata
        if (result.link) {
          data.website = result.link;
        }
      }
    }
  } catch (error) {
    console.error('Web search enrichment error:', error);
  }

  return data;
}

async function enrichFromLinkedIn(company: string): Promise<EnrichedData> {
  const data: EnrichedData = {};

  try {
    // LinkedIn Profile Scraper API (mock - in production use proper LinkedIn API)
    // This is a placeholder for LinkedIn enrichment
    if (process.env.LINKEDIN_API_KEY) {
      // Add LinkedIn enrichment logic here
    }
  } catch (error) {
    console.error('LinkedIn enrichment error:', error);
  }

  return data;
}

async function enrichFromClearbit(company: string, email?: string): Promise<EnrichedData> {
  const data: EnrichedData = {};

  try {
    // Clearbit API - free tier includes company and person enrichment
    if (process.env.CLEARBIT_API_KEY) {
      // Company enrichment
      const companyResponse = await axios.get(`https://company.clearbit.com/v1/domains/find`, {
        params: { name: company },
        headers: { Authorization: `Bearer ${process.env.CLEARBIT_API_KEY}` },
      });

      if (companyResponse.data) {
        const clearbitData = companyResponse.data;
        if (clearbitData.domain) {
          data.website = `https://${clearbitData.domain}`;
        }
      }

      // Company details
      if (data.website) {
        const domain = new URL(data.website).hostname;
        const detailsResponse = await axios.get(`https://company.clearbit.com/v2/companies/domains/${domain}`, {
          headers: { Authorization: `Bearer ${process.env.CLEARBIT_API_KEY}` },
        });

        if (detailsResponse.data) {
          const details = detailsResponse.data;
          data.company_size = details.metrics?.employeesRange;
          data.industry = details.industry;
          data.location = details.location;
          data.revenue_estimate = details.metrics?.revenue;
          data.linkedin_url = details.linkedin?.handle ? `https://linkedin.com/company/${details.linkedin.handle}` : undefined;
        }
      }
    }
  } catch (error) {
    console.error('Clearbit enrichment error:', error);
  }

  return data;
}

async function enrichFromRocketReach(company: string, email?: string): Promise<EnrichedData> {
  const data: EnrichedData = {};

  try {
    // RocketReach API - requires API key
    if (process.env.ROCKETREACH_API_KEY) {
      // Add RocketReach enrichment logic here
    }
  } catch (error) {
    console.error('RocketReach enrichment error:', error);
  }

  return data;
}

export async function enrichProspect(
  name: string,
  company: string,
  email?: string,
  phone?: string
): Promise<EnrichedData> {
  // Try multiple sources and merge results
  const results = await Promise.all([
    enrichFromWebSearch(company, name),
    enrichFromClearbit(company, email),
    // Add other sources as configured
  ]);

  // Merge all enrichment data, prioritizing more complete data
  const enriched: EnrichedData = {};

  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {
      if (value && !enriched[key as keyof EnrichedData]) {
        enriched[key as keyof EnrichedData] = value as any;
      }
    }
  }

  return enriched;
}

export function scoreProspectByEnrichment(enriched: EnrichedData): number {
  let score = 0;

  if (enriched.website) score += 10;
  if (enriched.linkedin_url) score += 10;
  if (enriched.company_size) score += 10;
  if (enriched.industry) score += 10;
  if (enriched.location) score += 5;
  if (enriched.revenue_estimate) score += 10;
  if (enriched.description) score += 5;

  return Math.min(score, 100);
}
