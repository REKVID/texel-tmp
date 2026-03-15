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

const schema = z.object({
  login_or_email: z.string().min(1, "Введите логин или почту"),
  password: z.string().min(1, "Введите пароль"),
});

type FormValues = z.infer<typeof schema>;

export function LoginDialog() {
  const { loginOpen, setLoginOpen, login, setRegisterOpen } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { login_or_email: "", password: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await login({
        login_or_email: data.login_or_email,
        password: data.password,
      });
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка входа");
    }
  };

  const switchToRegister = () => {
    setLoginOpen(false);
    form.reset();
    setError(null);
    setRegisterOpen(true);
  };

  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent className="glass border border-primary/20 rounded-2xl shadow-glow-primary">
        <DialogHeader>
          <DialogTitle className="text-gradient text-2xl">Вход</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="login_or_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин или почта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="логин или email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="пароль"
                      autoComplete="current-password"
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
                {form.formState.isSubmitting ? "Вход…" : "Войти"}
              </Button>
              <button
                type="button"
                onClick={switchToRegister}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Нет аккаунта? Зарегистрироваться
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
