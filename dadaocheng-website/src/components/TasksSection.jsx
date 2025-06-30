import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Map, Search, Video, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';

const TasksSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const taskIcons = {
    task1: BookOpen,
    task2: Map,
    task3: Search,
    task4: Video,
    task5: Users
  };

  const taskColors = {
    task1: 'bg-blue-500',
    task2: 'bg-green-500',
    task3: 'bg-purple-500',
    task4: 'bg-red-500',
    task5: 'bg-orange-500'
  };

  const scrollToUpload = () => {
    const element = document.querySelector('#upload');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="tasks" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.tasks.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'zh' 
              ? '選擇一個任務開始您的大稻埕探索之旅，每個任務都有獨特的學習目標和體驗。'
              : 'Choose a task to begin your Dadaocheng exploration journey. Each task offers unique learning objectives and experiences.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {Object.keys(t.tasks).filter(key => key.startsWith('task')).map((taskKey, index) => {
            const task = t.tasks[taskKey];
            const IconComponent = taskIcons[taskKey];
            const colorClass = taskColors[taskKey];
            
            return (
              <Card key={taskKey} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                    {task.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <h4 className="font-semibold text-gray-800">
                      {language === 'zh' ? '任務目標：' : 'Objectives:'}
                    </h4>
                    <ul className="space-y-2">
                      {task.objectives.slice(0, 2).map((objective, objIndex) => (
                        <li key={objIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-600 mr-2 mt-1">•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                      {task.objectives.length > 2 && (
                        <li className="text-sm text-gray-500 italic">
                          {language === 'zh' ? `還有 ${task.objectives.length - 2} 個目標...` : `${task.objectives.length - 2} more objectives...`}
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <Button 
                    onClick={scrollToUpload}
                    className="w-full bg-green-700 hover:bg-green-800 text-white group-hover:bg-green-800 transition-colors"
                  >
                    {language === 'zh' ? '選擇此任務' : 'Choose This Task'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Task Selection Guide */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'zh' ? '如何選擇任務？' : 'How to Choose a Task?'}
          </h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            {language === 'zh' 
              ? '根據您的教學專長、興趣和學生需求來選擇最適合的任務。每個任務都能提供不同的學習視角和教學靈感。'
              : 'Choose the most suitable task based on your teaching expertise, interests, and student needs. Each task offers different learning perspectives and teaching inspiration.'
            }
          </p>
          <Button 
            onClick={scrollToUpload}
            size="lg"
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-3"
          >
            {language === 'zh' ? '開始上傳成果' : 'Start Uploading Results'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TasksSection;

