import React, { useState, useEffect } from 'react';
import axiosInstance from '@utils/axiosInstance';

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/report');
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
      if (error.response?.status === 403) {
        alert('Bạn không có quyền truy cập chức năng này!');
      }
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await axiosInstance.post(`/report/${reportId}/resolve`, { action });
      await fetchReports();
      setSelectedReport(null);
      alert('Đã xử lý báo cáo thành công!');
    } catch (error) {
      console.error('Error resolving report:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDeleteContent = async (reportId, type) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${type === 'post' ? 'bài viết' : 'comment'} này?`)) return;
    
    try {
      const endpoint = type === 'post' ? 'delete-post' : 'delete-comment';
      await axiosInstance.delete(`/report/${reportId}/${endpoint}`);
      await fetchReports();
      setSelectedReport(null);
      alert(`Đã xóa ${type === 'post' ? 'bài viết' : 'comment'} thành công!`);
    } catch (error) {
      console.error('Error deleting content:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleRejectReport = async (reportId) => {
    try {
      await axiosInstance.patch(`/report/${reportId}/status`, { status: 'RESOLVED' });
      await fetchReports();
      setSelectedReport(null);
      alert('Đã từ chối báo cáo!');
    } catch (error) {
      console.error('Error rejecting report:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const filteredReports = reports.filter(report => {
    if (filterStatus === 'ALL') return true;
    return report.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'REVIEWED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'COMMENT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportType = (report) => {
    if (report.postId) return 'POST';
    if (report.commentId) return 'COMMENT';
    return 'UNKNOWN';
  };

  const getTargetInfo = (report) => {
    if (report.post) {
      return {
        title: report.post.title || 'Bài viết không có tiêu đề',
        content: report.post.content,
        author: report.post.user?.fullName || 'Unknown',
        category: report.post.category,
      };
    }
    if (report.comment) {
      return {
        title: `Comment trên: ${report.comment.post?.title || 'Unknown'}`,
        content: report.comment.content,
        author: report.comment.user?.fullName || 'Unknown',
        category: report.comment.category,
      };
    }
    return { title: 'Unknown', content: '', author: 'Unknown' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản lý báo cáo</h1>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'ALL'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tất cả ({reports.length})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'PENDING'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Chờ xử lý ({reports.filter(r => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setFilterStatus('RESOLVED')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'RESOLVED'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Đã xử lý ({reports.filter(r => r.status === 'RESOLVED').length})
          </button>
          <button
            onClick={() => setFilterStatus('REVIEWED')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'REVIEWED'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Đang xem xét ({reports.filter(r => r.status === 'REVIEWED').length})
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const reportType = getReportType(report);
          const targetInfo = getTargetInfo(report);
          
          return (
            <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(reportType)}`}>
                      {reportType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                      {report.status === 'PENDING' ? 'Chờ xử lý' : report.status === 'RESOLVED' ? 'Đã xử lý' : 'Đang xem xét'}
                    </span>
                    {targetInfo.category && (targetInfo.category === 'TOXIC' || targetInfo.category === 'NEGATIVE') && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        targetInfo.category === 'TOXIC' ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {targetInfo.category === 'TOXIC' ? 'TOXIC' : 'Tiêu cực'}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      ID: #{report.id}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {targetInfo.title}
                  </h3>
                  
                  {targetInfo.content && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-3 border-l-4 border-gray-300">
                      <p className="text-sm text-gray-700 line-clamp-3">{targetInfo.content}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold text-gray-700">Người báo cáo:</span>
                        <p className="text-gray-600">{report.reporter?.fullName || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Tác giả:</span>
                        <p className="text-gray-600">{targetInfo.author}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Lý do báo cáo:</span>
                      <p className="text-gray-600 bg-yellow-50 p-2 rounded mt-1">{report.reason}</p>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700">Thời gian:</span>
                      <span className="text-gray-600 ml-2">{new Date(report.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                
                {report.status === 'PENDING' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      Xử lý
                    </button>
                    <button
                      onClick={() => handleRejectReport(report.id)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
          Không có báo cáo nào
        </div>
      )}

      {/* Resolve Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-700 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Xử lý báo cáo</h2>
              <p className="text-white text-sm opacity-90 mt-1">ID: #{selectedReport.id}</p>
            </div>
            
            <div className="p-6">
              {/* Report Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-amber-600">
                <h3 className="font-semibold text-gray-800 mb-2">Thông tin báo cáo</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Loại:</span> {getReportType(selectedReport)}</p>
                  <p><span className="font-medium">Người báo cáo:</span> {selectedReport.reporter?.fullName}</p>
                  <p><span className="font-medium">Lý do:</span> {selectedReport.reason}</p>
                </div>
              </div>

              {/* Target Content */}
              {(() => {
                const targetInfo = getTargetInfo(selectedReport);
                return (
                  <div className="bg-red-50 p-4 rounded-lg mb-6 border-l-4 border-red-600">
                    <h3 className="font-semibold text-red-900 mb-2">Nội dung bị báo cáo</h3>
                    <p className="text-sm text-gray-700 mb-2">{targetInfo.title}</p>
                    {targetInfo.content && (
                      <p className="text-sm text-gray-600 bg-white p-3 rounded">{targetInfo.content}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Tác giả:</span> {targetInfo.author}
                    </p>
                  </div>
                );
              })()}

              <p className="text-gray-600 mb-6 font-medium">
                Chọn hành động xử lý:
              </p>
              
              <div className="space-y-3">
                {selectedReport.postId && (
                  <button
                    onClick={() => handleDeleteContent(selectedReport.id, 'post')}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Xóa bài viết vi phạm
                  </button>
                )}
                
                {selectedReport.commentId && (
                  <button
                    onClick={() => handleDeleteContent(selectedReport.id, 'comment')}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Xóa comment vi phạm
                  </button>
                )}
                
                <button
                  onClick={() => handleResolveReport(selectedReport.id, 'Đã cảnh cáo người dùng')}
                  className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Cảnh cáo người dùng (giữ nội dung)
                </button>
                
                <button
                  onClick={() => handleResolveReport(selectedReport.id, 'Báo cáo không đúng - Đã từ chối')}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Không vi phạm - Giữ nguyên
                </button>
                
                <button
                  onClick={() => setSelectedReport(null)}
                  className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-semibold"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;
