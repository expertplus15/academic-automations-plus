import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Eye, EyeOff, Loader } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // Rediriger si déjà connecté
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header avec logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">EduPlatform</h1>
          <p className="text-muted-foreground">Plateforme de Gestion Éducative</p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="bg-card/50 backdrop-blur-lg border shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace de gestion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">
                  Adresse email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-background/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-input bg-background"
                  />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Se souvenir de moi
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            {/* Comptes de démonstration */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Comptes de démonstration
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail('admin@eduplatform.com');
                    setPassword('demo123');
                  }}
                  className="text-xs"
                >
                  👨‍💼 Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail('teacher@eduplatform.com');
                    setPassword('demo123');
                  }}
                  className="text-xs"
                >
                  👨‍🏫 Enseignant
                </Button>
              </div>
            </div>

            {/* Liens supplémentaires */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nouveau sur la plateforme ?{' '}
                <Link to="/signup" className="text-primary hover:text-primary/80">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 EduPlatform. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}