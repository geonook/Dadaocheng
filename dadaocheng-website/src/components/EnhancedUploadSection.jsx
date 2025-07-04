/**
 * SuperClaude 增強版成果上傳組件
 * 25組管理、YouTube連結、上傳限制
 */
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Image, 
  Video, 
  AlertTriangle,
  CheckCircle,
  Users,
  Youtube,
  Loader2,
  Info
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useResults } from '../contexts/ResultsContext';
import { translations } from '../data/translations';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const EnhancedUploadSection = () => {
  const { language } = useLanguage();
  const { getAvailableGroups, uploadResult, isLoading } = useResults();
  const t = translations[language];
  
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.2
  });

  // 表單狀態
  const [formData, setFormData] = useState({
    groupNumber: '',
    task: '',
    description: '',
    files: [],
    youtubeLink: ''
  });

  const [errors, setErrors] = useState({});
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 可用組別選項
  const availableGroups = getAvailableGroups();

  // 任務選項
  const taskOptions = [
    { value: 'task1', label: t.tasks.task1.title },
    { value: 'task2', label: t.tasks.task2.title },
    { value: 'task3', label: t.tasks.task3.title },
    { value: 'task4', label: t.tasks.task4.title },
    { value: 'task5', label: t.tasks.task5.title }
  ];

  // 表單驗證
  const validateForm = () => {
    const newErrors = {};

    if (!formData.groupNumber) {
      newErrors.groupNumber = language === 'zh' ? '請選擇組別' : 'Please select a group';
    }

    if (!formData.task) {
      newErrors.task = language === 'zh' ? '請選擇任務' : 'Please select a task';
    }

    if (!formData.description.trim()) {
      newErrors.description = language === 'zh' ? '請填寫成果描述' : 'Please provide result description';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = language === 'zh' ? '描述至少需要50個字符' : 'Description must be at least 50 characters';
    }

    // YouTube 連結驗證（選填）
    if (formData.youtubeLink && !isValidYouTubeUrl(formData.youtubeLink)) {
      newErrors.youtubeLink = language === 'zh' ? '請輸入有效的YouTube連結' : 'Please enter a valid YouTube URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // YouTube URL 驗證
  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  // 文件拖拽處理
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelection(droppedFiles);
  }, []);

  // 文件選擇處理
  const handleFileSelection = (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter(file => {
      // 文件大小限制：100MB
      if (file.size > 100 * 1024 * 1024) {
        setUploadStatus({
          type: 'error',
          message: language === 'zh' 
            ? `檔案 ${file.name} 超過100MB限制` 
            : `File ${file.name} exceeds 100MB limit`
        });
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles]
    }));
  };

  // 移除文件
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // 獲取文件圖標
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576) + ' MB';
  };

  // 表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setUploadStatus({
        type: 'error',
        message: language === 'zh' ? '請檢查表單內容' : 'Please check form content'
      });
      return;
    }

    try {
      const result = await uploadResult(formData);
      
      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: t.upload.success
        });
        
        // 重置表單
        setFormData({
          groupNumber: '',
          task: '',
          description: '',
          files: [],
          youtubeLink: ''
        });
        setErrors({});
      } else {
        setUploadStatus({
          type: 'error',
          message: result.error || t.upload.error
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: t.upload.error
      });
    }
  };

  return (
    <section 
      ref={ref}
      id="upload" 
      className="py-20 bg-gradient-to-b from-white to-blue-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {t.upload.title}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {t.upload.subtitle}
          </p>
          
          {/* 重要提醒 */}
          <Alert className="max-w-2xl mx-auto bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {t.upload.warning}
            </AlertDescription>
          </Alert>
        </div>

        {/* 上傳表單 */}
        <Card className={`shadow-xl border-0 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '200ms' }}>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Upload className="w-6 h-6 mr-3" />
              {t.upload.title}
            </CardTitle>
            <CardDescription className="text-blue-100">
              {language === 'zh' 
                ? `目前可選擇 ${availableGroups.length} 個組別` 
                : `${availableGroups.length} groups available`
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 組別選擇 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="group" className="text-sm font-semibold flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {t.upload.teamNumber}
                  </Label>
                  <Select 
                    value={formData.groupNumber?.toString() || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, groupNumber: parseInt(value) }))}
                  >
                    <SelectTrigger className={errors.groupNumber ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t.upload.teamNumberPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableGroups.length === 0 ? (
                        <SelectItem value="none" disabled>
                          {language === 'zh' ? '所有組別已上傳完畢' : 'All groups have uploaded'}
                        </SelectItem>
                      ) : (
                        availableGroups.map((group) => (
                          <SelectItem key={group.value} value={group.value.toString()}>
                            {group.label[language]}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errors.groupNumber && (
                    <p className="text-sm text-red-500">{errors.groupNumber}</p>
                  )}
                </div>

                {/* 任務選擇 */}
                <div className="space-y-2">
                  <Label htmlFor="task" className="text-sm font-semibold">
                    {t.upload.selectedTask}
                  </Label>
                  <Select 
                    value={formData.task} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, task: value }))}
                  >
                    <SelectTrigger className={errors.task ? 'border-red-500' : ''}>
                      <SelectValue placeholder={t.upload.selectTaskPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {taskOptions.map((task) => (
                        <SelectItem key={task.value} value={task.value}>
                          {task.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.task && (
                    <p className="text-sm text-red-500">{errors.task}</p>
                  )}
                </div>
              </div>

              {/* 成果描述 */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  {t.upload.description}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={t.upload.descriptionPlaceholder}
                  className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formData.description.length}/500</span>
                  {errors.description && (
                    <span className="text-red-500">{errors.description}</span>
                  )}
                </div>
              </div>

              {/* YouTube 連結 */}
              <div className="space-y-2">
                <Label htmlFor="youtube" className="text-sm font-semibold flex items-center">
                  <Youtube className="w-4 h-4 mr-2 text-red-500" />
                  {t.upload.youtubeLink}
                </Label>
                <Input
                  id="youtube"
                  type="url"
                  value={formData.youtubeLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeLink: e.target.value }))}
                  placeholder={t.upload.youtubeLinkPlaceholder}
                  className={errors.youtubeLink ? 'border-red-500' : ''}
                />
                <p className="text-sm text-gray-500">{t.upload.youtubeLinkDesc}</p>
                {errors.youtubeLink && (
                  <p className="text-sm text-red-500">{errors.youtubeLink}</p>
                )}
              </div>

              {/* 文件上傳區域 */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold">{t.upload.files}</Label>
                
                {/* 拖拽上傳區 */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {language === 'zh' ? '拖拽文件到此處或點擊選擇' : 'Drag files here or click to select'}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">{t.upload.filesDesc}</p>
                  
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => handleFileSelection(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    {language === 'zh' ? '選擇文件' : 'Select Files'}
                  </Button>
                </div>

                {/* 已選文件列表 */}
                {formData.files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">
                      {language === 'zh' ? '已選文件：' : 'Selected Files:'}
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {formData.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file)}
                            <div>
                              <p className="text-sm font-medium text-gray-800">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 提交按鈕 */}
              <div className="pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isLoading || availableGroups.length === 0}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-3 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t.common.loading}
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      {t.upload.submit}
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* 狀態提示 */}
            {uploadStatus && (
              <Alert className={`mt-6 ${
                uploadStatus.type === 'success' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={
                  uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }>
                  {uploadStatus.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 說明信息 */}
        <div className="mt-8 text-center">
          <Alert className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {language === 'zh' 
                ? '上傳成功後，您的成果將在「成果展示」頁面中展示。請確保所有內容準確無誤後再提交。'
                : 'After successful upload, your results will be displayed on the "Results Display" page. Please ensure all content is accurate before submission.'
              }
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
};

export default EnhancedUploadSection;