import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const schema = z
  .object({
    username: z.string().min(2, "Логин не менее 2 символов"),
    email: z.string().min(1, "Введите почту").email("Некорректная почта"),
    password: z.string().min(6, "Пароль не менее 6 символов"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterDialog() {
  const { registerOpen, setRegisterOpen, register, setLoginOpen } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка регистрации");
    }
  };

  const switchToLogin = () => {
    setRegisterOpen(false);
    form.reset();
    setError(null);
    setLoginOpen(true);
  };

  return (
    <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
      <DialogContent className="glass border border-primary/20 rounded-2xl shadow-glow-primary">
        <DialogHeader>
          <DialogTitle className="text-gradient text-2xl">
            Регистрация
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="логин"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="не менее 6 символов"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повторите пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="повторите пароль"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                className="bg-gradient-primary hover:shadow-glow-primary transition-all"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Регистрация…" : "Зарегистрироваться"}
              </Button>
              <button
                type="button"
                onClick={switchToLogin}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Уже есть аккаунт? Войти
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
