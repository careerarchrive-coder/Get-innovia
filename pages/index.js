import { useMemo, useState } from 'react';
import Head from 'next/head';
import { fetchJobs } from '../lib/fetchJobs';

const selectStyle = {
    padding: '0.5rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: '0.95rem',
};

export default function Home({ jobs, error }) {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [classification, setClassification] = useState('');
    const [jobType, setJobType] = useState('');

  const classifications = useMemo(() => {
        const set = new Set(jobs.map((job) => job.classification).filter(Boolean));
        return Array.from(set).sort();
  }, [jobs]);

  const jobTypes = useMemo(() => {
        const set = new Set(jobs.map((job) => job.employmentType).filter(Boolean));
        return Array.from(set).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        const loc = location.trim().toLowerCase();

                                   return jobs.filter((job) => {
                                           const matchesKeyword =
                                                     !kw ||
                                                     job.title.toLowerCase().includes(kw) ||
                                                     job.company.toLowerCase().includes(kw) ||
                                                     job.description.toLowerCase().includes(kw);

                                                            const matchesLocation = !loc || job.location.toLowerCase().includes(loc);

                                                            const matchesClassification = !classification || job.classification === classification;

                                                            const matchesJobType = !jobType || job.employmentType === jobType;

                                                            return matchesKeyword && matchesLocation && matchesClassification && matchesJobType;
                                   });
  }, [jobs, keyword, location, classification, jobType]);

  const hasActiveFilters = keyword || location || classification || jobType;

  function clearFilters() {
        setKeyword('');
        setLocation('');
        setClassification('');
        setJobType('');
  }

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

{!error && (
          <div
           style={{
                         display: 'grid',
                         gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                         gap: '0.75rem',
                         background: '#f7f7f7',
                         border: '1px solid #e2e2e2',
                         borderRadius: 8,
                         padding: '1rem',
                         marginBottom: '1.5rem',
           }}
        >
          <input
            type="text"
            placeholder="Search job title, company, or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ ...selectStyle, gridColumn: '1 / -1' }}
          />

          <input
            type="text"
            placeholder="Location (city, state, country)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={selectStyle}
          />

                        <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            style={selectStyle}
          >
                          <option value="">All Categories</option>
{classifications.map((c) => (
                <option key={c} value={c}>
  {c}
  </option>
                                 ))}
</select>

          <select value={jobType} onChange={(e) => setJobType(e.target.value)} style={selectStyle}>
              <option value="">All Job Types</option>
{jobTypes.map((t) => (
                <option key={t} value={t}>
  {t}
  </option>
                          ))}
</select>

{hasActiveFilters && (
              <button
               type="button"
               onClick={clearFilters}
               style={{
                                 ...selectStyle,
                                 background: '#111',
                                 color: '#fff',
                                 cursor: 'pointer',
                 }}
                             >
                               Clear Filters
                 </button>
           )}
</div>
      )}

{!error && (
          <p style={{ color: '#555', fontSize: '0.9rem' }}>
{filteredJobs.length} job{filteredJobs.length === 1 ? '' : 's'} found
  </p>
      )}

{!error && jobs.length === 0 && <p>No jobs are currently available. Check back soon.</p>}

 {!error && jobs.length > 0 && filteredJobs.length === 0 && (
           <p>No jobs match your search filters. Try broadening your search.</p>
        )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
{filteredJobs.map((job) => (
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
