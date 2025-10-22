import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  const categories = [
    { value: "housing", label: "ЖКХ", icon: "Home" },
    { value: "transport", label: "Транспорт", icon: "Bus" },
    { value: "medicine", label: "Медицина", icon: "Heart" },
    { value: "education", label: "Образование", icon: "GraduationCap" },
    { value: "social", label: "Социальные службы", icon: "Users" },
    { value: "other", label: "Другое", icon: "MoreHorizontal" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.name || !formData.description) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, заполните обязательные поля",
      });
      return;
    }

    toast({
      title: "Жалоба отправлена",
      description: "Ваше обращение принято. Мы свяжемся с вами в ближайшее время.",
    });

    setFormData({
      category: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Icon name="AlertCircle" className="text-primary-foreground" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Жалобы на работу служб
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Сообщите о проблемах с качеством услуг. Мы рассмотрим ваше обращение и примем меры
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {categories.slice(0, 3).map((cat, idx) => (
              <Card 
                key={cat.value}
                className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setFormData({ ...formData, category: cat.value })}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader className="text-center pb-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                    <Icon name={cat.icon as any} className="text-primary" size={24} />
                  </div>
                  <CardTitle className="text-lg">{cat.label}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="shadow-xl animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl">Форма обращения</CardTitle>
              <CardDescription>
                Заполните форму ниже. Поля, отмеченные *, обязательны для заполнения
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Категория обращения *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <Icon name={cat.icon as any} size={16} />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ФИО *</Label>
                    <Input
                      id="name"
                      placeholder="Иванов Иван Иванович"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <Input
                    id="address"
                    placeholder="Город, улица, дом"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Описание проблемы *</Label>
                  <Textarea
                    id="description"
                    placeholder="Опишите суть жалобы максимально подробно..."
                    className="min-h-32"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" className="flex-1" size="lg">
                    <Icon name="Send" className="mr-2" size={20} />
                    Отправить жалобу
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({
                      category: "",
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                      description: "",
                    })}
                    size="lg"
                  >
                    Очистить форму
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-8 bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Info" size={24} />
                Важная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <Icon name="CheckCircle" className="text-success mt-0.5 flex-shrink-0" size={18} />
                Все обращения рассматриваются в течение 3-5 рабочих дней
              </p>
              <p className="flex items-start gap-2">
                <Icon name="CheckCircle" className="text-success mt-0.5 flex-shrink-0" size={18} />
                Мы свяжемся с вами по указанным контактам для уточнения деталей
              </p>
              <p className="flex items-start gap-2">
                <Icon name="CheckCircle" className="text-success mt-0.5 flex-shrink-0" size={18} />
                Ваши данные защищены и используются только для решения обращения
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
