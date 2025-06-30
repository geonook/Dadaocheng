import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Calendar, Users, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const AdminPanel = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/upload/submissions');
      const result = await response.json();
      if (result.success) {
        setSubmissions(result.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileId, filename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/upload/files/${fileId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getTaskName = (taskKey) => {
    return t.tasks[taskKey]?.title || taskKey;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(language === 'zh' ? 'zh-TW' : 'en-US');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">{t.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'zh' ? '任務成果管理' : 'Task Results Management'}
          </h1>
          <p className="text-gray-600">
            {language === 'zh' ? '查看和管理所有組別提交的任務成果' : 'View and manage all team task submissions'}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'zh' ? '總提交數' : 'Total Submissions'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'zh' ? '總文件數' : 'Total Files'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.reduce((total, sub) => total + sub.files.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'zh' ? '今日提交' : 'Today\'s Submissions'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter(sub => 
                      new Date(sub.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'zh' ? '最熱門任務' : 'Most Popular Task'}
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {submissions.length > 0 ? getTaskName(
                      Object.entries(
                        submissions.reduce((acc, sub) => {
                          acc[sub.selected_task] = (acc[sub.selected_task] || 0) + 1;
                          return acc;
                        }, {})
                      ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'task1'
                    ) : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {submission.team_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="secondary" className="mr-2">
                        {getTaskName(submission.selected_task)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDate(submission.created_at)}
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSubmission(
                      selectedSubmission?.id === submission.id ? null : submission
                    )}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {language === 'zh' ? '查看' : 'View'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {submission.description}
                </p>
                
                {submission.files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {language === 'zh' ? '附件' : 'Attachments'} ({submission.files.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {submission.files.slice(0, 3).map((file) => (
                        <Button
                          key={file.id}
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(file.id, file.original_filename)}
                          className="text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {file.original_filename.length > 15 
                            ? file.original_filename.substring(0, 15) + '...'
                            : file.original_filename
                          }
                        </Button>
                      ))}
                      {submission.files.length > 3 && (
                        <span className="text-xs text-gray-500 self-center">
                          +{submission.files.length - 3} {language === 'zh' ? '更多' : 'more'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">
              {language === 'zh' ? '尚無任務提交' : 'No task submissions yet'}
            </p>
          </div>
        )}

        {/* Detailed View Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedSubmission.team_name}
                    </h2>
                    <p className="text-gray-600">
                      {getTaskName(selectedSubmission.selected_task)} • {formatDate(selectedSubmission.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSubmission(null)}
                  >
                    {language === 'zh' ? '關閉' : 'Close'}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === 'zh' ? '成果描述' : 'Description'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedSubmission.description}
                    </p>
                  </div>

                  {selectedSubmission.files.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {language === 'zh' ? '附件文件' : 'Attached Files'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubmission.files.map((file) => (
                          <div key={file.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {file.original_filename}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(file.file_size)} • {formatDate(file.uploaded_at)}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadFile(file.id, file.original_filename)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

