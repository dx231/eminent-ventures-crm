import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck } from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully!');
      window.location.href = '/';
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Please check your email to confirm.');
      setEmail('');
      setPassword('');
      setFullName('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-sm border border-[#E4E4E7] p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#18181B] rounded-sm mb-4 mx-auto">
              <Truck className="w-8 h-8 text-white" weight="duotone" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#09090B]">
              Eminent Ventures CRM
            </h1>
            <p className="text-sm text-[#52525B] mt-2">Auto Transport Order Management</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6" style={{ display: 'flex' }}>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#E4E4E7]"
                  />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-[#E4E4E7]"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#18181B] hover:bg-[#27272A] text-white">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="border-[#E4E4E7]"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-[#E4E4E7]"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-[#E4E4E7]"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#18181B] hover:bg-[#27272A] text-white">
                  {loading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-[#F4F4F5] rounded-sm border border-[#E4E4E7]">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#52525B] mb-2">
              First time here?
            </p>
            <p className="text-xs text-[#52525B]">
              Sign up to create your account. An admin can assign your role (dispatch, sales, accounts) afterward in Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
