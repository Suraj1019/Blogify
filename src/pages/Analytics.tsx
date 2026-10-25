import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { toast } from 'react-toastify';
import { getPostsByUser } from '../api/posts';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';
import { formatDate, getErrorMessage } from '../utils/format';

const truncate = (s: string, n = 16) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export default function Analytics() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getPostsByUser(user.userId)
      .then(setPosts)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user]);

  const { totalViews, uniqueVisitors, topBlog, chartData } = useMemo(() => {
    const visitors = new Set<string>();
    let total = 0;
    let top: Post | null = null;
    for (const post of posts) {
      total += post.views ?? 0;
      post.visitors?.forEach((v) => visitors.add(v));
      if (!top || (post.views ?? 0) > (top.views ?? 0)) top = post;
    }
    return {
      totalViews: total,
      uniqueVisitors: visitors.size,
      topBlog: top,
      chartData: posts.map((p) => ({ title: p.title, views: p.views ?? 0, visitors: p.visitors?.length ?? 0 })),
    };
  }, [posts]);

  return (
    <div className="card">
      <h1 className="page-title">Analytics Dashboard</h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-6 lg:grid-cols-4">
        <StatTile label="Total Views" value={totalViews} />
        <StatTile label="Unique Visitors" value={uniqueVisitors} />
        <StatTile label="Total Posts" value={posts.length} />
        <StatTile label="Published" value={posts.filter((p) => !p.draft).length} />
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 p-4 sm:mb-8 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-700 sm:text-xl">Top Performing Blog</h3>
        {topBlog ? (
          <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="break-anywhere font-semibold text-gray-700">{topBlog.title}</h4>
              {topBlog.publishDate && <p className="text-sm text-gray-500">Published on {formatDate(topBlog.publishDate)}</p>}
            </div>
            <div className="text-sm font-semibold text-gray-700 sm:text-right">
              <p>{topBlog.views ?? 0} views</p>
              <p>{topBlog.visitors?.length ?? 0} unique visitors</p>
            </div>
          </div>
        ) : (
          !loading && <p className="text-gray-500">No posts yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-700 sm:text-xl">Views &amp; visitors per post</h3>
        {chartData.length > 0 ? (
          // Each post gets at least 72px so labels never collide; narrow screens scroll sideways instead.
          <div className="-mx-1 overflow-x-auto px-1">
          <div className="h-72 sm:h-80" style={{ minWidth: chartData.length * 72 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={2} barCategoryGap="25%">
                <CartesianGrid vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="title" tickFormatter={(t: string) => truncate(t, 10)} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={{ stroke: '#d1d5db' }} tickLine={false} interval={0} />
                <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 13 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 13, color: '#374151' }} />
                <Bar dataKey="views" name="Views" fill="#2a78d6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="visitors" name="Visitors" fill="#eb6834" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          </div>
        ) : (
          !loading && <EmptyState>No data to chart yet</EmptyState>
        )}
      </div>
      <Loader show={loading} />
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 sm:p-6">
      <h3 className="mb-1 text-sm font-semibold text-gray-700 sm:mb-2 sm:text-lg">{label}</h3>
      <p className="text-2xl font-bold text-gray-900 sm:text-3xl">{value.toLocaleString()}</p>
    </div>
  );
}
