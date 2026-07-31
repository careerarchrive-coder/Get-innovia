import { XMLParser } from 'fast-xml-parser';

function stripTrackingPixel(html) {
  if (!html) return '';
  return String(html).replace(/<img[^>]*>/gi, '').trim();
}

function normalizeJob(job, index) {
  const location = [job.Area, job.Location, job.Country].filter(Boolean).join(', ');

return {
  id: String(job.DisplayReference || job.SenderReference || index),
  title: job.Position || 'Untitled Position',
  company: job.AdvertiserName || 'Unknown Company',
  classification: job.Classification || '',
  description: stripTrackingPixel(job.Description),
  location,
  employmentType: job.EmploymentType || '',
  workHours: job.WorkHours || '',
  applicationUrl: job.ApplicationURL || '#',
};
}

export async function fetchJobs() {
  const feedUrl = process.env.JOB_FEED_URL;

if (!feedUrl) {
  throw new Error('JOB_FEED_URL environment variable is not set');
}

const res = await fetch(feedUrl);

if (!res.ok) {
  throw new Error('Failed to fetch job feed: ' + res.status);
}

const xml = await res.text();

const parser = new XMLParser({
  ignoreAttributes: false,
  trimValues: true,
  parseTagValue: false,
});

const data = parser.parse(xml);
  const jobsRaw = data && data.Jobs ? data.Jobs.Job : null;
  const jobsArray = Array.isArray(jobsRaw) ? jobsRaw : jobsRaw ? [jobsRaw] : [];

return jobsArray.map((job, index) => normalizeJob(job, index));
}
