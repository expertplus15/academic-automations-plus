import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Target, TrendingUp, Award, BookOpen } from 'lucide-react';

export function MyCareerPath() {
  const careerProfile = {
    name: 'Jean Dupont',
    currentLevel: 'Master 1 - Informatique',
    personalityType: 'ENFP - Inspirateur',
    preferredSectors: ['Technologie', 'Innovation', 'Startup'],
    careerGoal: 'Développeur Full Stack',
    progressPercentage: 65
  };

  const milestones = [
    {
      id: 1,
      title: 'Tests de personnalité',
      description: 'Évaluation MBTI et tests d\'aptitudes',
      status: 'completed',
      completedDate: '2024-01-05',
      type: 'assessment'
    },
    {
      id: 2,
      title: 'Entretien d\'orientation',
      description: 'Rendez-vous avec conseiller d\'orientation',
      status: 'completed',
      completedDate: '2024-01-10',
      type: 'counseling'
    },
    {
      id: 3,
      title: 'Définition du projet professionnel',
      description: 'Objectifs à court et moyen terme',
      status: 'completed',
      completedDate: '2024-01-12',
      type: 'planning'
    },
    {
      id: 4,
      title: 'Recherche de stage',
      description: 'Stage de fin d\'études - 6 mois',
      status: 'in_progress',
      expectedDate: '2024-02-15',
      type: 'internship'
    },
    {
      id: 5,
      title: 'Développement des compétences',
      description: 'Formation complémentaire React/Node.js',
      status: 'pending',
      expectedDate: '2024-03-01',
      type: 'training'
    },
    {
      id: 6,
      title: 'Préparation à l\'insertion',
      description: 'CV, portfolio, entretiens',
      status: 'pending',
      expectedDate: '2024-05-01',
      type: 'preparation'
    }
  ];

  const skills = [
    { name: 'JavaScript', level: 85, category: 'technique' },
    { name: 'React', level: 75, category: 'technique' },
    { name: 'Node.js', level: 60, category: 'technique' },
    { name: 'Communication', level: 90, category: 'soft' },
    { name: 'Travail en équipe', level: 85, category: 'soft' },
    { name: 'Résolution de problèmes', level: 80, category: 'soft' },
    { name: 'Gestion de projet', level: 65, category: 'management' },
    { name: 'Leadership', level: 70, category: 'management' }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Certification React Developer',
      description: 'Obtenez une certification reconnue en développement React',
      priority: 'high',
      estimatedDuration: '2 mois',
      provider: 'React Training'
    },
    {
      id: 2,
      title: 'Stage chez une startup tech',
      description: 'Expérience pratique dans un environnement agile',
      priority: 'high',
      estimatedDuration: '6 mois',
      provider: 'Job Board'
    },
    {
      id: 3,
      title: 'Formation en gestion de projet',
      description: 'Développez vos compétences managériales',
      priority: 'medium',
      estimatedDuration: '1 mois',
      provider: 'Formation Continue'
    },
    {
      id: 4,
      title: 'Participation à des hackathons',
      description: 'Développez votre réseau et vos compétences pratiques',
      priority: 'medium',
      estimatedDuration: 'Week-ends',
      provider: 'Événements Tech'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assessment': return '📊';
      case 'counseling': return '👥';
      case 'planning': return '🎯';
      case 'internship': return '🏢';
      case 'training': return '📚';
      case 'preparation': return '🚀';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillColor = (category: string) => {
    switch (category) {
      case 'technique': return 'bg-blue-500';
      case 'soft': return 'bg-green-500';
      case 'management': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profil de carrière */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Mon Profil de Carrière
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Formation actuelle</label>
                <p className="text-lg">{careerProfile.currentLevel}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Type de personnalité</label>
                <p className="text-lg">{careerProfile.personalityType}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Objectif professionnel</label>
                <p className="text-lg font-medium text-primary">{careerProfile.careerGoal}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Secteurs d'intérêt</label>
                <div className="flex flex-wrap gap-2">
                  {careerProfile.preferredSectors.map((sector) => (
                    <Badge key={sector} variant="secondary">{sector}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression vers l'objectif</span>
              <span>{careerProfile.progressPercentage}%</span>
            </div>
            <Progress value={careerProfile.progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Parcours et étapes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Mon Parcours
            </CardTitle>
            <CardDescription>
              Étapes franchies et à venir dans votre projet professionnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      milestone.status === 'completed' ? 'bg-green-100' : 
                      milestone.status === 'in_progress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {getTypeIcon(milestone.type)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className={`w-0.5 h-8 mt-2 ${
                        milestone.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge className={getStatusColor(milestone.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(milestone.status)}
                          {milestone.status === 'completed' ? 'Terminé' :
                           milestone.status === 'in_progress' ? 'En cours' : 'À venir'}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    <div className="text-xs text-muted-foreground">
                      {milestone.completedDate && `Complété le ${new Date(milestone.completedDate).toLocaleDateString('fr-FR')}`}
                      {milestone.expectedDate && `Prévu pour le ${new Date(milestone.expectedDate).toLocaleDateString('fr-FR')}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compétences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Mes Compétences
            </CardTitle>
            <CardDescription>
              Niveau actuel de vos compétences par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSkillColor(skill.category)}`} />
                    {skill.name}
                  </span>
                  <span>{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Recommandations Personnalisées
          </CardTitle>
          <CardDescription>
            Actions recommandées pour atteindre vos objectifs professionnels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <Badge className={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority === 'high' ? 'Priorité haute' :
                       recommendation.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  <div className="flex justify-between text-xs">
                    <span>Durée: {recommendation.estimatedDuration}</span>
                    <span>{recommendation.provider}</span>
                  </div>
                  <Button size="sm" className="w-full">
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}