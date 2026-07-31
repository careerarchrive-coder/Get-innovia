import { XMLParser } from 'fast-xml-parser';
import { unzipSync } from 'fflate';

function sanitizeDescription(html) {
    if (!html) return '';
    const withoutTags = String(html).replace(/<[^>]*>/g, ' ');
    return withoutTags
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&#39;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, ' ')
      .trim();
}

function normalizeJob(job, index) {
    const location = [job.Area, job.Location, job.Country].filter(Boolean).join(', ');
    const referenceId = [job.SenderReference, job.DisplayReference].filter(Boolean).join('-') || `job-${index}`;

  return {
        id: referenceId,
        title: job.Position || 'Untitled Position',
        company: job.AdvertiserName || 'Unknown Company',
        classification: job.Classification || '',
        description: sanitizeDescription(job.Description),
        location,
        employmentType: job.EmploymentType || '',
        workHours: job.WorkHours || '',
        applicationUrl: job.ApplicationURL || '#',
  };
}

async function fetchFeedXml(feedUrl) {
    const res = await fetch(feedUrl);

  if (!res.ok) {
        throw new Error('Failed to fetch job feed: ' + res.status);
  }

  const contentType = res.headers.get('content-type') || '';
    const buffer = new Uint8Array(await res.arrayBuffer());
    const looksLikeZip = buffer[0] === 0x50 && buffer[1] === 0x4b;
    const isZip = contentType.includes('zip') || looksLikeZip;

  if (!isZip) {
        return new TextDecoder('utf-8').decode(buffer);
  }

  const files = unzipSync(buffer);
    const xmlFileName = Object.keys(files).find((name) => name.toLowerCase().endsWith('.xml'));

  if (!xmlFileName) {
        throw new Error('No XML file found inside job feed archive');
  }

  return new TextDecoder('utf-8').decode(files[xmlFileName]);
}


function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJobs() {
    const feedUrl = process.env.JOB_FEED_URL;

if (!feedUrl) {
    throw new Error('JOB_FEED_URL environment variable is not set');
}

const parser = new XMLParser({
    ignoreAttributes: false,
    trimValues: true,
    parseTagValue: false,
});

let lastError = null;

for (let attempt = 1; attempt <= 3; attempt++) {
    try {
        const xml = await fetchFeedXml(feedUrl);
        const data = parser.parse(xml);
        const jobsRaw = data && data.Jobs ? data.Jobs.Job : null;
        const jobsArray = Array.isArray(jobsRaw) ? jobsRaw : jobsRaw ? [jobsRaw] : [];

    if (jobsArray.length > 0 || attempt === 3) {
        return jobsArray.map((job, index) => normalizeJob(job, index));
    }
    } catch (err) {
        lastError = err;
    }

    await delay(1500);
}

if (lastError) {
    throw lastError;
}

return [];
}
