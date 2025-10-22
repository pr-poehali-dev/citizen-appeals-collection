import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { useToast } from "@/components/ui/use-toast";

const Submit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
    subject: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Обращение принято",
          description: `Ваш номер обращения: ${data.appealNumber}`,
        });
        navigate(`/status?number=${data.appealNumber}`);
      } else {
        throw new Error("Ошибка отправки");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить обращение. Попробуйте позже.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Icon name="Building2" size={32} className="text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Портал обращений граждан</h1>
              <p className="text-sm text-muted-foreground">Подача обращения</p>
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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Подать обращение</h2>
          <p className="text-muted-foreground">
            Заполните форму ниже. После отправки вы получите уникальный номер для отслеживания статуса.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Форма обращения</CardTitle>
            <CardDescription>
              Все поля обязательны для заполнения. Ваши данные защищены и используются только для обработки обращения.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">ФИО</Label>
                  <Input
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.ru"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Категория обращения</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Здравоохранение</SelectItem>
                      <SelectItem value="housing">ЖКХ</SelectItem>
                      <SelectItem value="transport">Транспорт</SelectItem>
                      <SelectItem value="government">Госуслуги</SelectItem>
                      <SelectItem value="education">Образование</SelectItem>
                      <SelectItem value="social">Социальная защита</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Тема обращения</Label>
                  <Input
                    id="subject"
                    placeholder="Краткое описание проблемы"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Подробное описание</Label>
                  <Textarea
                    id="description"
                    placeholder="Опишите вашу проблему или жалобу максимально подробно..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Укажите все важные детали: даты, место, участники, предпринятые действия.
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex gap-3">
                  <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Обратите внимание:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Срок рассмотрения обращения — до 30 дней</li>
                      <li>Вы получите уведомления на указанный email</li>
                      <li>Статус можно отслеживать по номеру обращения</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={20} className="mr-2" />
                      Отправить обращение
                    </>
                  )}
                </Button>
                <Link to="/">
                  <Button type="button" variant="outline" size="lg">
                    Отмена
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icon name="Clock" size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm">Быстрая обработка</p>
                  <p className="text-xs text-muted-foreground">Ответ в течение 30 дней</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icon name="Shield" size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm">Конфиденциально</p>
                  <p className="text-xs text-muted-foreground">Защита персональных данных</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icon name="Bell" size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-sm">Уведомления</p>
                  <p className="text-xs text-muted-foreground">О каждом изменении статуса</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Submit;
