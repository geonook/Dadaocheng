import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Clock, Share2, MapPin, Phone, Mail, Building } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import outdoorEducation from '../assets/outdoor-education.png';
import teachersLearning from '../assets/teachers-learning.jpg';
import dadaochengBuildings from '../assets/dadaocheng-buildings.jpg';

export const PurposeSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="purpose" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t.purpose.title}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {t.purpose.content}
            </p>
            <div className="flex items-center space-x-2 text-green-700">
              <Target className="h-6 w-6" />
              <span className="font-semibold">
                {language === 'zh' ? '打破教學藩籬，走向真實學習' : 'Breaking Educational Boundaries, Moving Towards Authentic Learning'}
              </span>
            </div>
          </div>
          <div className="relative">
            <img
              src={outdoorEducation}
              alt="Outdoor Education"
              className="rounded-lg shadow-lg w-full"
            />
            <div className="absolute inset-0 bg-green-600/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const InstructionsSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const instructions = [
    {
      icon: Users,
      title: t.instructions.teamFormation,
      description: t.instructions.teamFormationDesc,
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: t.instructions.taskSelection,
      description: t.instructions.taskSelectionDesc,
      color: 'bg-green-500'
    },
    {
      icon: Clock,
      title: t.instructions.execution,
      description: t.instructions.executionDesc,
      color: 'bg-purple-500'
    },
    {
      icon: Share2,
      title: t.instructions.sharing,
      description: t.instructions.sharingDesc,
      color: 'bg-orange-500'
    }
  ];

  return (
    <section id="instructions" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.instructions.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {instructions.map((instruction, index) => {
            const IconComponent = instruction.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 ${instruction.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    {instruction.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {instruction.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            {language === 'zh' ? '行前注意事項' : 'Pre-Activity Reminders'}
          </h3>
          <ul className="space-y-2 text-yellow-700">
            <li>• {language === 'zh' ? '請務必攜帶防曬用品（例如帽子、防曬乳）' : 'Be sure to bring sun protection (e.g., hats, sunscreen)'}</li>
            <li>• {language === 'zh' ? '請穿著輕便舒適的衣物與鞋子' : 'Wear light, comfortable clothes and shoes'}</li>
            <li>• {language === 'zh' ? '請隨時注意個人安全與組員狀況' : 'Stay aware of personal safety and teammates\' well-being at all times'}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export const AboutSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.about.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.about.history}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              {t.about.historyContent}
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.about.culture}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {t.about.cultureContent}
            </p>
          </div>
          <div className="relative">
            <img
              src={dadaochengBuildings}
              alt="Dadaocheng Buildings"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContactSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t.contact.title}
          </h2>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800">
              {t.contact.school}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <MapPin className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">{t.contact.address}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">{t.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">{t.contact.email}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

