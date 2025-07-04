import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Clock, Share2, MapPin, Phone, Mail, Building, AlertTriangle, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../data/translations';
import outdoorEducation from '../assets/outdoor-education.png';
// import teachersLearning from '../assets/teachers-learning.jpg';
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
      icon: FileText,
      title: t.instructions.documentation,
      description: t.instructions.documentationDesc,
      color: 'bg-indigo-500'
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Building className="h-6 w-6 mr-2 text-blue-600" />
                  {t.about.history}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t.about.historyContent}
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="h-6 w-6 mr-2 text-green-600" />
                  {t.about.culture}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t.about.cultureContent}
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src={dadaochengBuildings}
              alt="Dadaocheng Buildings"
              className="rounded-lg shadow-lg w-full"
            />
            <div className="absolute inset-0 bg-blue-600/10 rounded-lg"></div>
          </div>
        </div>

        {/* 教育價值區塊 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {t.about.education}
            </h3>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            {t.about.educationContent}
          </p>
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

