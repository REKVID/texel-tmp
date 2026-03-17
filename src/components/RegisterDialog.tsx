import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    username: z.string().min(2, "Минимум 2 символа"),
    email: z.string().email("Некорректная почта"),
    name: z.string().min(1, "Введите имя"),
    password: z.string().min(6, "Минимум 6 символов").max(200),
    passwordConfirm: z.string().min(1, "Повторите пароль"),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Пароли не совпадают",
  });

type Values = z.infer<typeof schema>;

export function RegisterDialog() {
  const { registerOpen, setRegisterOpen, register, openLogin } = useAuth();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const submitting = form.formState.isSubmitting;

  return (
    <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
      <DialogContent className="glass-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Регистрация
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (data) => {
              try {
                await register({
                  username: data.username,
                  email: data.email,
                  name: data.name,
                  password: data.password,
                });
              } catch (e) {
                const message =
                  e instanceof Error ? e.message : "Не удалось создать аккаунт. Попробуйте ещё раз.";
                form.setError("root", { type: "server", message });
              }
            })}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Логин</FormLabel>
                  <FormControl>
                    <Input placeholder="" autoCapitalize="none" {...field} />
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
                    <Input placeholder="" autoCapitalize="none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Ваше имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль ещё раз</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.root?.message ? (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-primary hover:shadow-glow-primary transition-all"
              >
                {submitting ? "Создаём..." : "Создать аккаунт"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setRegisterOpen(false);
                  openLogin();
                }}
              >
                Уже есть аккаунт? Войти
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

