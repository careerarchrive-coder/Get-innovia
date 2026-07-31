import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchJobs } from '../../lib/fetchJobs';

export default function JobDetail({ job }) {
  const router = useRouter();

if (router.isFallback) {
  return <p className="loading">Loading job details…</p>;
}

if (!job) {
  return null;
}

return (
  <div className="page">
  <Head>
  <title>{job.title} | Innovia Job Board</title>
  <meta name="description" content={`${job.title} at ${job.company}`} />
  </Head>

<header className="hero">
  <div className="hero-inner">
  <Link href="/" className="back-link">← Back to all jobs</Link>
<div className="brand">
  <span className="brand-mark">I</span>
<span className="brand-name">Innovia</span>
  </div>
  </div>
  </header>

<main className="content">
  <div className="job-card">
  <h1 className="job-title">{job.title}</h1>
<div className="job-meta-line">
{job.company}
{job.location ? ` • ${job.location}` : ''}
</div>
<div className="badges">
{[job.employmentType, job.workHours, job.classification].filter(Boolean).map((tag) => (
  <span className="badge" key={tag}>{tag}</span>
))}
  </div>
<div className="job-desc">{job.description}</div>
<a href={job.applicationUrl} target="_blank" rel="noopener noreferrer" className="apply-btn">
  Apply Now
  </a>
  </div>
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
padding: 1.5rem 1.5rem 3.5rem;
}
.hero-inner { max-width: 720px; margin: 0 auto; }
.back-link { color: #fff; text-decoration: none; font-size: 0.9rem; font-weight: 600; opacity: 0.9; }
.back-link:hover { text-decoration: underline; }
.brand { display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; }
.brand-mark {
width: 32px; height: 32px; border-radius: 9px;
background: rgba(255,255,255,0.2);
display: flex; align-items: center; justify-content: center;
font-weight: 700; font-size: 1rem;
}
.brand-name { font-weight: 700; font-size: 1.1rem; letter-spacing: 0.02em; }
.content { max-width: 720px; margin: -2.5rem auto 0; padding: 0 1.5rem 3rem; flex: 1; width: 100%; }
.job-card {
background: #fff; border-radius: 16px; padding: 2rem;
box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15);
}
.job-title { margin: 0 0 0.5rem; font-size: 1.6rem; font-weight: 800; color: #201f3b; }
.job-meta-line { color: #5b5b78; font-size: 1rem; margin-bottom: 1rem; }
.badges { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem; }
.badge {
background: #f1edff; color: #5b21b6; font-size: 0.8rem; font-weight: 600;
padding: 0.3rem 0.7rem; border-radius: 999px;
}
.job-desc {
font-size: 1rem; line-height: 1.7; color: #34344d; margin-bottom: 2rem;
white-space: pre-wrap;
}
.apply-btn {
display: inline-block; padding: 0.75rem 1.8rem; border-radius: 999px;
background: linear-gradient(135deg, #4338ca, #9333ea);
color: #fff; text-decoration: none; font-weight: 700; font-size: 1rem;
}
.site-footer { text-align: center; color: #9494ab; padding: 2rem 0; font-size: 0.85rem; }
.loading { text-align: center; padding: 4rem 1rem; color: #5b5b78; }
`}</style>
  </div>
);
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  try {
    const jobs = await fetchJobs();
    const job = jobs.find((j) => j.id === params.id) || null;
    if (!job) {
      return { notFound: true, revalidate: 600 };
    }
    return { props: { job }, revalidate: 600 };
  } catch (err) {
    return { notFound: true, revalidate: 60 };
  }
}
