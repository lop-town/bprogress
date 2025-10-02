'use client';

import Link from 'next/link';
import { useProgress } from '@lop-town/bprogress-next';
import { useRouter } from '@lop-town/bprogress-next/app';

export default function Home() {
  const router = useRouter();
  const { start, stop } = useProgress();

  return (
    <>
      <h1>BProgress</h1>
      <button className="default" onClick={() => start()}>
        Start progress
      </button>
      <button className="default" onClick={() => stop()}>
        Stop progress
      </button>

      <Link href="/">Same route</Link>
      <Link href="/?test=param">Sallow</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link
        href="/dashboard"
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span>Dashboard</span>

        <span
          style={{
            marginTop: 15,
          }}
          onClick={(e) => e.preventDefault()}
          data-prevent-progress={true}
        >
          e.preventDefault()
        </span>
      </Link>
      <Link href="#test">Link with href</Link>
      <Link href="/dashboard" data-disable-progress={true}>
        Link with bprogress disabled
      </Link>
      <button onClick={() => router.push('/')}>Push same url</button>
      <button onClick={() => router.push('/dashboard')}>Push Dashboard</button>
      <button onClick={() => router.refresh()}>Refresh</button>
      <button
        onClick={() =>
          router.push('/docs', undefined, {
            disableSameURL: true,
          })
        }
      >
        Push with disableSameURL true
      </button>
      <button className="replace" onClick={() => router.replace('/dashboard')}>
        Replace Dashboard
      </button>
      <button onClick={() => router.push('/?test=param')}>
        Push with param
      </button>
      <button
        onClick={() =>
          router.push(
            '/dashboard',
            {},
            {
              showProgress: false,
            },
          )
        }
      >
        Push Dashboard without progress bar
      </button>
      <Link
        className="a"
        href="https://www.npmjs.com/package/@lop-town/bprogress-next"
        target="_blank"
        rel="noopener noreferrer"
      >
        Link with target=`&quot;`_blank`&quot;` not affected
      </Link>
      <Link
        className="a"
        href="mailto:john.doe@exemple.com"
        rel="noopener noreferrer"
      >
        Link with mailto not affected
      </Link>
      <Link className="a" href="tel:0000000000" rel="noopener noreferrer">
        Link with tel not affected
      </Link>
      <a
        className="a"
        href="blob:http://localhost:3000/123456789"
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        Link with blob not affected
      </a>
      <a className="a">Link without href won&apos;t throw error</a>

      <p
        style={{
          marginTop: 10,
          marginBottom: 5,
        }}
      >
        In a svg element :
      </p>
      <svg>
        <Link href="/dashboard">
          <circle cx={30} cy={30} r={30} />
        </Link>
      </svg>
    </>
  );
}
