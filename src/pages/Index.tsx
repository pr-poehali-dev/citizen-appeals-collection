import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Appeal {
  id: string;
  citizenName: string;
  category: string;
  description: string;
  status: 'new' | 'in_progress' | 'resolved';
  date: string;
  priority: 'low' | 'medium' | 'high';
}

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('citizen');
  const [appeals, setAppeals] = useState<Appeal[]>([
    {
      id: '001',
      citizenName: 'Иванов А.П.',
      category: 'Жалоба на качество услуг',
      description: 'Не работает уличное освещение на ул. Ленина',
      status: 'in_progress',
      date: '2024-10-20',
      priority: 'high'
    },
    {
      id: '002',
      citizenName: 'Петрова М.С.',
      category: 'Жалоба на работу служб',
      description: 'Несвоевременный вывоз мусора',
      status: 'new',
      date: '2024-10-21',
      priority: 'medium'
    },
    {
      id: '003',
      citizenName: 'Сидоров В.И.',
      category: 'Жалоба на качество услуг',
      description: 'Плохое состояние дорожного покрытия',
      status: 'resolved',
      date: '2024-10-18',
      priority: 'medium'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAppeal: Appeal = {
      id: String(appeals.length + 1).padStart(3, '0'),
      citizenName: formData.name,
      category: formData.category,
      description: formData.description,
      status: 'new',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium'
    };

    setAppeals([...appeals, newAppeal]);
    setFormData({ name: '', email: '', phone: '', category: '', description: '' });
    
    toast({
      title: 'Обращение принято',
      description: `Номер обращения: ${newAppeal.id}. Вы получите уведомление на email.`,
    });
  };

  const getStatusBadge = (status: Appeal['status']) => {
    const statusConfig = {
      new: { label: 'Новое', variant: 'default' as const },
      in_progress: { label: 'В работе', variant: 'secondary' as const },
      resolved: { label: 'Решено', variant: 'outline' as const }
    };
    return statusConfig[status];
  };

  const getPriorityBadge = (priority: Appeal['priority']) => {
    const priorityConfig = {
      low: { label: 'Низкий', className: 'bg-muted text-muted-foreground' },
      medium: { label: 'Средний', className: 'bg-accent text-accent-foreground' },
      high: { label: 'Высокий', className: 'bg-destructive text-destructive-foreground' }
    };
    return priorityConfig[priority];
  };

  const stats = {
    total: appeals.length,
    new: appeals.filter(a => a.status === 'new').length,
    inProgress: appeals.filter(a => a.status === 'in_progress').length,
    resolved: appeals.filter(a => a.status === 'resolved').length,
    categories: {
      services: appeals.filter(a => a.category.includes('работу служб')).length,
      quality: appeals.filter(a => a.category.includes('качество услуг')).length
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Shield" size={32} className="text-primary-foreground" />
              <div>
                <h1 className="text-2xl font-bold">Система обращений граждан</h1>
                <p className="text-sm text-primary-foreground/80">Портал государственных услуг</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              <Icon name="User" size={16} className="mr-2" />
              Войти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="citizen" className="flex items-center gap-2">
              <Icon name="User" size={16} />
              Для граждан
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Icon name="UserCog" size={16} />
              Для сотрудников
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citizen" className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="FileText" size={24} />
                      Подать обращение
                    </CardTitle>
                    <CardDescription>
                      Заполните форму для подачи жалобы или обращения
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">ФИО *</Label>
                          <Input
                            id="name"
                            placeholder="Иванов Иван Иванович"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="example@mail.ru"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Телефон</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Категория обращения *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                            required
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Жалоба на работу служб">Жалоба на работу служб</SelectItem>
                              <SelectItem value="Жалоба на качество услуг">Жалоба на качество услуг</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Описание проблемы *</Label>
                        <Textarea
                          id="description"
                          placeholder="Подробно опишите вашу проблему или жалобу..."
                          rows={6}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg">
                        <Icon name="Send" size={18} className="mr-2" />
                        Отправить обращение
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon name="Search" size={20} />
                      Проверить статус
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input placeholder="Номер обращения" />
                      <Button className="w-full" variant="outline">
                        Найти
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon name="Phone" size={20} />
                      Контакты
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Icon name="MapPin" size={18} className="text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold">Адрес</p>
                        <p className="text-muted-foreground">ул. Государственная, д. 1</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Phone" size={18} className="text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold">Телефон</p>
                        <p className="text-muted-foreground">8 (800) 555-35-35</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Mail" size={18} className="text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold">Email</p>
                        <p className="text-muted-foreground">info@gov.ru</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="animate-fade-in">
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Всего обращений</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold">{stats.total}</p>
                      <Icon name="FileText" size={28} className="text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Новые</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-primary">{stats.new}</p>
                      <Icon name="Bell" size={28} className="text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">В работе</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-secondary">{stats.inProgress}</p>
                      <Icon name="Clock" size={28} className="text-secondary" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Решено</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-success">{stats.resolved}</p>
                      <Icon name="CheckCircle" size={28} className="text-success" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="List" size={24} />
                      Список обращений
                    </CardTitle>
                    <CardDescription>Все текущие обращения граждан</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {appeals.map((appeal) => {
                        const status = getStatusBadge(appeal.status);
                        const priority = getPriorityBadge(appeal.priority);
                        
                        return (
                          <Card key={appeal.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant={status.variant}>{status.label}</Badge>
                                    <Badge className={priority.className}>{priority.label}</Badge>
                                  </div>
                                  <p className="font-semibold text-lg">{appeal.citizenName}</p>
                                  <p className="text-sm text-muted-foreground">№{appeal.id} • {appeal.date}</p>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Icon name="Eye" size={16} className="mr-2" />
                                  Открыть
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-primary">{appeal.category}</p>
                                <p className="text-sm text-muted-foreground">{appeal.description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="BarChart3" size={20} />
                        Аналитика
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Жалобы на службы</span>
                          <span className="text-sm font-bold">{stats.categories.services}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(stats.categories.services / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Качество услуг</span>
                          <span className="text-sm font-bold">{stats.categories.quality}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-secondary h-2 rounded-full transition-all"
                            style={{ width: `${(stats.categories.quality / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon name="TrendingUp" size={20} />
                        Приоритеты
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Высокий приоритет</span>
                        <Badge className="bg-destructive text-destructive-foreground">
                          {appeals.filter(a => a.priority === 'high').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Средний приоритет</span>
                        <Badge className="bg-accent text-accent-foreground">
                          {appeals.filter(a => a.priority === 'medium').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Низкий приоритет</span>
                        <Badge className="bg-muted text-muted-foreground">
                          {appeals.filter(a => a.priority === 'low').length}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-primary text-primary-foreground mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm">
            <p>&copy; 2024 Портал государственных услуг. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
