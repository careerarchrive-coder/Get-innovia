import { useMemo, useState } from 'react';
import Head from 'next/head';
import { fetchJobs } from '../lib/fetchJobs';

export default function Home({ jobs, error }) {
      const [keyword, setKeyword] = useState('');
      const [location, setLocation] = useState('');
      const [classification, setClassification] = useState('');
      const [jobType, setJobType] = useState('');

  const classifications = useMemo(() => {
          const set = new Set(jobs.map((job) => job.classification).filter(Boolean));
          return Array.from(set).sort();
  }, [jobs]);

        const locations = useMemo(() => {
                  const set = new Set(jobs.map((job) => job.location).filter(Boolean));
                  return Array.from(set).sort();
        }, [jobs]);

  const jobTypes = useMemo(() => {
          const set = new Set(jobs.map((job) => job.employmentType).filter(Boolean));
          return Array.from(set).sort();
  }, [jobs]);

  const filteredJobs = useMemo(() => {
          const kw = keyword.trim().toLowerCase();
                    return jobs.filter((job) => {
                    const matchesKeyword =
                                !kw ||
                                job.title?.toLowerCase().includes(kw) ||
                                job.company?.toLowerCase().includes(kw) ||
                                job.description?.toLowerCase().includes(kw);
                    const matchesLocation = !location || job.location === location;
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
          <div className="page">
            <Head>
              <title>Innovia Job Board</title>
            <meta name="description" content="Current job openings from Innovia hiring partners" />
      </Head>

      <header className="hero">
              <div className="hero-inner">
                <div className="brand">
                  <span className="brand-mark">I</span>
                <span className="brand-name">Innovia</span>
      </div>
              <h1>Find your next opportunity</h1>
              <p className="subtitle">Current openings from our hiring partners, updated daily</p>

          <div className="search-card">
                  <input
                  type="text"
                  className="keyword-input"
                  placeholder="Search job title, company, or keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                                  <div className="filter-row">
                                    <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">All Locations</option>
{locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
</select>
                                      <select value={classification} onChange={(e) => setClassification(e.target.value)}>
                <option value="">All Categories</option>
{classifications.map((c) => (
                      <option key={c} value={c}>{c}</option>
                                     ))}
</select>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="">All Job Types</option>
{jobTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                              ))}
</select>
{hasActiveFilters && (
                    <button type="button" className="clear-btn" onClick={clearFilters}>
                                          Clear Filters
    </button>
               )}
</div>
    </div>
    </div>
    </header>

      <main className="content">
{error && <p className="error-msg">Unable to load jobs right now. Please try again later.</p>}

        <p className="result-count">
{filteredJobs.length} job{filteredJobs.length === 1 ? '' : 's'} found
    </p>

{!error && jobs.length === 0 && (
              <p className="empty-msg">No jobs are currently available. Check back soon.</p>
         )}

{!error && jobs.length > 0 && filteredJobs.length === 0 && (
              <p className="empty-msg">No jobs match your search filters. Try broadening your search.</p>
         )}

        <ul className="job-list">
        {filteredJobs.map((job) => (
                        <li key={job.id} className="job-card">
                          <h2 className="job-title">{job.title}</h2>
                                        <div className="job-meta-line">
            {job.company}
                          {job.location ? ` • ${job.location}` : ''}
</div>
              <div className="badges">
{[job.employmentType, job.workHours, job.classification].filter(Boolean).map((tag) => (
                      <span className="badge" key={tag}>{tag}</span>
                ))}
                    </div>
              <div className="job-desc">
                {job.description && job.description.length > 300
                  ? `${job.description.slice(0, 300)}…`
                                      : job.description}
</div>
              <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="apply-btn">
                    Apply Now
    </a>
    </li>
          ))}
              </ul>
              </main>

      <footer className="site-footer">
                      <p>Innovia Job Board</p>
              </footer>

      <style jsx global>{`
              * { box-sizing: border-box; }
                      body {
                                margin: 0;
                                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                                                    background: #f6f7fb;
                                                              color: #1a1a2e;
                                                                      }
                                                                            `}</style>

      <style jsx>{`
              .page { min-height: 100vh; display: flex; flex-direction: column; }
                      .hero {
                                background: linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #9333ea 100%);
                                          color: #fff;
                                                    padding: 2.5rem 1.5rem 5rem;
                                                            }
                                                                    .hero-inner { max-width: 960px; margin: 0 auto; }
                                                                            .brand { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
                                                                                    .brand-mark {
                                                                                              width: 36px; height: 36px; border-radius: 10px;
                                                                                                        background: rgba(255,255,255,0.2);
                                                                                                                  display: flex; align-items: center; justify-content: center;
                                                                                                                            font-weight: 700; font-size: 1.1rem;
                                                                                                                                    }
                                                                                                                                            .brand-name { font-weight: 700; font-size: 1.25rem; letter-spacing: 0.02em; }
                                                                                                                                                    .hero h1 { font-size: 2.25rem; margin: 0 0 0.5rem; font-weight: 800; }
                                                                                                                                                            .subtitle { margin: 0 0 2rem; color: rgba(255,255,255,0.85); font-size: 1.05rem; }
                                                                                                                                                                    .search-card {
                                                                                                                                                                              background: #fff; border-radius: 16px; padding: 1.25rem;
                                                                                                                                                                                        box-shadow: 0 20px 40px -12px rgba(0,0,0,0.35);
                                                                                                                                                                                                }
                                                                                                                                                                                                        .keyword-input {
                                                                                                                                                                                                                  width: 100%; padding: 0.85rem 1rem; border-radius: 10px;
                                                                                                                                                                                                                            border: 1px solid #e2e2f0; font-size: 1rem; margin-bottom: 0.75rem;
                                                                                                                                                                                                                                      color: #1a1a2e;
                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                      .filter-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; }
                                                                                                                                                                                                                                                              .filter-row input, .filter-row select {
                                                                                                                                                                                                                                                                        width: 100%; padding: 0.7rem 0.85rem; border-radius: 10px;
                                                                                                                                                                                                                                                                                  border: 1px solid #e2e2f0; font-size: 0.95rem; color: #1a1a2e; background: #fff;
                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                  .clear-btn {
                                                                                                                                                                                                                                                                                                            background: #1a1a2e; color: #fff; border: none; border-radius: 10px;
                                                                                                                                                                                                                                                                                                                      padding: 0.7rem 1rem; font-size: 0.9rem; cursor: pointer; font-weight: 600;
                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                      .clear-btn:hover { background: #33335c; }
                                                                                                                                                                                                                                                                                                                                              .content { max-width: 960px; margin: -3rem auto 0; padding: 0 1.5rem 3rem; flex: 1; width: 100%; }
                                                                                                                                                                                                                                                                                                                                                      .error-msg { color: #b00020; font-weight: 600; }
                                                                                                                                                                                                                                                                                                                                                              .result-count { color: #5b5b78; font-size: 0.95rem; margin: 0 0 1rem; font-weight: 600; }
                                                                                                                                                                                                                                                                                                                                                                      .empty-msg { color: #5b5b78; background: #fff; padding: 1.5rem; border-radius: 12px; text-align: center; }
                                                                                                                                                                                                                                                                                                                                                                              .job-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
                                                                                                                                                                                                                                                                                                                                                                                      .job-card {
                                                                                                                                                                                                                                                                                                                                                                                                background: #fff; border-radius: 14px; padding: 1.5rem;
                                                                                                                                                                                                                                                                                                                                                                                                          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                                                                                                                                                                                                                                                                                                                                                                                                                    border: 1px solid #eef0f7;
                                                                                                                                                                                                                                                                                                                                                                                                                              transition: box-shadow 0.2s ease, transform 0.2s ease;
                                                                                                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                                                                                                              .job-card:hover { box-shadow: 0 12px 28px -8px rgba(76, 29, 149, 0.18); transform: translateY(-2px); }
                                                                                                                                                                                                                                                                                                                                                                                                                                                      .job-title { margin: 0 0 0.4rem; font-size: 1.2rem; font-weight: 700; color: #201f3b; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                              .job-meta-line { color: #5b5b78; margin-bottom: 0.65rem; font-size: 0.95rem; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                      .badges { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.9rem; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              .badge {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        background: #f1edff; color: #5b21b6; font-size: 0.78rem; font-weight: 600;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  padding: 0.25rem 0.65rem; border-radius: 999px;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  .job-desc { font-size: 0.95rem; line-height: 1.55; color: #34344d; margin-bottom: 1rem; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          .apply-btn {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    display: inline-block; padding: 0.6rem 1.3rem; border-radius: 999px;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              background: linear-gradient(135deg, #4338ca, #9333ea); color: #fff;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        text-decoration: none; font-weight: 600; font-size: 0.9rem;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        .apply-btn:hover { opacity: 0.9; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                .site-footer {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          text-align: center; color: #8b8ba7; font-size: 0.85rem; padding: 1.5rem;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          @media (max-width: 600px) {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    .hero h1 { font-size: 1.6rem; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              .hero { padding: 2rem 1rem 4rem; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        .content { margin-top: -2.5rem; padding: 0 1rem 2rem; }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      `}</style>
              </div>
  );
}

export async function getStaticProps() {
      try {
              const jobs = await fetchJobs();
              return { props: { jobs, error: false }, revalidate: 600 };
      } catch (err) {
              console.error('Failed to load job feed', err);
              return { props: { jobs: [], error: true }, revalidate: 600 };
      }
}
