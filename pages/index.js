import Head from 'next/head';
import { fetchJobs } from '../lib/fetchJobs';

export default function Home({ jobs, error }) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
<Head>
  <title>Innovia Job Board</title>
<meta name="description" content="Current job openings from Innovia hiring partners" />
  </Head>

<h1 style={{ marginBottom: '0.25rem' }}>Innovia Job Board</h1>
<p style={{ color: '#555', marginTop: 0 }}>Current openings from our hiring partners</p>

{error && (
  <p style={{ color: '#b00020' }}>Unable to load jobs right now. Please try again later.</p>
)}

{!error && jobs.length === 0 && <p>No jobs are currently available. Check back soon.</p>}

<ul style={{ listStyle: 'none', padding: 0 }}>
{jobs.map((job) => (
  <li
          key={job.id}
style={{
  border: '1px solid #e2e2e2',
  borderRadius: 8,
  padding: '1.25rem',
  marginBottom: '1rem',
}}
>
<h2 style={{ margin: '0 0 0.25rem' }}>{job.title}</h2>
<div style={{ color: '#555', marginBottom: '0.5rem' }}>
{job.company}
{job.location ? ` • ${job.location}` : ''}
</div>
<div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '0.75rem' }}>
{[job.employmentType, job.workHours, job.classification].filter(Boolean).join(' • ')}
</div>
<p style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
{job.description.length > 300
 ? job.description.slice(0, 300) + '…'
  : job.description}
</p>
<a
href={job.applicationUrl}
target="_blank"
rel="noopener noreferrer"
style={{
  display: 'inline-block',
  marginTop: '0.5rem',
  padding: '0.5rem 1rem',
  background: '#111',
  color: '#fff',
  borderRadius: 6,
  textDecoration: 'none',
}}
>
Apply Now
  </a>
  </li>
))}
  </ul>
  </div>
);
}

export async function getStaticProps() {
  try {
    const jobs = await fetchJobs();
    return {
      props: { jobs },
      revalidate: 600,
    };
  } catch (err) {
    console.error('Failed to load job feed', err);
    return {
      props: { jobs: [], error: true },
      revalidate: 60,
    };
  }
}
