import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Edit2, Award, Target, Flame, BookOpen } from 'lucide-react';

interface UserProfile {
  user: any;
  profile: {
    bio: string;
    skill_level: string;
    total_learning_hours: number;
    total_courses_completed: number;
    current_course_id: number | null;
    current_course_progress: number;
    total_points: number;
    streak_days: number;
    preferred_language: string;
    motivational_quote: string | null;
  };
  achievements: any[];
}

const SKILL_LEVELS = {
  beginner: { label: 'Начинающий', color: 'bg-green-500' },
  intermediate: { label: 'Средний', color: 'bg-blue-500' },
  advanced: { label: 'Продвинутый', color: 'bg-purple-500' },
};

const MOCK_STATS = [
  { date: 'Пн', hours: 2, exercises: 5 },
  { date: 'Вт', hours: 3, exercises: 8 },
  { date: 'Ср', hours: 1.5, exercises: 3 },
  { date: 'Чт', hours: 4, exercises: 12 },
  { date: 'Пт', hours: 2.5, exercises: 7 },
  { date: 'Сб', hours: 5, exercises: 15 },
  { date: 'Вс', hours: 1, exercises: 2 },
];

const MOCK_ACHIEVEMENTS = [
  { id: 1, name: 'Первые шаги', icon: '🎯', description: 'Завершите первый урок', unlocked: true },
  { id: 2, name: 'Неделя воина', icon: '🔥', description: 'Семидневная боевая полоса', unlocked: true },
  { id: 3, name: 'Сто часов', icon: '⏰', description: 'Изучите 100 часов', unlocked: false },
  { id: 4, name: 'Кодовый мастер', icon: '💻', description: '50 упражнений выполнено', unlocked: false },
];

const LANGUAGES_DATA = [
  { name: 'Python', value: 35 },
  { name: 'JavaScript', value: 25 },
  { name: 'React', value: 20 },
  { name: 'SQL', value: 20 },
];

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile['profile'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        } else {
          // Use mock data for demo
          setProfile({
            bio: 'Passionate learner exploring AI and web development',
            skill_level: 'intermediate',
            total_learning_hours: 47,
            total_courses_completed: 3,
            current_course_id: 1,
            current_course_progress: 65,
            total_points: 1250,
            streak_days: 7,
            preferred_language: 'Python',
            motivational_quote: 'Код - это современная поэзия',
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Use mock data
        setProfile({
          bio: 'Passionate learner exploring AI and web development',
          skill_level: 'intermediate',
          total_learning_hours: 47,
          total_courses_completed: 3,
          current_course_id: 1,
          current_course_progress: 65,
          total_points: 1250,
          streak_days: 7,
          preferred_language: 'Python',
          motivational_quote: 'Код - это современная поэзия',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  const skillLevelInfo = SKILL_LEVELS[profile.skill_level as keyof typeof SKILL_LEVELS];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile Card */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-4xl font-bold text-white">Мой Профиль</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-400 border-red-400 hover:bg-red-950"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выход
            </Button>
          </div>

          <Card className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-red-900/50 border-purple-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-8">
                <div>
                  <Avatar className="w-24 h-24 border-4 border-purple-500">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="text-2xl font-bold">
                      {user?.first_name[0]}
                      {user?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  {user?.username && (
                    <p className="text-purple-300 mb-3">@{user.username}</p>
                  )}
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge className={`${skillLevelInfo.color} text-white`}>
                      {skillLevelInfo.label}
                    </Badge>
                    {user?.is_premium && (
                      <Badge className="bg-yellow-500 text-white">⭐ Premium</Badge>
                    )}
                    <Badge variant="outline">
                      {profile.total_points} очков
                    </Badge>
                  </div>
                  {profile.motivational_quote && (
                    <p className="text-slate-300 italic mt-3">
                      "{profile.motivational_quote}"
                    </p>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-slate-300 mt-4">{profile.bio}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Часов обучения</p>
                  <p className="text-3xl font-bold text-purple-400">
                    {profile.total_learning_hours}
                  </p>
                </div>
                <BookOpen className="w-10 h-10 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Полных курсов</p>
                  <p className="text-3xl font-bold text-pink-400">
                    {profile.total_courses_completed}
                  </p>
                </div>
                <Award className="w-10 h-10 text-pink-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Боевая полоса</p>
                  <p className="text-3xl font-bold text-red-400">
                    {profile.streak_days}
                  </p>
                </div>
                <Flame className="w-10 h-10 text-red-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Всего очков</p>
                  <p className="text-3xl font-bold text-green-400">
                    {profile.total_points}
                  </p>
                </div>
                <Target className="w-10 h-10 text-green-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="mb-8">
          <TabsList className="bg-slate-900/50 border-slate-700">
            <TabsTrigger value="progress">Прогресс</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
            <TabsTrigger value="languages">Языки</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            {/* Current Course Progress */}
            {profile.current_course_id && (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Текущий курс</CardTitle>
                  <CardDescription>Ваш прогресс обучения</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <p className="text-white font-medium">
                          Основы React
                        </p>
                        <span className="text-purple-400">
                          {profile.current_course_progress}%
                        </span>
                      </div>
                      <Progress
                        value={profile.current_course_progress}
                        className="h-3"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weekly Stats */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Еженедельная статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={MOCK_STATS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="hours" fill="#8b5cf6" name="Часов" />
                    <Bar dataKey="exercises" fill="#ec4899" name="Упражнений" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Learning Trend */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Тренд обучения</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={MOCK_STATS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Часов"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Достижения</CardTitle>
                <CardDescription>
                  Разблокировано {MOCK_ACHIEVEMENTS.filter(a => a.unlocked).length} из{' '}
                  {MOCK_ACHIEVEMENTS.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_ACHIEVEMENTS.map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        achievement.unlocked
                          ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500'
                          : 'bg-slate-800/50 border-slate-700 opacity-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <p className="font-semibold text-white mb-1">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {achievement.description}
                      </p>
                      {achievement.unlocked && (
                        <p className="text-xs text-green-400 mt-2">✓ Разблокировано</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Languages Tab */}
          <TabsContent value="languages">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Предпочтительные языки программирования</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={LANGUAGES_DATA}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name} ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {LANGUAGES_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #475569',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-4">
                    {LANGUAGES_DATA.map((lang, index) => (
                      <div key={lang.name}>
                        <div className="flex justify-between mb-2">
                          <span className="text-white font-medium">{lang.name}</span>
                          <span className="text-slate-400">{lang.value}%</span>
                        </div>
                        <Progress value={lang.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle>Настройки профиля</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="text-white font-medium block mb-2">
                      Уровень навыков
                    </label>
                    <select className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2">
                      <option value="beginner">Начинающий</option>
                      <option value="intermediate" selected>
                        Средний
                      </option>
                      <option value="advanced">Продвинутый</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white font-medium block mb-2">
                      Предпочтительный язык
                    </label>
                    <select className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2">
                      <option value="Python" selected>
                        Python
                      </option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="Go">Go</option>
                      <option value="Rust">Rust</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white font-medium block mb-2">
                      Мотивирующая цитата
                    </label>
                    <textarea className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2">
                      Код - это современная поэзия
                    </textarea>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
