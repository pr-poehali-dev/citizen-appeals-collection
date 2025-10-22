import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";

interface Appeal {
  id: string;
  number: string;
  status: "new" | "in_progress" | "completed" | "rejected";
  category: string;
  subject: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
  fullName: string;
}

interface Analytics {
  totalAppeals: number;
  newAppeals: number;
  inProgress: number;
  completed: number;
  topCategories: { category: string; count: number }[];
  topProblems: { problem: string; count: number }[];
}

const Employee = () => {
  const { toast } = useToast();
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAppeals();
    loadAnalytics();
  }, []);

  const loadAppeals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-appeals");
      if (response.ok) {
        const data = await response.json();
        setAppeals(data.appeals);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить обращения",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/get-analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to load analytics", error);
    }
  };

  const updateAppealStatus = async (appealId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/update-appeal-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appealId, status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Статус обновлён",
          description: "Обращение успешно обновлено",
        });
        loadAppeals();
        loadAnalytics();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: "Новое", variant: "secondary" as const },
      in_progress: { label: "В работе", variant: "default" as const },
      completed: { label: "Выполнено", variant: "default" as const },
      rejected: { label: "Отклонено", variant: "destructive" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { label: "Низкий", className: "bg-blue-100 text-blue-800" },
      medium: { label: "Средний", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "Высокий", className: "bg-red-100 text-red-800" },
    };
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap];
    return <Badge className={priorityInfo.className}>{priorityInfo.label}</Badge>;
  };

  const filteredAppeals = appeals.filter((appeal) => {
    const matchesCategory = filterCategory === "all" || appeal.category === filterCategory;
    const matchesSearch = appeal.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appeal.number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon name="Building2" size={32} className="text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Личный кабинет сотрудника</h1>
              <p className="text-sm text-muted-foreground">Управление обращениями граждан</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="appeals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="appeals">
              <Icon name="FileText" size={16} className="mr-2" />
              Обращения
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appeals" className="space-y-6">
            {analytics && (
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Всего</p>
                        <p className="text-2xl font-bold">{analytics.totalAppeals}</p>
                      </div>
                      <Icon name="FileText" size={32} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Новые</p>
                        <p className="text-2xl font-bold text-blue-600">{analytics.newAppeals}</p>
                      </div>
                      <Icon name="AlertCircle" size={32} className="text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">В работе</p>
                        <p className="text-2xl font-bold text-yellow-600">{analytics.inProgress}</p>
                      </div>
                      <Icon name="Clock" size={32} className="text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Выполнено</p>
                        <p className="text-2xl font-bold text-green-600">{analytics.completed}</p>
                      </div>
                      <Icon name="CheckCircle" size={32} className="text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Фильтры</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Поиск по номеру или теме..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      <SelectItem value="healthcare">Здравоохранение</SelectItem>
                      <SelectItem value="housing">ЖКХ</SelectItem>
                      <SelectItem value="transport">Транспорт</SelectItem>
                      <SelectItem value="government">Госуслуги</SelectItem>
                      <SelectItem value="education">Образование</SelectItem>
                      <SelectItem value="social">Социальная защита</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2" />
                    <p className="text-muted-foreground">Загрузка обращений...</p>
                  </CardContent>
                </Card>
              ) : filteredAppeals.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Icon name="Inbox" size={48} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Обращения не найдены</p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppeals.map((appeal) => (
                  <Card key={appeal.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">№ {appeal.number}</CardTitle>
                            {getStatusBadge(appeal.status)}
                            {getPriorityBadge(appeal.priority)}
                          </div>
                          <CardDescription>{appeal.subject}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Заявитель</p>
                          <p className="font-medium">{appeal.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Категория</p>
                          <p className="font-medium">{appeal.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Дата подачи</p>
                          <p className="font-medium">{appeal.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={appeal.status}
                          onValueChange={(value) => updateAppealStatus(appeal.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Новое</SelectItem>
                            <SelectItem value="in_progress">В работе</SelectItem>
                            <SelectItem value="completed">Выполнено</SelectItem>
                            <SelectItem value="rejected">Отклонено</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm">
                          <Icon name="Eye" size={16} className="mr-2" />
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Популярные категории</CardTitle>
                      <CardDescription>Топ категорий по количеству обращений</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topCategories.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-bold">{index + 1}</span>
                              </div>
                              <span className="font-medium">{item.category}</span>
                            </div>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Выявленные проблемы</CardTitle>
                      <CardDescription>Часто повторяющиеся жалобы</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topProblems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon name="AlertTriangle" size={20} className="text-destructive" />
                              <span className="font-medium text-sm">{item.problem}</span>
                            </div>
                            <Badge variant="destructive">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Рекомендации</CardTitle>
                    <CardDescription>На основе анализа обращений</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-3 p-4 bg-muted rounded-lg">
                        <Icon name="TrendingUp" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Повышенное внимание к ЖКХ</p>
                          <p className="text-sm text-muted-foreground">
                            Количество жалоб на коммунальные услуги выросло на 25% за последний месяц.
                            Рекомендуется усилить контроль за управляющими компаниями.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 p-4 bg-muted rounded-lg">
                        <Icon name="Clock" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Оптимизация сроков</p>
                          <p className="text-sm text-muted-foreground">
                            Средний срок обработки обращений по категории "Транспорт" превышает норму на 5 дней.
                            Требуется дополнительное распределение нагрузки.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Employee;
