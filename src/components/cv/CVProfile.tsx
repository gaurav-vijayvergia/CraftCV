import { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  GraduationCap,
  Award,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface WorkExperience {
  company: string;
  position: string;
  dates: string;
  responsibilities: string[];
}

interface Education {
  institution: string;
  degree: string;
  dates: string;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface ParsedCV {
  personal_info: PersonalInfo;
  summary: string;
  work_experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: string[];
}

interface CVProfileProps {
  parsedData: ParsedCV;
  onClose: () => void;
}

export default function CVProfile({ parsedData, onClose }: CVProfileProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'json'>('profile');

  const tabs = [
    { id: 'profile' as const, label: 'Profile View' },
    { id: 'json' as const, label: 'JSON Data' },
  ];

  // Ensure arrays exist and are actually arrays
  const workExperience = Array.isArray(parsedData.work_experience) ? parsedData.work_experience : [];
  const education = Array.isArray(parsedData.education) ? parsedData.education : [];
  const skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
  const certifications = Array.isArray(parsedData.certifications) ? parsedData.certifications : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' ? (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Personal Info */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">
                  {parsedData.personal_info?.name || 'No Name Available'}
                </h2>
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-gray-600">
                  {parsedData.personal_info?.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{parsedData.personal_info.email}</span>
                    </div>
                  )}
                  {parsedData.personal_info?.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{parsedData.personal_info.phone}</span>
                    </div>
                  )}
                  {parsedData.personal_info?.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{parsedData.personal_info.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {parsedData.summary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {parsedData.summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              {workExperience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Work Experience
                  </h3>
                  <div className="space-y-6">
                    {workExperience.map((exp, index) => (
                      <div
                        key={index}
                        className="relative pl-8 border-l-2 border-gray-200"
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary" />
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex items-center text-gray-900 font-medium">
                            <Building className="h-4 w-4 mr-2" />
                            {exp.company}
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            {exp.dates}
                          </div>
                        </div>
                        <div className="font-medium text-primary mb-2">
                          {exp.position}
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {Array.isArray(exp.responsibilities) ? (
                            exp.responsibilities.map((resp, idx) => (
                              <li key={idx}>{resp}</li>
                            ))
                          ) : (
                            <li>{String(exp.responsibilities)}</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Education
                  </h3>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-primary mt-1 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {edu.institution}
                          </div>
                          <div className="text-primary">{edu.degree}</div>
                          <div className="text-sm text-gray-500">{edu.dates}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-start">
                        <Award className="h-5 w-5 text-primary mt-1 mr-3" />
                        <span className="text-gray-600">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
              <pre className="text-green-400 text-sm">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}