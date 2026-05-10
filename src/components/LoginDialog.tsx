import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  login_or_email: z.string().min(1, "Введите логин или почту"),
  password: z.string().min(1, "Введите пароль"),
});

type Values = z.infer<typeof schema>;

export function LoginDialog() {
  const { loginOpen, setLoginOpen, login, openRegister } = useAuth();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { login_or_email: "", password: "" },
  });

  const submitting = form.formState.isSubmitting;

  return (
    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
      <DialogContent className="glass-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Вход
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (data) => {
              try {
                await login({ login_or_email: data.login_or_email, password: data.password });
              } catch (e) {
                const message =
                  e instanceof Error ? e.message : "Не удалось войти. Попробуйте ещё раз.";
                form.setError("root", { type: "server", message });
              }
            })}
          >
            <FormField
              control={form.control}
              name="login_or_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин или почта</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.message ? (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-primary hover:shadow-glow-primary transition-all"
              >
                {submitting ? "Входим..." : "Войти"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setLoginOpen(false);
                  openRegister();
                }}
              >
                Нет аккаунта? Регистрация
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

