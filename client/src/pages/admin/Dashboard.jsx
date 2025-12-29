import React, { useState, useEffect } from 'react';
import axiosInstance from '@utils/axiosInstance';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp,
  Eye,
  Heart,
  Bookmark,
  Award,
  Activity,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/user/admin/dashboard/stats');
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không thể tải dữ liệu thống kê</p>
      </div>
    );
  }

  const { overview, posts, comments, engagement, reports, topUsers, charts } = stats;

  // Stats cards configuration
  const statCards = [
    {
      title: 'Tổng người dùng',
      value: overview.totalUsers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: `+${overview.newUsersThisWeek} tuần này`,
      trendColor: 'text-green-600',
    },
    {
      title: 'Tổng bài viết',
      value: overview.totalPosts,
      icon: <FileText className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: `+${overview.postsThisWeek} tuần này`,
      trendColor: 'text-green-600',
    },
    {
      title: 'Tổng bình luận',
      value: overview.totalComments,
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: `+${overview.commentsThisWeek} tuần này`,
      trendColor: 'text-green-600',
    },
    {
      title: 'Báo cáo chờ xử lý',
      value: overview.pendingReports,
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      trend: overview.pendingReports > 0 ? 'Cần xem xét' : 'Đã xử lý hết',
      trendColor: overview.pendingReports > 0 ? 'text-red-600' : 'text-green-600',
    },
    {
      title: 'Tổng lượt thích',
      value: engagement.totalLikes,
      icon: <Heart className="w-7 h-7" />,
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
    },
    {
      title: 'Tổng lượt xem',
      value: engagement.totalViews,
      icon: <Eye className="w-7 h-7" />,
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    },
    {
      title: 'Tổng bookmark',
      value: engagement.totalBookmarks,
      icon: <Bookmark className="w-7 h-7" />,
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    {
      title: 'User mới tháng này',
      value: overview.newUsersThisMonth,
      icon: <TrendingUp className="w-7 h-7" />,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    },
  ];

  // Prepare chart data
  const userGrowthData = charts.userGrowth.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    users: item.count,
  }));

  const postActivityData = charts.postActivity.map(item => ({
    date: new Date(item.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    posts: item.count,
  }));

  const postTypeData = posts.byType.map(item => ({
    name: item.type === 'NORMAL' ? 'Bình thường' : 'Poll',
    value: item._count,
  }));

  const postStatusData = posts.byStatus.map(item => ({
    name: item.status === 'VISIBLE' ? 'Hiển thị' : item.status === 'HIDDEN' ? 'Đã ẩn' : 'Đã xóa',
    value: item._count,
  }));

  const commentCategoryData = comments.byCategory.map(item => ({
    name: item.category === 'POSITIVE' ? 'Tích cực' : 
          item.category === 'NEGATIVE' ? 'Tiêu cực' : 
          item.category === 'TOXIC' ? 'Độc hại' : 'Trung tính',
    value: item._count,
  }));

  const COLORS = {
    blue: '#3b82f6',
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6',
    pink: '#ec4899',
    cyan: '#06b6d4',
    indigo: '#6366f1',
  };

  const PIE_COLORS = [COLORS.blue, COLORS.green, COLORS.yellow, COLORS.red, COLORS.purple];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Cập nhật real-time</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendColor}`}>
                  <TrendingUp size={16} />
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>
            <div className={`h-1 ${stat.color}`}></div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 - Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Tăng trưởng người dùng (30 ngày)</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke={COLORS.blue} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Post Activity Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">Hoạt động bài viết (30 ngày)</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={postActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="posts" 
                stroke={COLORS.green} 
                strokeWidth={3}
                dot={{ fill: COLORS.green, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 - Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Post Type Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-800">Phân bố loại bài viết</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={postTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {postTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Post Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg font-semibold text-gray-800">Trạng thái bài viết</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={postStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {postStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Comment Category Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg font-semibold text-gray-800">Phân loại bình luận</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={commentCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {commentCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-semibold text-gray-800">Top 10 Người dùng theo XP</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  XP
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bình luận
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          'bg-amber-600'
                        }`}>
                          {index + 1}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-gray-600 bg-gray-100">
                          {index + 1}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || '/default-avatar.png'}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-xs text-gray-500">@{user.userName || 'user'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Lv. {user.level}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        {user.xp.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user._count.posts}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user._count.comments}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
