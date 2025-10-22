import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Icon name="Building2" size={32} className="text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Портал обращений граждан</h1>
              <p className="text-sm text-muted-foreground">Контактная информация</p>
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
          <h2 className="text-3xl font-bold text-foreground mb-2">Контакты</h2>
          <p className="text-muted-foreground">
            Выберите удобный способ связи с нами
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Phone" size={24} className="text-primary" />
                </div>
                <CardTitle>Горячая линия</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-2">8-800-000-00-00</p>
              <p className="text-sm text-muted-foreground">
                Бесплатный звонок по всей России
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                <strong>График работы:</strong><br />
                Понедельник - Пятница: 9:00 - 18:00<br />
                Суббота - Воскресенье: выходной
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <CardTitle>Электронная почта</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-foreground mb-2">support@appeals.gov.ru</p>
              <p className="text-sm text-muted-foreground">
                Ответим в течение 1 рабочего дня
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                <strong>Для обращений:</strong><br />
                appeals@appeals.gov.ru
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="MapPin" size={24} className="text-primary" />
                </div>
                <CardTitle>Адрес приёмной</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-foreground mb-2">
                г. Москва, ул. Тверская, д. 1, офис 101
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Часы приёма:</strong><br />
                Вторник, Четверг: 10:00 - 17:00<br />
                Обед: 13:00 - 14:00
              </p>
              <p className="text-sm text-destructive mt-2">
                * Требуется предварительная запись
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                </div>
                <CardTitle>Онлайн-консультант</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Чат с оператором доступен в рабочие часы
              </p>
              <Button className="w-full">
                <Icon name="MessageCircle" size={16} className="mr-2" />
                Начать чат
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Часто задаваемые вопросы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Как подать обращение?</h4>
                <p className="text-sm text-muted-foreground">
                  Воспользуйтесь электронной формой на странице "Подать обращение".
                  Заполните все обязательные поля и отправьте заявку. Вы получите номер
                  для отслеживания статуса.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Какой срок рассмотрения обращения?</h4>
                <p className="text-sm text-muted-foreground">
                  Стандартный срок рассмотрения — до 30 календарных дней. В сложных
                  случаях срок может быть продлён до 60 дней с обязательным уведомлением.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Как проверить статус обращения?</h4>
                <p className="text-sm text-muted-foreground">
                  Перейдите на страницу "Статус обращения" и введите номер, полученный
                  после подачи заявки. Также вы будете получать уведомления на email.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Можно ли подать анонимное обращение?</h4>
                <p className="text-sm text-muted-foreground">
                  Нет, согласно законодательству для рассмотрения обращения необходимы
                  контактные данные заявителя. Ваши данные защищены и не передаются третьим лицам.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Icon name="AlertCircle" size={32} className="flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Экстренные ситуации</h3>
                <p className="mb-4">
                  При угрозе жизни и здоровью немедленно обращайтесь в экстренные службы:
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-bold">112</p>
                    <p className="opacity-90">Единый номер экстренных служб</p>
                  </div>
                  <div>
                    <p className="font-bold">103</p>
                    <p className="opacity-90">Скорая медицинская помощь</p>
                  </div>
                  <div>
                    <p className="font-bold">102</p>
                    <p className="opacity-90">Полиция</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Contacts;
