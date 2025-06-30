import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Image, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const UploadSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    teamName: '',
    selectedTask: '',
    description: '',
    files: []
  });
  
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskOptions = [
    { value: 'task1', label: t.tasks.task1.title },
    { value: 'task2', label: t.tasks.task2.title },
    { value: 'task3', label: t.tasks.task3.title },
    { value: 'task4', label: t.tasks.task4.title },
    { value: 'task5', label: t.tasks.task5.title }
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...selectedFiles]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('team_name', formData.teamName);
      formDataToSend.append('selected_task', formData.selectedTask);
      formDataToSend.append('description', formData.description);
      
      // 添加文件
      formData.files.forEach((file) => {
        formDataToSend.append('files', file);
      });
      
      const response = await fetch('https://9yhyi3cqwyd7.manus.space/api/upload/submit', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUploadStatus('success');
        // 重置表單
        setFormData({
          teamName: '',
          selectedTask: '',
          description: '',
          files: []
        });
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section id="upload" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.upload.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.upload.subtitle}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-6 w-6 text-green-700" />
              <span>{t.upload.title}</span>
            </CardTitle>
            <CardDescription>
              {t.upload.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {uploadStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800">{t.upload.success}</span>
              </div>
            )}
            
            {uploadStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{t.upload.error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Team Name */}
              <div className="space-y-2">
                <Label htmlFor="teamName">{t.upload.teamName}</Label>
                <Input
                  id="teamName"
                  type="text"
                  placeholder={t.upload.teamNamePlaceholder}
                  value={formData.teamName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  required
                />
              </div>

              {/* Task Selection */}
              <div className="space-y-2">
                <Label htmlFor="selectedTask">{t.upload.selectedTask}</Label>
                <Select
                  value={formData.selectedTask}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, selectedTask: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.upload.selectTaskPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {taskOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">{t.upload.description}</Label>
                <Textarea
                  id="description"
                  placeholder={t.upload.descriptionPlaceholder}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="files">{t.upload.files}</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="files" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {t.upload.files}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t.upload.filesDesc}
                    </p>
                  </label>
                </div>

                {/* File List */}
                {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          移除
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white py-3 text-lg font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? t.common.loading : t.upload.submit}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Upload Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            {language === 'zh' ? '上傳說明' : 'Upload Instructions'}
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• {language === 'zh' ? '支援的檔案格式：圖片 (JPG, PNG, GIF)、影片 (MP4, MOV)、文件 (PDF, DOC, TXT)' : 'Supported file formats: Images (JPG, PNG, GIF), Videos (MP4, MOV), Documents (PDF, DOC, TXT)'}</li>
            <li>• {language === 'zh' ? '單個檔案大小限制：50MB' : 'File size limit: 50MB per file'}</li>
            <li>• {language === 'zh' ? '可同時上傳多個檔案' : 'Multiple files can be uploaded simultaneously'}</li>
            <li>• {language === 'zh' ? '上傳後的檔案將安全存儲，僅供教學使用' : 'Uploaded files will be securely stored for educational purposes only'}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;

