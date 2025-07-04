/**
 * SuperClaude 增強任務區塊
 * 極致性能優化 + 微互動 + 無障礙性
 */
import React, { memo, useMemo, useCallback, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Map, Search, Video, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../data/translations';
import { useNavigate } from 'react-router-dom';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { usePerformanceMonitor, useSmartDebounce } from '../../hooks/useAdvancedPerformance';

// 任務卡片組件 - 獨立優化
const TaskCard = memo(({ task, taskKey, IconComponent, colorClass, onSelect, isVisible }) => {
  const { language } = useLanguage();
  usePerformanceMonitor(`TaskCard-${taskKey}`);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // 自定義緩動曲線
      }
    },
    hover: { 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const iconVariants = {
    hover: { 
      scale: 1.2, 
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-green-500"
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      tabIndex={0}
      role="button"
      aria-label={`選擇任務: ${task.title}`}
    >
      {/* 背景漸變效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-green-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* 光暈效果 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-500" />
      
      <CardHeader className="pb-4 relative z-10">
        <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
          <IconComponent className="h-6 w-6 text-white drop-shadow-sm" />
          
          {/* 微光效果 */}
          <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
        </div>
        
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
          {task.title}
          
          {/* 閃光效果 */}
          <Sparkles className="inline-block w-4 h-4 ml-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </CardTitle>
        
        <CardDescription className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {task.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 group-hover:animate-pulse"></span>
            {language === 'zh' ? '任務目標：' : 'Objectives:'}
          </h4>
          
          <ul className="space-y-2">
            {task.objectives.slice(0, 2).map((objective, objIndex) => (
              <li 
                key={objIndex} 
                className="text-sm text-gray-600 flex items-start transform transition-transform duration-300 group-hover:translate-x-1"
                style={{ transitionDelay: `${objIndex * 100}ms` }}
              >
                <span className="text-green-600 mr-2 mt-1 transition-colors duration-300 group-hover:text-green-500">•</span>
                <span className="group-hover:text-gray-700 transition-colors duration-300">{objective}</span>
              </li>
            ))}
            
            {task.objectives.length > 2 && (
              <li className="text-sm text-gray-500 italic transition-colors duration-300 group-hover:text-gray-600">
                {language === 'zh' ? `還有 ${task.objectives.length - 2} 個目標...` : `${task.objectives.length - 2} more objectives...`}
              </li>
            )}
          </ul>
        </div>
        
        <Button 
          className="w-full bg-green-700 hover:bg-green-800 text-white group-hover:bg-green-800 transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-lg"
          size="lg"
        >
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {language === 'zh' ? '選擇此任務' : 'Choose This Task'}
          </span>
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
        </Button>
      </CardContent>
      
      {/* 右上角裝飾 */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';

// 主要任務區塊組件
const EnhancedTasksSection = memo(() => {
  const { language } = useLanguage();
  const t = translations[language];
  const navigate = useNavigate();
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  usePerformanceMonitor('EnhancedTasksSection');

  // 智能防抖選擇
  const debouncedSelection = useSmartDebounce(null, 150);

  const taskConfig = useMemo(() => ({
    icons: {
      task1: BookOpen,
      task2: Map,
      task3: Search,
      task4: Video,
      task5: Users
    },
    colors: {
      task1: 'bg-gradient-to-br from-blue-500 to-blue-600',
      task2: 'bg-gradient-to-br from-green-500 to-green-600',
      task3: 'bg-gradient-to-br from-purple-500 to-purple-600',
      task4: 'bg-gradient-to-br from-red-500 to-red-600',
      task5: 'bg-gradient-to-br from-orange-500 to-orange-600'
    }
  }), []);

  const handleTaskSelection = useCallback((taskKey) => {
    // 添加觸覺反饋 (如果支持)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // 導航到上傳頁面
    navigate('/upload');
    
    // 記錄選擇事件
    console.log('📊 Task Selected:', taskKey);
  }, [navigate]);

  const taskKeys = useMemo(() => 
    Object.keys(t.tasks).filter(key => key.startsWith('task')),
    [t.tasks]
  );

  return (
    <section 
      ref={ref}
      id="tasks" 
      className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
    >
      {/* 背景裝飾 */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-gray-100 bg-[radial-gradient(circle,_#f0f0f0_1px,_transparent_1px)] bg-[length:60px_60px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 標題區域 */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t.tasks.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {language === 'zh' 
              ? '選擇一個任務開始您的大稻埕探索之旅，每個任務都有獨特的學習目標和體驗。'
              : 'Choose a task to begin your Dadaocheng exploration journey. Each task offers unique learning objectives and experiences.'
            }
          </p>
        </div>

        {/* 任務卡片網格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {taskKeys.map((taskKey, index) => {
            const task = t.tasks[taskKey];
            const IconComponent = taskConfig.icons[taskKey];
            const colorClass = taskConfig.colors[taskKey];
            
            return (
              <div
                key={taskKey}
                className={`transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />}>
                  <TaskCard
                    task={task}
                    taskKey={taskKey}
                    IconComponent={IconComponent}
                    colorClass={colorClass}
                    onSelect={() => handleTaskSelection(taskKey)}
                    isVisible={isVisible}
                  />
                </Suspense>
              </div>
            );
          })}
        </div>

        {/* 選擇指南 */}
        <div className={`bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl p-8 text-center shadow-xl border border-white/50 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '800ms' }}>
          <div className="relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
              {language === 'zh' ? '如何選擇任務？' : 'How to Choose a Task?'}
              <Sparkles className="w-6 h-6 ml-2 text-yellow-500" />
            </h3>
            
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed">
              {language === 'zh' 
                ? '根據您的教學專長、興趣和學生需求來選擇最適合的任務。每個任務都能提供不同的學習視角和教學靈感。'
                : 'Choose the most suitable task based on your teaching expertise, interests, and student needs. Each task offers different learning perspectives and teaching inspiration.'
              }
            </p>
            
            <Button 
              onClick={() => navigate('/upload')}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span className="flex items-center">
                {language === 'zh' ? '開始上傳成果' : 'Start Uploading Results'}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

EnhancedTasksSection.displayName = 'EnhancedTasksSection';

export default EnhancedTasksSection;