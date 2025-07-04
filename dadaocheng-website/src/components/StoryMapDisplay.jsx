/**
 * 第1組 Esri StoryMap 專用展示組件
 * 響應式設計，支援全屏模式
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Maximize, 
  Star, 
  Trophy, 
  MapPin,
  Info,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const StoryMapDisplay = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1
  });

  // iframe 載入完成處理
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // 全屏開啟 StoryMap
  const openFullscreen = () => {
    window.open('https://storymaps.arcgis.com/stories/b8af9265bf6841f181b8ddbc6810a29f', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-yellow-50 via-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 mr-2" />
            {language === 'zh' ? '特別展示' : 'Special Display'}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              {language === 'zh' ? '第1組成果展示' : 'Group 1 Results'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'zh' 
              ? '透過 Esri StoryMap 技術，深度探索大稻埕的歷史文化與現代風貌，呈現互動式地圖故事體驗。'
              : 'Explore the historical culture and modern features of Dadaocheng through Esri StoryMap technology, presenting an interactive map story experience.'
            }
          </p>
        </div>

        {/* StoryMap 主要展示區域 */}
        <Card 
          ref={ref}
          className={`relative overflow-hidden border-2 border-yellow-300 shadow-2xl transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* 特殊標記 */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-2 z-20"></div>
          
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-orange-600" />
                    {language === 'zh' ? '互動式大稻埕探索地圖' : 'Interactive Dadaocheng Exploration Map'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    {language === 'zh' ? 'Esri StoryMap 特別呈現' : 'Special Presentation by Esri StoryMap'}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm px-3 py-1">
                  {language === 'zh' ? '第1組' : 'Group 1'}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Esri StoryMap
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* StoryMap iframe 容器 */}
            <div className="relative w-full bg-gray-100">
              {/* 載入中指示器 */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === 'zh' ? '載入互動地圖中...' : 'Loading interactive map...'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* 響應式 iframe - 16:9 比例 */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe 
                  src="https://storymaps.arcgis.com/stories/b8af9265bf6841f181b8ddbc6810a29f"
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="geolocation"
                  loading="lazy"
                  onLoad={handleIframeLoad}
                  title={language === 'zh' ? '大稻埕探索互動地圖 - 第1組成果' : 'Dadaocheng Exploration Interactive Map - Group 1 Results'}
                />
              </div>
              
              {/* 浮動控制按鈕 */}
              <div className="absolute top-4 right-4 z-20 flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={openFullscreen}
                  className="bg-white/95 hover:bg-white text-gray-700 shadow-lg border border-gray-200 backdrop-blur-sm"
                >
                  <Maximize className="w-4 h-4 mr-1" />
                  {language === 'zh' ? '全屏' : 'Fullscreen'}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={openFullscreen}
                  className="bg-white/95 hover:bg-white text-gray-700 shadow-lg border border-gray-200 backdrop-blur-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  {language === 'zh' ? '新視窗' : 'New Window'}
                </Button>
              </div>
            </div>
            
            {/* 使用說明區域 */}
            <div className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    {language === 'zh' ? '🗺️ StoryMap 使用指南' : '🗺️ StoryMap Usage Guide'}
                  </h4>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>
                      <span className="font-medium">
                        {language === 'zh' ? '🖱️ 互動操作：' : '🖱️ Interactive Controls:'}
                      </span>
                      {language === 'zh' 
                        ? '點擊地圖元素進行互動，使用滑鼠滾輪縮放地圖。'
                        : 'Click map elements to interact, use mouse wheel to zoom the map.'
                      }
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'zh' ? '📖 故事瀏覽：' : '📖 Story Navigation:'}
                      </span>
                      {language === 'zh' 
                        ? '向下滾動瀏覽完整的地圖故事，體驗大稻埕的歷史journey。'
                        : 'Scroll down to browse the complete map story and experience the historical journey of Dadaocheng.'
                      }
                    </p>
                    <p>
                      <span className="font-medium">
                        {language === 'zh' ? '🖥️ 最佳體驗：' : '🖥️ Best Experience:'}
                      </span>
                      {language === 'zh' 
                        ? '建議使用全屏模式獲得最佳的互動體驗效果。'
                        : 'Fullscreen mode is recommended for the best interactive experience.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 額外資訊卡片 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 專案資訊 */}
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                {language === 'zh' ? '專案特色' : 'Project Features'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  {language === 'zh' ? '結合歷史文獻與現代科技' : 'Combining historical documents with modern technology'}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                  {language === 'zh' ? '互動式地圖敘事體驗' : 'Interactive map storytelling experience'}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  {language === 'zh' ? '多媒體內容豐富呈現' : 'Rich multimedia content presentation'}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  {language === 'zh' ? '跨平台響應式設計' : 'Cross-platform responsive design'}
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 技術資訊 */}
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                {language === 'zh' ? '技術架構' : 'Technical Architecture'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Esri StoryMaps Platform
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  ArcGIS Online Integration
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  {language === 'zh' ? '地理空間數據可視化' : 'Geospatial Data Visualization'}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                  {language === 'zh' ? '響應式 Web 設計' : 'Responsive Web Design'}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StoryMapDisplay;