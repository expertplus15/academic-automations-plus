import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, Clock, User, FileText, BarChart, PlayCircle } from 'lucide-react';

export function OrientationTests() {
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [testStarted, setTestStarted] = useState(false);

  const tests = [
    {
      id: 1,
      title: 'Test d\'aptitudes cognitives',
      description: 'Évalue vos capacités de raisonnement logique, numérique et verbal',
      duration: 45,
      questionsCount: 30,
      difficulty: 'Moyen',
      category: 'aptitudes',
      completed: true,
      lastScore: 78,
      lastDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Test de personnalité MBTI',
      description: 'Découvrez votre type de personnalité et les métiers qui vous correspondent',
      duration: 25,
      questionsCount: 60,
      difficulty: 'Facile',
      category: 'personnalite',
      completed: true,
      lastScore: null,
      result: 'ENFP - Inspirateur',
      lastDate: '2024-01-05'
    },
    {
      id: 3,
      title: 'Test d\'intérêts professionnels',
      description: 'Identifiez vos centres d\'intérêt et les domaines d\'activité qui vous motivent',
      duration: 20,
      questionsCount: 40,
      difficulty: 'Facile',
      category: 'interets',
      completed: false
    },
    {
      id: 4,
      title: 'Test de compétences techniques',
      description: 'Évaluez vos compétences dans différents domaines techniques et scientifiques',
      duration: 60,
      questionsCount: 45,
      difficulty: 'Difficile',
      category: 'competences',
      completed: false
    },
    {
      id: 5,
      title: 'Test de motivation et valeurs',
      description: 'Explorez vos motivations profondes et vos valeurs personnelles',
      duration: 30,
      questionsCount: 35,
      difficulty: 'Moyen',
      category: 'valeurs',
      completed: false
    }
  ];

  const sampleQuestions = [
    {
      id: 1,
      question: 'Quel type d\'environnement de travail préférez-vous ?',
      options: [
        'Un bureau calme et organisé',
        'Un open space dynamique',
        'À domicile en télétravail',
        'Sur le terrain, en déplacement'
      ]
    },
    {
      id: 2,
      question: 'Comment préférez-vous travailler ?',
      options: [
        'Seul(e) en autonomie',
        'En petite équipe',
        'En grande équipe',
        'En binôme'
      ]
    },
    {
      id: 3,
      question: 'Quel type de tâches vous motive le plus ?',
      options: [
        'Résoudre des problèmes complexes',
        'Créer et innover',
        'Aider et accompagner les autres',
        'Organiser et planifier'
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'aptitudes': return <Brain className="w-4 h-4" />;
      case 'personnalite': return <User className="w-4 h-4" />;
      case 'interets': return <FileText className="w-4 h-4" />;
      case 'competences': return <BarChart className="w-4 h-4" />;
      case 'valeurs': return <Brain className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const startTest = (testId: number) => {
    setSelectedTest(testId);
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const nextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Fin du test
      setTestStarted(false);
      setSelectedTest(null);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  if (testStarted && selectedTest) {
    const test = tests.find(t => t.id === selectedTest);
    const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{test?.title}</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} sur {sampleQuestions.length}
                </CardDescription>
              </div>
              <Badge variant="outline">
                <Clock className="w-4 h-4 mr-1" />
                {test?.duration} min
              </Badge>
            </div>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                {sampleQuestions[currentQuestion].question}
              </h3>
              <RadioGroup
                value={answers[currentQuestion] || ''}
                onValueChange={handleAnswer}
              >
                {sampleQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setTestStarted(false);
                  setSelectedTest(null);
                }}
              >
                Abandonner
              </Button>
              <Button 
                onClick={nextQuestion} 
                disabled={!answers[currentQuestion]}
              >
                {currentQuestion < sampleQuestions.length - 1 ? 'Question suivante' : 'Terminer le test'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Tests complétés</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">78%</div>
                <div className="text-sm text-muted-foreground">Score moyen</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">ENFP</div>
                <div className="text-sm text-muted-foreground">Type de personnalité</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des tests */}
      <div className="grid gap-6 md:grid-cols-2">
        {tests.map((test) => (
          <Card key={test.id} className={test.completed ? 'border-green-200' : ''}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(test.category)}
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                </div>
                {test.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Complété
                  </Badge>
                )}
              </div>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {test.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    {test.questionsCount} questions
                  </span>
                </div>
                <Badge className={getDifficultyColor(test.difficulty)}>
                  {test.difficulty}
                </Badge>
              </div>

              {test.completed && (
                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dernier passage:</span>
                    <span>{new Date(test.lastDate!).toLocaleDateString('fr-FR')}</span>
                  </div>
                  {test.lastScore && (
                    <div className="flex justify-between text-sm">
                      <span>Score:</span>
                      <span className="font-medium">{test.lastScore}%</span>
                    </div>
                  )}
                  {test.result && (
                    <div className="flex justify-between text-sm">
                      <span>Résultat:</span>
                      <span className="font-medium">{test.result}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => startTest(test.id)}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {test.completed ? 'Repasser le test' : 'Commencer le test'}
                </Button>
                {test.completed && (
                  <Button variant="outline" size="sm">
                    Voir les résultats
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}