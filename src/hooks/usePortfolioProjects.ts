import { useState, useEffect } from 'react';
import { FALLBACK_PROJECTS } from '../data/fallbackProjects';

export interface PortfolioProject {
  id: string;
  title: string;
  slug?: string | null;
  status?: string;
  category?: string;
  summary?: string;
  updatedAt?: string;
  rawUpdatedAt?: string;
  body?: string;
  content?: string;
  link?: string;
  image?: string;
  coverImage?: string;
  pinimage?: string;
  author?: string;
  client?: string;
  photo?: string;
}

/**
 * Normalizes project properties such as fallback summaries and links.
 */
export function normalizeProject(project: PortfolioProject): PortfolioProject {
  let summary = project.summary?.trim() || '';
  let link = project.link?.trim() || '';

  // If summary is empty, generate a clean excerpt from body or content
  if (!summary && (project.body || project.content)) {
    const raw = (project.body || project.content || '')
      .replace(/^#+\s+[^\n]+/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();
    const firstParagraph = raw.split(/\n\s*\n/)[0]?.trim() || '';
    const firstSentence = firstParagraph.split('. ')[0]?.trim();
    summary = firstSentence ? `${firstSentence}.` : firstParagraph.slice(0, 140).trim();
  }

  // If link is empty, attempt to extract any live URL from markdown body
  if (!link && (project.body || project.content)) {
    const urlMatch = (project.body || project.content || '').match(/https?:\/\/[^\s)\"']+/);
    if (urlMatch) {
      link = urlMatch[0];
    }
  }

  return {
    ...project,
    summary: summary || 'Explore this project and read the full story.',
    link,
  };
}

/**
 * Parses various updatedAt formats (e.g. "Just now", "2 hours ago", "10/13/2026", ISO strings)
 * into a comparable numeric epoch timestamp.
 */
export function parseUpdatedTime(val?: string | null, rawVal?: string | null): number {
  if (rawVal) {
    const rawTime = Date.parse(rawVal);
    if (!isNaN(rawTime)) return rawTime;
  }
  if (!val) return 0;
  const str = String(val).trim().toLowerCase();

  if (str === 'just now' || str === 'right now') {
    return Date.now();
  }
  if (str === 'yesterday') {
    return Date.now() - 86400000;
  }

  const match = str.match(
    /^(\d+)\s*(s|sec|second|m|min|minute|h|hr|hour|d|day|w|wk|week|mo|month|y|yr|year)s?\s*ago$/
  );
  if (match && match[1] && match[2]) {
    const num = parseInt(match[1], 10);
    const unit = match[2];
    const msMap: Record<string, number> = {
      s: 1000, sec: 1000, second: 1000,
      m: 60000, min: 60000, minute: 60000,
      h: 3600000, hr: 3600000, hour: 3600000,
      d: 86400000, day: 86400000,
      w: 604800000, wk: 604800000, week: 604800000,
      mo: 2592000000, month: 2592000000,
      y: 31536000000, yr: 31536000000, year: 31536000000,
    };
    return Date.now() - num * (msMap[unit] || 60000);
  }

  const parsed = Date.parse(val);
  if (!isNaN(parsed)) {
    return parsed;
  }

  return 0;
}

/**
 * Normalizes and sorts projects with the latest updated first.
 */
export function sortProjectsByUpdated(projects: PortfolioProject[]): PortfolioProject[] {
  return [...projects].map(normalizeProject).sort((a, b) => {
    const timeA = parseUpdatedTime(a.updatedAt, a.rawUpdatedAt);
    const timeB = parseUpdatedTime(b.updatedAt, b.rawUpdatedAt);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    // Tie-breaker: compare IDs
    return (b.id || '').localeCompare(a.id || '');
  });
}

export const STORAGE_CACHE_KEY = 'vinay_portfolio_projects_cache_v2';
export const STORAGE_TIMESTAMP_KEY = 'vinay_portfolio_projects_cache_time';

function getCachedProjects(): PortfolioProject[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sortProjectsByUpdated(parsed);
      }
    }
  } catch (err) {
    console.warn('Could not read cached portfolio projects:', err);
  }
  return null;
}

// In-flight singleton promise to avoid duplicate network calls
let inFlightFetchPromise: Promise<PortfolioProject[] | null> | null = null;

export async function fetchLiveProjects(): Promise<PortfolioProject[] | null> {
  if (inFlightFetchPromise) return inFlightFetchPromise;

  inFlightFetchPromise = (async () => {
    try {
      const baseUrl = import.meta.env['VITE_API_BASE_URL'];
      const slug = import.meta.env['VITE_API_SLUG'];
      const token = import.meta.env['VITE_API_TOKEN'];
      const endpoint = `${baseUrl}/api/v1/${slug}/project-with-blog`;

      // 20-second timeout controller so cold-starts don't freeze the app indefinitely
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch project data: HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json && Array.isArray(json.data) && json.data.length > 0) {
        const sorted = sortProjectsByUpdated(json.data);
        try {
          localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(sorted));
          localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
        } catch (storageErr) {
          console.warn('Failed to cache projects in localStorage:', storageErr);
        }
        return sorted;
      }
      return null;
    } catch (err) {
      console.error('Error fetching live portfolio projects:', err);
      return null;
    } finally {
      inFlightFetchPromise = null;
    }
  })();

  return inFlightFetchPromise;
}

// Eager fetch as soon as this module is loaded by Vite
if (typeof window !== 'undefined') {
  fetchLiveProjects().catch(() => {});
}

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<PortfolioProject[]>(() => {
    const cached = getCachedProjects();
    return cached ?? [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const cached = getCachedProjects();
    return !cached || cached.length === 0;
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsSyncing(true);
      const data = await fetchLiveProjects();
      if (!isMounted) return;

      if (data && data.length > 0) {
        setProjects(data);
      } else {
        // Fallback if network failed and no cached data exists
        setProjects((prev) => {
          if (prev.length === 0 && FALLBACK_PROJECTS.length > 0) {
            return sortProjectsByUpdated(FALLBACK_PROJECTS);
          }
          return prev;
        });
      }

      setLoading(false);
      setIsSyncing(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  // Developer / debug helper to test loading states in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).clearProjectsCache = () => {
        localStorage.removeItem(STORAGE_CACHE_KEY);
        localStorage.removeItem(STORAGE_TIMESTAMP_KEY);
        console.log('[Portfolio] Project cache cleared. Reloading...');
        window.location.reload();
      };
    }
  }, []);

  return { projects, loading, isSyncing };
}
