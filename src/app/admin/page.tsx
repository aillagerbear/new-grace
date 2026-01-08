"use client";

import { useState, useEffect } from "react";
import { Users, FileText, Activity, TrendingUp } from "lucide-react";

interface Stats {
  totalUsers: number;
  todayUsers: number;
  totalPosts: number;
  todayPosts: number;
  activeSessions: number;
  weeklyUsers: { date: string; count: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
    } catch {
      setError("통계를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
    );
  }

  const statCards = [
    {
      name: "전체 사용자",
      value: stats?.totalUsers || 0,
      subValue: `오늘 +${stats?.todayUsers || 0}`,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "전체 게시글",
      value: stats?.totalPosts || 0,
      subValue: `오늘 +${stats?.todayPosts || 0}`,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      name: "활성 세션",
      value: stats?.activeSessions || 0,
      subValue: "현재 접속 중",
      icon: Activity,
      color: "bg-purple-500",
    },
    {
      name: "주간 가입자",
      value: stats?.weeklyUsers?.reduce((acc, curr) => acc + parseInt(curr.count), 0) || 0,
      subValue: "최근 7일",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600 mt-1">사이트 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.subValue}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 최근 가입자 차트 */}
      {stats?.weeklyUsers && stats.weeklyUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            최근 7일간 가입자 추이
          </h2>
          <div className="flex items-end justify-between h-40 gap-2">
            {stats.weeklyUsers.map((day) => {
              const maxCount = Math.max(
                ...stats.weeklyUsers.map((d) => parseInt(d.count))
              );
              const height =
                maxCount > 0
                  ? (parseInt(day.count) / maxCount) * 100
                  : 0;
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString("ko-KR", {
                weekday: "short",
              });

              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="w-full flex justify-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {day.count}
                    </span>
                  </div>
                  <div
                    className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 빠른 링크 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Users className="w-5 h-5 text-blue-500 mr-3" />
            <span className="text-gray-700">사용자 관리</span>
          </a>
          <a
            href="/admin/posts"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">게시글 관리</span>
          </a>
          <a
            href="/"
            target="_blank"
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Activity className="w-5 h-5 text-purple-500 mr-3" />
            <span className="text-gray-700">사이트 보기</span>
          </a>
        </div>
      </div>
    </div>
  );
}
