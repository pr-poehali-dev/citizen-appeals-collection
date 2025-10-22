import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";

interface AppealStatus {
  number: string;
  status: "new" | "in_progress" | "completed" | "rejected";
  category: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  history: {
    date: string;
    status: string;
    comment: string;
  }[];
}

const Status = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [appealNumber, setAppealNumber] = useState(searchParams.get("number") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [appealData, setAppealData] = useState<AppealStatus | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите номер обращения",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-appeal-status?number=${appealNumber}`);
      if (response.ok) {
        const data = await response.json();
        setAppealData(data);
      } else {
        toast({
          variant: "destructive",
          title: "Не найдено",
          description: "Обращение с таким номером не найдено",
        });
        setAppealData(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить данные. Попробуйте позже.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      new: { label: "Новое", variant: "secondary" as const },
      in_progress: { label: "В работе", variant: "default" as const },
      completed: { label: "Выполнено", variant: "default" as const },
      rejected: { label: "Отклонено", variant: "destructive" as const },
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Icon name="Building2" size={32} className="text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Портал обращений граждан</h1>
              <p className="text-sm text-muted-foreground">Проверка статуса обращения</p>
            </div>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Проверить статус обращения</h2>
          <p className="text-muted-foreground">
            Введите номер обращения, полученный после подачи заявки
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="appealNumber" className="sr-only">
                  Номер обращения
                </Label>
                <Input
                  id="appealNumber"
                  placeholder="Например: AP-2024-000123"
                  value={appealNumber}
                  onChange={(e) => setAppealNumber(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Поиск...
                  </>
                ) : (
                  <>
                    <Icon name="Search" size={20} className="mr-2" />
                    Найти
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {appealData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Обращение № {appealData.number}</CardTitle>
                    <CardDescription className="mt-2">{appealData.subject}</CardDescription>
                  </div>
                  {getStatusBadge(appealData.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Категория</p>
                    <p className="font-medium">{appealData.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Дата подачи</p>
                    <p className="font-medium">{appealData.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Последнее обновление</p>
                    <p className="font-medium">{appealData.updatedAt}</p>
                  </div>
                  {appealData.assignedTo && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ответственный</p>
                      <p className="font-medium">{appealData.assignedTo}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История обработки</CardTitle>
                <CardDescription>Все изменения статуса обращения</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appealData.history.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        {index !== appealData.history.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{item.status}</span>
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-2">Информация о сроках</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Срок рассмотрения обращения — до 30 календарных дней</li>
                      <li>При необходимости срок может быть продлён до 60 дней с уведомлением</li>
                      <li>Вы получите email-уведомление при изменении статуса</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!appealData && !isLoading && (
          <div className="text-center py-12">
            <Icon name="Search" size={64} className="text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Введите номер обращения</h3>
            <p className="text-muted-foreground mb-6">
              Номер обращения был отправлен вам на email после подачи заявки
            </p>
            <Link to="/submit">
              <Button variant="outline">
                <Icon name="FileText" size={20} className="mr-2" />
                Подать новое обращение
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Status;
