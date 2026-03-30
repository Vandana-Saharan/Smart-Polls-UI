import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import Button from '../../components/ui/Button';
import { Card, CardTitle } from '../../components/ui/Card';
import FieldError from '../../components/ui/FieldError';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label';
import { useAuth } from '../../app/auth/AuthContext';
import { register } from '../../lib/authRepo';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      const response = await register(values);
      toast.success(response.message);
      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Register failed';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Register</h1>
        <p className="mt-1 text-[var(--smart-secondary)]">Create an account to own and manage polls.</p>
      </div>

      <Card>
        <CardTitle>Create your account</CardTitle>
        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="mt-2">
              <Input id="username" placeholder="e.g. vandana" {...form.register('username')} />
              <FieldError message={form.formState.errors.username?.message} />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-2">
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                {...form.register('password')}
              />
              <FieldError message={form.formState.errors.password?.message} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit">Register</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/login')}>
              Back to login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
