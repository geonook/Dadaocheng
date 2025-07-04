/**
 * SuperClaude 成果展示頁面
 * 25組成果展示，包含第1組特殊處理
 */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Play, 
  Calendar, 
  Users, 
  Trophy, 
  Star,
  FileText,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useResults } from '../contexts/ResultsContext';
import { translations } from '../data/translations';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// 第1組特殊展示組件
const SpecialGroupDisplay = ({ language, t }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.2
  });

  return (
    <Card 
      ref={ref}
      className={`relative overflow-hidden border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* 特殊標記 */}
      <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-orange-400 text-white px-4 py-1 rounded-bl-lg">
        <div className="flex items-center space-x-1 text-sm font-semibold">
          <Star className="w-4 h-4" />
          <span>{t.results.specialGroup}</span>
        </div>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {language === 'zh' ? '第1組' : 'Group 1'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {language === 'zh' ? 'StoryMap 特別展示' : 'StoryMap Special Display'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="bg-white/70 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-gray-800 mb-2">
              {language === 'zh' ? '互動式地圖故事' : 'Interactive Map Story'}
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              {language === 'zh' 
                ? '透過 Esri StoryMap 技術呈現大稻埕的豐富故事與深度探索。'
                : 'Presenting rich stories and in-depth exploration of Dadaocheng through Esri StoryMap technology.'
              }
            </p>
            
            {/* StoryMap 嵌入區域 */}
            <div className="relative w-full">
              {/* StoryMap 標題 */}
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-700 flex items-center">
                  <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                  {language === 'zh' ? '互動式大稻埕探索地圖' : 'Interactive Dadaocheng Exploration Map'}
                </h5>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Esri StoryMap
                </Badge>
              </div>
              
              {/* 響應式 iframe 容器 */}
              <div className="relative w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 bg-white">
                {/* 16:9 響應式容器 */}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe 
                    src="https://storymaps.arcgis.com/stories/b8af9265bf6841f181b8ddbc6810a29f"
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                    allow="geolocation"
                    loading="lazy"
                    title={language === 'zh' ? '大稻埕探索互動地圖' : 'Dadaocheng Exploration Interactive Map'}
                  />
                </div>
                
                {/* 全屏按鈕覆層 */}
                <div className="absolute top-2 right-2 z-10">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-gray-700 shadow-md"
                    onClick={() => window.open('https://storymaps.arcgis.com/stories/b8af9265bf6841f181b8ddbc6810a29f', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {language === 'zh' ? '全屏' : 'Fullscreen'}
                  </Button>
                </div>
              </div>
              
              {/* StoryMap 說明 */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{language === 'zh' ? '💡 使用提示：' : '💡 Usage Tips:'}</span>
                  {language === 'zh' 
                    ? '點擊地圖可進行互動，滾動瀏覽完整故事。建議使用全屏模式獲得最佳體驗。'
                    : 'Click the map to interact, scroll to browse the complete story. Fullscreen mode is recommended for the best experience.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {language === 'zh' ? '特別展示項目' : 'Special Display Item'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 一般組別成果展示組件
const GroupResultCard = ({ result, language, t }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.2
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return language === 'zh' 
      ? date.toLocaleDateString('zh-TW', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  };

  const getTaskName = (taskId) => {
    const taskMap = {
      'task1': t.tasks.task1.title,
      'task2': t.tasks.task2.title,
      'task3': t.tasks.task3.title,
      'task4': t.tasks.task4.title,
      'task5': t.tasks.task5.title
    };
    return taskMap[taskId] || taskId;
  };

  const getTaskColor = (taskId) => {
    const colorMap = {
      'task1': 'bg-blue-500',
      'task2': 'bg-green-500',
      'task3': 'bg-purple-500',
      'task4': 'bg-red-500',
      'task5': 'bg-orange-500'
    };
    return colorMap[taskId] || 'bg-gray-500';
  };

  return (
    <Card 
      ref={ref}
      className={`transition-all duration-700 hover:shadow-xl hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                {language === 'zh' ? `第${result.groupNumber}組` : `Group ${result.groupNumber}`}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {getTaskName(result.task)}
              </CardDescription>
            </div>
          </div>
          
          <Badge className={`${getTaskColor(result.task)} text-white`}>
            {t.results.task} {result.task.replace('task', '')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* 成果描述 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              {t.upload.description}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.description}
            </p>
          </div>

          {/* 檔案和影片 */}
          <div className="flex flex-wrap gap-2">
            {result.files && result.files.length > 0 && (
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>{t.results.downloadFiles} ({result.files.length})</span>
              </Button>
            )}
            
            {result.youtubeLink && (
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>{t.results.watchVideo}</span>
              </Button>
            )}
          </div>

          {/* 上傳時間 */}
          <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{t.results.uploadTime}: {formatDate(result.uploadTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 主要成果展示組件
const ResultsDisplay = () => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [refreshing, setRefreshing] = useState(false);
  
  // 安全地獲取 results context
  let results = [];
  let stats = {
    totalGroups: 24,
    uploadedCount: 0,
    pendingCount: 24,
    taskBreakdown: {}
  };
  
  try {
    const { getAllResults, getStatistics } = useResults();
    results = getAllResults() || [];
    stats = getStatistics() || stats;
  } catch (error) {
    console.error('Error loading results context:', error);
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    // 模擬刷新延遲
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <section id="results" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.results.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            {t.results.subtitle}
          </p>

          {/* 統計面板 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-blue-600">{stats.totalGroups}</div>
              <div className="text-sm text-gray-600">{t.results.totalGroups}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="text-2xl font-bold text-green-600">{stats.uploadedCount}</div>
              <div className="text-sm text-gray-600">{t.results.uploadedGroups}</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingCount}</div>
              <div className="text-sm text-gray-600">{t.results.pendingGroups}</div>
            </div>
          </div>

          {/* 刷新按鈕 */}
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            className="mb-8"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t.common.loading : t.common.refresh}
          </Button>
        </div>

        {/* 成果展示區域 */}
        {results.length === 1 ? (
          // 只有第1組時的狀態
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t.results.noResults}
            </h3>
            <p className="text-gray-500">
              {language === 'zh' 
                ? '各組完成任務後，成果將會在這裡展示。' 
                : 'Results will be displayed here after groups complete their tasks.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((result, index) => (
              <div
                key={result.id}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {result.isSpecial ? (
                  <SpecialGroupDisplay language={language} t={t} />
                ) : (
                  <GroupResultCard result={result} language={language} t={t} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 特殊說明 */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">
              {language === 'zh' ? '💡 展示說明' : '💡 Display Instructions'}
            </h4>
            <p className="text-sm text-blue-700">
              {language === 'zh' 
                ? '成果將按照上傳時間順序展示。第1組為特別展示區域，其他組別完成上傳後將自動出現在此頁面。'
                : 'Results will be displayed in order of upload time. Group 1 is a special display area, other groups will automatically appear on this page after uploading.'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;